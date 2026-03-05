import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar' // New left narrow sidebar
import ChatList from '../components/ChatList' // New middle chat list
import ChatContainer from '../components/ChatContainer'
import { ChatContext } from '../../context/ChatContext'
import ContactsView from '../components/ContactsView'
import NotificationsView from '../components/NotificationsView'
import CalendarView from '../components/CalendarView'
import SettingsView from '../components/SettingsView'
import { motion, AnimatePresence } from 'framer-motion'

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext)
  const [selectedOption, setSelectedOption] = useState('CHAT')

  const renderContent = () => {
    switch (selectedOption) {
      case 'CHAT':
        return (
          <div className="flex h-full w-full overflow-hidden">
            <ChatList />
            <ChatContainer />
          </div>
        )
      case 'CONTACTS':
        return <ContactsView />
      case 'NOTIFICATIONS':
        return <NotificationsView />
      case 'CALENDER':
        return <CalendarView />
      case 'SETTINGS':
        return <SettingsView />
      default:
        return <ChatContainer />
    }
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* 3-Column SaaS Layout */}
      {/* Left Sidebar (Narrow Nav) */}
      <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      
      {/* Main Content Area (Middle + Right) */}
      <main className="flex-1 h-full overflow-hidden relative flex">
        {renderContent()}
      </main>
    </div>
  )
}

export default HomePage
