import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, List, Calendar, Users, User, Bell, Search, PlusCircle, Map, Sparkles, TrendingUp, AlertCircle, MapPin, MapPinned } from 'lucide-react';
import notificationService from '../api/notificationService';
import taskService from '../api/taskService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-[3rem] p-12 text-center border border-gray-100 shadow-xl mx-4 my-10">
          <div className="p-6 rounded-full bg-red-50 text-red-500 mb-6">
             <AlertCircle size={48} />
          </div>
          <h2 className="text-[24px] font-extrabold text-gray-900 mb-4">System Fault</h2>
          <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">{this.state.error?.toString()}</p>
          <button 
            onClick={() => window.location.reload()}
            className="h-[56px] px-10 bg-[#6750A4] text-white rounded-full font-bold shadow-lg shadow-[#6750A4]/30 hover:bg-[#4F378B] transition-all"
          >
            Reset Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [userPrefs, setUserPrefs] = useState(null);
  const prevCount = useRef(0);
  const alertedTasks = useRef(new Set());

  const checkProximity = async (lat, lon) => {
    if (userPrefs && !userPrefs.location_services) return;
    try {
      const tasks = await taskService.getAllTasks({ status: 'pending' });
      for (const task of tasks) {
        if (task.location && !alertedTasks.current.has(task.id)) {
          const dist = haversine(lat, lon, task.location.latitude, task.location.longitude);
          const radiusKm = (task.location.radius_meters || userPrefs?.radius_meters || 500) / 1000;
          
          if (dist <= radiusKm) {
            alertedTasks.current.add(task.id);
            showProximityAlert(task);
          }
        }
      }
    } catch (err) {
      console.error('Proximity check error:', err);
    }
  };

  const showProximityAlert = (task) => {
    // Show in-app toast
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        onClick={() => {
          toast.dismiss(t.id);
          navigate(`/task/${task.id}`);
        }}
        className="max-w-md w-full bg-[#10B981] shadow-2xl rounded-[24px] pointer-events-auto flex p-5 gap-4 cursor-pointer border-2 border-white group hover:scale-[1.02] transition-all"
      >
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
            <MapPinned size={26} className="animate-bounce" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-black text-white uppercase tracking-widest opacity-80">Proximity Alert</p>
          <p className="text-[16px] font-black text-white leading-tight mt-0.5">
            You are near "{task.title}"
          </p>
          <p className="mt-1 text-[13px] font-bold text-white/90">
            {task.location.placeName || 'Tap to view details'}
          </p>
        </div>
      </motion.div>
    ), { duration: 6000, position: 'top-center' });

    // Try system notification
    if (Notification.permission === 'granted') {
      new Notification(`Task Alert: ${task.title}`, {
        body: `You are near ${task.location.placeName || 'the destination'}.`,
        icon: '/favicon.ico'
      });
    }
  };

  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const fetchUnread = async (manual = false) => {
    try {
      const data = await notificationService.getUnreadCount();
      const currentCount = data.unread_count || 0;
      
      // If count increased, show a notification toast
      if (currentCount > prevCount.current || manual) {
        if (location.pathname === '/notifications' && !manual) {
          setUnreadCount(currentCount);
          prevCount.current = currentCount;
          return;
        }

        const notifications = await notificationService.getNotifications({ unread_only: true });
        const latest = notifications[0];
        
        if (latest && (manual || currentCount > prevCount.current)) {
          const getIcon = (type) => {
            switch(type?.toLowerCase()) {
              case 'location': return <MapPin size={20} className="text-[#6750A4]" />;
              case 'deadline': return <AlertCircle size={20} className="text-[#B3261E]" />;
              default: return <Bell size={20} className="text-[#6750A4]" />;
            }
          };

          toast.custom((t) => (
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              onClick={() => {
                toast.dismiss(t.id);
                navigate('/notifications');
              }}
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-2xl rounded-[24px] pointer-events-auto flex ring-1 ring-black ring-opacity-5 cursor-pointer border border-[#EADDFF] p-5 gap-4 group hover:bg-[#F3EDF7] transition-all`}
            >
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
                  {getIcon(latest.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-black text-[#21005D]">
                  {latest.title}
                </p>
                <p className="mt-1 text-[13px] font-medium text-gray-500 line-clamp-2">
                  {latest.message}
                </p>
              </div>
            </motion.div>
          ), { duration: 5000, position: 'top-right' });
        }
      }
      
      setUnreadCount(currentCount);
      prevCount.current = currentCount;

      // Handle system notifications for new unread messages
      if (!manual && currentCount > prevCount.current && Notification.permission === 'granted') {
          const notifications = await notificationService.getNotifications({ unread_only: true });
          const latest = notifications[0];
          if (latest) {
            new Notification(latest.title, { body: latest.message });
          }
      }

      // Also check geofences if location is available and enabled
      if (navigator.geolocation && (!userPrefs || userPrefs.location_services)) {
        navigator.geolocation.getCurrentPosition((pos) => {
          checkProximity(pos.coords.latitude, pos.coords.longitude);
        });
      }
    } catch (err) {
      console.log('Unread fetch error:', err);
    }
  };

  useEffect(() => {
    const fetchUserPrefs = async () => {
        try {
            const data = await userService.getMe();
            setUserPrefs(data);
        } catch (e) {}
    };
    fetchUserPrefs();
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000); // Check every 15s

    const handleRefresh = () => fetchUnread(true);
    window.addEventListener('refreshNotifications', handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshNotifications', handleRefresh);
    };
  }, []);

  const navItems = [
    {icon: Home, label: 'Home', path: '/home' },
    { icon: List, label: 'Tasks', path: '/tasks' },
    { icon: Bell, label: 'Alerts', path: '/notifications', badge: true },
    { icon: Sparkles, label: 'AI Chat', path: '/ai-suggestions' },
    { icon: TrendingUp, label: 'Insights', path: '/insights', desktopOnly: true },
    { icon: PlusCircle, label: '', path: '/create-task', center: true },
    { icon: Map, label: 'Map', path: '/map', desktopOnly: true },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-[#FEFEFE] text-gray-900 flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-72 bg-[#FCF8FE] border-r border-gray-200 p-8 fixed h-full z-40">
        <div className="flex items-center gap-4 mb-12 select-none">
          <div className="w-12 h-12 bg-[#6750A4] rounded-[16px] flex items-center justify-center text-white shadow-lg shadow-[#6750A4]/20">
            <Sparkles size={24} />
          </div>
          <h1 className="text-[24px] font-black tracking-tighter text-[#21005D]">TaskMate</h1>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {navItems.filter(item => !item.center).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all duration-300 relative group overflow-hidden ${
                  isActive 
                    ? 'bg-[#EADDFF] text-[#21005D] font-extrabold shadow-sm' 
                    : 'text-gray-600 hover:bg-[#F3EDF7] hover:text-[#21005D]'
                }`}
              >
                <div className="relative">
                    <Icon size={24} />
                    {item.badge && unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B3261E] rounded-full border-2 border-white" />
                    )}
                </div>
                <span className="text-[15px] font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="mt-auto pt-8 border-t border-gray-100">
          <button 
            onClick={() => navigate('/create-task')}
            className="w-full flex items-center justify-center gap-3 bg-[#6750A4] text-white py-4 rounded-[20px] hover:bg-[#4F378B] transition-all shadow-lg shadow-[#6750A4]/20 active:scale-95"
          >
            <PlusCircle size={24} />
            <span className="font-extrabold text-[16px]">Create Task</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 pb-24 md:pb-8 p-0 md:p-8 bg-[#FEFEFE] min-h-screen">
        <div className="max-w-5xl mx-auto h-full w-full">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-[80px] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[32px] px-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-between z-50">
        {navItems.filter(item => !item.desktopOnly).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          if (item.center) {
            return (
              <button 
                key="center-btn"
                onClick={() => navigate(item.path)}
                className="bg-[#6750A4] p-4 rounded-[16px] -mt-12 shadow-xl shadow-[#6750A4]/30 text-white hover:scale-105 active:scale-95 transition-all outline outline-[8px] outline-[#FEFEFE]"
              >
                <Icon size={28} />
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-all relative ${
                isActive ? 'text-[#21005D]' : 'text-gray-400'
              }`}
            >
              <div className={`px-5 py-2 rounded-[16px] flex items-center justify-center transition-colors ${isActive ? 'bg-[#EADDFF]' : 'bg-transparent'}`}>
                  <div className="relative">
                    <Icon size={24} />
                    {item.badge && unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B3261E] rounded-full border-2 border-white" />
                    )}
                  </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default MainLayout;
