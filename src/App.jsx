import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Eagerly loaded Auth Flow (critical for initial paint performance)
import SplashScreen from './pages/auth/SplashScreen';
import OnboardingScreen from './pages/auth/OnboardingScreen';
import LoginScreen from './pages/auth/LoginScreen';
import RegistrationScreen from './pages/auth/RegistrationScreen';
import ForgotPasswordScreen from './pages/auth/ForgotPasswordScreen';
import VerifyEmailScreen from './pages/auth/VerifyEmailScreen';
import ResetPasswordScreen from './pages/auth/ResetPasswordScreen';
import MainLayout from './layouts/MainLayout';
import MapScreen from './pages/map/MapScreen';
import TeamChatScreen from './pages/team/TeamChatScreen';
import TaskAnalysisScreen from './pages/team/TaskAnalysisScreen';
import CreateTeamScreen from './pages/team/CreateTeamScreen';
import InviteMemberScreen from './pages/team/InviteMemberScreen';
import AssignTaskScreen from './pages/team/AssignTaskScreen';
import TeamMemberProfileScreen from './pages/team/TeamMemberProfileScreen';
import EmailPreferencesScreen from './pages/dashboard/EmailPreferencesScreen';
import LocationPermissionsScreen from './pages/dashboard/LocationPermissionsScreen';
// Lazy loaded Dashboard and Sub-Flows (optimizes performance)
const HomeScreen = lazy(() => import('./pages/dashboard/HomeScreen'));
const AllTasksScreen = lazy(() => import('./pages/tasks/AllTasksScreen'));
const TaskDetailScreen = lazy(() => import('./pages/tasks/TaskDetailScreen'));
const CreateTaskScreen = lazy(() => import('./pages/tasks/CreateTaskScreen'));
const EditTaskScreen = lazy(() => import('./pages/tasks/EditTaskScreen'));
const TaskCategoriesScreen = lazy(() => import('./pages/tasks/TaskCategoriesScreen'));

const ProfileScreen = lazy(() => import('./pages/dashboard/ProfileScreen'));
const EditProfileScreen = lazy(() => import('./pages/dashboard/EditProfileScreen'));
const NotificationsScreen = lazy(() => import('./pages/dashboard/NotificationsScreen'));

const AISuggestionsScreen = lazy(() => import('./pages/ai/AISuggestionsScreen'));
const CalendarScreen = lazy(() => import('./pages/dashboard/CalendarScreen'));
const ProductivityInsightsScreen = lazy(() => import('./pages/dashboard/ProductivityInsightsScreen'));
const DeadlineRiskAlertsScreen = lazy(() => import('./pages/dashboard/DeadlineRiskAlertsScreen'));
const SmartReschedulingScreen = lazy(() => import('./pages/dashboard/SmartReschedulingScreen'));

const TeamCollaborationScreen = lazy(() => import('./pages/team/TeamCollaborationScreen'));


// Custom Suspense Loading UI
const SuspenseLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-950">
    <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
  </div>
);

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-center" toastOptions={{duration: 4000}} />
      <Routes>
        {/* Auth Flow */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegistrationScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/verify-email" element={<VerifyEmailScreen />} />
        <Route path="/reset-password" element={<ResetPasswordScreen />} />

        {/* Protected Routes with Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Suspense fallback={<SuspenseLoader />}><HomeScreen /></Suspense>} />
          <Route path="/tasks" element={<Suspense fallback={<SuspenseLoader />}><AllTasksScreen /></Suspense>} />
          <Route path="/task/:id" element={<Suspense fallback={<SuspenseLoader />}><TaskDetailScreen /></Suspense>} />
          <Route path="/create-task" element={<Suspense fallback={<SuspenseLoader />}><CreateTaskScreen /></Suspense>} />
          <Route path="/edit-task/:id" element={<Suspense fallback={<SuspenseLoader />}><EditTaskScreen /></Suspense>} />
          <Route path="/categories" element={<Suspense fallback={<SuspenseLoader />}><TaskCategoriesScreen /></Suspense>} />
          
          <Route path="/profile" element={<Suspense fallback={<SuspenseLoader />}><ProfileScreen /></Suspense>} />
          <Route path="/edit-profile" element={<Suspense fallback={<SuspenseLoader />}><EditProfileScreen /></Suspense>} />
          <Route path="/notifications" element={<Suspense fallback={<SuspenseLoader />}><NotificationsScreen /></Suspense>} />
          
          <Route path="/ai-suggestions" element={<Suspense fallback={<SuspenseLoader />}><AISuggestionsScreen /></Suspense>} />
          <Route path="/calendar" element={<Suspense fallback={<SuspenseLoader />}><CalendarScreen /></Suspense>} />
          <Route path="/insights" element={<Suspense fallback={<SuspenseLoader />}><ProductivityInsightsScreen /></Suspense>} />
          <Route path="/deadline-risks" element={<Suspense fallback={<SuspenseLoader />}><DeadlineRiskAlertsScreen /></Suspense>} />
          <Route path="/smart-reschedule" element={<Suspense fallback={<SuspenseLoader />}><SmartReschedulingScreen /></Suspense>} />
          
          {/* <Route path="/team" element={<Suspense fallback={<SuspenseLoader />}><TeamCollaborationScreen /></Suspense>} />
          <Route path="/team/create" element={<CreateTeamScreen />} />
          <Route path="/team/chat/:teamId" element={<TeamChatScreen />} />
          <Route path="/team/analysis/:teamId" element={<TaskAnalysisScreen />} />
          <Route path="/team/invite/:teamId" element={<InviteMemberScreen />} />
          <Route path="/team/assign/:teamId" element={<AssignTaskScreen />} />
          <Route path="/team/member/:teamId/:userId" element={<TeamMemberProfileScreen />} /> */}
          
          <Route path="/map" element={<MapScreen />} />
          <Route path="/email-preferences" element={<EmailPreferencesScreen />} />
          <Route path="/location-permissions" element={<LocationPermissionsScreen />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
