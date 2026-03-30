import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import * as L_Module from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Navigation, 
  ChevronRight, 
  RefreshCcw, 
  Plus, 
  LocateFixed,
  Crosshair,
  AlertCircle,
  Clock,
  LayoutGrid
} from 'lucide-react';
import taskService from '../../api/taskService';

// Safely resolve Leaflet object
const L = L_Module.default || L_Module;

const MapScreen = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState([13.0827, 80.2707]);
    const [nearbyTasks, setNearbyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("Initializing GPS...");

    const fetchNearbyTasks = async (lat, lng) => {
        try {
            setLoading(true);
            const tasks = await taskService.getAllTasks();
            // In a real app, we'd filter by distance on the backend
            // Here we just filter tasks that have location data
            const locTasks = tasks.filter(t => t.location && t.location.latitude);
            setNearbyTasks(locTasks);
        } catch (error) {
            console.error('Error fetching nearby tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Safe Icon Fix
        try {
            if (L && L.Icon && L.Icon.Default) {
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                });
            }
        } catch (e) {
            console.warn("Leaflet static fix failed:", e);
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords = [pos.coords.latitude, pos.coords.longitude];
                    setLocation(coords);
                    fetchNearbyTasks(coords[0], coords[1]);
                    setStatus("GPS Active");
                },
                () => {
                    fetchNearbyTasks(location[0], location[1]);
                    setStatus("Using default coordinates.");
                }
            );
        } else {
            fetchNearbyTasks(location[0], location[1]);
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#FEFEFE] font-sans flex flex-col pb-24">
            {/* Top Bar Overlay */}
            <div className="flex items-center px-4 py-4 sticky top-0 bg-white/95 backdrop-blur-md z-30 shadow-sm border-b border-gray-50">
                <button 
                  onClick={() => navigate('/home')}
                  className="p-3 rounded-full hover:bg-gray-100 text-[#21005D] transition-all active:scale-90"
                >
                  <ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-[20px] font-black text-[#21005D]">Geofence Map</h1>
                <div className="flex-1" />
                <button className="p-3 rounded-full hover:bg-gray-100 text-gray-400">
                    <Search size={24} />
                </button>
            </div>
            
            {/* Map Container - 40vh fixed height as per mobile design */}
            <div className="h-[40vh] w-full relative z-10 shadow-inner">
                {L && MapContainer ? (
                    <MapContainer center={location} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                        <TileLayer 
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution='&copy; CARTO'
                        />
                        <Marker position={location}>
                            <Popup>Your Location</Popup>
                        </Marker>
                        
                        {nearbyTasks.map(task => (
                            <Marker 
                                key={task.id} 
                                position={[task.location.latitude, task.location.longitude]}
                                icon={new L.Icon({
                                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                                    iconSize: [32, 32],
                                    iconAnchor: [16, 32]
                                })}
                            >
                                <Popup>
                                    <div className="p-1">
                                        <p className="font-black text-[#21005D] text-[14px]">{task.title}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{task.location.place_name}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-red-500 font-bold bg-gray-100">
                         Map Interface Error
                    </div>
                )}
                
                {/* Search this area FAB overlay */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000]">
                    <button 
                        onClick={() => fetchNearbyTasks()}
                        className="bg-[#6750A4] text-white px-6 py-2.5 rounded-full font-black text-[13px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#6750A4]/30 hover:bg-[#4F378B] transition-all active:scale-95"
                    >
                        <RefreshCcw size={16} />
                        Sync Area
                    </button>
                </div>

                <div className="absolute bottom-6 right-6 z-[1000]">
                    <button 
                        onClick={() => {
                             if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(pos => setLocation([pos.coords.latitude, pos.coords.longitude]));
                             }
                        }}
                        className="w-[56px] h-[56px] bg-white rounded-2xl flex items-center justify-center text-[#6750A4] shadow-2xl border border-gray-100 active:scale-90 transition-all"
                    >
                        <LocateFixed size={28} />
                    </button>
                </div>
            </div>

            {/* Content Area - Nearby Tasks */}
            <div className="flex-1 bg-white rounded-t-[32px] -mt-10 relative z-20 px-6 pt-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-[22px] font-black text-[#21005D] leading-none uppercase tracking-tighter">Geofenced Tasks</h2>
                        <p className="text-[12px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{nearbyTasks.length} Near Coordinates</p>
                    </div>
                    <button className="text-[12px] font-black text-[#6750A4] bg-[#6750A4]/10 px-4 py-1.5 rounded-full uppercase tracking-widest">Filters</button>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center opacity-30">
                            <RefreshCcw size={40} className="animate-spin text-[#6750A4]" />
                        </div>
                    ) : nearbyTasks.length > 0 ? (
                        nearbyTasks.map(task => (
                            <div 
                                key={task.id}
                                onClick={() => navigate(`/task/${task.id}`)}
                                className="bg-white border border-gray-100 rounded-[24px] p-5 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="w-[56px] h-[56px] bg-[#6750A4]/10 rounded-[16px] flex items-center justify-center text-[#6750A4] flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <MapPin size={28} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-extrabold text-[16px] text-[#21005D] truncate">{task.title}</h4>
                                    <p className="text-gray-400 text-[13px] font-bold truncate mt-0.5">{task.location.place_name}</p>
                                    
                                    <div className="flex items-center gap-3 mt-3">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${task.location.latitude},${task.location.longitude}`, '_blank');
                                            }}
                                            className="flex items-center gap-1.5 text-[11px] font-black text-[#6750A4] uppercase tracking-wide hover:underline"
                                        >
                                            <Navigation size={12} fill="currentColor" />
                                            Google Maps
                                        </button>
                                        <div className="w-1 h-1 rounded-full bg-gray-200" />
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                            {task.category || 'Focus'}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-gray-200 ml-2" />
                            </div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center bg-[#FCF8FE] rounded-[32px] border border-dashed border-gray-200">
                             <div className="p-6 bg-white rounded-full mb-4 shadow-sm text-gray-200">
                                <AlertCircle size={48} />
                             </div>
                             <p className="text-gray-400 font-bold uppercase text-[12px] tracking-widest text-center px-8">No tasks found for your current GPS coordinate grid</p>
                        </div>
                    ) }
                </div>
            </div>

            {/* Bottom Floating Action Button */}
            <button 
                onClick={() => navigate('/create-task')}
                className="fixed bottom-[100px] right-6 w-[64px] h-[64px] bg-[#6750A4] text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-[#6750A4]/40 hover:scale-110 active:scale-95 transition-all z-[100] border-4 border-white"
            >
                <Plus size={32} />
            </button>
        </div>
    );
};

export default MapScreen;
