import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  Bot, 
  Timer, 
  Lightbulb, 
  User, 
  BrainCircuit,
  MessageSquare,
  ArrowLeft,
  RefreshCcw,
  Loader2,
  AlertCircle,
  ChevronRight,
  UserCircle
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import aiService from '../../api/aiService';
import userService from '../../api/userService';

const SuggestionChip = ({ label, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex-shrink-0 flex items-center gap-2 px-6 py-4 rounded-[20px] bg-[#EADDFF]/40 text-[#6750A4] text-[12px] font-black uppercase tracking-widest border border-[#6750A4]/10 transition-all hover:bg-[#EADDFF]/70 active:scale-95 whitespace-nowrap"
  >
    <Icon size={18} />
    {label}
  </button>
);

const AIMessageItem = ({ msg, userProfile }) => {
  const isAI = msg.type === 'ai';
  return (
    <div className={`flex flex-col w-full mb-6 ${isAI ? 'items-start' : 'items-end'}`}>
      <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm ${isAI ? 'bg-[#FCF8FE] border border-[#6750A4]/10' : 'bg-[#6750A4]'}`}>
          {isAI ? (
            <Sparkles size={18} className="text-[#6750A4]" />
          ) : (
            userProfile?.profile_picture ? (
              <img src={userProfile.profile_picture} alt="User" className="w-full h-full object-cover" />
            ) : <User size={20} className="text-white" />
          )}
        </div>
        
        <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
          <div className={`px-5 py-4 rounded-[22px] text-[15px] font-medium leading-relaxed shadow-sm ${
            isAI 
            ? 'bg-[#F3EDF7] text-[#21005D] rounded-tl-none border border-gray-100' 
            : 'bg-[#6750A4] text-white rounded-tr-none'
          }`}>
            {msg.text}
          </div>
          <span className="text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest px-2">
            {msg.time}
          </span>
        </div>
      </div>
    </div>
  );
};

const AISuggestionsScreen = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const [history, setHistory] = useState([
    { 
      type: 'ai', 
      text: "Hello! I'm your AI Workspace assistant. I can help you optimize your schedule, group your tasks, and give you productivity insights. How can I assist you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);

  useEffect(() => {
    const initAI = async () => {
      try {
        setLoading(true);
        const [userData, chatHistory] = await Promise.all([
          userService.getMe().catch(() => null),
          aiService.getChatHistory().catch(() => [])
        ]);
        
        setUser(userData);
        
        if (chatHistory && chatHistory.length > 0) {
            const formattedHistory = chatHistory.slice().reverse().flatMap(item => [
                {
                    type: 'user',
                    text: item.query,
                    time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                },
                {
                    type: 'ai',
                    text: item.response,
                    time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
            setHistory(prev => [...prev.slice(0, 1), ...formattedHistory]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    initAI();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isTyping]);

  const handleSend = async (text, type = "general") => {
    const userQuery = text || query;
    if (!userQuery.trim() || isTyping) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHistory(prev => [...prev, { type: 'user', text: userQuery, time }]);
    setQuery('');
    setIsTyping(true);

    try {
      const response = await aiService.chat(userQuery, type);
      setHistory(prev => [...prev, { 
        type: 'ai', 
        text: response.response || "I'm sorry, I couldn't process that request right now.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setHistory(prev => [...prev, { 
        type: 'ai', 
        text: "I'm having trouble connecting right now. Please check your network.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    { label: 'Optimize my day', icon: Timer, text: 'Help me optimize my task schedule for today', type: 'optimize' },
    { label: 'Task suggestions', icon: Lightbulb, text: 'Suggest new tasks based on my productivity pattern', type: 'suggestions' },
    { label: 'Analyze Goals', icon: MessageSquare, text: 'Analyze my upcoming goals for this month', type: 'general' },
  ];

  if (loading && history.length <= 1) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FEFEFE] gap-4">
              <div className="w-10 h-10 border-4 border-[#6750A4]/20 border-t-[#6750A4] rounded-full animate-spin" />
              <p className="text-[#6750A4] font-black text-[12px] uppercase tracking-[0.3em] animate-pulse">Syncing Neural Link...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#FEFEFE] font-sans flex flex-col">
      {/* Top App Bar */}
      <div className="flex items-center px-4 py-4 sticky top-0 bg-white z-30 shadow-sm border-b border-gray-50">
        <button 
          onClick={() => navigate('/home')}
          className="p-3 rounded-full hover:bg-gray-100 text-[#21005D] transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="ml-4 flex items-center gap-3">
            <div className="p-2 bg-[#6750A4]/10 rounded-lg text-[#6750A4]">
                <Sparkles size={20} className="animate-pulse" />
            </div>
            <h2 className="text-[20px] font-black text-[#21005D]">AI Assistant</h2>
        </div>
      </div>

      {/* Chat History Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 pt-10 pb-40 noscrollbar"
      >
        <div className="flex flex-col items-center justify-center mb-12 opacity-40">
            <Sparkles size={64} className="text-[#6750A4] mb-4" />
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em]">Integrated Intelligence</p>
            <p className="text-center text-[13px] font-bold text-gray-500 mt-2 max-w-[250px]">
                I can help you build the perfect schedule, give you insights, and optimize your geofences.
            </p>
        </div>

        <AnimatePresence>
            {history.map((msg, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <AIMessageItem msg={msg} userProfile={user} />
                </motion.div>
            ))}
        </AnimatePresence>

        {isTyping && (
           <div className="flex items-start gap-3 mb-6 animate-in slide-in-from-left-2 duration-300">
                <div className="w-10 h-10 rounded-full bg-[#FCF8FE] border border-[#6750A4]/10 flex items-center justify-center shadow-sm">
                    <Sparkles size={18} className="text-[#6750A4] animate-pulse" />
                </div>
                <div className="bg-[#F3EDF7] p-5 rounded-[22px] rounded-tl-none border border-gray-100 flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-[#6750A4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-[#6750A4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-[#6750A4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
           </div>
        )}
      </div>

      {/* Input Overlay Area */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent md:bg-white md:border-t md:border-gray-100 z-40 max-w-4xl mx-auto w-full">
        {/* Suggestion Chips */}
        <div className="flex gap-3 overflow-x-auto pb-4 noscrollbar mb-4">
            {suggestions.map((s) => (
                <SuggestionChip 
                    key={s.label} 
                    label={s.label} 
                    icon={s.icon} 
                    onClick={() => handleSend(s.text, s.type)} 
                />
            ))}
        </div>

        {/* Text Input Row */}
        <div className="relative group">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
            placeholder="Ask anything..."
            className="w-full bg-[#FCF8FE] border border-[#6750A4]/10 focus:border-[#6750A4] focus:bg-white rounded-[24px] py-5 px-8 pr-16 text-[#21005D] text-[16px] font-bold placeholder-gray-400 outline-none transition-all shadow-inner"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!query.trim() || isTyping}
            className={`absolute right-3 top-3 w-[46px] h-[46px] rounded-full flex items-center justify-center transition-all ${
              query.trim() && !isTyping 
              ? 'bg-[#6750A4] text-white shadow-lg active:scale-95' 
              : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsScreen;
