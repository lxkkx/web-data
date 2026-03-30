import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, Loader2, AlertCircle, Zap, ShieldAlert } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../api/authService';

const ResetPasswordScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const { email, code } = state;

  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!email || !code) {
      navigate('/forgot-password');
    }
  }, [email, code, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Construct token as email|code for the backend logic
      const token = `${email}|${code}`;
      await authService.resetPassword(token, formData.password);
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-6 md:items-center md:justify-center">
      {!isSuccess && (
          <motion.button 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => navigate(-1)}
            className="self-start md:absolute md:top-8 md:left-8 p-4 rounded-2xl glass-card text-slate-400 hover:text-white transition-all hover:scale-105"
          >
            <ArrowLeft size={24} />
          </motion.button>
      )}

      <div className="w-full max-w-md mt-12 md:mt-0">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            {!isSuccess ? (
            <>
                <div className="space-y-6 text-center md:text-left">
                    <div className="w-20 h-20 bg-rose-500/10 rounded-[1.5rem] flex items-center justify-center text-rose-500 mb-6 mx-auto md:mx-0 shadow-2xl shadow-rose-500/5 ring-1 ring-rose-500/20">
                    <ShieldAlert size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-white uppercase tracking-tight leading-none">New<br/><span className="text-rose-500">Credentials</span></h2>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-[300px] md:max-w-none">
                            Update your access protocol. Ensure your new signature is robust and unique.
                        </p>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-6 py-4 rounded-2xl flex items-center gap-4 text-sm"
                    >
                        <AlertCircle size={20} className="shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-6">Primary Signature</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-indigo-500 transition-all group-focus-within/input:scale-110" size={20} />
                                <input 
                                    required
                                    type={showPass ? "text" : "password"} 
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full bg-slate-950/50 border border-white/5 focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/5 rounded-3xl py-6 pl-16 pr-14 text-white placeholder-slate-800 outline-none transition-all text-lg shadow-inner font-mono"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                >
                                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-6">Verify Signature</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-indigo-500 transition-all group-focus-within/input:scale-110" size={20} />
                                <input 
                                    required
                                    type={showPass ? "text" : "password"} 
                                    placeholder="••••••••"
                                    value={formData.confirm}
                                    onChange={(e) => setFormData({...formData, confirm: e.target.value})}
                                    className="w-full bg-slate-950/50 border border-white/5 focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/5 rounded-3xl py-6 pl-16 pr-6 text-white placeholder-slate-800 outline-none transition-all text-lg shadow-inner font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading || !formData.password || formData.password !== formData.confirm}
                        className="w-full py-6 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 overflow-hidden relative group"
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {loading ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <>
                                <span className="tracking-widest uppercase">Override Lock</span>
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </>
            ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full animate-pulse" />
                    <div className="w-32 h-32 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-indigo-500 shadow-2xl shadow-indigo-500/10 ring-4 ring-indigo-500/20 relative z-10 border border-indigo-500/30">
                        <ShieldCheck size={60} />
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tight">Security Restored</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Your account hash has been successfully re-indexed. You may now proceed to authenticate.
                    </p>
                </div>
                <button 
                onClick={() => navigate('/login')}
                className="w-full py-6 rounded-[2rem] bg-indigo-500 text-white font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-500/20 tracking-widest uppercase"
                >
                Login to Workspace
                </button>
            </motion.div>
            )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
