import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";


export const ChatContext = createContext();

export const ChatProvider = ({ children })=>{

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})

    const queryClient = useQueryClient();

    const {socket, axios, authUser} = useContext(AuthContext);

    // function to get all users for sidebar
    const getUsers = async () =>{
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to get messages for selected user
    const getMessages = async (userId)=>{
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to send message to selected user
    const sendMessage = async (messageData)=>{
        // Optimistic UI Update - Instant delivery feedback
        const tempId = "temp-" + Date.now();
        const optimisticMessage = {
            id: tempId,
            content: messageData.text || "",
            mediaUrl: messageData.image || null,
            messageType: messageData.messageType || 'TEXT',
            senderId: authUser?.id,
            chatId: selectedUser.id,
            createdAt: new Date().toISOString(),
            status: 'sending'
        };

        // 1. Instantly show in current chat window
        setMessages((prevMessages)=>[...prevMessages, optimisticMessage]);

        // 2. Instantly bump chat to top of list
        queryClient.setQueryData(['chats'], (oldChats) => {
            if (!oldChats) return oldChats;
            const chatIndex = oldChats.findIndex(c => c.id === selectedUser.id);
            if (chatIndex > -1) {
                const updatedChat = { ...oldChats[chatIndex], lastMessage: optimisticMessage, updatedAt: optimisticMessage.createdAt };
                const newChats = [...oldChats];
                newChats.splice(chatIndex, 1);
                newChats.unshift(updatedChat);
                return newChats;
            }
            return oldChats;
        });

        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser.id}`, messageData);
            if(data.success){
                // Replace optimistic message with real one from DB
                setMessages((prevMessages) => prevMessages.map(msg => msg.id === tempId ? data.newMessage : msg));
                
                // Update chat list again with real DB message
                queryClient.setQueryData(['chats'], (oldChats) => {
                    if (!oldChats) return oldChats;
                    const chatIndex = oldChats.findIndex(c => c.id === selectedUser.id);
                    if (chatIndex > -1) {
                        const updatedChat = { ...oldChats[chatIndex], lastMessage: data.newMessage, updatedAt: data.newMessage.createdAt };
                        const newChats = [...oldChats];
                        newChats.splice(chatIndex, 1);
                        newChats.unshift(updatedChat);
                        return newChats;
                    }
                    return oldChats;
                });
            }else{
                // Revert on failure
                setMessages((prev) => prev.filter(msg => msg.id !== tempId));
                toast.error(data.message);
            }
        } catch (error) {
            // Revert on failure
            setMessages((prev) => prev.filter(msg => msg.id !== tempId));
            toast.error(error.message);
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = async () =>{
        if(!socket) return;

        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser.id){
                newMessage.seen = true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage.id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
            
            // Instantly reorder the chat list for incoming messages too
            queryClient.setQueryData(['chats'], (oldChats) => {
                if (!oldChats) return oldChats;
                const chatIndex = oldChats.findIndex(c => c.id === newMessage.chatId);
                if (chatIndex > -1) {
                    const updatedChat = { ...oldChats[chatIndex], lastMessage: newMessage, updatedAt: new Date().toISOString() };
                    const newChats = [...oldChats];
                    newChats.splice(chatIndex, 1);
                    newChats.unshift(updatedChat);
                    return newChats;
                }
                return oldChats;
            });
        })
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = ()=>{
        if(socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket, selectedUser])

    const [isTyping, setIsTyping] = useState({});

    useEffect(() => {
        if (!socket) return;

        socket.on("typing", (userId) => {
            setIsTyping((prev) => ({ ...prev, [userId]: true }));
        });

        socket.on("stopTyping", (userId) => {
            setIsTyping((prev) => ({ ...prev, [userId]: false }));
        });

        return () => {
            socket.off("typing");
            socket.off("stopTyping");
            socket.off("messageReaction");
        };
    }, [socket]);

    // Handle message reactions and deletions
    useEffect(() => {
        if (!socket) return;
        
        socket.on("messageReaction", ({ messageId, reactions }) => {
            setMessages(prevMessages => prevMessages.map(msg => 
                msg.id === messageId ? { ...msg, reactions } : msg
            ));
        });

        socket.on("messageDeleted", (messageId) => {
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
        });

        return () => {
            socket.off("messageReaction");
            socket.off("messageDeleted");
        }
    }, [socket]);

    const sendTyping = (receiverId) => {
        if (socket) socket.emit("typing", { receiverId });
    };

    const sendStopTyping = (receiverId) => {
        if (socket) socket.emit("stopTyping", { receiverId });
    };

    const addReaction = async (messageId, emoji) => {
        try {
            await axios.put(`/api/messages/${messageId}/react`, { emoji });
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            const { data } = await axios.delete(`/api/messages/${messageId}`);
            if (data.success) {
                setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
                toast.success("Message deleted");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const value = {
        messages, 
        users, 
        selectedUser, 
        getUsers, 
        getMessages, 
        sendMessage, 
        setSelectedUser, 
        unseenMessages, 
        setUnseenMessages,
        isTyping,
        sendTyping,
        sendStopTyping,
        addReaction,
        deleteMessage
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}