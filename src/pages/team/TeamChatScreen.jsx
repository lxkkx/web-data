import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  MoreVertical,
  ChevronRight,
  MessageCircle,
  Clock,
  User,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import teamService from '../../api/teamService';
import userService from '../../api/userService';

const ChatMessageItem = ({ msg, isMe }) => {
  return (
    <div className={`w-full flex flex-col mb-4 ${isMe ? 'items-end' : 'items-start'}`}>
      {!isMe && (
        <span className="text-[12px] font-bold text-gray-400 pl-4 mb-2 uppercase tracking-widest">{msg.full_name}</span>
      )}
      
      <div 
        className={`max-w-[85%] md:max-w-[70%] px-5 py-4 shadow-sm flex flex-col ${
          isMe 
            ? 'bg-[#6750A4] text-white rounded-[22px] rounded-br-[4px]' 
            : 'bg-[#F3EDF7] text-[#21005D] rounded-[22px] rounded-bl-[4px] border border-gray-100'
        }`}
      >
        <span className="text-[15px] leading-relaxed font-medium">{msg.message}</span>
        <div className={`flex items-center gap-1 mt-1 self-end ${isMe ? 'text-white/60' : 'text-gray-400'} font-bold text-[10px] uppercase tracking-tighter`}>
            <Clock size={10} />
            <span>{msg.created_at ? msg.created_at.split('T')[1].substring(0, 5) : ''}</span>
        </div>
      </div>
    </div>
  );
};

const TeamChatScreen = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [team, setTeam] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchData = async () => {
    try {
      const [teamData, chatData, userData] = await Promise.all([
        teamService.getTeamById(teamId).catch(() => null),
        teamService.getChatMessages(teamId).catch(() => []),
        userService.getMe().catch(() => null)
      ]);
      setTeam(teamData);
      setChat(chatData);
      setMe(userData);
    } catch (error) {
      console.error('Error fetching chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(async () => {
        try {
            const chatData = await teamService.getChatMessages(teamId);
            setChat(chatData);
        } catch (e) {}
    }, 5000); // Polling every 5s for team chat
    return () => clearInterval(interval);
  }, [teamId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !me) return;

    const currentMsg = message;
    setMessage('');

    try {
      await teamService.sendChatMessage(teamId, currentMsg);
      const chatData = await teamService.getChatMessages(teamId);
      setChat(chatData);
    } catch (error) {
       console.error("Failed to send message:", error);
    }
  };

  if (loading && chat.length === 0) {
      return (
          <div className="h-screen w-full flex items-center justify-center bg-[#FEFEFE]">
              <Loader2 className="animate-spin text-[#6750A4]" size={40} />
          </div>
      );
  }

  return (
    <div className="flex flex-col h-screen bg-[#FEFEFE] font-sans">
      {/* Top App Bar Overlay */}
      <div className="bg-white/95 backdrop-blur-md px-4 py-4 flex items-center border-b border-gray-50 sticky top-0 z-30 shadow-sm w-full">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 -ml-2 mr-2 rounded-full hover:bg-gray-100 transition-colors text-[#21005D]"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex items-center flex-1">
          <div className="w-10 h-10 rounded-full bg-[#EADDFF] flex items-center justify-center mr-3 border border-[#6750A4]/10 shadow-inner">
            <span className="text-[#21005D] font-black text-lg">T</span>
          </div>
        <div className="flex flex-col">
            <h1 className="text-[17px] font-black leading-tight text-[#21005D] truncate max-w-[180px]">
                {team?.name || 'Loading Hub...'}
            </h1>
            <p className="text-[11px] text-[#6750A4] font-black uppercase tracking-widest leading-none mt-1">Direct Synchronization</p>
        </div>
        </div>

        <button className="p-3 -mr-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400">
          <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Chat Messages Scrolling Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-4 bg-[#FEFEFE] noscrollbar"
      >
        <div className="flex flex-col items-center justify-center mb-12 opacity-30 select-none">
            <MessageCircle size={48} className="text-gray-200 mb-3" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">End-to-End Encrypted Tunnel</p>
        </div>

        {chat.map((msg, i) => {
          const isMe = msg.user_id === me?.id;
          return <ChatMessageItem key={msg.id || i} msg={msg} isMe={isMe} />;
        })}
      </div>

      {/* Message Input Fixed Footer */}
      <div className="bg-white p-6 md:px-20 border-t border-gray-100 z-40">
        <form onSubmit={handleSend} className="w-full flex items-center gap-3">
          <div className="flex-1 relative">
            <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..." 
                className="w-full bg-gray-50 border border-transparent focus:border-[#6750A4] focus:bg-white text-[#21005D] text-[16px] font-bold px-7 py-5 rounded-[24px] outline-none placeholder:text-gray-300 transition-all shadow-inner"
            />
          </div>
          <button 
                type="submit"
                disabled={!message.trim()}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    message.trim() 
                    ? 'bg-[#6750A4] text-white shadow-xl shadow-[#6750A4]/30 active:scale-90' 
                    : 'bg-gray-100 text-gray-300'
                }`}
            >
                <Send size={24} className="ml-1" />
            </button>
        </form>
      </div>
    </div>
  );
};

export default TeamChatScreen;
