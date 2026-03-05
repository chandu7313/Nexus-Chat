import React, { useContext, useState } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import assets from '../assets/assets'
import { IoSearch, IoPersonAddOutline } from 'react-icons/io5'
import { motion } from 'framer-motion'

const ContactsView = () => {
  const { users, setSelectedUser } = useContext(ChatContext)
  const { onlineUsers } = useContext(AuthContext)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStartChat = (user) => {
    setSelectedUser(user)
  }

  return (
    <div className='h-full flex flex-col bg-white overflow-hidden'>
      {/* Header Section */}
      <div className="p-8 pb-4">
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-text-primary'>Contacts</h1>
            <p className='text-sm text-text-secondary mt-1'>Manage your connections and team members</p>
          </div>
          <button className='flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary-hover transition-all active:scale-95'>
            <IoPersonAddOutline size={18} />
            <span>Add Contact</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-divider rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Contacts */}
      <div className='flex-1 overflow-y-auto px-8 pb-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => {
              const isOnline = onlineUsers.includes(user._id);
              return (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-5 bg-white border border-divider rounded-2xl hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <div className='flex flex-col items-center text-center'>
                    <div className='relative mb-4'>
                      <img 
                        src={user.profilePic || assets.avatar_icon} 
                        alt={user.fullName} 
                        className="w-20 h-20 rounded-full object-cover border-2 border-divider" 
                      />
                      <div className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white ${isOnline ? 'bg-success' : 'bg-slate-300'}`} />
                    </div>
                    
                    <h3 className="font-bold text-text-primary truncate w-full px-2">{user.fullName}</h3>
                    <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider mt-1 mb-5">
                      {isOnline ? 'Available' : 'Offline'}
                    </p>
                    
                    <button 
                      onClick={() => handleStartChat(user)}
                      className="w-full py-2 bg-slate-50 text-primary border border-primary/10 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all"
                    >
                      Message
                    </button>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className='col-span-full py-20 text-center'>
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoSearch size={24} className="text-text-muted" />
              </div>
              <p className='text-text-secondary font-medium'>No contacts found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactsView
