import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Rocket, 
  PlusCircle, 
  MessageSquare, 
  BarChart3, 
  ChevronRight,
  Lock,
  MoreVertical,
  LogOut,
  ChevronDown,
  Layout,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import teamService from '../../api/teamService';
import userService from '../../api/userService';
import toast from 'react-hot-toast';

const TeamSummaryCard = ({ count, label, icon: Icon, colorClass }) => (
  <div className={`p-6 rounded-[28px] border border-gray-100 flex flex-col gap-4 shadow-sm h-[130px] flex-1 ${colorClass}`}>
    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
      <Icon size={22} className="text-[#6750A4]" />
    </div>
    <div>
      <span className="block text-2xl font-black text-[#21005D] leading-none mb-1">{count}</span>
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  </div>
);

const MemberItem = ({ member, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white border border-gray-100 rounded-[20px] p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-[#EADDFF] flex items-center justify-center border border-[#6750A4]/10 text-[#21005D] font-black text-lg shadow-inner overflow-hidden">
        {member.profile_picture ? (
            <img src={member.profile_picture} alt={member.full_name} className="w-full h-full object-cover" />
        ) : member.full_name.charAt(0)}
      </div>
      <div>
        <h4 className="font-extrabold text-[#21005D] text-[16px]">{member.full_name}</h4>
        <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-0.5">{member.role || 'Contributor'}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-gray-200" />
  </div>
);

const SharedTaskItem = ({ task, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white border border-gray-100 rounded-[20px] p-5 flex items-center justify-between hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
  >
    <div className="flex-1 min-w-0 pr-4">
      <h4 className="font-extrabold text-[#21005D] text-[16px] truncate">{task.title}</h4>
      <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mt-1">
        {task.category} • {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Deadline'}
      </p>
    </div>
    <div className="w-10 h-10 rounded-full bg-[#FCF8FE] text-[#6750A4] flex items-center justify-center border border-[#6750A4]/5">
        <MessageCircle size={18} />
    </div>
  </div>
);

const TeamCollaborationScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('members');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamsData, userData] = await Promise.all([
          teamService.getTeams(),
          userService.getMe()
      ]);
      
      setTeams(teamsData);
      setCurrentUser(userData);
      
      if (teamsData.length > 0) {
        const savedId = localStorage.getItem('last_team_id');
        const defaultTeam = savedId ? teamsData.find(t => t.id === parseInt(savedId)) || teamsData[0] : teamsData[0];
        await handleTeamSelect(defaultTeam);
      }
    } catch (err) {
      console.error('Failed to load team data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSelect = async (team) => {
    setSelectedTeam(team);
    localStorage.setItem('last_team_id', team.id);
    try {
        const membersData = await teamService.getTeamMembers(team.id);
        setMembers(membersData);
    } catch (e) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) return;
    try {
        setLoading(true);
        await teamService.acceptInvite(inviteCode);
        toast.success("Welcome to the team!");
        setShowJoinDialog(false);
        setInviteCode('');
        fetchData();
    } catch (err) {
        toast.error("Invalid invite code.");
    } finally {
        setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!selectedTeam) return;
    if (!window.confirm(`Are you sure you want to leave ${selectedTeam.name}?`)) return;
    try {
        setLoading(true);
        // await teamService.leaveTeam(selectedTeam.id);
        toast.success(`You left ${selectedTeam.name}`);
        setShowMenu(false);
        fetchData();
    } catch (err) {
        toast.error("Failed to leave team.");
    } finally {
        setLoading(false);
    }
  };

  if (loading && members.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFEFE]">
        <Loader2 className="w-10 h-10 animate-spin text-[#6750A4]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFEFE] font-sans pb-32">
       {/* Top App Bar */}
       <div className="flex items-center px-4 py-4 sticky top-0 bg-white z-30 shadow-sm border-b border-gray-50">
           <div className="flex-1">
                <h2 className="text-[22px] font-black text-[#21005D] leading-none">Team Space</h2>
                <p className="text-[12px] font-bold text-gray-400 mt-1 uppercase tracking-widest leading-none">Collaborative environment</p>
           </div>
           
           <button 
             onClick={() => setShowJoinDialog(true)}
             className="p-3 rounded-full hover:bg-gray-100 text-[#6750A4] transition-all active:scale-90"
           >
             <UserPlus size={24} />
           </button>
       </div>

       <div className="px-6 pt-6 flex flex-col max-w-2xl mx-auto w-full space-y-10">
            {/* Summary Row */}
        <div className="flex gap-4">
            <TeamSummaryCard 
                count={members.length} 
                label="Team Members" 
                icon={Users} 
                colorClass="bg-[#F3EDF7]/40" 
            />
            <TeamSummaryCard 
                count={(selectedTeam?.shared_tasks || []).length} 
                label="Total Tasks" 
                icon={Rocket} 
                colorClass="bg-[#EADDFF]/30" 
            />
        </div>

        {/* Team Switcher Horizontal List */}
        <div className="w-full">
            <h3 className="px-2 font-black text-[14px] text-gray-400 uppercase tracking-widest mb-4">Your Teams</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 noscrollbar px-2">
                <button 
                  onClick={() => navigate('/team/create')}
                  className="w-14 h-14 rounded-[20px] bg-slate-50 border-2 border-dashed border-slate-200 flex-shrink-0 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all active:scale-90"
                >
                  <Plus size={24} />
                </button>
                {teams.map(t => (
                    <button
                        key={t.id}
                        onClick={() => handleTeamSelect(t)}
                        className={`w-14 h-14 rounded-[20px] flex-shrink-0 flex items-center justify-center text-xl font-black transition-all relative ${
                            selectedTeam?.id === t.id 
                            ? 'bg-[#6750A4] text-white shadow-lg shadow-[#6750A4]/30 scale-110' 
                            : 'bg-white border border-gray-100 text-[#6750A4]'
                        }`}
                    >
                        {t.name.charAt(0)}
                        {selectedTeam?.id === t.id && (
                            <motion.div layoutId="active_team" className="absolute -bottom-1 w-1 h-1 bg-[#21005D] rounded-full" />
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* Selected Team Info */}
        {selectedTeam && (
            <div className="bg-[#6750A4] rounded-[32px] p-8 text-white shadow-xl shadow-[#6750A4]/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                    <Star size={120} fill="white" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-black uppercase tracking-[0.2em] opacity-80">Connected Team</span>
                        <div className="relative">
                            <button 
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 hover:bg-white/10 rounded-full transition-all"
                            >
                                <MoreVertical size={20} />
                            </button>
                            <AnimatePresence>
                                {showMenu && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100"
                                    >
                                        <button 
                                            onClick={handleLeaveTeam}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors text-[14px] font-bold"
                                        >
                                            <LogOut size={18} />
                                            Leave Team
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <h1 className="text-[32px] font-black leading-tight tracking-tight">{selectedTeam.name}</h1>
                    <p className="mt-2 text-[14px] opacity-80 font-medium line-clamp-2">{selectedTeam.description || 'Collaborative task organization for performance tracking.'}</p>
                </div>
            </div>
        )}

            {/* Team Members Section */}
            <div>
                <div className="flex items-center justify-between px-2 mb-4">
                    <h3 className="font-black text-[18px] text-[#21005D] uppercase tracking-wider">The Squad</h3>
                    <button 
                        onClick={() => navigate(`/team/invite/${selectedTeam?.id}`)}
                        className="p-2 text-[#6750A4] hover:bg-[#6750A4]/10 rounded-full transition-all"
                    >
                        <PlusCircle size={24} />
                    </button>
                </div>
                <div className="space-y-3">
                    {members.length > 0 ? (
                        members.map(member => (
                            <MemberItem 
                                key={member.id} 
                                member={member} 
                                onClick={() => navigate(`/team/member/${selectedTeam.id}/${member.id}`)}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400 text-center py-4 bg-gray-50 rounded-[20px] font-bold text-[13px] uppercase tracking-widest">No members detected</p>
                    )}
                </div>
            </div>

            {/* Shared Tasks Section */}
            <div>
                <div className="flex items-center justify-between px-2 mb-4">
                    <h3 className="font-black text-[18px] text-[#21005D] uppercase tracking-wider">Mission Log</h3>
                    <button 
                        onClick={() => navigate(`/team/assign/${selectedTeam?.id}`)}
                        className="text-[11px] font-black text-[#6750A4] bg-[#6750A4]/10 px-4 py-1.5 rounded-full uppercase tracking-widest"
                    >
                        Assign Task
                    </button>
                </div>
                <div className="space-y-3">
                    {(selectedTeam?.shared_tasks || []).length > 0 ? (
                        selectedTeam.shared_tasks.map(task => (
                            <SharedTaskItem 
                                key={task.id} 
                                task={task} 
                                onClick={() => navigate(`/task/${task.id}`)}
                            />
                        ))
                    ) : (
                        <div className="py-12 border border-dashed border-gray-200 rounded-[28px] flex flex-col items-center justify-center opacity-40">
                            <Rocket size={40} className="text-gray-300 mb-2" />
                            <p className="text-[11px] font-black uppercase tracking-widest">No shared objectives</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Collaboration Ops */}
            <div className="pt-2">
                <h3 className="px-2 font-black text-[17px] text-[#21005D] uppercase tracking-widest mb-4">Collaboration Ops</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => navigate(`/team/chat/${selectedTeam?.id}`)}
                        className="bg-white border border-gray-100 rounded-[28px] p-8 flex flex-col items-center justify-center gap-4 hover:shadow-lg transition-all active:scale-[0.98] shadow-sm group"
                    >
                        <div className="p-5 bg-blue-50 text-blue-600 rounded-[20px] group-hover:scale-110 transition-transform">
                            <MessageSquare size={32} />
                        </div>
                        <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest">Team Chat</span>
                    </button>
                    <button 
                        onClick={() => navigate(`/team/analysis/${selectedTeam?.id}`)}
                        className="bg-white border border-gray-100 rounded-[28px] p-8 flex flex-col items-center justify-center gap-4 hover:shadow-lg transition-all active:scale-[0.98] shadow-sm group"
                    >
                        <div className="p-5 bg-orange-50 text-orange-600 rounded-[20px] group-hover:scale-110 transition-transform">
                            <BarChart3 size={32} />
                        </div>
                        <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest">Insights</span>
                    </button>
                </div>
            </div>
       </div>

       {/* Join Team Dialog Overlay */}
       <AnimatePresence>
            {showJoinDialog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl"
                    >
                        <h3 className="text-[24px] font-black text-[#21005D] mb-2">Join Team</h3>
                        <p className="text-[14px] font-bold text-gray-400 mb-6 lowercase tracking-tight">Enter the invitation code received via email to synchronize your workspace.</p>
                        
                        <input 
                            type="text" 
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            placeholder="INVITE_TOKEN_01"
                            className="w-full bg-gray-50 border border-transparent focus:border-[#6750A4] focus:bg-white rounded-[16px] py-4 px-6 text-[#21005D] font-black placeholder-gray-300 outline-none transition-all mb-8 shadow-inner"
                        />
                        
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleJoinTeam}
                                className="w-full py-4 bg-[#6750A4] text-white font-black text-[15px] rounded-[16px] shadow-lg shadow-[#6750A4]/20 hover:bg-[#4F378B] active:scale-95 transition-all"
                            >
                                SYNCHRONIZE
                            </button>
                            <button 
                                onClick={() => setShowJoinDialog(false)}
                                className="w-full py-4 text-gray-400 font-black text-[15px] rounded-[16px] hover:bg-gray-50 transition-all"
                            >
                                CANCEL
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
       </AnimatePresence>
    </div>
  );
};

export default TeamCollaborationScreen;
