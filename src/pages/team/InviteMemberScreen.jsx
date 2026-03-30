import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Check, 
  Mail, 
  UserPlus, 
  ShieldCheck, 
  Rocket,
  MapPin,
  Clock,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import teamService from '../../api/teamService';
import toast from 'react-hot-toast';

const BenefitItem = ({ text }) => (
  <div className="flex items-start gap-3">
    <div className="p-1 rounded-full bg-[#6750A4]/10 text-[#6750A4]">
      <Check size={14} />
    </div>
    <span className="text-[14px] font-bold text-gray-400 lowercase leading-relaxed tracking-tight">{text}</span>
  </div>
);

const InviteMemberScreen = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInvite = async () => {
        if (!email.trim()) {
            toast.error("Please enter a valid mission recipient.");
            return;
        }
        try {
            setLoading(true);
            await teamService.inviteMember(teamId, email, 'Member');
            toast.success("Invitation dispatched to neural link!");
            navigate(-1);
        } catch (error) {
            toast.error("Dispatch failed. Check the recipient's identity.");
        } finally {
            setLoading(false);
        }
    };

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
                    <h2 className="text-[20px] font-black text-[#21005D]">Invite Member</h2>
                    <p className="text-[12px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest leading-none">Expand your operations</p>
                </div>
            </div>

            <div className="px-6 pt-10 flex flex-col max-w-2xl mx-auto w-full space-y-10">
                {/* Hero Card */}
                <div className="bg-[#F3EDF7]/50 rounded-[32px] p-8 border border-[#6750A4]/5 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-[24px] bg-white text-[#6750A4] flex items-center justify-center shadow-xl mb-6 transform -rotate-3 hover:rotate-0 transition-transform">
                        <UserPlus size={32} />
                    </div>
                    <h3 className="text-[24px] font-black text-[#21005D] mb-2 lowercase tracking-tighter">grow your squad</h3>
                    <p className="text-[14px] font-bold text-gray-400 max-w-[250px] lowercase leading-relaxed">
                        invite members to collaborate on tasks, shared geofencing, and project insights.
                    </p>
                </div>

                {/* Input Fields */}
                <div className="space-y-6">
                    <div>
                        <label className="px-2 text-[12px] font-black text-[#21005D] uppercase tracking-widest mb-3 block">Recipient Email</label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6750A4] transition-colors">
                                <Mail size={22} />
                            </div>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="COLLEAGUE_ALPHA_01"
                                className="w-full bg-[#FCF8FE] border border-[#6750A4]/10 focus:border-[#6750A4] focus:bg-white rounded-[24px] py-6 px-16 text-[#21005D] font-black placeholder-gray-300 outline-none transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Benefits Card */}
                    <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                        <h4 className="text-[14px] font-black text-[#21005D] uppercase tracking-widest mb-6 flex items-center gap-2">
                           <Sparkles size={18} className="text-[#6750A4]" />
                           Uplink Benefits
                        </h4>
                        <div className="space-y-4">
                            <BenefitItem text="access to shared tasks and geofence mission logs" />
                            <BenefitItem text="real-time collaboration and neural pathfinding" />
                            <BenefitItem text="location-based project synchronization" />
                        </div>
                    </div>
                </div>

                {/* Action Row */}
                <div className="pt-6">
                    <button 
                        onClick={handleInvite}
                        disabled={loading}
                        className="w-full h-20 bg-[#6750A4] text-white font-black text-[18px] rounded-[32px] shadow-xl shadow-[#6750A4]/30 hover:bg-[#4F378B] transition-all active:scale-95 flex items-center justify-center gap-3 group"
                    >
                        {loading ? <Loader2 className="animate-spin" size={28} /> : (
                            <>
                                <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                DISPATCH INVITE
                            </>
                        )}
                    </button>
                    <button 
                         onClick={() => navigate(-1)}
                         className="w-full py-6 text-gray-400 font-bold text-[14px] uppercase tracking-widest mt-2 hover:text-[#6750A4] transition-colors"
                    >
                        Cancel Dispatch
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InviteMemberScreen;
