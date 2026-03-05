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
    <div className={`w-80 h-full flex flex-col bg-white border-r border-gray-200 flex-shrink-0 ${selectedUser ? "max-md:hidden" : ''}`}>
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
        <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition">
          <IoAdd size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="mx-4 mt-4 mb-3 relative">
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search conversations..."
          className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4"><LoadingSkeleton type="user" count={6} /></div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {filteredUsers.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                No conversations found
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
                    className={`flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer transition ${isSelected ? 'bg-blue-50 border-r-4 border-blue-500' : 'border-r-4 border-transparent'}`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img 
                        src={user?.profilePic || assets.avatar_icon} 
                        alt={user.fullName} 
                        className="w-10 h-10 rounded-full object-cover bg-blue-500 text-white flex items-center justify-center font-medium"
                      />
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="text-sm font-medium text-gray-800 truncate">
                          {user.fullName}
                        </h4>
                        <span className="text-xs text-gray-400">12:45 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate ${hasUnseen ? 'font-medium text-gray-800' : 'text-gray-500'}`}>
                          {hasUnseen ? 'New message received' : 'Click to start chatting'}
                        </p>
                        {hasUnseen && (
                          <span className="bg-blue-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-medium ml-2">
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
