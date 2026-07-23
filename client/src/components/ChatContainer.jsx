import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import { IoImage, IoSend, IoSearch, IoTrashOutline, IoClose, IoHappyOutline, IoCallOutline, IoVideocamOutline, IoInformationCircleOutline, IoChatbubbleEllipses, IoArrowBack } from 'react-icons/io5'
import { formatMessageTime, formatLastSeen } from '../lib/utils'
import LoadingSkeleton from './ui/LoadingSkeleton'
import TypingIndicator from './TypingIndicator'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import Tooltip from './ui/Tooltip'
import ContactInfoPane from './ContactInfoPane'

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages, isTyping, sendTyping, sendStopTyping, addReaction, deleteMessage } = useContext(ChatContext)
  const { authUser, onlineUsers } = useContext(AuthContext)
  
  const scrollEnd = useRef()
  const inputRef = useRef(null)
  const [input, setInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false)
  const [msgImages, setMsgImages] = useState([])
  const typingTimeoutRef = useRef(null)

  useEffect(()=>{
    setMsgImages(
      messages.filter(msg => msg.mediaUrl).map(msg => msg.mediaUrl)
    )
  }, [messages])

  const filteredMessages = messages.filter(msg => 
    !searchQuery || msg.content?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInputChange = (e) => {
    setInput(e.target.value)

    if (e.target.value.trim() !== "") {
      sendTyping(selectedUser.id)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => {
        sendStopTyping(selectedUser.id)
      }, 2000)
    } else {
      sendStopTyping(selectedUser.id)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.trim() === "") return null
    
    sendStopTyping(selectedUser.id)
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
      getMessages(selectedUser.id).finally(() => setIsLoading(false))
      setInput("") 
      setSearchQuery("")
      setIsSearchOpen(false)
      setIsContactInfoOpen(false)
      
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus()
      }, 100)
    }
  }, [selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-surface text-on-surface-variant relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-surface-container rounded-full mx-auto mb-6 flex items-center justify-center shadow-sm">
              <IoChatbubbleEllipses size={36} className="text-primary-container" />
            </div>
            <h2 className="text-[22px] font-bold mb-3 text-on-surface tracking-tight">Direct Messenger System</h2>
            <div className="w-12 h-1 bg-primary-container rounded-full mx-auto mb-4 opacity-50" />
            <p className="max-w-xs text-on-surface-variant text-[14px] leading-[20px]">
              Select a conversation from the sidebar to view your messages and start collaborating.
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-surface-container-lowest">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header 
          className="bg-surface-container-lowest border-b border-outline-variant/30 px-4 md:px-6 py-4 flex items-center justify-between z-10 shadow-[0_4px_24px_rgba(37,211,102,0.02)]"
        >
          <div className="flex items-center gap-[12px]">
            {/* Mobile Back Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(null);
              }}
              className="md:hidden p-2 -ml-2 mr-1 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-surface"
            >
              <IoArrowBack size={24} />
            </button>

            <div 
              className="flex items-center gap-[12px] cursor-pointer group"
              onClick={() => setIsContactInfoOpen(!isContactInfoOpen)}
            >
              <div className="relative">
                <img 
                  src={selectedUser.avatarUrl || selectedUser.profilePic || assets.avatar_icon} 
                  alt={selectedUser.name || selectedUser.fullName} 
                  className="w-10 h-10 rounded-full object-cover group-hover:opacity-90 transition-opacity"
                />
                {onlineUsers.includes(selectedUser.id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary-container rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-on-surface leading-[24px] group-hover:text-primary-container transition-colors">{selectedUser.name || selectedUser.fullName}</h3>
                <p className="text-[12px] text-on-surface-variant font-normal">
                  {onlineUsers.includes(selectedUser.id) ? 'Online now' : formatLastSeen(selectedUser.lastSeen)}
                </p>
              </div>
            </div>
          </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-surface">
            <IoCallOutline size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-surface">
            <IoVideocamOutline size={22} />
          </button>
          <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-surface">
            <IoInformationCircleOutline size={22} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto relative bg-[#F8FAFC]">
        {/* Patterned Background */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21 19v-2h-2v2h-2v2h2v2h2v-2h2v-2h-2z' fill='%23CBD5E1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center'
          }}
        />

        <div className="relative z-10 px-6 py-6 space-y-[14px] min-h-full">
          {isLoading ? (
            <LoadingSkeleton type="message" count={4} />
          ) : filteredMessages.length === 0 && !isTyping[selectedUser.id] ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
              <p className="text-[14px] font-medium text-on-surface-variant">No messages yet</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-[14px]">
            {filteredMessages.map((msg, idx) => {
              const isSent = msg.senderId === authUser.id
              return (
                <div key={msg.id || idx} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[75%] ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="flex flex-col">
                      <div 
                        className={`px-4 py-[10px] text-[14px] leading-[20px] shadow-sm ${
                          isSent 
                            ? 'ml-auto bg-primary-container text-on-primary-container rounded-[12px] rounded-br-[4px]' 
                            : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-[12px] rounded-bl-[4px]'
                        }`}
                      >
                        {msg.mediaUrl && (
                          <img src={msg.mediaUrl} className="rounded-lg mb-2 max-w-full h-auto cursor-pointer" alt="sent" />
                        )}
                        {msg.content && <p className="leading-relaxed">{msg.content}</p>}
                      </div>
                      <span className={`text-[12px] font-normal text-on-surface-variant mt-1 ${isSent ? 'text-right' : 'text-left'}`}>
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {isTyping[selectedUser.id] && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-[12px] rounded-bl-[4px] border border-outline-variant/30 shadow-sm">
                  <TypingIndicator size="small" />
                </div>
              </div>
            )}
              <div ref={scrollEnd} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-surface-container-lowest px-6 py-4 flex items-center gap-3">
        <form onSubmit={handleSendMessage} className="w-full flex items-center gap-[12px]">
          <div className="flex gap-1 text-on-surface-variant">
             <label className="p-2.5 hover:bg-surface-container-low rounded-full cursor-pointer transition-colors text-on-surface-variant hover:text-on-surface">
                <IoImage size={24} />
                <input type="file" hidden accept="image/*" onChange={handleSendImage} disabled={isSending} />
             </label>
             <button type="button" className="p-2.5 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant hover:text-on-surface">
                <IoHappyOutline size={24} />
             </button>
          </div>
          
          <input 
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={`Message ${selectedUser.name || selectedUser.fullName}...`}
            className="flex-1 bg-surface-container-lowest border border-outline-variant/50 rounded-full px-5 py-3 text-[14px] text-on-surface focus:border-primary-container outline-none transition-colors"
            disabled={isSending}
          />
          
          <button 
            type="submit"
            disabled={!input.trim() || isSending}
            className="bg-primary-container text-white w-12 h-12 rounded-full flex items-center justify-center hover:brightness-95 transition-all disabled:opacity-50 disabled:hover:brightness-100 flex-shrink-0 shadow-md shadow-primary-container/20"
          >
             {isSending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : (
                <IoSend size={20} className="ml-1" />
             )}
            </button>
          </form>
        </div>
      </div>

      {/* Contact Info Pane */}
      <AnimatePresence>
        {isContactInfoOpen && (
          <ContactInfoPane 
            user={selectedUser} 
            msgImages={msgImages} 
            onClose={() => setIsContactInfoOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatContainer
