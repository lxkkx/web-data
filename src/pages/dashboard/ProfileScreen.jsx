import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  MapPin,
  Bell,
  Clock,
  BrainCircuit,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../../api/userService';
import authService from '../../api/authService';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [stats, setStats] = useState({
    total_tasks: '0',
    completion_rate: 0,
    task_streak: '0'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [userData, statsData] = await Promise.all([
          userService.getMe(),
          userService.getStats()
        ]);
        setUser(userData);
        if (statsData) {
          setStats(statsData);
        }
      } catch (err) {
        console.error('Failed to fetch profile details:', err);
        setError(err.response?.data?.detail || 'Failed to fetch profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleTogglePush = (e) => {
    const checked = e.target.checked;
    setPushAlerts(checked);
    if (checked) {
       toast.success('Push Alerts Enabled', { 
           icon: '🔔',
           style: {
               borderRadius: '16px',
               background: '#FEFEFE',
               color: '#21005D',
               fontWeight: 'bold',
               border: '1px solid #EADDFF'
           }
       });
    } else {
       toast('Push Alerts Disabled', { 
           icon: '🔕',
           style: {
               borderRadius: '16px',
               background: '#FEFEFE',
               color: '#79747E',
               fontWeight: 'bold',
               border: '1px solid #E0E0E0'
           }
       });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#FEFEFE]">
        <div className="w-12 h-12 border-4 border-[#6750A4]/30 border-t-[#6750A4] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FEFEFE] min-h-screen font-sans flex flex-col pb-24">
      {/* Top App Bar */}
      <div className="bg-white text-gray-900 px-4 py-4 flex items-center shadow-sm sticky top-0 z-50">
        <h1 className="text-[20px] font-extrabold text-gray-900">Profile</h1>
      </div>

      <div className="flex-1 px-4 max-w-2xl mx-auto w-full pt-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center bg-white rounded-[24px] pb-8 pt-4">
          <div className="w-[100px] h-[100px] rounded-full bg-[#EADDFF] flex items-center justify-center overflow-hidden">
            {user?.profile_picture ? (
              <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[40px] font-extrabold text-[#21005D]">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <h2 className="mt-4 text-[24px] font-extrabold text-gray-900">
            {user?.full_name || 'Loading...'}
          </h2>
          <p className="text-[14px] font-medium text-[#79747E] mt-1">
            {user?.email || ''}
          </p>

          {/* Stats Row */}
          <div className="flex w-full gap-4 mt-8 px-4">
            <div className="flex-1 h-[80px] bg-[#F3EDF7] rounded-[20px] flex flex-col items-center justify-center">
              <span className="text-[22px] font-black text-[#6750A4]">
                {stats.total_tasks || '0'}
              </span>
              <span className="text-[12px] font-bold text-[#79747E]">Tasks</span>
            </div>
            <div className="flex-1 h-[80px] bg-[#F3EDF7] rounded-[20px] flex flex-col items-center justify-center">
              <span className="text-[22px] font-black text-[#6750A4]">
                {parseInt(stats.completion_rate || 0)}%
              </span>
              <span className="text-[12px] font-bold text-[#79747E]">Score</span>
            </div>
            <div className="flex-1 h-[80px] bg-[#F3EDF7] rounded-[20px] flex flex-col items-center justify-center">
              <span className="text-[22px] font-black text-[#6750A4]">
                {stats.task_streak || '0'}
              </span>
              <span className="text-[12px] font-bold text-[#79747E]">Streak</span>
            </div>
          </div>
        </div>

        {/* Settings Lists */}
        <div className="mt-4 space-y-6">
          
          {/* ACCOUNT */}
          <div>
            <h3 className="px-2 pb-2 text-[12px] font-black text-[#6750A4] uppercase tracking-wider">
              ACCOUNT
            </h3>
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden divide-y divide-gray-100 shadow-sm">
              <button onClick={() => navigate('/edit-profile')} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <User size={22} className="text-[#49454F]" />
                  <span className="text-[16px] font-medium text-gray-900">Edit Profile</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
              <button onClick={() => navigate('/email-preferences')} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Mail size={22} className="text-[#49454F]" />
                  <span className="text-[16px] font-medium text-gray-900">Email Notifications</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
              <button onClick={() => navigate('/location-permissions')} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <MapPin size={22} className="text-[#49454F]" />
                  <span className="text-[16px] font-medium text-gray-900">Location Permissions</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div>
            <h3 className="px-2 pb-2 text-[12px] font-black text-[#6750A4] uppercase tracking-wider">
              NOTIFICATIONS
            </h3>
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden divide-y divide-gray-100 shadow-sm">
              <div className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Bell size={22} className="text-[#49454F]" />
                  <span className="text-[16px] font-medium text-gray-900">Push Alerts</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={pushAlerts} onChange={handleTogglePush} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6750A4]"></div>
                </label>
              </div>
              <button onClick={() => navigate('/deadline-risks')} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Clock size={22} className="text-[#49454F]" />
                  <span className="text-[16px] font-medium text-gray-900">Deadline Risks</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* AI & ANALYTICS */}
          <div>
            <h3 className="px-2 pb-2 text-[12px] font-black text-[#6750A4] uppercase tracking-wider">
              AI & ANALYTICS
            </h3>
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">
              <button onClick={() => navigate('/insights')} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <BrainCircuit size={22} className="text-[#49454F]" />
                  <span className="text-[16px] font-medium text-gray-900">Efficiency Insights</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={handleLogout}
              className="w-full h-[56px] flex items-center justify-center gap-2 rounded-[16px] bg-[#F9DEDC] hover:bg-[#F2C8C6] transition-colors"
            >
              <LogOut size={20} className="text-[#B3261E]" />
              <span className="text-[#B3261E] font-bold text-[16px]">Logout</span>
            </button>
          </div>

          <div className="text-center py-8">
            <p className="text-[12px] font-medium text-[#79747E]">
              Version 1.2.4 (Pro Edition)
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
