import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, MapPin, Brain } from 'lucide-react';

const onboardingData = [
  {
    title: "Organize Your Tasks",
    description: "Keep track of all your tasks in one place. Create, manage, and complete tasks with ease.",
    icon: CheckCircle2,
    color: "#3D5AFE",
    bg: "#E3F2FD"
  },
  {
    title: "Location Reminders",
    description: "Get notified when you're near a location where you need to complete a task. Never forget again!",
    icon: MapPin,
    color: "#4CAF50",
    bg: "#E8F5E9"
  },
  {
    title: "AI Smart Scheduling",
    description: "Our AI analyzes your habits to suggest the best time for your activities and optimize your day.",
    icon: Brain,
    color: "#6750A4",
    bg: "#F3E5F5"
  }
];

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/login');
    }
  };

  const skip = () => {
    navigate('/login');
  };

  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden font-sans">
      <div className="flex justify-end p-6">
        <button 
          onClick={skip}
          className="text-[16px] font-medium text-gray-400 hover:text-gray-900 transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring", damping: 22 }}
            className="w-full flex flex-col items-center"
          >
            <div 
              style={{ backgroundColor: onboardingData[currentStep].bg }}
              className="w-full max-w-[280px] aspect-square rounded-[24px] mb-12 flex items-center justify-center shadow-sm relative group overflow-hidden"
            >
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
               {React.createElement(onboardingData[currentStep].icon, { 
                 size: 140, 
                 style: { color: onboardingData[currentStep].color },
                 className: "transition-transform group-hover:scale-110 duration-500" 
               })}
            </div>
            
            <h2 className="text-[28px] font-extrabold text-gray-900 text-center mb-4 leading-tight">
              {onboardingData[currentStep].title}
            </h2>
            <p className="text-[16px] font-medium text-gray-500 text-center max-w-[300px]">
              {onboardingData[currentStep].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-10 flex flex-col items-center">
        {/* Pagination Dots */}
        <div className="flex gap-2 mb-10">
          {onboardingData.map((_, index) => (
            <div 
              key={index}
              className={`h-2 transition-all duration-300 rounded-full ${
                index === currentStep ? 'w-8 bg-gray-900' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          className="w-full max-w-sm h-[56px] rounded-[16px] bg-black text-white flex items-center justify-center gap-2 hover:bg-gray-800 transition-all font-bold group"
        >
          <span className="text-[16px]">{currentStep === onboardingData.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
