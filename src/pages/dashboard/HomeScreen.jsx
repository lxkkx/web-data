import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Bot,
  Calendar as CalendarIcon,
  Filter,
  CheckCircle2, 
  Circle, 
  MapPin,
  ChevronRight,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import taskService from '../../api/taskService';
import userService from '../../api/userService';
import notificationService from '../../api/notificationService';

const SummaryCard = ({ count, label, color, bg }) => (
  <div 
    style={{ backgroundColor: bg }}
    className="flex-1 rounded-[24px] p-4 flex flex-col justify-center h-[100px] border border-gray-100 shadow-sm transition-transform active:scale-95 cursor-default"
  >
    <span 
      style={{ color: color }}
      className="text-[32px] font-black leading-none mb-1"
    >
      {count}
    </span>
    <span className="text-[14px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
  </div>
);

const QuickActionButton = ({ text, icon: Icon, onClick }) => (
  <button 
    onClick={onClick}
    className="flex-1 bg-white border border-gray-200/60 shadow-sm rounded-[20px] h-[64px] flex items-center px-5 hover:bg-gray-50 active:scale-95 transition-all group"
  >
    <div className="w-10 h-10 rounded-full bg-[#6750A4]/10 flex items-center justify-center text-[#6750A4] group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <span className="ml-4 font-extrabold text-[#21005D] text-[16px]">{text}</span>
  </button>
);

const HomeScreen = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({ today_count: 0, pending_count: 0, completed_count: 0 });
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tasksData, summaryData, unreadData, userProfile] = await Promise.all([
          taskService.getAllTasks({ due_today: true }),
          taskService.getTaskSummary(),
          notificationService.getUnreadCount(),
          userService.getMe()
        ]);
        setTasks(tasksData);
        setSummary(summaryData);
        setUnreadCount(unreadData.unread_count || 0);
        setUserName(userProfile.full_name?.split(' ')[0] || 'User');
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const toggleTask = async (id, currentStatus) => {
    try {
      if (currentStatus === 'completed') {
        await taskService.updateTask(id, { status: 'pending' });
      } else {
        await taskService.completeTask(id);
      }
      const [tasksData, summaryData] = await Promise.all([
        taskService.getAllTasks({ due_today: true }),
        taskService.getTaskSummary()
      ]);
      setTasks(tasksData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const highPriorityCount = tasks.filter(t => t.priority?.toLowerCase() === 'high').length;

  return (
    <div className="min-h-screen bg-[#FEFEFE] font-sans pb-24">
      {/* Top App Bar */}
      <div className="bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-40 border-b border-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#6750A4] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#6750A4]/30">
            {userName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <h1 className="text-[18px] font-black text-[#21005D] tracking-tight leading-none">
              Hello, {userName}!
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Workspace Hub</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/notifications')}
          className="p-3 relative rounded-2xl bg-[#F3EDF7] hover:bg-[#EADDFF] transition-all text-[#6750A4] active:scale-90"
        >
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#B3261E] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white shadow-xl">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className="px-4 flex flex-col max-w-2xl mx-auto w-full space-y-8">
        {/* Summary Info Cards */}
        <div className="flex w-full gap-4">
            <SummaryCard 
              count={summary.today_count} 
              label="Today" 
              color="#6750A4" 
              bg="#F3EDF7" 
            />
            <SummaryCard 
              count={summary.pending_count} 
              label="Pending" 
              color="#625B71" 
              bg="#EADDFF" 
            />
            <SummaryCard 
              count={summary.completed_count} 
              label="Done" 
              color="#10B981" 
              bg="#E8F5E9" 
            />
        </div>

        {/* AI Smart Insight Card */}
        <div className="w-full bg-gradient-to-br from-[#6750A4] to-[#4F378B] rounded-[32px] p-8 flex flex-col min-h-[220px] shadow-xl shadow-[#6750A4]/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                <Bot size={140} />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center text-white/90 mb-6 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                    <Bot size={20} className="animate-pulse" />
                    <span className="ml-2 font-black text-[12px] uppercase tracking-widest">AI Assistant</span>
                </div>
                <h2 className="text-[26px] font-black text-white mb-2 leading-tight">Optimize your day</h2>
                <p className="text-white/70 text-[15px] font-medium leading-relaxed max-w-[240px]">
                    Your AI is ready with {highPriorityCount} priority tasks for tracking.
                </p>
                
                <div className="mt-8">
                    <button 
                      onClick={() => navigate('/ai-suggestions')}
                      className="bg-white text-[#6750A4] font-black py-3.5 px-8 rounded-[16px] hover:shadow-lg active:scale-95 transition-all text-[15px] uppercase tracking-wider"
                    >
                      View Insights
                    </button>
                </div>
            </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="w-full">
            <h3 className="font-black text-[18px] text-[#21005D] mb-4 uppercase tracking-[0.15em] ml-2">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4">
                <QuickActionButton 
                  text="New Task" 
                  icon={Plus} 
                  onClick={() => navigate('/create-task')} 
                />
                <QuickActionButton 
                  text="Calendar" 
                  icon={CalendarIcon} 
                  onClick={() => navigate('/calendar')} 
                />
            </div>
        </div>

        {/* Today's Tasks Section */}
        <div className="space-y-4">
            <div className="flex items-center justify-between w-full px-2">
                <h3 className="font-black text-[18px] text-[#21005D] uppercase tracking-[0.15em]">Today's Tasks</h3>
                <button className="p-2 text-gray-400 hover:bg-[#F3EDF7] hover:text-[#21005D] rounded-full transition-all">
                    <Filter size={22} />
                </button>
            </div>

            {loading && tasks.length === 0 ? (
                <div className="flex justify-center p-20">
                    <div className="w-10 h-10 border-4 border-[#6750A4]/20 border-t-[#6750A4] rounded-full animate-spin" />
                </div>
            ) : tasks.length === 0 ? (
                 <div className="w-full flex flex-col items-center justify-center py-20 bg-[#FCF8FE] rounded-[32px] border border-dashed border-gray-200">
                    <div className="p-6 rounded-full bg-white mb-4 shadow-sm text-gray-300">
                        <CheckCircle2 size={48} />
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[13px]">No tasks for today. Great job!</p>
                 </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {tasks.map(task => {
                        const isCompleted = task.status === 'completed';
                        let priorityColor = '#22C55E';
                        if (task.priority?.toLowerCase() === 'high') priorityColor = '#B3261E';
                        else if (task.priority?.toLowerCase() === 'medium') priorityColor = '#F59E0B';

                        return (
                            <div 
                                key={task.id}
                                onClick={() => navigate(`/task/${task.id}`)}
                                className={`w-full rounded-[24px] border p-5 flex flex-row items-center cursor-pointer transition-all hover:shadow-md ${
                                    isCompleted ? 'bg-[#FCF8FE] border-gray-100' : 'bg-white border-gray-100'
                                }`}
                            >
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleTask(task.id, task.status);
                                    }}
                                    className={`mr-4 transition-all active:scale-90 ${isCompleted ? 'text-[#6750A4]' : 'text-gray-300 hover:text-gray-400'}`}
                                >
                                    {isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                                </button>
                                
                                <div className="flex-1 flex flex-col min-w-0">
                                    <span className={`font-extrabold text-[17px] truncate leading-none ${isCompleted ? 'text-gray-400 line-through' : 'text-[#21005D]'}`}>
                                        {task.title}
                                    </span>
                                    {task.description && (
                                        <p className="text-gray-500 text-[14px] font-medium truncate mt-1">
                                            {task.description}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center mt-3 gap-3 overflow-x-auto noscrollbar">
                                        <div 
                                            style={{ backgroundColor: `${priorityColor}15`, color: priorityColor }}
                                            className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                                        >
                                            {task.priority || 'NORMAL'}
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-100 rounded-lg bg-gray-50 text-gray-500 whitespace-nowrap">
                                            <LayoutGrid size={12} />
                                            <span className="text-[11px] font-bold uppercase tracking-tighter">{task.category || 'General'}</span>
                                        </div>

                                        {task.location && (
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#6750A4]/10 text-[#6750A4] rounded-lg whitespace-nowrap">
                                                <MapPin size={12} />
                                                <span className="text-[11px] font-black uppercase tracking-tighter truncate max-w-[80px]">
                                                    {task.location.placeName || 'GPS'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-300 ml-2" size={20} />
                            </div>
                        );
                    })}
                </div>
            )}

            <button 
                onClick={() => navigate('/tasks')}
                className="w-full h-[64px] bg-white border border-[#EADDFF] text-[#6750A4] font-black rounded-[24px] mt-4 hover:bg-[#F3EDF7] active:scale-95 transition-all text-[15px] uppercase tracking-[0.2em] shadow-sm shadow-[#6750A4]/5 flex items-center justify-center gap-3"
            >
                View All Tasks
                <ChevronRight size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
