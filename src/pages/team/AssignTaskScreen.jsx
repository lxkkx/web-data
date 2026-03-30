import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Search,
  CheckCircle,
  UserPlus,
  Loader2,
  Users,
  LayoutGrid,
  Check
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import teamService from '../../api/teamService';
import taskService from '../../api/taskService';
import toast from 'react-hot-toast';

const AssignTaskScreen = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  const [selectedTask, setSelectedTask] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, membersData, tasksData] = await Promise.all([
          teamService.getTeamById(teamId),
          teamService.getTeamMembers(teamId),
          taskService.getAllTasks() 
        ]);
        setTeam(teamData);
        setMembers(membersData);
        const unassignedTasks = tasksData.filter(t => !t.is_assigned);
        setTasks(unassignedTasks);
        if (unassignedTasks.length > 0) {
            setSelectedTask(unassignedTasks[0].id.toString());
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teamId]);

  const filteredMembers = members.filter(m => 
    m.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCount = Object.values(selectedMembers).filter(Boolean).length;

  const toggleMember = (id) => {
    setSelectedMembers(prev => ({
        ...prev,
        [id]: !prev[id]
    }));
  };

  const handleAssign = async () => {
    const memberIds = Object.keys(selectedMembers).filter(id => selectedMembers[id]);
    if (memberIds.length === 0 || !selectedTask) return;
    
    try {
        setSubmitting(true);
        for (let userId of memberIds) {
            await teamService.assignTask(teamId, {
                task_id: parseInt(selectedTask),
                user_id: parseInt(userId),
                team_id: parseInt(teamId)
            });
        }
        toast.success("Tasks assigned successfully!");
        navigate(-1);
    } catch (err) {
        toast.error(err.response?.data?.detail || 'Failed to assign task');
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#6750A4]" size={40} />
    </div>
  );

  return (
    <div className="bg-[#FEFEFE] min-h-screen font-sans flex flex-col pb-32">
      {/* Top App Bar */}
      <div className="flex items-center px-4 py-4 sticky top-0 bg-white z-50 border-b border-gray-50">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-full hover:bg-gray-100 text-[#21005D] transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="ml-4 flex-1">
            <h1 className="text-[20px] font-black text-[#21005D] leading-none">Delegate Tasks</h1>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mt-1">SQUAD WORKSPACE</p>
        </div>
      </div>

      <div className="px-6 pt-8 flex flex-col max-w-2xl mx-auto w-full space-y-10">
          {/* Select Task Section */}
          <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400 ml-1">
                  <LayoutGrid size={20} />
                  <h3 className="text-[14px] font-black uppercase tracking-widest">Target Objective</h3>
              </div>
              <div className="relative group">
                  <select 
                      value={selectedTask}
                      onChange={(e) => setSelectedTask(e.target.value)}
                      className="w-full bg-white border border-gray-100 focus:border-[#6750A4] rounded-[24px] py-6 px-8 text-[#21005D] text-[18px] font-black outline-none appearance-none shadow-sm transition-all"
                  >
                      {tasks.length === 0 && <option value="" disabled>No unassigned tasks...</option>}
                      {tasks.map(task => (
                          <option key={task.id} value={task.id}>{task.title}</option>
                      ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#6750A4]">
                      <Users size={24} />
                  </div>
              </div>
          </div>

          {/* Member Search & Selection */}
          <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                  <div className="flex items-center gap-3 text-gray-400">
                    <UserPlus size={20} />
                    <h3 className="text-[14px] font-black uppercase tracking-widest">Select Team</h3>
                  </div>
                  <span className="text-[12px] font-black text-[#6750A4]">{selectedCount} Selected</span>
              </div>
              
              <div className="relative">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                      <Search size={22} className="text-gray-300" />
                  </div>
                  <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for agents..."
                      className="w-full bg-gray-50 border border-transparent focus:border-[#6750A4] focus:bg-white rounded-[24px] py-6 pl-16 pr-8 text-[#21005D] text-[16px] font-bold outline-none transition-all shadow-inner"
                  />
              </div>

              <div className="space-y-3 pt-2">
                  {filteredMembers.map(member => {
                      const isSelected = !!selectedMembers[member.id];
                      return (
                          <div 
                            key={member.id}
                            onClick={() => toggleMember(member.id)}
                            className={`w-full rounded-[28px] p-5 flex items-center cursor-pointer transition-all border ${
                                isSelected ? 'bg-[#6750A4] border-[#6750A4] shadow-lg shadow-[#6750A4]/20' : 'bg-white border-gray-100 hover:shadow-md'
                            }`}
                          >
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl mr-5 shadow-inner ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-[#F3EDF7] text-[#6750A4]'
                              }`}>
                                  {member.full_name?.charAt(0)}
                              </div>
                              
                              <div className="flex-1 flex flex-col">
                                  <span className={`font-black text-[17px] ${isSelected ? 'text-white' : 'text-[#21005D]'}`}>
                                      {member.full_name}
                                  </span>
                                  <span className={`text-[12px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                      {member.role || 'Contributor'}
                                  </span>
                              </div>

                              {isSelected ? (
                                  <div className="w-10 h-10 rounded-full bg-white text-[#6750A4] flex items-center justify-center">
                                      <Check size={20} strokeWidth={4} />
                                  </div>
                              ) : (
                                  <div className="w-10 h-10 rounded-full border-2 border-gray-100" />
                              )}
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-6 right-6 max-w-2xl mx-auto z-50">
          <button 
              onClick={handleAssign}
              disabled={submitting || selectedCount === 0 || !selectedTask}
              className={`w-full h-20 rounded-[32px] font-black text-[18px] flex items-center justify-center gap-3 transition-all shadow-2xl ${
                  submitting || selectedCount === 0 || !selectedTask 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                  : 'bg-[#6750A4] text-white shadow-[#6750A4]/40 active:scale-95'
              }`}
          >
              {submitting ? <Loader2 className="animate-spin" size={28} /> : (
                  <>
                      <Rocket size={24} />
                      {selectedCount === 0 ? 'SELECT RECIPIENTS' : `DISPATCH MISSION (${selectedCount})`}
                  </>
              )}
          </button>
      </div>
    </div>
  );
};

export default AssignTaskScreen;
