import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  User, 
  Mail, 
  Phone,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../../api/userService';

const EditProfileScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await userService.getMe();
      setFormData({
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || ''
      });
      if (data.profile_picture) {
        setImagePreview(data.profile_picture);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updateData = {
        full_name: formData.full_name,
        phone: formData.phone,
        bio: formData.bio
      };
      
      await userService.updateProfile(updateData);
      // Wait a moment so user sees it successfully updated
      setTimeout(() => {
        navigate(-1);
      }, 500);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans">
      {/* Top App Bar */}
      <div className="bg-transparent text-gray-900 px-4 py-3 flex items-center z-10 w-full relative">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 mr-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        
        <div className="flex flex-col">
          <h1 className="text-[18px] font-bold leading-tight text-gray-900">Edit Profile</h1>
          <p className="text-[14px] text-gray-500 leading-tight">Update your personal information</p>
        </div>
      </div>

      {loading && !formData.full_name ? (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#6750A4] animate-spin" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center px-4 overflow-y-auto w-full max-w-lg mx-auto">
            <div className="h-6 shrink-0" />
            
            {/* Profile Image Header */}
            <div className="relative w-[120px] h-[120px] flex items-center justify-center">
                <div 
                    onClick={handleImageClick}
                    className="w-[100px] h-[100px] rounded-full bg-[#EADDFF] flex items-center justify-center cursor-pointer overflow-hidden isolate"
                >
                    {imagePreview ? (
                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-[48px] font-bold text-[#21005D]">
                            {formData.full_name ? formData.full_name.charAt(0) : 'U'}
                        </span>
                    )}
                </div>
                <button 
                    onClick={handleImageClick}
                    className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#6750A4] border-2 border-white flex items-center justify-center"
                >
                    <Camera size={20} className="text-white" />
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                         if (e.target.files && e.target.files[0]) {
                              const url = URL.createObjectURL(e.target.files[0]);
                              setImagePreview(url);
                              // Handle photo upload logic to server if needed
                         }
                    }}
                />
            </div>
            
            <div className="h-6 shrink-0" />

            <form onSubmit={handleSave} className="w-full flex flex-col gap-4">
               {/* Full Name */}
               <div className="flex flex-col">
                   <label className="text-gray-500 text-[12px] font-bold ml-1 mb-1">Full Name</label>
                   <div className="relative flex items-center">
                       <User size={24} className="absolute left-3 text-[#6750A4]" />
                       <input 
                           type="text"
                           value={formData.full_name}
                           onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                           className="w-full h-14 bg-white border border-gray-300 rounded-xl pl-12 pr-4 text-base text-gray-900 outline-none focus:border-[#6750A4] focus:border-2 transition-all"
                       />
                   </div>
               </div>

               {/* Email */}
               <div className="flex flex-col">
                   <label className="text-gray-500 text-[12px] font-bold ml-1 mb-1">Email</label>
                   <div className="relative flex items-center">
                       <Mail size={24} className="absolute left-3 text-[#6750A4]" />
                       <input 
                           type="email"
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className="w-full h-14 bg-white border border-gray-300 rounded-xl pl-12 pr-4 text-base text-gray-900 outline-none focus:border-[#6750A4] focus:border-2 transition-all"
                       />
                   </div>
               </div>

               {/* Phone */}
               <div className="flex flex-col">
                   <label className="text-gray-500 text-[12px] font-bold ml-1 mb-1">Phone</label>
                   <div className="relative flex items-center">
                       <Phone size={24} className="absolute left-3 text-[#6750A4]" />
                       <input 
                           type="tel"
                           value={formData.phone}
                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
                           className="w-full h-14 bg-white border border-gray-300 rounded-xl pl-12 pr-4 text-base text-gray-900 outline-none focus:border-[#6750A4] focus:border-2 transition-all"
                       />
                   </div>
               </div>

               {/* Bio */}
               <div className="flex flex-col">
                   <label className="text-gray-500 text-[12px] font-bold ml-1 mb-1">Bio</label>
                   <textarea 
                       value={formData.bio}
                       onChange={(e) => setFormData({...formData, bio: e.target.value})}
                       className="w-full h-[120px] bg-white border border-gray-300 rounded-xl p-4 text-base text-gray-900 outline-none focus:border-[#6750A4] focus:border-2 transition-all resize-none"
                   />
               </div>

               <div className="h-8 shrink-0" />

               <button 
                   type="submit"
                   disabled={saving || loading}
                   className="w-full h-14 bg-[#6750A4] text-white rounded-xl font-bold text-[16px] flex items-center justify-center active:bg-[#4F378B] transition-colors disabled:opacity-70"
               >
                   {saving ? (
                       <Loader2 className="w-6 h-6 animate-spin" />
                   ) : (
                       "Save Changes"
                   )}
               </button>

               <div className="h-8 shrink-0" />
            </form>
        </div>
      )}
    </div>
  );
};

export default EditProfileScreen;
