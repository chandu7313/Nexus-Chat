import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { IoChatbubbleEllipses, IoMoon, IoSunny } from "react-icons/io5"
import { BiSolidContact } from "react-icons/bi"
import { MdOutlineNotifications, MdCalendarMonth } from "react-icons/md"
import { FiSettings } from "react-icons/fi"
import { FaPowerOff } from "react-icons/fa6"
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import Tooltip from './ui/Tooltip'
import { motion } from 'framer-motion'

const Sidebar = ({ selectedOption, setSelectedOption }) => {
  const { authUser, logout } = useContext(AuthContext)
  const { toggleTheme, isDark } = useTheme()
  const navigate = useNavigate()

  const navItems = [
    { id: "CHAT", icon: <IoChatbubbleEllipses size={22} />, label: "Chats" },
    { id: "CONTACTS", icon: <BiSolidContact size={22} />, label: "Contacts" },
    { id: "NOTIFICATIONS", icon: <MdOutlineNotifications size={22} />, label: "Notifications" },
    { id: "CALENDER", icon: <MdCalendarMonth size={22} />, label: "Calendar" },
  ]

  return (
    <aside className="w-16 bg-gray-900 text-gray-300 flex flex-col justify-between items-center py-6 flex-shrink-0 z-50">
      {/* Top: Profile */}
      <div className="mb-8">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileActive={{ scale: 0.95 }}
          className="relative cursor-pointer group"
          onClick={() => navigate('/profile')}
        >
          <img 
            src={authUser.profilePic || assets.avatar_icon} 
            alt="profile" 
            className="w-10 h-10 rounded-xl object-cover border-2 border-gray-700 group-hover:border-blue-500 transition-colors" 
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
        </motion.div>
      </div>

      {/* Center: Navigation */}
      <nav className="flex-1 flex flex-col gap-4 items-center w-full">
        <Tooltip content="Chats" position="right">
          <button
            onClick={() => setSelectedOption('CHAT')}
            className={`p-3 rounded-xl hover:bg-gray-800 hover:text-white transition ${selectedOption === 'CHAT' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
          >
            <IoChatbubbleEllipses size={22} />
          </button>
        </Tooltip>

        <Tooltip content="Contacts" position="right">
          <button
            onClick={() => setSelectedOption('CONTACTS')}
            className={`p-3 rounded-xl hover:bg-gray-800 hover:text-white transition ${selectedOption === 'CONTACTS' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
          >
            <BiSolidContact size={22} />
          </button>
        </Tooltip>

        <Tooltip content="Notifications" position="right">
          <button
            onClick={() => setSelectedOption('NOTIFICATIONS')}
            className={`p-3 rounded-xl hover:bg-gray-800 hover:text-white transition ${selectedOption === 'NOTIFICATIONS' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
          >
            <MdOutlineNotifications size={22} />
          </button>
        </Tooltip>

        <Tooltip content="Calendar" position="right">
          <button
            onClick={() => setSelectedOption('CALENDER')}
            className={`p-3 rounded-xl hover:bg-gray-800 hover:text-white transition ${selectedOption === 'CALENDER' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
          >
            <MdCalendarMonth size={22} />
          </button>
        </Tooltip>
      </nav>

      {/* Bottom: Settings & Logout */}
      <div className="flex flex-col gap-4 items-center w-full mt-auto">
        <Tooltip content="Theme" position="right">
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-xl hover:bg-gray-800 hover:text-white transition"
          >
            {isDark ? <IoSunny size={20} /> : <IoMoon size={20} />}
          </button>
        </Tooltip>

        <Tooltip content="Settings" position="right">
          <button 
            onClick={() => setSelectedOption('SETTINGS')}
            className={`p-3 rounded-xl hover:bg-gray-800 hover:text-white transition ${selectedOption === 'SETTINGS' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
          >
            <FiSettings size={20} />
          </button>
        </Tooltip>

        <div className="w-8 h-[1px] bg-gray-800 my-2" />

        <Tooltip content="Logout" position="right">
          <button 
            onClick={logout}
            className="p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <FaPowerOff size={20} />
          </button>
        </Tooltip>
      </div>
    </aside>
  )
}

export default Sidebar