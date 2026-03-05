import React from 'react'
import { motion } from 'framer-motion'
import { IoNotifications, IoChatbubbleEllipses, IoPersonAddOutline, IoShieldCheckmark, IoLockClosed } from 'react-icons/io5'

const NotificationsView = () => {
  const notifications = [
    { id: 1, type: 'message', content: 'Alex sent you a new message', time: '2m ago', icon: <IoChatbubbleEllipses className="text-blue-500" /> },
    { id: 2, type: 'contact', content: 'Sarah accepted your contact request', time: '1h ago', icon: <IoPersonAddOutline className="text-green-500" /> },
    { id: 3, type: 'system', content: 'Your profile was updated successfully', time: '3h ago', icon: <IoShieldCheckmark className="text-purple-500" /> },
    { id: 4, type: 'alert', content: 'New login detected from Chrome on MacOS', time: '5h ago', icon: <IoLockClosed className="text-amber-500" /> },
    { id: 5, type: 'message', content: 'John mentioned you in a group chat', time: 'Yesterday', icon: <IoNotifications className="text-blue-400" /> },
  ]

  return (
    <div className='h-full flex flex-col bg-white overflow-hidden'>
      {/* Header */}
      <div className="p-8 pb-4">
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-text-primary'>Notifications</h1>
            <p className='text-sm text-text-secondary mt-1'>Stay updated with your latest activities</p>
          </div>
          <button className='text-sm font-bold text-primary hover:underline transition-all'>
            Mark all as read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className='flex-1 overflow-y-auto px-8 pb-8'>
        <div className='max-w-3xl space-y-2 mt-2'>
          {notifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className='p-4 bg-white border border-divider rounded-xl flex items-center gap-4 hover:border-primary/20 hover:bg-slate-50 transition-all cursor-pointer group'
            >
              <div className='w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-slate-50 border border-divider group-hover:bg-white transition-colors'>
                {notif.icon}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold text-text-primary truncate'>
                  {notif.content}
                </p>
                <span className='text-[11px] text-text-muted mt-0.5'>{notif.time}</span>
              </div>
              <div className='w-2 h-2 rounded-full bg-primary flex-shrink-0' />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotificationsView
