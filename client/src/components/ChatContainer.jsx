import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import { IoImage, IoSend, IoSearch, IoTrashOutline, IoClose, IoHappyOutline, IoCallOutline, IoVideocamOutline, IoInformationCircleOutline } from 'react-icons/io5'
import { formatMessageTime, formatLastSeen } from '../lib/utils'
import LoadingSkeleton from './ui/LoadingSkeleton'
import TypingIndicator from './TypingIndicator'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import Tooltip from './ui/Tooltip'

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages, isTyping, sendTyping, sendStopTyping, addReaction, deleteMessage } = useContext(ChatContext)
  const { authUser, onlineUsers } = useContext(AuthContext)
  
  const scrollEnd = useRef()
  const [input, setInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const typingTimeoutRef = useRef(null)

  const filteredMessages = messages.filter(msg => 
    msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInputChange = (e) => {
    setInput(e.target.value)

    if (e.target.value.trim() !== "") {
      sendTyping(selectedUser._id)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => {
        sendStopTyping(selectedUser._id)
      }, 2000)
    } else {
      sendStopTyping(selectedUser._id)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.trim() === "") return null
    
    sendStopTyping(selectedUser._id)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    setIsSending(true)
    await sendMessage({ text: input.trim() })
    setInput("")
    setIsSending(false)
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    
    const reader = new FileReader()
    reader.onloadend = async () => {
      setIsSending(true)
      await sendMessage({ image: reader.result })
      e.target.value = ""
      setIsSending(false)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (selectedUser) {
      setIsLoading(true)
      getMessages(selectedUser._id).finally(() => setIsLoading(false))
      setInput("") 
      setSearchQuery("")
      setIsSearchOpen(false)
    }
  }, [selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-gray-50 text-gray-400">
        <div className="w-64 h-64 mb-8 bg-blue-100/50 rounded-full flex items-center justify-center">
          <img src={assets.nexusLogo} className="w-32 opacity-20 grayscale" alt="Nexus" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Nexus Chat Ready</h2>
        <p className="max-w-sm">
          Select a conversation to start messaging
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={selectedUser.profilePic || assets.avatar_icon} 
              alt={selectedUser.fullName} 
              className="w-10 h-10 rounded-full object-cover"
            />
            {onlineUsers.includes(selectedUser._id) && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">{selectedUser.fullName}</h3>
            <p className="text-xs text-gray-500">
              {onlineUsers.includes(selectedUser._id) ? 'Online' : formatLastSeen(selectedUser.lastSeen)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <IoCallOutline size={20} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <IoVideocamOutline size={22} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <IoInformationCircleOutline size={22} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading ? (
          <LoadingSkeleton type="message" count={4} />
        ) : filteredMessages.length === 0 && !isTyping[selectedUser._id] ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30">
            <p className="text-sm font-medium">Establish a connection</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {filteredMessages.map((msg, idx) => {
              const isSent = msg.senderId === authUser._id
              return (
                <div key={msg._id || idx} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[70%] ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar only for received messages or every X messages? Let's keep it simple */}
                    {!isSent && (
                      <img 
                        src={selectedUser.profilePic || assets.avatar_icon} 
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0 mb-1"
                        alt=""
                      />
                    )}
                    <div className="flex flex-col">
                      <div 
                        className={`px-4 py-2 rounded-2xl text-sm ${
                          isSent 
                            ? 'ml-auto max-w-xs bg-blue-500 text-white shadow-sm rounded-br-none' 
                            : 'max-w-xs bg-white border border-gray-200 rounded-bl-none'
                        }`}
                      >
                        {msg.image && (
                          <img src={msg.image} className="rounded-lg mb-2 max-w-full h-auto cursor-pointer" alt="sent" />
                        )}
                        {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                      </div>
                      <span className={`text-xs text-gray-400 mt-1 ${isSent ? 'text-right' : 'text-left'}`}>
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {isTyping[selectedUser._id] && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-divider shadow-sm">
                  <TypingIndicator size="small" />
                </div>
              </div>
            )}
            <div ref={scrollEnd} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 flex items-center gap-3">
        <form onSubmit={handleSendMessage} className="w-full flex items-center gap-3">
          <div className="flex gap-1 text-gray-400">
             <label className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition">
                <IoImage size={22} />
                <input type="file" hidden accept="image/*" onChange={handleSendImage} disabled={isSending} />
             </label>
             <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition">
                <IoHappyOutline size={22} />
             </button>
          </div>
          
          <input 
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={`Message ${selectedUser.fullName}...`}
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isSending}
          />
          
          <button 
            type="submit"
            disabled={!input.trim() || isSending}
            className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition disabled:opacity-50 disabled:hover:bg-blue-500 flex-shrink-0"
          >
             {isSending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : (
                <IoSend size={18} className="ml-1" />
             )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatContainer
