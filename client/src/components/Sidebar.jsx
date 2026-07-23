import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { IoChatbubbleEllipses, IoMoon, IoSunny, IoChevronForward } from "react-icons/io5"
import { BiSolidContact } from "react-icons/bi"
import { MdOutlineNotifications, MdCalendarMonth } from "react-icons/md"
import { FiSettings } from "react-icons/fi"
import { FaPowerOff } from "react-icons/fa6"
import { IoPerson } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import Tooltip from './ui/Tooltip'

const Sidebar = ({ selectedOption, setSelectedOption }) => {
  const { authUser, logout } = useContext(AuthContext)
  const { toggleTheme, isDark } = useTheme()
  const navigate = useNavigate()

  const navItems = [
    { id: "CHAT", icon: <IoChatbubbleEllipses size={24} />, label: "Chats" },
    { id: "CONTACTS", icon: <BiSolidContact size={24} />, label: "Contacts" },
    { id: "NOTIFICATIONS", icon: <MdOutlineNotifications size={24} />, label: "Notifications" },
    { id: "CALENDER", icon: <MdCalendarMonth size={24} />, label: "Calendar" },
  ]

  return (
    <aside className="w-[84px] bg-[#080c14] flex flex-col items-center py-6 flex-shrink-0 z-50 h-full relative">
      
      {/* Top: Profile */}
      <div className="mb-8 w-full flex flex-col items-center relative">
        <div 
          className="relative cursor-pointer group"
          onClick={() => navigate('/profile')}
        >
          {/* Avatar Placeholder exactly like image */}
          {authUser?.profilePic ? (
            <img 
              src={authUser.profilePic} 
              alt="profile" 
              className="w-14 h-14 rounded-full object-cover border-2 border-[#1c2333]" 
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#3b82f6] flex items-center justify-center border-2 border-[#1c2333]">
               <IoPerson size={32} className="text-[#080c14]" />
            </div>
          )}
          
          {/* Status Dot */}
          <div className="absolute bottom-0 right-0 w-[14px] h-[14px] bg-[#10b981] rounded-full border-[2.5px] border-[#080c14]" />
        </div>

        {/* Floating Chevron right */}
        <button className="absolute -right-3 top-5 w-[26px] h-[26px] bg-[#2962ff] text-white rounded-full flex items-center justify-center shadow-lg z-10 hover:brightness-110 transition-colors">
          <IoChevronForward size={14} />
        </button>
      </div>

      {/* Center: Navigation */}
      <nav className="flex-1 flex flex-col gap-6 items-center w-full mt-4">
        {navItems.map((item) => (
          <Tooltip key={item.id} content={item.label} position="right">
            <button
              onClick={() => setSelectedOption(item.id)}
              className={`relative w-14 h-14 flex items-center justify-center rounded-[18px] transition-colors ${
                selectedOption === item.id 
                  ? 'bg-[#2962ff] text-white shadow-[0_4px_20px_rgba(41,98,255,0.4)]' 
                  : 'text-[#475569] hover:text-white'
              }`}
            >
              {item.icon}
            </button>
          </Tooltip>
        ))}
      </nav>

      {/* Bottom: Settings & Logout */}
      <div className="flex flex-col gap-6 items-center w-full mt-auto mb-2">
        <Tooltip content="Theme" position="right">
          <button 
            onClick={toggleTheme}
            className="w-12 h-12 flex items-center justify-center rounded-xl text-[#475569] hover:text-white transition-colors"
          >
            {isDark ? <IoSunny size={22} /> : <IoMoon size={22} />}
          </button>
        </Tooltip>

        <Tooltip content="Settings" position="right">
          <button 
            onClick={() => setSelectedOption('SETTINGS')}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${
              selectedOption === 'SETTINGS' 
                ? 'bg-[#2962ff] text-white' 
                : 'text-[#475569] hover:text-white'
            }`}
          >
            <FiSettings size={22} />
          </button>
        </Tooltip>

        <div className="w-8 h-[1px] bg-[#1e293b]" />

        <Tooltip content="Logout" position="right">
          <button 
            onClick={logout}
            className="w-12 h-12 flex items-center justify-center rounded-xl text-[#475569] hover:text-[#ef4444] transition-colors"
          >
            <FaPowerOff size={20} />
          </button>
        </Tooltip>
      </div>
    </aside>
  )
}

export default Sidebar