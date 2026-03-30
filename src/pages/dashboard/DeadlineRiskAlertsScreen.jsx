import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Calendar, 
  ArrowRight, 
  ShieldAlert,
  Clock,
  TrendingUp,
  Brain,
  Loader2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import aiService from '../../api/aiService';

const DeadlineRiskAlertsScreen = () => {
  const navigate = useNavigate();
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      const data = await aiService.getDeadlineRisks();
      setRisks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching deadline risks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, []);

  const getRiskScore = (priority) => {
      if (priority === 'high') return 85;
      if (priority === 'medium') return 55;
      return 25;
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="p-12 -m-4 md:m-0 bg-gradient-to-br from-rose-600 to-rose-900 rounded-b-[4rem] relative overflow-hidden shadow-2xl shadow-rose-500/20">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
          <ShieldAlert size={200} />
        </div>
        <div className="relative z-10 space-y-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-4 rounded-2xl bg-white/10 text-white backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-4xl font-black text-white tracking-widest uppercase">Sentinel</h2>
            <p className="text-rose-100 text-sm font-black uppercase tracking-[0.3em] opacity-60 mt-1">Predictive Conflict Analysis</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
             {[
               { label: 'Critical', value: risks.filter(r => r.priority === 'high').length, color: 'bg-white/10 border-white/10 ring-1 ring-rose-400/20' },
               { label: 'Warning', value: risks.filter(r => r.priority === 'medium').length, color: 'bg-white/5 border-white/5' },
               { label: 'Secure', value: 0, color: 'bg-white/5 border-white/5 opacity-40' },
             ].map(stat => (
               <div key={stat.label} className={`${stat.color} p-5 rounded-[2rem] backdrop-blur-3xl text-center border shadow-xl`}>
                 <span className="block text-2xl font-black text-white">{stat.value}</span>
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/50">{stat.label}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Risks List */}
      <div className="space-y-8 px-4">
        <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
            <Brain size={18} className="text-rose-500" />
            Neural Assessment 0x2
            </h3>
            <div className="px-4 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase tracking-widest border border-rose-500/20">Active Monitoring</div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-700">
                    <Loader2 size={40} className="animate-spin text-rose-500" />
                    <p className="font-black uppercase tracking-[0.3em] text-[10px]">Evaluating Project Timelines...</p>
                </div>
            ) : risks.map((risk, i) => (
                <motion.div
                key={risk.title}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-[3.5rem] glass-card border ${
                    risk.priority === 'high' ? 'border-rose-500/30' : 'border-white/5'
                } space-y-8 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-500`}
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                        <AlertTriangle size={150} className="text-white" />
                    </div>

                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-[1.5rem] ${risk.priority === 'high' ? 'bg-rose-500/10 text-rose-500 ring-4 ring-rose-500/5 shadow-[0_0_30px_rgba(244,63,94,0.2)]' : 'bg-amber-500/10 text-amber-500'} group-hover:rotate-12 transition-all duration-500`}>
                                <AlertTriangle size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-white text-2xl tracking-tight leading-none group-hover:text-rose-400 transition-colors uppercase">{risk.title}</h4>
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mt-3">Priority Sector: {risk.priority}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-950/40 p-6 rounded-[2rem] border border-white/5 relative z-10">
                        <p className="text-slate-400 text-sm leading-relaxed italic">"{risk.description}"</p>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <div className="flex justify-between text-[10px] font-black tracking-[0.2em]">
                        <span className="text-slate-500 uppercase">Conflict Probability</span>
                        <span className={risk.priority === 'high' ? 'text-rose-500' : 'text-amber-500'}>{getRiskScore(risk.priority)}% Critical</span>
                        </div>
                        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${getRiskScore(risk.priority)}%` }}
                            transition={{ delay: 0.5, duration: 1.5, ease: "circOut" }}
                            className={`h-full rounded-full shadow-[0_0_15px_rgba(244,63,94,0.4)] ${risk.priority === 'high' ? 'bg-gradient-to-r from-rose-500 to-rose-300' : 'bg-gradient-to-r from-amber-500 to-amber-300'}`}
                        />
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/smart-reschedule')}
                        className="w-full py-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-lg flex items-center justify-center gap-4 group transition-all shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
                    >
                        Mitigate Risk
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </motion.div>
            ))}
          </AnimatePresence>

          {!loading && risks.length === 0 && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center glass-card border-dashed border-2 border-white/5 rounded-[4rem] opacity-30"
            >
              <ShieldCheck size={80} className="mx-auto mb-8 text-emerald-500/50" />
              <p className="font-black uppercase tracking-[0.5em] text-xs">Security Protocol: Nominal</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeadlineRiskAlertsScreen;
