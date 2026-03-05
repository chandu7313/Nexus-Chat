import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { IoChevronBack, IoChevronForward, IoCalendarOutline } from 'react-icons/io5'
import { format } from 'date-fns'

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthName = format(currentDate, 'MMMM yyyy')

  const events = {
    15: { title: 'Project Sync', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    22: { title: 'Design Review', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    28: { title: 'Feedback', color: 'bg-green-100 text-green-700 border-green-200' }
  }

  return (
    <div className='h-full flex flex-col bg-white overflow-hidden'>
      {/* Header */}
      <div className="p-8 pb-4">
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-text-primary'>Calendar</h1>
            <p className='text-sm text-text-secondary mt-1'>Plan your schedule and catch up on meetings</p>
          </div>
          <div className='flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-divider'>
            <button onClick={prevMonth} className='p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-text-muted hover:text-primary'>
              <IoChevronBack size={18} />
            </button>
            <span className='text-xs font-bold w-32 text-center text-text-primary'>{monthName}</span>
            <button onClick={nextMonth} className='p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-text-muted hover:text-primary'>
              <IoChevronForward size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className='flex-1 overflow-y-auto px-8 pb-8'>
        <div className='bg-white border border-divider rounded-2xl overflow-hidden shadow-sm flex flex-col h-full min-h-[500px]'>
          <div className='grid grid-cols-7 bg-slate-50 border-b border-divider'>
            {days.map(day => (
              <div key={day} className='py-4 text-center text-[10px] font-bold text-text-muted uppercase tracking-widest'>{day}</div>
            ))}
          </div>
          
          <div className='grid grid-cols-7 flex-1'>
            {Array.from({ length: firstDayOfMonth(currentDate) }).map((_, i) => (
              <div key={`empty-${i}`} className='border-r border-b border-divider bg-slate-50/30' />
            ))}
            {Array.from({ length: daysInMonth(currentDate) }).map((_, i) => {
              const dayNum = i + 1
              const event = events[dayNum]
              const isToday = dayNum === new Date().getDate() && currentDate.getMonth() === new Date().getMonth()

              return (
                <div 
                  key={dayNum} 
                  className={`min-h-[100px] p-2 border-r border-b border-divider transition-all hover:bg-slate-50 group relative ${isToday ? 'bg-blue-50/20' : ''}`}
                >
                  <div className='flex justify-between items-start'>
                    <span className={`text-xs font-bold ${isToday ? 'w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center' : 'text-text-secondary'}`}>
                      {dayNum}
                    </span>
                    {isToday && <span className="text-[8px] font-black text-primary uppercase tracking-tighter">Today</span>}
                  </div>
                  
                  {event && (
                    <div className={`mt-2 p-1.5 rounded-lg border text-[10px] font-bold truncate shadow-sm ${event.color}`}>
                      {event.title}
                    </div>
                  )}

                  {!event && (
                    <button className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <div className="w-8 h-8 rounded-full bg-white shadow-md border border-divider flex items-center justify-center text-primary">
                          <IoCalendarOutline size={14} />
                       </div>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView
