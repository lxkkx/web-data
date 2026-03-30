import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Camera, 
  Shield, 
  Rocket, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import teamService from '../../api/teamService';
import toast from 'react-hot-toast';

const CreateTeamScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setLoading(true);
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      if (formData.image) {
        payload.append('image', formData.image);
      }

      await teamService.createTeam(payload);
      toast.success("Team created successfully!");
      navigate('/team');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFormData({ ...formData, image: file });
        setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] font-sans pb-32">
      <div className="flex items-center px-4 py-4 sticky top-0 bg-white z-30 shadow-sm border-b border-gray-50">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-full hover:bg-gray-100 text-[#21005D] transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="ml-4 text-[20px] font-black text-[#21005D]">Create New Team</h2>
      </div>

      <div className="px-6 pt-10 flex flex-col max-w-2xl mx-auto w-full space-y-10">
        <div className="flex flex-col items-center">
            <div className="relative group">
                <div className="w-32 h-32 rounded-[40px] bg-[#F3EDF7] flex items-center justify-center text-[#6750A4] border border-[#6750A4]/10 shadow-inner overflow-hidden">
                    {preview ? (
                        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                        <Users size={48} />
                    )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-3 bg-[#6750A4] text-white rounded-2xl shadow-lg border-4 border-white cursor-pointer active:scale-90 hover:bg-[#4F378B] transition-all">
                    <Camera size={20} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mt-6">Team Brand Identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
                <label className="text-[12px] font-black uppercase tracking-widest text-gray-400 ml-2">Team Name</label>
                <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Design Ninjas"
                    className="w-full bg-white border border-gray-100 focus:border-[#6750A4] rounded-[24px] py-5 px-8 text-[18px] font-extrabold text-[#21005D] outline-none transition-all shadow-sm"
                />
            </div>

            <div className="space-y-3">
                <label className="text-[12px] font-black uppercase tracking-widest text-gray-400 ml-2">Mission Description</label>
                <textarea 
                    rows="4"
                    value={formData.description}
                    placeholder="What does this team focus on?"
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white border border-gray-100 focus:border-[#6750A4] rounded-[24px] py-5 px-8 text-[#21005D] font-medium text-[16px] outline-none transition-all resize-none shadow-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-[24px] bg-[#6750A4]/5 border border-[#6750A4]/10 flex flex-col gap-2">
                    <Shield size={22} className="text-[#6750A4]" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#6750A4]">Private Group</span>
                </div>
                <div className="p-5 rounded-[24px] bg-blue-50 border border-blue-100 flex flex-col gap-2">
                    <Rocket size={22} className="text-blue-600" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">Sync Enabled</span>
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full h-20 bg-[#6750A4] text-white font-black text-[18px] rounded-[32px] shadow-xl shadow-[#6750A4]/20 hover:bg-[#4F378B] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
            >
                {loading ? <Loader2 className="animate-spin" size={28} /> : (
                    <>
                        <Sparkles size={24} />
                        CREATE TEAM
                    </>
                )}
            </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamScreen;
