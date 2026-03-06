import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { IoSearch, IoAdd } from "react-icons/io5";
import { useDebounce } from '../hooks/useDebounce';
import LoadingSkeleton from './ui/LoadingSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

const ChatList = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(input, 300);
  
  const filteredUsers = debouncedSearch 
    ? users.filter((user) => user.fullName.toLowerCase().includes(debouncedSearch.toLowerCase())) 
    : users;
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      await getUsers();
      setIsLoading(false);
    };
    fetchUsers();
  }, [onlineUsers]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } }
  }

  return (
    <div className={`w-96 h-full flex flex-col bg-white border-r border-gray-100 flex-shrink-0 ${selectedUser ? "max-md:hidden" : ''} shadow-sm z-40`}>
      {/* Header Section */}
      <div className="px-6 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Messages</h1>
        <button className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95">
          <IoAdd size={24} />
        </button>
      </div>

      {/* Search */}
      <div className="px-6 mb-6">
        <div className="relative group">
          <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 placeholder:text-slate-400 text-slate-700"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="px-6"><LoadingSkeleton type="user" count={6} /></div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col px-3"
          >
            {filteredUsers.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoSearch size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-500">No conversations found</p>
                <p className="text-xs text-slate-400 mt-1">Try searching for someone else</p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isOnline = onlineUsers.includes(user._id);
                const isSelected = selectedUser?._id === user._id;
                const hasUnseen = unseenMessages[user._id] > 0;
                
                return (
                  <motion.div 
                    key={user._id}
                    variants={itemVariants}
                    onClick={() => { setSelectedUser(user); setUnseenMessages(prev => ({ ...prev, [user._id]: 0 })) }}
                    className={`group flex items-center gap-4 px-4 py-4 rounded-2xl cursor-pointer transition-all duration-300 mb-1 relative ${
                      isSelected 
                        ? 'bg-blue-50/50' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && (
                      <motion.div 
                        layoutId="activeUser"
                        className="absolute left-0 w-1 h-8 bg-blue-600 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img 
                        src={user?.profilePic || assets.avatar_icon} 
                        alt={user.fullName} 
                        className={`w-12 h-12 rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105 shadow-sm ${isSelected ? 'ring-2 ring-blue-100 ring-offset-2' : ''}`}
                      />
                      {isOnline && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-600' : 'text-slate-800'}`}>
                          {user.fullName}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">12:45 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate ${hasUnseen ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                          {hasUnseen ? 'New message received' : 'Click to start chatting'}
                        </p>
                        {hasUnseen && (
                          <span className="bg-blue-600 text-white text-[10px] rounded-lg px-2 py-0.5 font-bold shadow-lg shadow-blue-500/20 ml-2">
                            {unseenMessages[user._id]}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ChatList
