import React, { useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoSearch } from 'react-icons/io5';
import { useUsers, useAccessChat, useChats } from '../api/queries';
import { AuthContext } from '../../context/AuthContext';
import assets from '../assets/assets';

const AddContactModal = ({ isOpen, onClose, onChatCreated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingUserId, setLoadingUserId] = useState(null);
  const { data: users, isLoading } = useUsers();
  const { data: chats } = useChats();
  const accessChat = useAccessChat();
  const { authUser } = useContext(AuthContext);

  const connectedUserIds = useMemo(() => {
    if (!chats) return new Set();
    const ids = new Set();
    chats.forEach(chat => {
      chat.participants.forEach(p => {
        if (p.user && p.user.id !== authUser?.id) {
          ids.add(p.user.id);
        }
      });
    });
    return ids;
  }, [chats, authUser]);

  if (!isOpen) return null;

  const filteredUsers = users?.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartChat = async (userId) => {
    try {
      setLoadingUserId(userId);
      const chat = await accessChat.mutateAsync(userId);
      onChatCreated(chat);
      onClose();
    } catch (error) {
      console.error("Failed to start chat:", error);
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-divider">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Add Contact</h2>
              <p className="text-sm text-text-secondary mt-1">Search the directory for new connections</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <IoClose size={24} className="text-text-muted" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 pb-2">
            <div className="relative">
              <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input 
                type="text" 
                autoFocus
                placeholder="Search by name or email..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-divider rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* User List */}
          <div className="p-6 pt-4 h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filteredUsers?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {filteredUsers.map(user => {
                  const isConnected = connectedUserIds.has(user.id);
                  return (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-xl border border-divider hover:border-primary/30 hover:bg-slate-50 transition-all group">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.profilePic || assets.avatar_icon} 
                        alt={user.fullName} 
                        className="w-10 h-10 rounded-full object-cover border border-divider"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-text-primary">{user.fullName}</h4>
                        <p className="text-xs text-text-secondary">{user.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleStartChat(user.id)}
                      disabled={accessChat.isPending && loadingUserId === user.id}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 min-w-[80px] ${
                        isConnected 
                          ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                          : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      {loadingUserId === user.id ? 'Starting...' : isConnected ? 'Connected' : 'Chat'}
                    </button>
                  </div>
                )})}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <IoSearch size={20} className="text-text-muted" />
                </div>
                <p className="text-sm font-medium text-text-secondary">No users found for "{searchTerm}"</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddContactModal;
