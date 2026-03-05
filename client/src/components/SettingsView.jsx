import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import assets from '../assets/assets'
import { IoMoon, IoSunny, IoNotifications, IoLockClosed, IoColorPalette, IoShieldCheckmark, IoChatbubbleEllipses, IoArrowForward } from 'react-icons/io5'
import { motion } from 'framer-motion'

const SettingsView = () => {
  const { authUser } = useContext(AuthContext)
  const { toggleTheme, isDark } = useTheme()

  const categories = [
    { name: 'Notifications', icon: <IoNotifications />, desc: 'Pushes, alerts, sounds', color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Appearance', icon: isDark ? <IoSunny /> : <IoMoon />, desc: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode', color: 'text-purple-500', bg: 'bg-purple-50', action: toggleTheme },
    { name: 'Privacy & Security', icon: <IoShieldCheckmark />, desc: 'Two-factor auth, session data', color: 'text-green-500', bg: 'bg-green-50' },
    { name: 'Account Settings', icon: <IoLockClosed />, desc: 'Update email and credentials', color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'Chat Settings', icon: <IoChatbubbleEllipses />, desc: 'Backups and media quality', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { name: 'Help & Support', icon: <IoShieldCheckmark />, desc: 'Documentation and support team', color: 'text-slate-500', bg: 'bg-slate-50' },
  ]

  return (
    <div className='h-full flex flex-col bg-white overflow-hidden'>
      {/* Header */}
      <div className="p-8 pb-4">
        <h1 className='text-2xl font-bold text-text-primary'>Settings</h1>
        <p className='text-sm text-text-secondary mt-1'>Configure your preferences and account security</p>
      </div>

      <div className='flex-1 overflow-y-auto px-8 pb-8'>
        <div className='max-w-5xl space-y-8 mt-4'>
          {/* Profile Quick Link */}
          <div className="saas-card p-6 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6 border border-divider rounded-2xl">
            <div className='flex items-center gap-4'>
              <img 
                src={authUser.profilePic || assets.avatar_icon} 
                alt="profile" 
                className='w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-sm' 
              />
              <div>
                <h2 className='text-lg font-bold text-text-primary'>{authUser.fullName}</h2>
                <p className='text-sm text-text-secondary'>{authUser.email}</p>
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                  Verified Node
                </div>
              </div>
            </div>
            <button className='px-4 py-2 bg-white border border-divider text-text-primary rounded-xl text-sm font-bold hover:bg-slate-100 transition-all shadow-sm'>
              Account Profile
            </button>
          </div>

          {/* Settings Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={cat.action}
                className='saas-card p-5 cursor-pointer bg-white border border-divider rounded-2xl hover:border-primary/30 hover:shadow-md transition-all group shrink-0'
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center text-xl shadow-sm`}>
                    {cat.icon}
                  </div>
                  <IoArrowForward className="text-text-muted opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                <h3 className='font-bold text-text-primary mb-1'>{cat.name}</h3>
                <p className='text-[11px] text-text-secondary font-medium leading-relaxed'>{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsView
