import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sun,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import aiService from '../../api/aiService';
import taskService from '../../api/taskService';

const SmartReschedulingScreen = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const data = await aiService.getSmartReschedule();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching rescheduling suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleApply = async (suggestion) => {
    if (!suggestion.task_id || !suggestion.suggestion_data?.suggested_date) {
        setSuggestions(prev => prev.filter(s => s.task_id !== suggestion.task_id));
        return;
    }

    try {
        await taskService.updateTask(suggestion.task_id, {
            due_date: suggestion.suggestion_data.suggested_date
        });
        setSuggestions(prev => prev.filter(s => s.task_id !== suggestion.task_id));
    } catch (error) {
        console.error('Error applying suggestion:', error);
    }
  };

  const removeSuggestion = (taskId) => {
    setSuggestions(suggestions.filter(s => s.task_id !== taskId));
  };

  const rescheduleCount = suggestions.filter(s => true).length; // Simplify as app filters by actionType == 'reschedule'

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col font-sans">
      {/* Top App Bar */}
      <div className="bg-[#6A11CB] text-white px-4 py-3 flex items-center shadow-md drop-shadow-sm sticky top-0 z-10 w-full">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 mr-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-[22px] font-bold leading-tight">Smart Rescheduling</h1>
          <p className="text-[14px] text-white/80 leading-tight">AI-optimized time slots</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col relative">
        {loading && suggestions.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#6A11CB] animate-spin" />
          </div>
        ) : (
          <div className="p-4 flex flex-col custom-container max-w-2xl mx-auto w-full">
            {/* AI Analysis Card */}
            <div className="bg-[#E3F2FD] border border-blue-600/30 rounded-xl p-4 flex items-center mb-6">
              <Sun className="text-blue-600 w-6 h-6 mr-3 shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-blue-600">AI Recommendations</span>
                <span className="text-blue-600/80 text-sm">We've found {rescheduleCount} opportunities to optimize your flow</span>
              </div>
            </div>

            {suggestions.length === 0 ? (
              <div className="flex-1 flex justify-center py-8">
                <p className="text-gray-500">Your schedule is perfectly optimized! 🎉</p>
              </div>
            ) : (
              <>
                <h2 className="font-bold text-[18px] mb-4 text-gray-900">Suggested Adjustments</h2>
                
                <div className="flex flex-col gap-4">
                  {suggestions.map((suggestion, i) => (
                    <div key={suggestion.task_id || i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col">
                      <h3 className="font-bold text-[18px] text-gray-900">{suggestion.title}</h3>
                      <p className="text-gray-500 text-[14px] mt-2 mb-4">{suggestion.description}</p>
                      
                      <div className="flex gap-2 w-full mt-auto">
                        <button 
                          onClick={() => handleApply(suggestion)}
                          className="flex-1 bg-black text-white font-medium py-2 px-4 rounded-lg active:bg-gray-800 transition-colors"
                        >
                          Apply
                        </button>
                        <button 
                          onClick={() => removeSuggestion(suggestion.task_id)}
                          className="flex-1 bg-white text-black border border-gray-300 font-medium py-2 px-4 rounded-lg active:bg-gray-50 transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <button 
              onClick={() => navigate(-1)}
              className="w-full bg-white text-black border border-gray-300 font-medium py-3 px-4 rounded-lg mt-4 active:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartReschedulingScreen;
