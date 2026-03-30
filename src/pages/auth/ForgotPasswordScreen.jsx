import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Loader2, Sparkles, ShieldQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../api/authService';

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await authService.forgotPassword(email);
      navigate('/verify-email', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-6 md:items-center md:justify-center">
      <motion.button 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        onClick={() => navigate(-1)}
        className="self-start md:absolute md:top-8 md:left-8 p-4 rounded-2xl glass-card text-slate-400 hover:text-white transition-all hover:scale-105"
      >
        <ArrowLeft size={24} />
      </motion.button>

      <div className="w-full max-w-md mt-12 md:mt-0">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
        >
            <div className="space-y-4 text-center md:text-left">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-[1.5rem] flex items-center justify-center text-indigo-500 mb-6 mx-auto md:mx-0 shadow-2xl shadow-indigo-500/5 ring-1 ring-indigo-500/20">
                <ShieldQuestion size={40} />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight leading-none uppercase">Identity<br/><span className="text-indigo-500">Recovery</span></h2>
            <p className="text-slate-500 font-medium leading-relaxed max-w-[280px] md:max-w-none"> No worries! Enter your credentials and our protocol will issue a temporal reset link. </p>
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
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-6">Secure Entry Terminal</label>
                    <div className="relative group/input">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-indigo-500 transition-all group-focus-within/input:scale-110" size={20} />
                        <input 
                        required
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@neural-link.com"
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/5 rounded-3xl py-6 pl-16 pr-6 text-white placeholder-slate-800 outline-none transition-all text-lg shadow-inner"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 overflow-hidden relative group"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {loading ? (
                    <Loader2 size={24} className="animate-spin" />
                    ) : (
                    <>
                        <span className="tracking-widest uppercase">Execute Reset</span>
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </>
                    )}
                </button>
            </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
