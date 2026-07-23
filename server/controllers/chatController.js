import { prisma } from "../lib/db.js";
import redisClient from "../lib/redis.js";

// Get all chats for the logged in user
export const getChats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Check Redis Cache
        if (redisClient) {
            const cachedChats = await redisClient.get(`user:${userId}:chats`);
            if (cachedChats) {
                return res.json({ success: true, chats: JSON.parse(cachedChats) });
            }
        }
        
        // Find all chats where this user is a participant
        const chats = await prisma.chat.findMany({
            where: {
                participants: {
                    some: { userId }
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                profilePic: true,
                                isOnline: true,
                                lastSeen: true
                            }
                        }
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            // Order by most recent update (a new message updates the chat's updatedAt)
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // Format the response
        const formattedChats = chats.map(chat => {
            // For 1:1 chats, the name and avatar come from the other participant
            let chatName = chat.name;
            let chatAvatar = chat.avatarUrl;
            let otherUser = null;

            if (!chat.isGroup) {
                otherUser = chat.participants.find(p => p.userId !== userId)?.user;
                if (otherUser) {
                    chatName = otherUser.fullName;
                    chatAvatar = otherUser.profilePic;
                }
            }

            return {
                id: chat.id,
                isGroup: chat.isGroup,
                name: chatName,
                avatarUrl: chatAvatar,
                participants: chat.participants,
                lastMessage: chat.messages[0] || null,
                updatedAt: chat.updatedAt
            };
        });

        // Set Cache
        if (redisClient) {
            await redisClient.setex(`user:${userId}:chats`, 300, JSON.stringify(formattedChats));
        }

        res.json({ success: true, chats: formattedChats });
    } catch (error) {
        console.log("Error in getChats:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Access a 1:1 chat or create it if it doesn't exist
export const accessChat = async (req, res) => {
    try {
        const { userId: otherUserId } = req.body;
        const currentUserId = req.user.id;

        if (!otherUserId) {
            return res.status(400).json({ success: false, message: "UserId param not sent with request" });
        }

        // Check if a 1:1 chat already exists with these two users
        let chat = await prisma.chat.findFirst({
            where: {
                isGroup: false,
                AND: [
                    { participants: { some: { userId: currentUserId } } },
                    { participants: { some: { userId: otherUserId } } }
                ]
            },
            include: {
                participants: {
                    include: {
                        user: { select: { id: true, fullName: true, email: true, profilePic: true, isOnline: true } }
                    }
                },
                messages: { orderBy: { createdAt: 'desc' }, take: 1 }
            }
        });

        if (chat) {
            return res.json({ success: true, chat });
        }

        // Create a new 1:1 chat
        const newChat = await prisma.chat.create({
            data: {
                isGroup: false,
                participants: {
                    create: [
                        { userId: currentUserId },
                        { userId: otherUserId }
                    ]
                }
            },
            include: {
                participants: {
                    include: {
                        user: { select: { id: true, fullName: true, email: true, profilePic: true, isOnline: true } }
                    }
                }
            }
        });

        if (redisClient) {
            await redisClient.del(`user:${currentUserId}:chats`);
            await redisClient.del(`user:${otherUserId}:chats`);
        }

        res.status(201).json({ success: true, chat: newChat });
    } catch (error) {
        console.log("Error in accessChat:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a group chat
export const createGroupChat = async (req, res) => {
    try {
        if (!req.body.users || !req.body.name) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        let users = req.body.users;
        if (typeof users === "string") {
            users = JSON.parse(users);
        }

        if (users.length < 2) {
            return res.status(400).json({ success: false, message: "More than 2 users are required to form a group chat" });
        }

        // Add current user to participants
        users.push(req.user.id);

        const groupChat = await prisma.chat.create({
            data: {
                name: req.body.name,
                isGroup: true,
                participants: {
                    create: users.map(userId => ({
                        userId,
                        role: userId === req.user.id ? "admin" : "member"
                    }))
                }
            },
            include: {
                participants: {
                    include: {
                        user: { select: { id: true, fullName: true, email: true, profilePic: true } }
                    }
                }
            }
        });

        if (redisClient) {
            const pipeline = redisClient.pipeline();
            users.forEach(u => pipeline.del(`user:${u}:chats`));
            await pipeline.exec();
        }

        res.status(201).json({ success: true, chat: groupChat });
    } catch (error) {
        console.log("Error in createGroupChat:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
