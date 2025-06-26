
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

interface PasswordGateProps {
  onAccess: (clearanceLevel: 'admin' | 'friend' | 'public') => void;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ onAccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Smooth loading animation
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const passwordMap: Record<string, 'admin' | 'friend' | 'public'> = {
      'cosmic-admin-2024': 'admin',
      'starlight-friend': 'friend',
      'nebula-guest': 'public',
      '': 'public'
    };
    
    const clearanceLevel = passwordMap[password] || 'public';
    setIsLoading(false);
    onAccess(clearanceLevel);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Floating orbs for ambient effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-pulse"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              width: `${60 + Math.random() * 120}px`,
              height: `${60 + Math.random() * 120}px`,
              background: `linear-gradient(135deg, ${
                ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'][Math.floor(Math.random() * 4)]
              }, transparent)`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <div className="apple-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 animate-glow">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Enter your access key to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access key"
                className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-400 focus:outline-none text-gray-900 placeholder-gray-500 transition-all duration-200"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl apple-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Continue</span>
                </div>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-gray-50/50 rounded-xl">
            <p className="text-xs text-gray-600 text-center mb-2">Demo credentials:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>🔑 <code className="bg-white px-2 py-1 rounded font-mono">cosmic-admin-2024</code> - Admin</p>
              <p>⭐ <code className="bg-white px-2 py-1 rounded font-mono">starlight-friend</code> - Friend</p>
              <p>🌐 <code className="bg-white px-2 py-1 rounded font-mono">nebula-guest</code> - Public</p>
              <p className="text-center pt-2">or leave blank for public access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
