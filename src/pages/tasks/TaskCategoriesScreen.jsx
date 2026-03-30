import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Briefcase, 
  User, 
  Heart, 
  ShoppingBag, 
  GraduationCap, 
  Dumbbell,
  ChevronRight,
  LayoutGrid,
  Loader2,
  Box
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import taskService from '../../api/taskService';

const getCategoryIcon = (name) => {
    const icons = {
        'Work': Briefcase,
        'Personal': User,
        'Health': Heart,
        'Shopping': ShoppingBag,
        'Education': GraduationCap,
        'Fitness': Dumbbell,
        'Dev': Box,
        'Home': ShoppingBag,
        'Finance': Briefcase,
        'Social': Heart,
        'Other': Box
    };
    return icons[name] || Box;
};

const getCategoryColor = (name) => {
    const colors = {
        'Work': 'bg-blue-500',
        'Personal': 'bg-purple-500',
        'Health': 'bg-rose-500',
        'Dev': 'bg-indigo-500',
        'Home': 'bg-emerald-500',
        'Finance': 'bg-amber-500',
        'Social': 'bg-pink-500',
        'Other': 'bg-slate-500'
    };
    return colors[name] || 'bg-slate-500';
};

const TaskCategoriesScreen = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await taskService.getTasksByCategories();
            // Data is { "CategoryName": { "total": 10, ... } }
            const formatted = Object.entries(data).map(([name, stats]) => ({
                name,
                count: stats.total,
                pending: stats.pending,
                completed: stats.completed,
                icon: getCategoryIcon(name),
                color: getCategoryColor(name)
            }));
            setCategories(formatted);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-4 rounded-2xl glass-card text-slate-400 hover:text-white transition-all shadow-lg hover:scale-105"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase tracking-widest">Categories</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Operation Departments</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-700">
                <Loader2 size={40} className="animate-spin" />
                <p className="font-black uppercase tracking-[0.3em] text-[10px]">Scanning Divisions...</p>
            </div>
        ) : (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-6"
            >
                {categories.map((cat, i) => (
                <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => navigate(`/tasks?category=${cat.name}`)}
                    className="p-8 rounded-[3rem] glass-card transition-all cursor-pointer group hover:shadow-2xl hover:shadow-indigo-500/10 border border-white/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                        <cat.icon size={120} className="text-white" />
                    </div>

                    <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white mb-8 shadow-2xl shadow-black/30 group-hover:rotate-12 transition-all relative overflow-hidden`}>
                        <div className={`absolute inset-0 opacity-40 ${cat.color} blur-xl`} />
                        <cat.icon size={32} className="relative z-10" />
                    </div>
                    
                    <div className="space-y-1">
                        <h4 className="text-2xl font-black text-white tracking-tight">{cat.name}</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">{cat.count} Units</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                            <span className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">{cat.pending} Active</span>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between items-center bg-slate-900/50 p-2 rounded-3xl border border-white/5">
                        <div className="flex -space-x-2 px-2">
                             {[1,2,3].map(j => (
                                 <div key={j} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-black text-slate-500">
                                     {j}
                                 </div>
                             ))}
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-slate-800/80 text-slate-500 group-hover:bg-indigo-500 group-hover:text-white group-hover:rotate-90 transition-all backdrop-blur-sm border border-white/5 flex items-center justify-center">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </motion.div>
                ))}
                
                {categories.length === 0 && (
                    <div className="col-span-2 py-32 text-center glass-card border-dashed border-2 border-white/5 rounded-[4rem] opacity-20">
                        <LayoutGrid size={80} className="mx-auto mb-6 text-slate-800" />
                        <p className="font-black uppercase tracking-[0.5em] text-xs">Awaiting Organizational Protocol</p>
                    </div>
                )}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskCategoriesScreen;
