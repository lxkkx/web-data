import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-48 h-48 mb-12 glass-panel rounded-[2.5rem] flex items-center justify-center border-t-2 border-l-2 border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.3)] relative group transform hover:rotate-6 transition-transform duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-[2.5rem]" />
        <Sparkles size={80} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] z-10 animate-float" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight"
      >
        TaskMate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-slate-400 font-medium tracking-widest uppercase text-xs"
      >
        Intelligent Productivity
      </motion.p>
      
      <div className="mt-24 z-10 w-full max-w-[200px]">
        <div className="h-1.5 glass-panel rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_#6366f1]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
