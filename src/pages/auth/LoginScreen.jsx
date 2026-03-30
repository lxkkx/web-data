import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import authService from '../../api/authService';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login({ email, password });
      navigate('/home');
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : (detail ? JSON.stringify(detail) : 'Login failed. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col font-sans">
      {/* Top App Bar */}
      <div className="flex items-center px-4 py-3 bg-transparent">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-full hover:bg-gray-100 text-gray-900 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-8 pt-4 w-full max-w-md mx-auto relative">
        <h2 className="text-[32px] font-extrabold text-gray-900 leading-tight">Welcome Back</h2>
        <p className="text-[16px] font-medium text-gray-500 mt-2 mb-12">
          Sign in to continue your progress
        </p>

        <form onSubmit={handleLogin} className="flex flex-col flex-1">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                id="email-input"
                className={`peer w-full bg-transparent border ${error ? 'border-red-500' : 'border-gray-300 focus:border-[#6750A4]'} rounded-[16px] px-4 pt-6 pb-2 text-[16px] text-gray-900 outline-none transition-all placeholder-transparent`}
                placeholder="Email Address"
              />
              <label 
                htmlFor="email-input"
                className={`absolute left-4 top-4 text-gray-500 text-[16px] transition-all peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[12px] peer-valid:top-2 peer-valid:text-[12px] ${error ? 'peer-focus:text-red-500 text-red-500' : 'peer-focus:text-[#6750A4]'}`}
              >
                Email Address
              </label>
            </div>

            {/* Password Field */}
            <div className="relative">
              <input 
                required
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                id="password-input"
                className={`peer w-full bg-transparent border ${error ? 'border-red-500' : 'border-gray-300 focus:border-[#6750A4]'} rounded-[16px] px-4 pt-6 pb-2 pr-12 text-[16px] text-gray-900 outline-none transition-all placeholder-transparent`}
                placeholder="Password"
              />
              <label 
                htmlFor="password-input"
                className={`absolute left-4 top-4 text-gray-500 text-[16px] transition-all peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[12px] peer-valid:top-2 peer-valid:text-[12px] ${error ? 'peer-focus:text-red-500 text-red-500' : 'peer-focus:text-[#6750A4]'}`}
              >
                Password
              </label>
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
            
            {error && (
              <p className="text-[12px] text-red-500 font-medium px-4">{error}</p>
            )}

            <div className="flex justify-end pt-2 pb-4">
              <Link to="/forgot-password" className="text-[14px] font-bold text-[#6750A4] hover:opacity-80 transition-opacity">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-[60px] mt-2 rounded-[16px] bg-[#6750A4] text-white flex items-center justify-center shadow-md active:bg-[#4F378B] hover:bg-[#594099] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <span className="text-[18px] font-bold">Login</span>
            )}
          </button>

          <div className="mt-8 flex items-center justify-center gap-1 pb-10">
            <span className="text-[14px] font-medium text-gray-500">Don't have an account?</span>
            <Link to="/register" className="text-[14px] font-bold text-[#6750A4] hover:opacity-80 transition-opacity">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
