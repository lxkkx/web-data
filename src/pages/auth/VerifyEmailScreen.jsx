import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCw, Send, Loader2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../api/authService';

const VerifyEmailScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resending, setResending] = useState(false);
  
  const inputs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return;

    try {
      setLoading(true);
      setError(null);
      await authService.verifyResetCode(email, code);
      // Pass email and code as token to ResetPasswordScreen
      navigate('/reset-password', { state: { email, code } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError(null);
      await authService.forgotPassword(email);
      // Optional: show local success message
    } catch (err) {
      setError('Failed to resend code. Please wait a moment.');
    } finally {
      setResending(false);
    }
  };

  // Auto-submit when all fields are filled
  useEffect(() => {
    if (otp.every(v => v !== '') && !loading) {
      handleSubmit();
    }
  }, [otp]);

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
          className="space-y-10"
        >
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-24 h-24">
               <div className="absolute inset-0 bg-indigo-500/20 blur-[40px] rounded-full animate-pulse" />
               <div className="w-24 h-24 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-500 relative z-10 border border-indigo-500/20 shadow-2xl">
                 <Mail size={40} />
               </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-4xl font-black text-white uppercase tracking-tight">Verify Identity</h2>
                <p className="text-slate-500 font-medium max-w-[300px] mx-auto leading-relaxed">
                    Enter the 6-digit decryption code sent to <span className="text-white font-bold">{email}</span>
                </p>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-6 py-4 rounded-2xl flex items-center gap-4 text-sm"
              >
                <AlertCircle size={20} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="flex justify-between gap-3 px-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  ref={el => inputs.current[index] = el}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className="w-full h-16 bg-slate-900 border border-white/5 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 rounded-2xl text-center text-2xl font-black text-white outline-none transition-all shadow-inner"
                />
              ))}
            </div>

            <div className="space-y-6">
              <button 
                type="submit"
                disabled={loading || otp.some(v => v === '')}
                className="w-full py-6 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <span className="tracking-widest uppercase">Validate Protocol</span>
                )}
              </button>
              
              <div className="flex flex-col items-center gap-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Didn't receive the transmission?</p>
                  <button 
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="flex items-center gap-3 text-indigo-400 hover:text-indigo-300 transition-all font-black text-xs uppercase tracking-widest px-6 py-2 rounded-full border border-indigo-500/10 hover:bg-indigo-500/5"
                  >
                    {resending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    Resend Code
                  </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmailScreen;
