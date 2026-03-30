import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Bookmark, 
  AlertCircle, 
  Bell,
  Mic, 
  ChevronRight,
  Check,
  X,
  MapPin,
  Calendar as CalendarIcon,
  Search,
  Crosshair,
  Flag,
  Calendar,
  Layers,
  AlarmClock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import taskService from '../../api/taskService';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationPickerModal = ({ isOpen, onClose, onSelect, initialLocation }) => {
  const [selectedPos, setSelectedPos] = useState(initialLocation || [13.0827, 80.2707]);
  const [placeName, setPlaceName] = useState('Selected Spot');
  
  const LocationEvents = () => {
    useMapEvents({
      click(e) {
        setSelectedPos([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden flex flex-col h-[70vh] shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[20px] font-black text-[#21005D]">Select Location</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 relative">
          <MapContainer 
            center={selectedPos} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer 
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
              attribution='&copy; OpenStreetMap contributors'
            />
            <LocationEvents />
            <Marker position={selectedPos} />
          </MapContainer>
          
          <div className="absolute bottom-6 left-6 right-6 z-[1000]">
            <div className="bg-white p-6 rounded-[24px] shadow-2xl flex flex-col gap-4 border border-gray-100">
               <div>
                 <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Place Name</label>
                 <div className="flex items-center gap-3 bg-[#F3EDF7] rounded-[16px] px-4 py-3 border border-transparent focus-within:border-[#6750A4] transition-all">
                    <MapPin size={20} className="text-[#6750A4]" />
                    <input 
                      type="text" 
                      value={placeName}
                      onChange={(e) => setPlaceName(e.target.value)}
                      className="bg-transparent border-none outline-none text-[#21005D] w-full font-bold placeholder-gray-400"
                      placeholder="e.g. Home, Office, Gym..."
                    />
                 </div>
               </div>
               <button 
                onClick={() => onSelect({ lat: selectedPos[0], lng: selectedPos[1], name: placeName })}
                className="w-full py-4 bg-[#6750A4] hover:bg-[#4F378B] text-white font-black rounded-[16px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6750A4]/20 active:scale-95"
               >
                 <Check size={20} />
                 Confirm Destination
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: IconComponent, title, value, onClick, children, color = "#6750A4" }) => (
  <div 
    onClick={onClick}
    className="w-full bg-white border border-gray-100 rounded-[20px] p-5 flex items-center gap-4 mb-3 cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all relative group"
  >
    <div 
      style={{ backgroundColor: `${color}15`, color: color }}
      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
    >
      <IconComponent size={20} />
    </div>
    <div className="flex-1 flex flex-col min-w-0">
      <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{title}</span>
      <span className="text-[16px] font-black text-[#21005D] truncate">{value}</span>
    </div>
    {children || <ChevronRight className="text-gray-300" size={24} />}
  </div>
);

const CreateTaskScreen = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [reminder, setReminder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const categories = ['Personal', 'Work', 'Finance', 'Fitness', 'Social', 'Dev', 'Home'];
  const priorities = ['low', 'medium', 'high'];

  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    setIsMapOpen(false);
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data.display_name || "Custom Point";
    } catch (e) {
      return "Current Location";
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    const toastId = toast.loading("Fetching your precise location...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const address = await reverseGeocode(latitude, longitude);
        setSelectedLocation({ 
          lat: latitude, 
          lng: longitude, 
          name: address.split(',')[0],
          fullName: address 
        });
        toast.success("Location locked!", { id: toastId });
      },
      (err) => {
        toast.error("Please allow location access in your browser.", { id: toastId });
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
        setError("Task Title is required");
        return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const taskData = {
        title,
        description,
        category,
        priority,
        due_date: new Date(dueDate).toISOString(),
        daily_reminder: reminder
      };

      if (selectedLocation) {
        taskData.location = {
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          place_name: selectedLocation.name,
          radius_meters: 500
        };
      }

      await taskService.createTask(taskData);
      
      // Trigger immediate notification check in MainLayout
      window.dispatchEvent(new CustomEvent('refreshNotifications'));

      if (selectedLocation) {
        toast.success(`Geofence active for ${selectedLocation.name}.`, {
            duration: 4000,
            icon: '📍',
            style: {
                borderRadius: '20px',
                background: '#FEFEFE',
                color: '#21005D',
                fontWeight: 'bold',
                border: '1px solid #EADDFF'
            }
        });
      }
      
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FEFEFE] min-h-screen font-sans flex flex-col pb-24">
      {/* Top App Bar */}
      <div className="flex items-center px-4 py-4 sticky top-0 bg-white/95 backdrop-blur-md z-30 shadow-sm border-b border-gray-50">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-full hover:bg-gray-100 text-[#21005D] transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="ml-4 text-[20px] font-black text-[#21005D]">New Task</h1>
      </div>

      <div className="flex-1 px-6 max-w-2xl mx-auto w-full pt-6">
        <h2 className="text-[28px] font-black text-gray-900 leading-tight">Create New Task</h2>
        <p className="text-[14px] font-bold text-gray-400 uppercase tracking-widest mt-1">Add a new item to your list</p>

        {error && (
          <div className="bg-red-50 text-red-600 px-5 py-4 rounded-[20px] flex items-center gap-3 text-[14px] my-6 border border-red-100 italic font-medium">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6 pt-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Task Title *</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(null); }}
              className="w-full bg-[#FCF8FE] border border-transparent focus:border-[#6750A4] focus:bg-white rounded-[20px] py-4 px-6 text-[#21005D] text-[16px] font-bold placeholder-gray-400 outline-none transition-all"
              placeholder="e.g., Buy groceries"
              required
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#FCF8FE] border border-transparent focus:border-[#6750A4] focus:bg-white rounded-[20px] py-4 px-6 text-[#21005D] text-[16px] font-medium placeholder-gray-400 outline-none transition-all resize-none"
              placeholder="Add more details about this task..."
            />
          </div>

          {/* Info Selection Rows */}
          <div className="pt-2">
            <div className="relative">
                <InfoRow icon={Layers} title="Category" value={category} color="#625B71">
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronRight className="text-gray-300" size={24} />
                </InfoRow>
            </div>

            <div className="relative">
                <InfoRow 
                    icon={Flag} 
                    title="Priority" 
                    value={priority.toUpperCase()} 
                    color={priority === 'high' ? '#B3261E' : (priority === 'medium' ? '#F59E0B' : '#6750A4')}
                >
                    <select 
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                        {priorities.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                    </select>
                    <ChevronRight className="text-gray-300" size={24} />
                </InfoRow>
            </div>

            <div className="w-full bg-white border border-gray-100 rounded-[20px] p-5 flex flex-col gap-1 mb-3 hover:bg-gray-50 transition-colors cursor-pointer group animate-in slide-in-from-right-2 duration-300">
                <div className="flex items-center gap-3 text-gray-400 mb-1">
                    <div className="w-10 h-10 rounded-full bg-[#6750A4]/10 flex items-center justify-center text-[#6750A4]">
                        <Calendar size={20} />
                    </div>
                    <span className="text-[12px] font-bold uppercase tracking-widest">Due Date</span>
                </div>
                <input 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-transparent text-[16px] font-black text-[#21005D] outline-none cursor-pointer pl-[52px]"
                    style={{ colorScheme: 'light' }}
                />
            </div>

            {/* Location Card */}
            <div className="w-full bg-white border border-gray-100 rounded-[20px] p-5 mb-3 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-400">
                        <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                             <MapPin size={20} />
                        </div>
                        <span className="text-[12px] font-bold uppercase tracking-widest">Location</span>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        type="button" 
                        onClick={handleGetCurrentLocation}
                        className="flex-1 h-[48px] text-[13px] font-bold text-[#6750A4] bg-[#6750A4]/5 px-4 rounded-[12px] flex items-center justify-center gap-2 hover:bg-[#6750A4]/10 transition-colors"
                    >
                        <Crosshair size={18} /> GPS Current
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setIsMapOpen(true)}
                        className="flex-1 h-[48px] text-[13px] font-bold text-gray-600 bg-gray-50 px-4 rounded-[12px] flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                    >
                        <Search size={18} /> Manual Pin
                    </button>
                </div>

                {selectedLocation && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="flex items-center justify-between p-4 bg-[#10B981]/5 rounded-[20px] border border-[#10B981]/20">
                            <div className="flex-1 min-w-0 pr-4">
                                <span className="text-[14px] font-black text-[#10B981] truncate block">{selectedLocation.name}</span>
                                {selectedLocation.fullName && (
                                    <p className="text-[12px] text-gray-400 font-medium truncate mt-0.5">{selectedLocation.fullName}</p>
                                )}
                            </div>
                            <button onClick={() => setSelectedLocation(null)} className="text-[#10B981] p-2 hover:bg-[#10B981]/10 rounded-full transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        
                        {/* Mini Map Preview */}
                        <div className="h-[120px] w-full rounded-[20px] overflow-hidden border border-gray-100 shadow-inner relative group">
                            <MapContainer 
                                center={[selectedLocation.lat, selectedLocation.lng]} 
                                zoom={15} 
                                zoomControl={false}
                                dragging={false}
                                touchZoom={false}
                                scrollWheelZoom={false}
                                doubleClickZoom={false}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
                            </MapContainer>
                            <div className="absolute inset-0 bg-transparent flex items-center justify-center group-hover:bg-black/5 transition-colors cursor-default" />
                        </div>
                    </div>
                )}
            </div>

            {/* Daily Reminder Toggle */}
            <div className="w-full bg-white border border-gray-100 rounded-[20px] p-5 flex items-center justify-between mt-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#6750A4]/10 flex items-center justify-center text-[#6750A4]">
                        <AlarmClock size={20} />
                    </div>
                    <span className="text-[16px] font-black text-[#21005D]">Daily Reminder</span>
                </div>
                <div 
                  onClick={() => setReminder(!reminder)}
                  className={`w-14 h-8 flex items-center rounded-full p-1.5 cursor-pointer transition-colors ${reminder ? 'bg-[#6750A4]' : 'bg-gray-200'}`}
                >
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${reminder ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 space-y-4">
            <button
              onClick={handleSubmit}
              disabled={loading || !title.trim()}
              className={`w-full h-[60px] rounded-[24px] font-black text-[18px] flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                  !title.trim() ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 
                  loading ? 'bg-[#4F378B] text-white opacity-80' : 'bg-[#6750A4] hover:bg-[#4F378B] text-white shadow-[#6750A4]/20'
              }`}
            >
              {loading ? (
                  <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                  "Create Task"
              )}
            </button>

          </div>
        </div>
      </div>

      {isMapOpen && (
        <LocationPickerModal 
          isOpen={isMapOpen} 
          onClose={() => setIsMapOpen(false)} 
          onSelect={handleLocationSelect}
          initialLocation={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null}
        />
      )}
    </div>
  );
};

export default CreateTaskScreen;
