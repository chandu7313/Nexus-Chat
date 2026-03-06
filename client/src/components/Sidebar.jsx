import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { IoChatbubbleEllipses, IoMoon, IoSunny, IoChevronBack, IoChevronForward } from "react-icons/io5"
import { BiSolidContact } from "react-icons/bi"
import { MdOutlineNotifications, MdCalendarMonth } from "react-icons/md"
import { FiSettings } from "react-icons/fi"
import { FaPowerOff } from "react-icons/fa6"
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import Tooltip from './ui/Tooltip'
import { motion, AnimatePresence } from 'framer-motion'

const Sidebar = ({ selectedOption, setSelectedOption }) => {
  const { authUser, logout } = useContext(AuthContext)
  const { toggleTheme, isDark } = useTheme()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const navigate = useNavigate()

  const navItems = [
    { id: "CHAT", icon: <IoChatbubbleEllipses size={22} />, label: "Chats" },
    { id: "CONTACTS", icon: <BiSolidContact size={22} />, label: "Contacts" },
    { id: "NOTIFICATIONS", icon: <MdOutlineNotifications size={22} />, label: "Notifications" },
    { id: "CALENDER", icon: <MdCalendarMonth size={22} />, label: "Calendar" },
  ]

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 240 }}
      className="bg-slate-950 text-slate-400 flex flex-col items-center py-8 flex-shrink-0 z-50 border-r border-white/5 relative h-full"
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-[60]"
      >
        {isCollapsed ? <IoChevronForward size={14} /> : <IoChevronBack size={14} />}
      </button>

      {/* Top: Profile */}
      <div className={`mb-10 w-full flex flex-col items-center ${isCollapsed ? '' : 'px-4'}`}>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileActive={{ scale: 0.95 }}
          className="relative cursor-pointer group"
          onClick={() => navigate('/profile')}
        >
          <img 
            src={authUser.profilePic || assets.avatar_icon} 
            alt="profile" 
            className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-800 group-hover:border-blue-500/50 transition-all duration-300 shadow-lg" 
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-sm" />
        </motion.div>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              className="mt-4 text-center overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <h4 className="text-sm font-bold text-slate-100">{authUser.fullName}</h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">My Profile</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Center: Navigation */}
      <nav className="flex-1 flex flex-col gap-5 items-center w-full px-3">
        {navItems.map((item) => (
          <Tooltip key={item.id} content={item.label} position="right" disabled={!isCollapsed}>
            <button
              onClick={() => setSelectedOption(item.id)}
              className={`relative w-full group flex items-center p-3.5 rounded-2xl transition-all duration-300 ${
                selectedOption === item.id 
                  ? 'bg-blue-600 text-white shadow-blue-600/20 shadow-xl' 
                  : 'hover:bg-slate-900 hover:text-slate-100'
              } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              <div className={`flex-shrink-0 ${selectedOption === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                {item.icon}
              </div>

              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span 
                    className="text-sm font-medium whitespace-nowrap ml-4 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {selectedOption === item.id && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute left-[-0.75rem] w-1.5 h-8 bg-blue-600 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          </Tooltip>
        ))}
      </nav>

      {/* Bottom: Settings & Logout */}
      <div className="flex flex-col gap-5 items-center w-full mt-auto px-3">
        <Tooltip content="Theme" position="right" disabled={!isCollapsed}>
          <button 
            onClick={toggleTheme}
            className={`w-full group flex items-center p-3.5 rounded-2xl hover:bg-slate-900 hover:text-slate-100 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
              {isDark ? <IoSunny size={20} /> : <IoMoon size={20} />}
            </div>
            {!isCollapsed && (
              <motion.span 
                className="text-sm font-medium ml-4 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </button>
        </Tooltip>

        <Tooltip content="Settings" position="right" disabled={!isCollapsed}>
          <button 
            onClick={() => setSelectedOption('SETTINGS')}
            className={`w-full group flex items-center p-3.5 rounded-2xl transition-all duration-300 ${
              selectedOption === 'SETTINGS' 
                ? 'bg-blue-600 text-white shadow-blue-600/20 shadow-xl' 
                : 'hover:bg-slate-900 hover:text-slate-100'
            } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
              <FiSettings size={20} />
            </div>
            {!isCollapsed && (
              <motion.span 
                className="text-sm font-medium ml-4 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Settings
              </motion.span>
            )}
          </button>
        </Tooltip>

        <div className="w-10 h-[1px] bg-white/5 my-2" />

        <Tooltip content="Logout" position="right" disabled={!isCollapsed}>
          <button 
            onClick={logout}
            className={`w-full group flex items-center p-3.5 rounded-2xl transition-all duration-300 hover:bg-rose-500/10 hover:text-rose-500 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            <div className="flex-shrink-0 group-hover:rotate-12 transition-transform">
              <FaPowerOff size={20} />
            </div>
            {!isCollapsed && (
              <motion.span 
                className="text-sm font-medium ml-4 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Logout
              </motion.span>
            )}
          </button>
        </Tooltip>
      </div>
    </motion.aside>
  )
}

export default Sidebar