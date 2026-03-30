import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Info,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import teamService from '../../api/teamService';

const TaskAnalysisScreen = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const data = await teamService.getTeamAnalysis(teamId);
        setAnalysis(data);
      } catch (err) {
        setError('Failed to load performance metrics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [teamId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !analysis) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
                <BarChart3 size={48} />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest">Error Loading Stats</h3>
            <p className="text-slate-500">{error || "Data unavailable"}</p>
            <button onClick={() => navigate(-1)} className="btn-secondary px-8">Go Back</button>
        </div>
      );
  }

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
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase tracking-widest">Team Performance</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Live Analytics Engine</p>
          </div>
        </div>
      </div>

      {/* Completion Trend */}
      <div className="p-10 rounded-[3rem] glass-card border border-white/5 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <TrendingUp size={120} className="text-indigo-500" />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <h3 className="font-black text-sm uppercase tracking-[0.2em] text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <TrendingUp size={20} />
            </div>
            Completion Velocity
          </h3>
          <select className="bg-transparent text-[10px] font-black text-indigo-400 border border-indigo-500/20 rounded-full px-4 py-1.5 outline-none glass-card uppercase tracking-widest">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        
        <div className="h-56 flex items-end justify-between gap-4 relative z-10 px-4">
          {(analysis.completion_trend || [10, 20, 15, 30, 25, 40, 35]).map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{h}%</span>
                </div>
                <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(10, h)}%` }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                    className={`w-full rounded-t-2xl transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] ${
                        h === Math.max(...analysis.completion_trend) 
                        ? 'bg-gradient-to-t from-indigo-600 to-purple-500 shadow-lg shadow-indigo-500/20' 
                        : 'bg-slate-800/80 hover:bg-slate-700'
                    }`}
                />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-black text-slate-700 tracking-[0.3em] px-4 pt-4 border-t border-white/5">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => <span key={d}>{d}</span>)}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            <h3>Squad Leaderboard</h3>
            <div className="flex items-center gap-2">
                <Users size={14} className="text-indigo-500" />
                <span>{analysis.performance?.length} Active</span>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(analysis.performance || []).map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] glass-card border border-white/5 hover:border-indigo-500/20 transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-black text-2xl border border-white/10 group-hover:scale-110 transition-transform`}>
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg tracking-wide">{member.name}</h4>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Efficiency Level</p>
                  </div>
                </div>
                <div className="text-right">
                    <span className="block text-2xl font-black text-white">{(member.rate * 100).toFixed(0)}%</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{member.tasks} Tasks Logged</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="h-3 w-full bg-slate-950/50 rounded-full overflow-hidden shadow-inner p-0.5 border border-white/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${member.rate * 100}%` }}
                        transition={{ delay: 1 + i * 0.1, duration: 1.5, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]`}
                    />
                </div>
                <div className="flex justify-between text-[9px] font-black text-slate-600 tracking-widest">
                    <span>STATUS: {member.rate > 0.8 ? 'PEAK' : member.rate > 0.5 ? 'CONSISTENT' : 'RAMPING UP'}</span>
                    <span className="text-indigo-400 flex items-center gap-1">
                        <Zap size={10} />
                        ACTIVE WING
                    </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="p-10 rounded-[3rem] glass-panel border border-indigo-500/10 flex flex-col md:flex-row gap-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
        <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:scale-110 transition-transform group-hover:opacity-[0.05] duration-1000">
          <Sparkles size={250} className="text-indigo-500" />
        </div>
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner flex-shrink-0 group-hover:rotate-12 transition-transform">
            <Sparkles size={40} className="animate-pulse" />
        </div>
        <div className="flex-1 space-y-4 relative z-10">
          <div className="flex items-center gap-3 text-indigo-400">
            <Info size={18} />
            <h4 className="font-black text-xs uppercase tracking-[0.3em]">Neural Productivity Insight</h4>
          </div>
          <p className="text-slate-200 text-xl font-medium leading-relaxed italic">
            "{analysis.ai_tip || "Analyzing team patterns to generate actionable intelligence..."}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskAnalysisScreen;
