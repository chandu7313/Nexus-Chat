import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Users (Contacts)
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get('/api/messages/users');
      return data.users;
    },
  });
};

// Chats
export const useChats = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/chats');
      return data.chats;
    },
  });
};

// Create or access a 1:1 chat
export const useAccessChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await axios.post('/api/chats', { userId });
      return data.chat;
    },
    onSuccess: () => {
      // Invalidate the chats list so it refreshes with the new chat
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};

// Fetch messages for a specific chat
export const useMessages = (chatId) => {
  return useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      if (!chatId) return [];
      const { data } = await axios.get(`/api/messages/${chatId}`);
      return data.messages;
    },
    enabled: !!chatId, // Only run the query if we have a chatId
  });
};

// Send a message
export const useSendMessage = () => {
  return useMutation({
    mutationFn: async ({ chatId, text, image, messageType }) => {
      const { data } = await axios.post(`/api/messages/send/${chatId}`, { text, image, messageType });
      return data.newMessage;
    }
  });
};
