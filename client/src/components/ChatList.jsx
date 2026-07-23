import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { IoSearch, IoAdd, IoEllipsisVertical, IoChatbubbleEllipses } from "react-icons/io5";
import { useDebounce } from '../hooks/useDebounce';
import LoadingSkeleton from './ui/LoadingSkeleton';
import { motion } from 'framer-motion';
import { useChats } from '../api/queries';

const ChatList = ({ setSelectedOption }) => {
  const { selectedUser, setSelectedUser } = useContext(ChatContext);
  const { onlineUsers, authUser } = useContext(AuthContext);
  
  const [input, setInput] = useState('');
  const debouncedSearch = useDebounce(input, 300);
  
  const { data: chats, isLoading } = useChats();
  
  const filteredChats = debouncedSearch && chats
    ? chats.filter((chat) => chat.name.toLowerCase().includes(debouncedSearch.toLowerCase())) 
    : (chats || []);
  


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } }
  }

  return (
    <div className={`w-full md:w-96 h-full flex flex-col bg-[#F7FAFC] md:bg-surface-container-lowest border-r border-outline-variant/30 flex-shrink-0 z-40 relative`}>
      {/* Header Section */}
      <div className="px-5 pt-8 pb-4 flex items-center justify-between md:hidden">
        <h1 className="text-[26px] font-bold text-[#10b981] tracking-tight">NexusChat</h1>
        <div className="flex items-center gap-5 text-[#1e293b]">
          <button><IoSearch size={22} /></button>
          <button><IoEllipsisVertical size={22} /></button>
        </div>
      </div>
      
      {/* Desktop Header */}
      <div className="hidden md:flex px-6 py-6 items-center justify-between">
        <h1 className="text-[22px] font-bold text-on-surface tracking-tight leading-[28px]">Messages</h1>
        <button 
          onClick={() => setSelectedOption('CONTACTS')}
          className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center hover:brightness-95 transition-all duration-300 shadow-md"
        >
          <IoAdd size={24} />
        </button>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="relative group">
          <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors" size={18} />
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search or start new chat"
            className="w-full bg-[#E9EDF0] md:bg-surface-container rounded-full pl-11 pr-4 py-2.5 text-[15px] text-[#1e293b] outline-none transition-all duration-300 placeholder:text-slate-500 border border-transparent focus:border-[#10b981]/50"
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
            className="flex flex-col"
          >
            {filteredChats.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoSearch size={24} className="text-on-surface-variant" />
                </div>
                <p className="text-[14px] font-medium text-on-surface-variant">No conversations found</p>
                <p className="text-[12px] text-on-surface-variant mt-1">Try searching for someone else</p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                // Determine if the other person in 1:1 chat is online
                const otherParticipant = !chat.isGroup 
                  ? chat.participants.find(p => p.userId !== authUser?.id) 
                  : null;
                  
                const isOnline = otherParticipant ? onlineUsers.includes(otherParticipant.userId) : false;
                const isSelected = selectedUser?.id === chat.id;
                
                // For now we don't have the unseenMessages logic ported, so we'll mock it temporarily
                const hasUnseen = false;
                
                return (
                  <motion.div 
                    key={chat.id}
                    variants={itemVariants}
                    onClick={() => { setSelectedUser(chat); }}
                    className={`group flex items-center gap-[14px] px-5 py-[10px] cursor-pointer transition-all duration-300 relative ${
                      isSelected 
                        ? 'bg-[#E9EDF0] md:bg-surface-container' 
                        : 'hover:bg-[#E9EDF0] md:hover:bg-surface-container-low'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img 
                        src={chat.avatarUrl || assets.avatar_icon} 
                        alt={chat.name} 
                        className="w-[52px] h-[52px] rounded-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 border-b border-transparent md:border-outline-variant/10 pb-3 pt-1">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="text-[16px] font-bold text-[#1e293b] truncate">
                          {chat.name}
                        </h4>
                        <span className={`text-[12px] font-medium ${hasUnseen ? 'text-[#10b981]' : 'text-slate-500'}`}>
                          {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-[14px] truncate pr-2 ${hasUnseen ? 'font-semibold text-[#1e293b]' : 'text-slate-500'}`}>
                          {chat.lastMessage ? chat.lastMessage.content : 'Click to start chatting'}
                        </p>
                        {hasUnseen && (
                          <span className="bg-[#22c55e] text-white text-[11px] rounded-full px-[6px] py-[2px] font-bold min-w-[20px] text-center">
                            1
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

      {/* Mobile FAB */}
      <button 
        onClick={() => setSelectedOption('CONTACTS')}
        className="md:hidden absolute bottom-6 right-6 w-[56px] h-[56px] bg-[#22c55e] text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 z-50 hover:bg-[#16a34a] transition-colors"
      >
        <IoAdd size={28} />
      </button>
    </div>
  )
}

export default ChatList
