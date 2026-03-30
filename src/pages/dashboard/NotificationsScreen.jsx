import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Users,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import notificationService from '../../api/notificationService';

const NotificationsScreen = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const filtered = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.is_read;
    if (filter === 'Location') return n.type === 'location';
    return true;
  });

  const getIconData = (type) => {
    switch(type?.toLowerCase()) {
      case 'location': return { icon: MapPin, color: '#6750A4', bg: 'rgba(103, 80, 164, 0.1)' };
      case 'deadline': return { icon: AlertTriangle, color: '#B3261E', bg: 'rgba(179, 38, 30, 0.1)' };
      case 'completion': return { icon: CheckCircle, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'assignment': return { icon: Users, color: '#625B71', bg: 'rgba(98, 91, 113, 0.1)' };
      default: return { icon: Bell, color: '#79747E', bg: 'rgba(121, 116, 126, 0.1)' };
    }
  };

  return (
    <div className="bg-[#FEFEFE] min-h-screen font-sans flex flex-col pb-24">
      {/* Top App Bar */}
      <div className="flex items-center px-4 py-3 bg-white sticky top-0 z-50 shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-full hover:bg-gray-100 text-gray-900 transition-colors mr-2"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[20px] font-extrabold text-gray-900">Notifications</h1>
      </div>

      <div className="flex-1 px-4 max-w-2xl mx-auto w-full pt-4">
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-6 noscrollbar">
          {['All', `Unread (${unreadCount})`, 'Location'].map((label) => {
            const filterValue = label.split(' ')[0];
            const isSelected = filter === filterValue;
            return (
              <button
                key={label}
                onClick={() => setFilter(filterValue)}
                className={`h-[32px] px-4 rounded-[16px] text-[12px] font-bold transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#6750A4] text-white border-[#6750A4]' 
                    : 'bg-white text-gray-900 border-gray-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {loading && notifications.length === 0 ? (
          <div className="flex justify-center items-center h-[30vh]">
            <div className="w-8 h-8 border-4 border-[#6750A4]/30 border-t-[#6750A4] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-40">
            <Bell size={48} className="text-gray-400 mb-4" />
            <span className="text-[14px] font-medium text-gray-500">No notifications found</span>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map(notification => {
                const { icon: IconComp, color, bg } = getIconData(notification.type);
                
                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={() => handleMarkAsRead(notification.id, notification.is_read)}
                    className={`group relative w-full rounded-[24px] border p-5 flex gap-4 transition-all cursor-pointer ${
                      notification.is_read 
                        ? 'bg-white border-gray-100' 
                        : 'bg-[#6750A4]/5 border-[#6750A4]/10 shadow-sm'
                    }`}
                  >
                    <div 
                      style={{ backgroundColor: bg }}
                      className="w-[48px] h-[48px] rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <IconComp size={22} style={{ color: color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-[17px] text-[#21005D] leading-tight pr-8">
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => handleDelete(e, notification.id)}
                          className="absolute right-4 top-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-[14px] font-medium text-gray-500 mt-2 whitespace-pre-wrap leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                          {new Date(notification.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {!notification.is_read && (
                          <span className="w-2 h-2 rounded-full bg-[#6750A4]" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {unreadCount > 0 && (
              <div className="pt-6 pb-12">
                <button 
                  onClick={handleMarkAllAsRead}
                  className="w-full h-[48px] flex items-center justify-center text-[#6750A4] font-bold text-[14px] hover:bg-[#6750A4]/5 rounded-[12px] transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
