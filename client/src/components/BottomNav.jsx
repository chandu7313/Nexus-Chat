import React from 'react'
import { IoChatbubbleOutline, IoPeopleOutline, IoCallOutline } from 'react-icons/io5'

const BottomNav = ({ selectedOption, setSelectedOption }) => {
  const tabs = [
    { id: 'CHAT', icon: <IoChatbubbleOutline size={22} />, label: 'Chats' },
    { id: 'CONTACTS', icon: <IoPeopleOutline size={22} />, label: 'Contacts' },
    { id: 'CALLS', icon: <IoCallOutline size={22} />, label: 'Calls' },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-[#f8fafc] border-t border-slate-200 flex items-center justify-around z-50">
      {tabs.map((tab) => {
        const isSelected = selectedOption === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setSelectedOption(tab.id)}
            className="flex flex-col items-center justify-center w-full h-full gap-1"
          >
            <div className={`px-5 py-1 rounded-full transition-colors ${isSelected ? 'bg-[#22c55e] text-[#0f172a]' : 'text-[#475569]'}`}>
              {tab.icon}
            </div>
            <span className={`text-[12px] font-semibold ${isSelected ? 'text-[#0f172a]' : 'text-[#475569]'}`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default BottomNav
