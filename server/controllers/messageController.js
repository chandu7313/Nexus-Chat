import { prisma } from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js"
import { io, userSocketMap } from "../server.js";

// Fetch all users for the Contacts section
export const getAllUsers = async (req, res) => {
    try {
        const userId = req.user.id;
        const users = await prisma.user.findMany({
            where: { id: { not: userId } },
            select: { id: true, fullName: true, email: true, profilePic: true, isOnline: true, lastSeen: true, bio: true }
        });
        res.json({ success: true, users });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get messages for a specific chat
export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const myId = req.user.id;

        // Try to find chat by ID
        let chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: { participants: true }
        });

        // If not found, treat chatId as a userId and find the 1:1 chat
        if (!chat) {
            chat = await prisma.chat.findFirst({
                where: {
                    isGroup: false,
                    AND: [
                        { participants: { some: { userId: myId } } },
                        { participants: { some: { userId: chatId } } }
                    ]
                },
                include: { participants: true }
            });
        }

        if (!chat || !chat.participants.some(p => p.userId === myId)) {
            return res.json({ success: true, messages: [] });
        }

        const actualChatId = chat.id;
        const isParticipant = chat.participants.find(p => p.userId === myId);

        const messages = await prisma.message.findMany({
            where: { chatId: actualChatId },
            include: {
                statuses: true,
                sender: { select: { id: true, fullName: true, profilePic: true } }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Mark messages as read for this user
        const unreadMessages = messages.filter(m => m.senderId !== myId && !m.statuses.some(s => s.userId === myId && s.status === 'read'));
        if (unreadMessages.length > 0) {
            await Promise.all(unreadMessages.map(msg => 
                prisma.messageStatus.upsert({
                    where: { messageId_userId: { messageId: msg.id, userId: myId } },
                    update: { status: 'read', timestamp: new Date() },
                    create: { messageId: msg.id, userId: myId, status: 'read' }
                })
            ));

            // Update participant lastReadMessageId
            const lastMsg = unreadMessages[unreadMessages.length - 1];
            await prisma.chatParticipant.update({
                where: { id: isParticipant.id },
                data: { lastReadMessageId: lastMsg.id }
            });

            // Emit read receipts via socket
            unreadMessages.forEach(msg => {
                const senderSocketId = userSocketMap[msg.senderId];
                if (senderSocketId) {
                    io.to(senderSocketId).emit("messageRead", { messageId: msg.id, userId: myId, chatId: actualChatId });
                }
            });
        }

        res.json({ success: true, messages });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Send a message in a chat
export const sendMessage = async (req, res) => {
    try {
        const { text, image, messageType = "text" } = req.body;
        const { chatId } = req.params;
        const senderId = req.user.id;

        // Try to find chat by ID
        let chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: { participants: true }
        });

        // If not found, treat chatId as a userId and find the 1:1 chat
        if (!chat) {
            chat = await prisma.chat.findFirst({
                where: {
                    isGroup: false,
                    AND: [
                        { participants: { some: { userId: senderId } } },
                        { participants: { some: { userId: chatId } } }
                    ]
                },
                include: { participants: true }
            });

            // If it still doesn't exist, create it on the fly
            if (!chat) {
                chat = await prisma.chat.create({
                    data: {
                        isGroup: false,
                        participants: {
                            create: [
                                { userId: senderId },
                                { userId: chatId }
                            ]
                        }
                    },
                    include: { participants: true }
                });
            }
        }

        if (!chat || !chat.participants.some(p => p.userId === senderId)) {
            return res.status(403).json({ success: false, message: "Chat not found or access denied" });
        }

        const actualChatId = chat.id;

        let imageUrl = null;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Create the message
        const newMessage = await prisma.message.create({
            data: {
                chatId: actualChatId,
                senderId,
                content: text,
                mediaUrl: imageUrl,
                messageType
            },
            include: {
                sender: { select: { id: true, fullName: true, profilePic: true } },
                statuses: true
            }
        });

        // Update chat updatedAt
        await prisma.chat.update({
            where: { id: actualChatId },
            data: { updatedAt: new Date() }
        });

        // Broadcast to all other participants
        chat.participants.forEach(participant => {
            if (participant.userId !== senderId) {
                const receiverSocketId = userSocketMap[participant.userId];
                
                // Create delivered/sent status depending on if they are online
                // For now, we will optimistically emit it. In a real scenario we'd await DB writes or do them async.
                prisma.messageStatus.create({
                    data: {
                        messageId: newMessage.id,
                        userId: participant.userId,
                        status: receiverSocketId ? 'delivered' : 'sent'
                    }
                }).then((status) => {
                    if (receiverSocketId) {
                        // Send the message payload over socket
                        io.to(receiverSocketId).emit("newMessage", newMessage);
                        
                        // Notify sender that it was delivered
                        const senderSocket = userSocketMap[senderId];
                        if (senderSocket) {
                            io.to(senderSocket).emit("messageDelivered", { messageId: newMessage.id, userId: participant.userId });
                        }
                    }
                });
            }
        });

        res.json({ success: true, newMessage });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Soft delete a message
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const message = await prisma.message.findUnique({ where: { id }, include: { chat: { include: { participants: true } } } });
        if (!message) return res.status(404).json({ success: false, message: "Message not found" });

        if (message.senderId !== userId) {
            return res.status(401).json({ success: false, message: "Unauthorized to delete this message" });
        }

        await prisma.message.update({ 
            where: { id },
            data: { deletedAt: new Date(), content: "This message was deleted", mediaUrl: null }
        });

        // Notify chat participants
        message.chat.participants.forEach(p => {
            if (p.userId !== userId && userSocketMap[p.userId]) {
                io.to(userSocketMap[p.userId]).emit("messageDeleted", id);
            }
        });

        res.json({ success: true, messageId: id });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}