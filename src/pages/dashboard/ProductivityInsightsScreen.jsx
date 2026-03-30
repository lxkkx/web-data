import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Zap, 
  Activity, 
  ChevronRight,
  Sparkles,
  PieChart,
  BarChart2,
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import aiService from '../../api/aiService';

const ProductivityInsightsScreen = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const data = await aiService.getProductivityInsights();
      setInsights(data);
    } catch (error) {
      console.error('Error fetching productivity insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getMetricIcon = (metric) => {
    switch (metric) {
        case 'Completion Rate': return Target;
        case 'Task Streak': return Zap;
        case 'Pending Tasks': return Activity;
        case 'Total Tasks': return TrendingUp;
        default: return Activity;
    }
  };

  const getMetricColor = (metric) => {
    switch (metric) {
        case 'Completion Rate': return 'text-emerald-500';
        case 'Task Streak': return 'text-amber-500';
        case 'Pending Tasks': return 'text-rose-500';
        case 'Total Tasks': return 'text-indigo-400';
        default: return 'text-indigo-500';
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-4 rounded-2xl glass-card text-slate-400 hover:text-white transition-all shadow-lg hover:scale-105"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase tracking-widest leading-none">Intelligence</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Neural Performance Analysis</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
             <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-700">
                <Loader2 size={40} className="animate-spin text-indigo-500" />
                <p className="font-black uppercase tracking-[0.3em] text-[10px]">Processing Cognitive Logs...</p>
            </div>
        ) : (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
            >
                {/* Hero Stats */}
                <div className="grid grid-cols-2 gap-6">
                    {insights.map((stat, i) => {
                        const Icon = getMetricIcon(stat.metric);
                        return (
                            <motion.div
                                key={stat.metric}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-[3rem] glass-card border border-white/5 flex flex-col gap-5 hover:border-white/10 transition-all group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${getMetricColor(stat.metric)} shadow-inner group-hover:scale-110 transition-transform`}>
                                    <Icon size={28} />
                                </div>
                                <div className="space-y-1">
                                    <span className="block text-4xl font-black text-white tracking-tight">{stat.value}</span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.metric}</span>
                                </div>
                                <div className={`text-[9px] font-black px-4 py-1.5 rounded-full w-fit uppercase tracking-widest shadow-lg ${
                                    stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 
                                    stat.trend === 'down' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-800 text-slate-400'
                                }`}>
                                    Trend: {stat.trend}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Activity Visualization Placeholder */}
                <div className="p-10 rounded-[3.5rem] glass-card border border-white/5 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                        <BarChart2 size={250} className="text-white" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-12 relative z-10">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                            <BarChart2 size={20} />
                        </div>
                        Cognitive Activity
                    </h3>
                    <div className="flex gap-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className={`w-8 h-8 rounded-xl text-[10px] flex items-center justify-center font-black ${i === 3 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-900 text-slate-600 hover:text-slate-400 transition-colors'}`}>
                            {d}
                        </div>
                        ))}
                    </div>
                    </div>
                    
                    <div className="flex items-end justify-between h-40 gap-4 relative z-10 px-4">
                    {[40, 70, 45, 95, 65, 80, 50].map((h, i) => (
                        <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                            className={`w-full rounded-t-2xl transition-all duration-500 ${
                                i === 3 
                                ? 'bg-gradient-to-t from-indigo-600 to-purple-500 shadow-xl shadow-indigo-500/20' 
                                : 'bg-slate-800/50 group-hover:bg-slate-700/50 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                            }`}
                        />
                    ))}
                    </div>
                    <div className="flex justify-between text-[9px] font-black text-slate-700 tracking-[0.4em] px-4 pt-6 border-t border-white/5 mt-6">
                        <span>SUNDAY</span><span>MONDAY</span><span>TUESDAY</span><span>WEDNESDAY</span><span>THURSDAY</span><span>FRIDAY</span><span>SATURDAY</span>
                    </div>
                </div>

                {/* AI Analysis Sections */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Sparkles size={16} className="text-indigo-400" />
                            Deep Focus Analysis
                        </h3>
                        <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest border border-indigo-500/20">Alpha V2.1</div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 px-2">
                        {insights.map((insight, i) => (
                        <motion.div
                            key={insight.metric}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="p-10 rounded-[3rem] glass-card border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all shadow-xl"
                        >
                            <div className={`absolute top-0 right-0 w-48 h-48 blur-[80px] -mr-24 -mt-24 opacity-10 transition-all duration-1000 group-hover:opacity-20 ${
                            insight.trend === 'up' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`} />
                            
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-2 rounded-lg bg-white/5 ${insight.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    <AlertCircle size={16} />
                                </div>
                                <h4 className="text-xl font-black text-white tracking-tight uppercase">{insight.metric} Report</h4>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-2xl">{insight.description}</p>
                            
                            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">Cognitive Suggestion</p>
                                    <p className="text-slate-200 text-base font-medium italic">"Based on your {insight.metric.toLowerCase()}, we recommend optimizing your schedule."</p>
                                </div>
                                <button className="p-3 rounded-2xl bg-white/5 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-lg self-end md:self-center group-hover:rotate-12">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/ai-suggestions')}
                    className="w-full py-8 rounded-[3rem] bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                    <span className="tracking-[0.2em] uppercase">Generate Executive Summary</span>
                </button>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductivityInsightsScreen;
