import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreVertical,
  ChevronRight,
  TrendingUp,
  Inbox,
  LayoutGrid,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import taskService from '../../api/taskService';

const SectionHeader = ({ title, count, color = "text-[#6750A4]" }) => (
  <div className="flex items-center gap-3 px-2 mb-4">
    <div className={`h-1.5 w-8 rounded-full bg-current ${color}`} />
    <h3 className={`text-[12px] font-black uppercase tracking-[0.2em] ${color}`}>
      {title} {count !== undefined && `(${count})`}
    </h3>
  </div>
);

const TaskItem = ({ task, onClick, onToggleComplete, isCompleted }) => {
  let priorityColor = '#10B981';
  if (task.priority?.toLowerCase() === 'high') priorityColor = '#B3261E';
  else if (task.priority?.toLowerCase() === 'medium') priorityColor = '#F59E0B';

  return (
    <div 
      onClick={onClick}
      className={`group w-full rounded-[24px] border p-5 flex items-center transition-all cursor-pointer hover:shadow-md ${
        isCompleted ? 'bg-[#FCF8FE] border-gray-100 opacity-60' : 'bg-white border-gray-100'
      }`}
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(task.id, task.status);
        }}
        className={`mr-4 transition-all active:scale-90 ${isCompleted ? 'text-[#6750A4]' : 'text-gray-300 hover:text-gray-400'}`}
      >
        {isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
      </button>

      <div className="flex-1 min-w-0">
        <h5 className={`font-extrabold text-[17px] truncate leading-none ${isCompleted ? 'text-gray-400 line-through italic' : 'text-[#21005D]'}`}>
          {task.title}
        </h5>
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
            <Calendar size={12} />
            <span className="text-[11px] font-bold uppercase tracking-tighter">
              {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Date'}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-100 rounded-lg bg-gray-50 text-gray-200">
             <LayoutGrid size={12} className="text-gray-400" />
             <span className="text-[11px] font-bold uppercase tracking-tighter text-gray-400">{task.category || 'General'}</span>
          </div>
        </div>
      </div>
      <ChevronRight size={20} className="text-gray-300 ml-2" />
    </div>
  );
};

const AllTasksScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleTask = async (id, currentStatus) => {
    try {
        if (currentStatus === 'pending') {
            await taskService.completeTask(id);
        } else {
            await taskService.updateTask(id, { status: 'pending' });
        }
        fetchTasks();
    } catch (error) {
        console.error('Error toggling task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryParam ? task.category === categoryParam : true;
    return matchesSearch && matchesCategory;
  });

  const activeTasks = filteredTasks.filter(t => t.status === 'pending');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-[#FEFEFE] flex items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-[#6750A4]/20 border-t-[#6750A4] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFEFE] font-sans pb-24">
      {/* Top App Bar */}
      <div className="flex items-center px-4 py-4 sticky top-0 bg-white/95 backdrop-blur-md z-30 shadow-sm border-b border-gray-50">
        <button 
          onClick={() => navigate('/home')}
          className="p-3 rounded-full hover:bg-gray-100 text-[#21005D] transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="ml-4 flex-1 min-w-0">
          <h1 className="text-[20px] font-black text-[#21005D] truncate leading-tight">
            {categoryParam || 'My Tasks'}
          </h1>
          <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
            {activeTasks.length} active items
          </p>
        </div>
        <button className="p-3 rounded-full hover:bg-[#6750A4]/10 text-[#6750A4] transition-all">
          <Filter size={24} />
        </button>
      </div>

      <div className="px-6 pt-6 flex flex-col max-w-2xl mx-auto w-full space-y-8">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6750A4] transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search your items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F3EDF7] focus:bg-white border border-transparent focus:border-[#6750A4] focus:ring-4 focus:ring-[#6750A4]/5 rounded-[24px] py-4 pl-14 pr-4 text-[#21005D] font-bold placeholder-gray-400 transition-all outline-none"
          />
        </div>

        {/* Task Sections */}
        <div className="space-y-10">
          {/* Active Tasks */}
          {activeTasks.length > 0 && (
            <div>
              <SectionHeader title="Active" count={activeTasks.length} />
              <div className="flex flex-col gap-3">
                {activeTasks.map(task => (
                  <TaskItem 
                    key={task.id}
                    task={task}
                    onClick={() => navigate(`/task/${task.id}`)}
                    onToggleComplete={toggleTask}
                    isCompleted={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <SectionHeader title="Completed" count={completedTasks.length} color="text-gray-400" />
              <div className="flex flex-col gap-3">
                {completedTasks.map(task => (
                  <TaskItem 
                    key={task.id}
                    task={task}
                    onClick={() => navigate(`/task/${task.id}`)}
                    onToggleComplete={toggleTask}
                    isCompleted={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="p-8 rounded-full bg-[#F3EDF7] mb-6 text-[#6750A4]/30">
                <Inbox size={64} />
              </div>
              <h3 className="text-[20px] font-black text-[#21005D] mb-2">All tasks found</h3>
              <p className="text-gray-400 font-medium">Looking good! Everything is caught up.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTasksScreen;
