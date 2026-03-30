import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2,
  Calendar as CalendarIcon,
  Loader2,
  CalendarDays,
  Bell,
  Trash2,
  MoreVertical,
  CheckCircle,
  Circle,
  Tag,
  LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import taskService from '../../api/taskService';

const DateView = ({ date, isSelected, isToday, hasTasks, onClick }) => (
  <button
    onClick={() => onClick(date)}
    className={`relative w-[44px] h-[48px] rounded-[14px] flex flex-col items-center justify-center transition-all active:scale-90 ${
      isSelected 
      ? 'bg-[#6750A4] text-white shadow-lg shadow-[#6750A4]/20' 
      : isToday
      ? 'bg-[#EADDFF] text-[#21005D] border border-[#6750A4]/20 font-black'
      : 'text-[#21005D] hover:bg-[#F3EDF7] font-bold'
    }`}
  >
    <span className="text-[17px] leading-none mb-0.5">{date}</span>
    {hasTasks && (
      <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#6750A4]'}`} />
    )}
  </button>
);

const CalendarScreen = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const data = await taskService.getCalendarTasks(year, month);
      setCalendarData(data);
    } catch (error) {
      console.error('Error fetching calendar tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const changeMonth = (offset) => {
    const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + offset, 1));
    setCurrentDate(new Date(nextMonth));
    setSelectedDay(1);
  };

  const getDaysInMonth = (y, m) => new Date(y, m, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  
  const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const dayTasks = calendarData[selectedDay] || [];

  return (
    <div className="min-h-screen bg-[#FEFEFE] font-sans pb-32">
      {/* Top App Bar */}
      <div className="flex items-center px-4 py-4 sticky top-0 bg-white/95 backdrop-blur-md z-30 shadow-sm border-b border-gray-50">
        <button 
          onClick={() => navigate('/home')}
          className="p-3 rounded-full hover:bg-gray-100 text-[#21005D] transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex-1 flex items-center justify-center gap-4">
          <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400"><ChevronLeft size={24} /></button>
          <div className="text-center min-w-[120px]">
            <h1 className="text-[18px] font-black text-[#21005D] truncate leading-none uppercase tracking-tighter">
              {monthName}
            </h1>
            <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{year}</p>
          </div>
          <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400"><ChevronRight size={24} /></button>
        </div>

        <div className="w-[48px]" /> {/* Spacer for balance */}
      </div>

      <div className="px-6 pt-6 flex flex-col max-w-2xl mx-auto w-full">
        {/* Calendar Grid */}
        <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-7 gap-2 mb-6">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-3 gap-x-2">
                {blanks.map(b => <div key={`blank-${b}`} className="w-[44px] h-[48px]" />)}
                {days.map((day) => {
                    const isToday = day === new Date().getDate() && month === (new Date().getMonth() + 1) && year === new Date().getFullYear();
                    const isSelected = day === selectedDay;
                    const hasTasks = calendarData[day] && calendarData[day].length > 0;

                    return (
                        <div key={day} className="flex justify-center">
                            <DateView 
                                date={day} 
                                isSelected={isSelected} 
                                isToday={isToday} 
                                hasTasks={hasTasks} 
                                onClick={(d) => setSelectedDay(d)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Selected Tasks List */}
        <div className="mt-10 space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-[18px] text-[#21005D] uppercase tracking-[0.1em]">
                    {selectedDay === new Date().getDate() && month === (new Date().getMonth() + 1) ? "TODAY'S PLAN" : `RECORDS: DAY ${selectedDay}`}
                </h3>
                <span className="text-[11px] font-black bg-[#6750A4] text-white px-3 py-1 rounded-full uppercase tracking-widest">
                    {dayTasks.length} Events
                </span>
            </div>

            <div className="space-y-3">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center opacity-30">
                        <Loader2 size={40} className="animate-spin text-[#6750A4]" />
                        <p className="mt-4 font-black uppercase text-[10px] tracking-[0.3em]">Syncing Calendar...</p>
                    </div>
                ) : dayTasks.length > 0 ? (
                    dayTasks.map(task => (
                        <div 
                            key={task.id}
                            onClick={() => navigate(`/task/${task.id}`)}
                            className="bg-white border border-gray-100 rounded-[24px] p-5 flex items-center justify-between hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                        >
                            <div className="flex-1 min-w-0 pr-4">
                                <h4 className="font-extrabold text-[17px] text-[#21005D] truncate">{task.title}</h4>
                                <div className="flex items-center gap-3 mt-1 text-gray-400 font-bold uppercase text-[11px] tracking-tight">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span>{new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                                    <span className="text-[#6750A4]/60">{task.category || 'General'}</span>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-gray-200" />
                        </div>
                    ))
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center bg-[#FCF8FE] rounded-[32px] border border-dashed border-gray-200">
                        <CalendarIcon size={48} className="text-gray-300 opacity-50 mb-4" />
                        <p className="text-gray-400 font-bold uppercase text-[13px] tracking-widest">No tasks for this date</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/create-task')}
        className="fixed bottom-[100px] right-6 w-[64px] h-[64px] bg-[#6750A4] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#6750A4]/30 hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

export default CalendarScreen;
