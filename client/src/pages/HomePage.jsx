import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar' // New left narrow sidebar
import BottomNav from '../components/BottomNav' // New bottom nav for mobile
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
          <div className="flex h-full w-full overflow-hidden relative">
            <div className={`h-full flex-shrink-0 z-40 ${selectedUser ? 'hidden md:block' : 'w-full md:w-96'}`}>
              <ChatList setSelectedOption={setSelectedOption} />
            </div>
            <div className={`flex-1 h-full bg-surface ${!selectedUser ? 'hidden md:flex' : 'flex w-full'}`}>
              <ChatContainer />
            </div>
          </div>
        )
      case 'CONTACTS':
        return <ContactsView setSelectedOption={setSelectedOption} />
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

  const showBottomNav = selectedOption !== 'CHAT' || !selectedUser;

  return (
    <div className={`flex h-screen bg-surface md:pb-0 ${showBottomNav ? 'pb-[68px]' : ''}`}>
      {/* 3-Column SaaS Layout */}
      {/* Left Sidebar (Narrow Nav) */}
      <div className="hidden md:flex h-full">
        <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      </div>
      
      {/* Main Content Area (Middle + Right) */}
      <main className="flex-1 h-full overflow-hidden relative flex bg-surface">
        {renderContent()}
      </main>

      {showBottomNav && (
        <BottomNav selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      )}
    </div>
  )
}

export default HomePage
