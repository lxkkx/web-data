import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Mail, 
  Settings, 
  Bell, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Lock,
  MessageSquare,
  Zap,
  Activity,
  ChevronRight,
  ShieldAlert,
  Inbox
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import userService from '../../api/userService';

const PreferenceItem = ({ icon: Icon, title, description, enabled, onToggle }) => (
  <div 
    onClick={onToggle}
    className="bg-white border border-gray-100 rounded-[24px] p-5 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
  >
    <div className="flex-1 min-w-0 pr-4">
      <h4 className="font-extrabold text-[17px] text-[#21005D] truncate">{title}</h4>
      <p className="text-gray-400 font-bold text-[13px] leading-tight mt-1">{description}</p>
    </div>
    
    <div className={`relative w-14 h-8 rounded-full p-1 transition-all duration-300 shadow-inner ${enabled ? 'bg-[#6750A4]' : 'bg-gray-100'}`}>
        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 transform ${enabled ? 'translate-x-[22px]' : 'translate-x-0'}`} />
    </div>
  </div>
);

const EmailPreferencesScreen = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    task_reminders: true,
    team_updates: false,
    security_alerts: true,
    marketing: false
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPrefs = async () => {
        try {
            const user = await userService.getMe();
            setPreferences({
                task_reminders: user.location_reminders,
                team_updates: user.push_notifications,
                security_alerts: user.deadline_alerts,
                marketing: user.daily_reminder
            });
        } catch (e) {}
        setFetching(false);
    };
    fetchPrefs();
  }, []);

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await userService.updatePreferences({
          location_reminders: preferences.task_reminders,
          push_notifications: preferences.team_updates,
          deadline_alerts: preferences.security_alerts,
          daily_reminder: preferences.marketing
      });
      toast.success('Preferences updated successfully.');
      navigate(-1);
    } catch (err) {
      toast.error('Failed to update email preferences.');
      setLoading(false);
    }
  };

  if (fetching) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#FEFEFE]">
              <Loader2 className="animate-spin text-[#6750A4]" size={40} />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#FEFEFE] font-sans pb-32">
      {/* Top App Bar */}
      <div className="flex items-center px-4 py-4 sticky top-0 bg-white z-30 shadow-sm border-b border-gray-50">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-full hover:bg-gray-100 text-[#21005D] transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="ml-4">
            <h2 className="text-[20px] font-black text-[#21005D]">Email Notifications</h2>
            <p className="text-[12px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest leading-none">Manage your email alerts</p>
        </div>
      </div>

      <div className="px-6 pt-10 flex flex-col max-w-2xl mx-auto w-full space-y-8">
        <div>
            <h1 className="text-[28px] font-black text-[#21005D] leading-tight">Mailing Preferences</h1>
            <p className="text-[14px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Configuring communication protocols</p>
        </div>

        {/* Preferences List */}
        <div className="space-y-4">
            <PreferenceItem 
                title="Task Reminders" 
                description="Receive emails for upcoming task deadlines and geofence entries" 
                enabled={preferences.task_reminders}
                onToggle={() => handleToggle('task_reminders')}
            />
            <PreferenceItem 
                title="Team Updates" 
                description="Get notified when team members assign tasks or chat in groups" 
                enabled={preferences.team_updates}
                onToggle={() => handleToggle('team_updates')}
            />
            <PreferenceItem 
                title="Security Alerts" 
                description="Critical alerts regarding account security and login activity" 
                enabled={preferences.security_alerts}
                onToggle={() => handleToggle('security_alerts')}
            />
             <PreferenceItem 
                title="Goal Pulse" 
                description="Periodic insights about your performance and goal achievements" 
                enabled={preferences.marketing}
                onToggle={() => handleToggle('marketing')}
            />
        </div>

        {/* Protocol Guard Info Box */}
        <div className="p-6 rounded-[28px] bg-[#F3EDF7]/50 border-2 border-dashed border-[#6750A4]/10 flex items-start gap-4">
            <ShieldCheck size={28} className="text-[#6750A4] flex-shrink-0 mt-1" />
            <p className="text-[13px] text-gray-400 font-bold leading-relaxed lowercase tracking-tight">
                system-wide encryption is active. all transmissions are routed through secure neural tunnels. your email activity is never shared with third-party networks.
            </p>
        </div>

        {/* Commit Changes Button */}
        <div className="pt-6">
            <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full h-20 bg-[#6750A4] text-white font-black text-[18px] rounded-[32px] shadow-xl shadow-[#6750A4]/30 hover:bg-[#4F378B] transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
                {loading ? <Loader2 className="animate-spin" size={28} /> : (
                    <>
                        <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                        DONE
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EmailPreferencesScreen;
