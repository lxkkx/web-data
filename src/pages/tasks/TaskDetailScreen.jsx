import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Edit, 
  Share2, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Tag, 
  AlertCircle,
  MapPin,
  Calendar as CalendarIcon,
  ChevronRight,
  ShieldCheck,
  MoreVertical,
  Flag,
  Calendar,
  Layers
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import taskService from '../../api/taskService';

const TaskInfoCard = ({ icon: Icon, title, value, color = "#6750A4", showArrow = false }) => (
  <div className="w-full bg-white rounded-[20px] border border-gray-100 p-4 flex items-center gap-4 transition-all hover:shadow-md cursor-default">
    {Icon && (
      <div 
        style={{ backgroundColor: `${color}10`, color: color }}
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
      >
        <Icon size={20} />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      <p className="text-[16px] font-extrabold text-[#21005D] truncate">{value}</p>
    </div>
    {showArrow && <ChevronRight size={20} className="text-gray-300" />}
  </div>
);

const TaskDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTaskById(id);
      setTask(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch task details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleToggleComplete = async () => {
    try {
      if (task.status === 'pending') {
        await taskService.completeTask(id);
      } else {
        await taskService.updateTask(id, { status: 'pending' });
      }
      fetchTask();
    } catch (err) {
      console.error('Error toggling task status:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        navigate('/tasks');
      } catch (err) {
        alert(err.response?.data?.detail || 'Failed to delete task.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFEFE] flex items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-[#6750A4]/20 border-t-[#6750A4] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-[#FEFEFE] flex flex-col items-center justify-center p-8 text-center">
        <div className="p-6 rounded-full bg-red-50 text-red-500 mb-6">
            <AlertCircle size={48} />
        </div>
        <h2 className="text-[24px] font-black text-gray-900 mb-2">Error</h2>
        <p className="text-gray-500 font-medium mb-8 max-w-md">{error || 'Task not found'}</p>
        <button 
            onClick={() => navigate(-1)} 
            className="h-[56px] px-10 bg-[#6750A4] text-white rounded-full font-bold shadow-lg shadow-[#6750A4]/20 hover:bg-[#4F378B] transition-all"
        >
            Go Back
        </button>
      </div>
    );
  }

  const isCompleted = task.status === 'completed';
  const priorityColor = task.priority?.toLowerCase() === 'high' ? '#B3261E' : (task.priority?.toLowerCase() === 'medium' ? '#F59E0B' : '#10B981');

  return (
    <div className="min-h-screen bg-[#FEFEFE] font-sans pb-24">
      {/* Top App Bar */}
      <div className="flex items-center px-4 py-4 sticky top-0 bg-white/95 backdrop-blur-md z-30 shadow-sm border-b border-gray-50">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-full hover:bg-gray-100 text-[#21005D] transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="ml-4 text-[20px] font-black text-[#21005D] truncate flex-1">Task Details</h1>
        <button 
            onClick={() => navigate(`/edit-task/${id}`)}
            className="p-3 rounded-full hover:bg-[#6750A4]/10 text-[#6750A4] transition-all"
        >
            <Edit size={24} />
        </button>
      </div>

      <div className="px-6 pt-6 flex flex-col max-w-2xl mx-auto w-full space-y-8">
        {/* Title Section */}
        <div className="space-y-3">
            <div 
                style={{ backgroundColor: `${priorityColor}15`, color: priorityColor }}
                className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit"
            >
                {task.priority || 'NORMAL'} PRIORITY
            </div>
            <h2 className={`text-[32px] font-black text-[#21005D] leading-tight ${isCompleted ? 'line-through text-gray-400 italic' : ''}`}>
                {task.title}
            </h2>
        </div>

        {/* Primary Actions */}
        <div className="flex gap-4">
            <button
                onClick={handleToggleComplete}
                className={`flex-1 h-[60px] rounded-[24px] font-extrabold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${
                    isCompleted 
                    ? 'bg-gray-100 text-gray-400 shadow-none' 
                    : 'bg-[#6750A4] text-white shadow-[#6750A4]/20'
                }`}
            >
                {isCompleted ? <CheckCircle2 size={24} /> : null}
                {isCompleted ? 'Completed' : 'Mark as Complete'}
            </button>
            
            <button className="w-[60px] h-[60px] rounded-[24px] bg-white border border-gray-200 text-[#21005D] flex items-center justify-center transition-all hover:bg-gray-50 active:scale-95">
                <Share2 size={24} />
            </button>
        </div>

        {/* Info Grid */}
        <div className="space-y-4 pt-2">
            <div className="bg-[#FCF8FE] rounded-[32px] p-6 border border-gray-100">
                <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Description</h4>
                <p className="text-[16px] font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {task.description || 'No description provided.'}
                </p>
            </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TaskInfoCard 
                        icon={Flag} 
                        title="Priority Level" 
                        value={task.priority?.toUpperCase() || 'NORMAL'} 
                        color={priorityColor}
                    />
                    <TaskInfoCard 
                        icon={Calendar} 
                        title="Due Date" 
                        value={task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Deadline'} 
                        color="#6750A4"
                    />
                    <TaskInfoCard 
                        icon={Layers} 
                        title="Task Category" 
                        value={task.category || 'General'} 
                        color="#625B71"
                    />
                    <TaskInfoCard 
                        icon={MapPin} 
                        title="Location" 
                        value={task.location?.placeName || 'Not pinned'} 
                        color="#10B981"
                        showArrow={!!task.location}
                    />
                </div>

                {/* Map Preview for Details */}
                {task.location && (
                    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-2 px-1">
                            <MapPin size={16} className="text-[#10B981]" />
                            <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">Geographic Context</h4>
                        </div>
                        <div className="h-[200px] w-full rounded-[32px] overflow-hidden border border-gray-100 shadow-xl relative group">
                            <MapContainer 
                                center={[task.location.latitude, task.location.longitude]} 
                                zoom={14} 
                                zoomControl={false}
                                dragging={false}
                                touchZoom={false}
                                scrollWheelZoom={false}
                                doubleClickZoom={false}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                <Marker position={[task.location.latitude, task.location.longitude]} />
                            </MapContainer>
                            <div className="absolute inset-0 bg-transparent flex items-center justify-center group-hover:bg-black/5 transition-colors cursor-default" />
                        </div>
                        <p className="text-[14px] text-gray-500 font-bold px-3 py-4 bg-gray-50 rounded-[20px] border border-gray-100 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                            {task.location.address || 'Address information unavailable'}
                        </p>
                    </div>
                )}
            </div>

        {/* Secondary Actions */}
        <div className="pt-10">
            <button
                onClick={handleDelete}
                className="w-full h-[60px] rounded-[24px] bg-red-50 text-[#B3261E] font-black hover:bg-red-100 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[13px] border border-red-100"
            >
                <Trash2 size={20} />
                Delete Task
            </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailScreen;
