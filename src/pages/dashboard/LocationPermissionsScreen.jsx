import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  MapPin, 
  Bell, 
  Navigation,
  Timer,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  LocateFixed,
  Loader2,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../../api/userService';

const SettingCard = ({ icon: Icon, title, description, isGranted, onToggle }) => (
  <div className="w-full bg-white border border-gray-100 rounded-[20px] p-5 flex items-center justify-between shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isGranted ? 'bg-[#6750A4]/10 text-[#6750A4]' : 'bg-red-50 text-red-500'}`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-[16px] font-black text-[#21005D] leading-none">{title}</h4>
        <p className={`text-[12px] font-bold mt-1 uppercase tracking-widest ${isGranted ? 'text-[#6750A4]' : 'text-red-500'}`}>
          {isGranted ? "Permission Granted" : "Access Required"}
        </p>
      </div>
    </div>
    {!isGranted ? (
        <button 
            onClick={onToggle}
            className="px-4 py-2 bg-[#6750A4] text-white text-[12px] font-black rounded-lg shadow-lg shadow-[#6750A4]/20 hover:bg-[#4F378B] transition-all active:scale-90"
        >
            GRANT
        </button>
    ) : (
        <div className="text-[#6750A4] p-2">
            <CheckCircle2 size={24} />
        </div>
    )}
  </div>
);

const LocationPermissionsScreen = () => {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({
    location_services: false,
    push_notifications: false,
    location_reminders: true,
    radius_meters: 500
  });
  const [browserStatus, setBrowserStatus] = useState({
    location: 'prompt',
    notifications: 'prompt'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await userService.getMe();
        setPrefs({
          location_services: user.location_services,
          push_notifications: user.push_notifications,
          location_reminders: user.location_reminders,
          radius_meters: user.radius_meters || 500
        });

        // Check browser permissions
        if (navigator.permissions) {
          const locPerm = await navigator.permissions.query({ name: 'geolocation' });
          const notifPerm = Notification.permission;
          setBrowserStatus({
            location: locPerm.state,
            notifications: notifPerm
          });
        }
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setBrowserStatus(prev => ({ ...prev, location: 'granted' }));
        setPrefs(prev => ({ ...prev, location_services: true }));
        toast.success("Location access granted!");
      },
      (err) => {
        setBrowserStatus(prev => ({ ...prev, location: 'denied' }));
        toast.error("Location access denied.");
      }
    );
  };

  const requestNotifications = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setBrowserStatus(prev => ({ ...prev, notifications: permission }));
    if (permission === 'granted') {
      setPrefs(prev => ({ ...prev, push_notifications: true }));
      toast.success("Notifications enabled!");
    } else {
      toast.error("Notifications disabled.");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await userService.updatePreferences(prefs);
      toast.success("Preferences saved successfully!");
      navigate(-1);
    } catch (err) {
      toast.error("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#6750A4]" size={40} />
    </div>
  );

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
            <h2 className="text-[20px] font-black text-[#21005D] leading-none">Location Access</h2>
        </div>
      </div>

      <div className="px-6 pt-6 flex flex-col max-w-2xl mx-auto w-full space-y-8">
        <div>
            <h1 className="text-[28px] font-black text-[#21005D] leading-tight">Location Services</h1>
            <p className="text-[14px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Manage geofencing and real-time mapping</p>
        </div>

        <div className="space-y-4">
            <SettingCard 
                icon={LocateFixed} 
                title="Geofencing Services" 
                isGranted={browserStatus.location === 'granted'} 
                onToggle={requestLocation}
            />
            <SettingCard 
                icon={Bell} 
                title="Push Notifications" 
                isGranted={browserStatus.notifications === 'granted'} 
                onToggle={requestNotifications}
            />
        </div>

        {/* Current Location Card */}
        <div className="w-full bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm overflow-hidden relative">
            <div className="flex items-center gap-3 text-gray-400 mb-6">
                <MapPin size={24} className="text-[#6750A4]" />
                <h4 className="text-[16px] font-black text-[#21005D]">Your Current Location</h4>
            </div>
            
            <div className="h-[180px] bg-[#F3EDF7] rounded-[20px] flex items-center justify-center relative overflow-hidden mb-6">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className="relative p-6 rounded-full bg-white shadow-xl text-[#6750A4] animate-bounce">
                    <MapPin size={48} fill="currentColor" />
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-[16px] border border-gray-100 text-center">
                <p className="text-[15px] font-black text-[#21005D]">
                    LAT: {location ? location.lat.toFixed(6) : 'FETCHING...'}
                </p>
                <p className="text-[13px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                    LNG: {location ? location.lng.toFixed(6) : 'FETCHING...'}
                </p>
            </div>
        </div>

        {/* Radius Slider Card */}
        <div className="w-full bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Navigation size={22} className="text-[#6750A4]" />
                    <h4 className="text-[16px] font-black text-[#21005D]">Reminder Radius</h4>
                </div>
                <span className="text-[18px] font-black text-[#6750A4]">{prefs.radius_meters}m</span>
            </div>
            
            <div className="space-y-4 px-2">
                <input 
                    type="range" 
                    min="100" max="2000" step="50"
                    value={prefs.radius_meters} 
                    onChange={(e) => setPrefs(prev => ({ ...prev, radius_meters: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#6750A4]"
                />
                <div className="flex justify-between text-[11px] font-black text-gray-300 uppercase tracking-widest px-1">
                    <span>100m</span>
                    <span>2000m</span>
                </div>
            </div>
        </div>

        {/* Timing Card */}
        <div className="w-full bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <Timer size={22} className="text-[#6750A4]" />
                <h4 className="text-[16px] font-black text-[#21005D]">Notification Timing</h4>
            </div>
            
            <input 
                type="text" 
                value={prefs.timing || ""}
                onChange={(e) => setPrefs(prev => ({ ...prev, timing: e.target.value }))}
                placeholder="e.g. 5 minutes before"
                className="w-full bg-gray-50 border border-transparent focus:border-[#6750A4] focus:bg-white rounded-[16px] py-4 px-6 text-[#21005D] font-bold placeholder-gray-300 outline-none transition-all shadow-inner"
            />
        </div>

        {/* Save Button */}
        <div className="pt-6">
            <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full h-20 bg-[#6750A4] text-white font-black text-[18px] rounded-[32px] shadow-xl shadow-[#6750A4]/30 hover:bg-[#4F378B] transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
                {saving ? <Loader2 className="animate-spin" size={28} /> : (
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

export default LocationPermissionsScreen;
