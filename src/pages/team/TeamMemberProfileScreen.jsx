import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  MessageCircle,
  Shield,
  Briefcase,
  Zap,
  Activity,
  AlertCircle,
  Loader2,
  Lock,
  MoreVertical
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import teamService from '../../api/teamService';

const TeamMemberProfileScreen = () => {
  const { teamId, userId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const data = await teamService.getMemberProfile(teamId, userId);
        setMember(data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load member profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [teamId, userId]);

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-950">
              <Loader2 className="animate-spin text-indigo-500" size={40} />
          </div>
      );
  }

  if (error) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center text-rose-500 bg-slate-950">
              <AlertCircle size={48} className="mb-4" />
              <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Access Denied</h3>
              <p className="text-xs text-slate-500 max-w-sm mb-6">{error}</p>
              <button 
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 font-black uppercase text-[10px] tracking-[0.2em]"
              >
                  Return to Base
              </button>
          </div>
      );
  }

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-4 rounded-2xl glass-card text-slate-400 hover:text-white transition-all shadow-lg hover:scale-110"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Identity Record V2.1</span>
        <button className="p-4 rounded-2xl glass-card text-slate-400 hover:text-white transition-all shadow-lg hover:rotate-90">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative p-2 rounded-[3.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30"
          >
              <div className="w-32 h-32 rounded-[3rem] overflow-hidden bg-slate-900 border-4 border-slate-950">
                 {member.profile_picture ? (
                    <img src={member.profile_picture} alt={member.full_name} className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-indigo-400">
                        {member.full_name?.charAt(0)}
                    </div>
                 )}
              </div>
              <div className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-slate-950 border border-emerald-500/20 text-emerald-500 shadow-xl">
                 <CheckCircle2 size={20} />
              </div>
          </motion.div>

          <div className="space-y-2">
              <h2 className="text-4xl font-black text-white uppercase tracking-widest">{member.full_name}</h2>
              <div className="flex items-center justify-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest">{member.role || 'Strategic Asset'}</div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Team {member.team_name || 'Uplink'}</span>
              </div>
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
          {[
              { label: 'Completion Rate', value: '94%', color: 'text-emerald-500', icon: TrendingUp },
              { label: 'Shared Nodes', value: member.assigned_tasks_count || 0, color: 'text-indigo-400', icon: Zap },
              { label: 'Activity Score', value: '8.5', color: 'text-amber-500', icon: Activity },
          ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-[2.5rem] glass-card border border-white/5 flex flex-col items-center gap-3 group hover:border-white/10"
                  >
                      <div className={`p-4 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                        <Icon size={20} />
                      </div>
                      <div className="text-center">
                          <span className="block text-2xl font-black text-white">{stat.value}</span>
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                      </div>
                  </motion.div>
              );
          })}
      </div>

      {/* Details List */}
      <div className="space-y-4">
          <div className="p-8 rounded-[3rem] glass-card border border-white/5 space-y-6 shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 pb-4 border-b border-white/5 flex items-center justify-between">
                Uplink Parameters
                <Lock size={12} className="text-slate-700" />
              </h3>
              
              <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-slate-500 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all">
                          <Mail size={18} />
                      </div>
                      <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 mb-1">Signal Protocol</p>
                          <p className="text-sm font-bold text-white tracking-wide">{member.email}</p>
                      </div>
                  </div>
              </div>

              <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-slate-500 group-hover:text-rose-400 group-hover:border-rose-500/20 transition-all">
                          <MapPin size={18} />
                      </div>
                      <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 mb-1">Current Sector</p>
                          <p className="text-sm font-bold text-white tracking-wide">{member.location || 'Global/Untracked'}</p>
                      </div>
                  </div>
              </div>

              <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-slate-500 group-hover:text-amber-400 group-hover:border-amber-500/20 transition-all">
                          <Briefcase size={18} />
                      </div>
                      <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 mb-1">Deployment Role</p>
                          <p className="text-sm font-bold text-white tracking-wide">{member.role || 'Strategic Asset'}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-12 left-0 right-0 px-8 max-w-4xl mx-auto z-40">
          <div className="p-4 rounded-[3.5rem] glass-card border border-white/10 backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] flex items-center justify-between gap-4">
              <button 
                onClick={() => navigate(`/team/chat/${teamId}`)}
                className="flex-1 py-6 rounded-[2.5rem] bg-white/5 border border-white/5 text-indigo-400 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all group"
              >
                  <MessageCircle size={18} className="group-hover:-rotate-12 transition-transform" />
                  Open Channel
              </button>
              <button 
                onClick={() => navigate(`/team/assign/${teamId}`)}
                className="flex-1 py-6 rounded-[2.5rem] bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all group"
              >
                  <Zap size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Assign Mission
              </button>
          </div>
      </div>
    </div>
  );
};

export default TeamMemberProfileScreen;
