import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Layout, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Bell,
  Mic,
  Tag,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import taskService from '../../api/taskService';

const EditTaskScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    due_date: '',
    location: '',
    daily_reminder: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const task = await taskService.getTaskById(id);
        setFormData({
          title: task.title,
          description: task.description,
          category: task.category,
          priority: task.priority,
          due_date: new Date(task.due_date).toISOString().split('T')[0],
          location: task.location || '',
          daily_reminder: task.daily_reminder ?? true
        });
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch task details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await taskService.updateTask(id, {
        ...formData,
        due_date: new Date(formData.due_date).toISOString()
      });
      navigate(`/task/${id}`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update task.');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-lg hover:scale-105"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase tracking-widest">Edit Task</h2>
        <button 
            onClick={handleDelete}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-rose-500 hover:bg-rose-500/10 transition-all shadow-lg hover:scale-105"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <input 
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Task Title"
            className="w-full bg-transparent text-3xl font-black text-white placeholder-slate-800 outline-none border-b border-white/5 py-4 focus:border-indigo-500 transition-colors"
          />
          <textarea 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Add description..."
            className="w-full glass-card rounded-[2.5rem] p-6 text-slate-300 placeholder-slate-700 outline-none border border-white/5 min-h-[120px] resize-none focus:border-indigo-500/30 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-6 rounded-[2rem] glass-card border border-white/5 flex flex-col gap-2">
             <Tag size={18} className="text-indigo-500" />
             <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Category</span>
             <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="bg-transparent text-white font-bold outline-none cursor-pointer appearance-none"
             >
                {['Personal', 'Work', 'Finance', 'Fitness', 'Social', 'Dev', 'Home'].map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
             </select>
           </div>
           <div className="p-6 rounded-[2rem] glass-card border border-white/5 flex flex-col gap-2">
             <AlertCircle size={18} className="text-rose-500" />
             <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Priority</span>
             <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="bg-transparent text-white font-bold outline-none cursor-pointer appearance-none capitalize"
             >
                {['low', 'medium', 'high'].map(p => <option key={p} value={p} className="bg-slate-900 capitalize">{p}</option>)}
             </select>
           </div>
        </div>

        <div className="space-y-4">
           <div className="p-6 rounded-[2.5rem] glass-card border border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4 w-full">
               <Calendar className="text-indigo-500" size={20} />
               <div className="flex-1">
                 <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Due Date</p>
                 <input 
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    className="bg-transparent text-white font-bold outline-none cursor-pointer w-full"
                 />
               </div>
             </div>
           </div>

           <div className="p-6 rounded-[2.5rem] glass-card border border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4 w-full">
               <MapPin className="text-rose-500" size={20} />
               <div className="flex-1">
                 <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Location</p>
                 <input 
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Set location"
                    className="bg-transparent text-white font-bold outline-none w-full placeholder-slate-700"
                 />
               </div>
             </div>
           </div>

           <div className="p-6 rounded-[2.5rem] glass-card border border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <Bell className="text-amber-500" size={20} />
               <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Reminder</p>
                  <span className="text-white font-bold">Daily Reminders</span>
               </div>
             </div>
             <button 
                type="button"
                onClick={() => setFormData({...formData, daily_reminder: !formData.daily_reminder})}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.daily_reminder ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800'}`}
             >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.daily_reminder ? 'translate-x-6' : 'translate-x-0'}`} />
             </button>
           </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button 
            type="submit"
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-6 rounded-[2.5rem] text-lg shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
          >
            Update Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskScreen;
