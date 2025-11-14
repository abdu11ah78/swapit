"use client"

import { useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { CalendarDay } from "../lib/utils"
import { Card, CardContent } from "../components/ui/Card" 
import { MOCK_EVENTS } from "../lib/mockData"
import { CalendarIcon, ChevronLeft, ChevronRight, Circle, Clock, CheckCircle } from "lucide-react"


export default function CalendarPage() {
  // Initialize to the start of the current month
  const [currentDate, setCurrentDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const formattedMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const navigateMonth = useCallback((amount: number) => {
    setCurrentDate(prevDate => {
      // Calculate new date for the 1st of the next/previous month
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + amount, 1)
      return newDate
    })
    setSelectedDay(null)
  }, [])

  // Memoized function to generate the calendar grid (optimizes rendering)
  const calendarDays: CalendarDay[] = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate()
    const startDayOfWeek = firstDayOfMonth.getDay() // 0 (Sun) to 6 (Sat)

    const days: CalendarDay[] = []

    // 1. Padding days from previous month
    for (let i = 0; i < startDayOfWeek; i++) {
      const prevDate = new Date(year, month, 0 - startDayOfWeek + i + 1)
      days.push({ date: prevDate, isCurrentMonth: false, dayOfMonth: prevDate.getDate(), events: [] })
    }

    // 2. Days of the current month
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const dayDate = new Date(year, month, i)
      const dateString = dayDate.toISOString().split('T')[0]
      const events = MOCK_EVENTS.filter(e => e.date === dateString)
      days.push({ date: dayDate, isCurrentMonth: true, dayOfMonth: i, events })
    }

    // 3. Padding days for the next month (ensures a consistent 6-week view)
    const totalDays = days.length
    const endPadding = 42 - totalDays 

    for (let i = 1; i <= endPadding; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({ date: nextDate, isCurrentMonth: false, dayOfMonth: i, events: [] })
    }

    return days.slice(0, 42)
  }, [currentDate])

  const isToday = (dayDate: Date) => {
    const today = new Date()
    return dayDate.toDateString() === today.toDateString()
  }

  const handleDayClick = (dayDate: Date) => {
    setSelectedDay(dayDate)
  }

  // Get events for the selected day for the sidebar
  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return []
    const dateString = selectedDay.toISOString().split('T')[0]
    return MOCK_EVENTS.filter(e => e.date === dateString)
  }, [selectedDay])
  
  const selectedDayFormatted = selectedDay?.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  // Utility to determine Tailwind ring/text classes based on event color
  const getEventColorClasses = (color: string) => {
    switch(color) {
      case 'blue': return "bg-blue-500 text-blue-50 ring-blue-500"
      case 'green': return "bg-green-500 text-green-50 ring-green-500"
      case 'red': return "bg-red-500 text-red-50 ring-red-500"
      case 'purple': return "bg-purple-500 text-purple-50 ring-purple-500"
      case 'yellow': return "bg-yellow-yellow-500 text-yellow-50 ring-yellow-500"
      default: return "bg-gray-500 text-gray-50 ring-gray-500"
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pt-24 md:pt-32 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-blue-600" />
          Event Calendar
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">Manage team schedules and view deadlines in real-time.</p>
      </motion.div>
      
      {/* Main Content: Calendar Grid and Sidebar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calendar Grid Container */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-4">
              
              {/* Month Navigation Header */}
              <div className="flex justify-between items-center mb-6 px-2">
                <motion.button
                  onClick={() => navigateMonth(-1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                <motion.h2
                  key={formattedMonth} // Key for transition
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-semibold text-gray-900 dark:text-white"
                >
                  {formattedMonth}
                </motion.h2>
                <motion.button
                  onClick={() => navigateMonth(1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 text-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 h-auto">
                {calendarDays.map((day, index) => {
                  const dayDate = day.date
                  const isCurrentDay = isToday(dayDate)
                  const isSelected = selectedDay && dayDate.toDateString() === selectedDay.toDateString()

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.005 }}
                      onClick={() => handleDayClick(dayDate)}
                      className={`
                        min-h-[100px] border border-gray-100 dark:border-gray-700 rounded-lg p-2 transition duration-150 cursor-pointer
                        ${day.isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}
                        ${isCurrentDay ? 'ring-2 ring-blue-500 dark:ring-blue-400 border-blue-300 dark:border-blue-600' : ''}
                        ${isSelected ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                        ${!day.isCurrentMonth ? 'opacity-60' : ''}
                      `}
                    >
                      {/* Day Number */}
                      <div className={`text-sm font-semibold ${day.isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                        {day.dayOfMonth}
                      </div>

                      {/* Event Indicators */}
                      <div className="mt-2 space-y-1">
                        {day.events.slice(0, 2).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium truncate ring-1 ring-inset ${getEventColorClasses(event.color)}`}
                          >
                            <Circle className="w-2 h-2 fill-current" />
                            {event.title}
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 pl-1.5">
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Details Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="min-h-[400px]">
            <CardContent className="flex flex-col h-full">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2 border-b pb-2 border-gray-200 dark:border-gray-700">
                <Clock className="w-5 h-5 text-blue-600" />
                Selected Day Events
              </h3>
              
              {selectedDay ? (
                <>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
                    {selectedDayFormatted}
                  </p>
                  
                  {selectedDayEvents.length > 0 ? (
                    <div className="space-y-4 flex-1 overflow-y-auto">
                      {selectedDayEvents.map((event, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-xl shadow-md border 
                            ${event.color === 'blue' ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' : 
                            event.color === 'green' ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 
                            event.color === 'red' ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 
                            event.color === 'purple' ? 'border-purple-300 bg-purple-50 dark:bg-purple-900/20' : 
                            'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20'}`}
                        >
                          <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 ${event.color === 'blue' ? 'text-blue-600' : 'text-green-600'}`} />
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 pl-6">
                            Time: <span className="font-medium">{event.time}</span>
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 flex-1 flex flex-col justify-center items-center">
                      <CheckCircle className="w-10 h-10 text-green-300 dark:text-green-700 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No events scheduled for this day.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-8 flex-1 flex flex-col justify-center items-center">
                  <CalendarIcon className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Select a day on the calendar to view its events.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}