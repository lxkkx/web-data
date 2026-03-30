import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Mic, 
  StopCircle, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Brain,
  Zap,
  Activity,
  User,
  Search,
  MessageSquare,
  Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VoiceCommandScreen = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('Standby'); // Standby, Listening, Processing, Success, Error
  const [visualizerLines, setVisualizerLines] = useState(new Array(20).fill(10));
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initializing Speech Recognition if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript) handleCommand(transcript);
        else setStatus('Standby');
      };
    }
  }, [transcript]);

  useEffect(() => {
    let interval;
    if (isListening) {
      interval = setInterval(() => {
        setVisualizerLines(new Array(20).fill(0).map(() => Math.random() * 40 + 10));
      }, 100);
    } else {
      setVisualizerLines(new Array(20).fill(5));
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setStatus('Listening');
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleCommand = async (cmd) => {
    setStatus('Processing');
    // Mock processing logic
    setTimeout(() => {
        if (cmd.toLowerCase().includes('task') || cmd.toLowerCase().includes('create')) {
            setStatus('Success');
            setTimeout(() => navigate('/create-task'), 1500);
        } else if (cmd.toLowerCase().includes('map') || cmd.toLowerCase().includes('nearby')) {
            setStatus('Success');
            setTimeout(() => navigate('/map'), 1500);
        } else {
            setStatus('Success');
            alert(`Voice Command: "${cmd}" received. System ready for directives.`);
            setStatus('Standby');
        }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-120px)] pb-12">
      {/* Header */}
      <div className="w-full flex items-center justify-between p-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-4 rounded-2xl glass-card text-slate-400 hover:text-white transition-all shadow-lg hover:scale-110"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase tracking-widest leading-none">Neural Command</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/80 mt-1">Uplink Beta V1.0</p>
          </div>
          <div className="w-12 h-12" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-12 text-center max-w-lg w-full px-6">
          {/* Status HUD */}
          <motion.div 
            animate={isListening ? { scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`p-8 rounded-[3rem] glass-card border border-white/5 shadow-2xl space-y-4 w-full relative overflow-hidden group`}
          >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-all duration-1000">
                  <Brain size={120} />
              </div>
              
              <div className="flex items-center justify-center gap-3 relative z-10">
                  <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{status}</span>
              </div>
              
              <div className="min-h-[100px] flex items-center justify-center relative z-10">
                <AnimatePresence mode="wait">
                    {transcript ? (
                        <motion.p 
                            key="transcript"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-black text-white italic tracking-tight leading-snug"
                        >
                            "{transcript}"
                        </motion.p>
                    ) : (
                        <motion.p 
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            className="text-lg font-bold text-slate-500 uppercase tracking-widest"
                        >
                            {isListening ? 'Transmitting audio signal...' : 'Ready for neural input'}
                        </motion.p>
                    )}
                </AnimatePresence>
              </div>

              {/* Visualizer */}
              <div className="flex items-center justify-center gap-2 h-12 pt-4 border-t border-white/5 relative z-10">
                  {visualizerLines.map((h, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: `${h}px` }}
                        className={`w-1 rounded-full ${isListening ? 'bg-indigo-500/50' : 'bg-slate-800'}`}
                        style={{ height: `${h}px` }}
                      />
                  ))}
              </div>
          </motion.div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-4 w-full">
              {[
                  { label: 'Create Task', icon: Sparkles, desc: 'Add new mission' },
                  { label: 'Open Map', icon: Navigation, desc: 'Signal sweep' },
                  { label: 'Team Hub', icon: User, desc: 'Squad roster' },
                  { label: 'Analysis', icon: TrendingUp, desc: 'Neural stats' },
              ].map((opt, i) => (
                  <button 
                    key={opt.label}
                    onClick={() => handleCommand(opt.label)}
                    className="p-6 rounded-[2rem] glass-card border border-white/5 flex flex-col items-center gap-2 group hover:bg-white/5 hover:border-white/10 transition-all text-center shadow-xl"
                  >
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-slate-500 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all">
                          <opt.icon size={20} />
                      </div>
                      <div className="pt-1">
                          <span className="block text-[10px] font-black text-white uppercase tracking-widest">{opt.label}</span>
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">{opt.desc}</span>
                      </div>
                  </button>
              ))}
          </div>
      </div>

      {/* Main Mic Button */}
      <div className="relative pt-12">
          {isListening && (
              <>
                  <motion.div 
                    animate={{ scale: [1, 2], opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl"
                  />
                  <motion.div 
                    animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="absolute inset-0 bg-purple-500/10 rounded-full blur-3xl"
                  />
              </>
          )}
          
          <button 
            onClick={toggleListening}
            className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-2xl transform active:scale-90 ${isListening ? 'bg-rose-500 shadow-rose-500/50 scale-110' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/50 hover:scale-105'}`}
          >
              {isListening ? <StopCircle size={48} className="text-white fill-white/20" /> : <Mic size={48} className="text-white" />}
          </button>
          
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 text-center mt-8 animate-pulse">
            {isListening ? 'SIGNAL ACTIVE' : 'OPEN UPLINK'}
          </p>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 blur-[200px] rounded-full rotate-45" />
      </div>
    </div>
  );
};

export default VoiceCommandScreen;
