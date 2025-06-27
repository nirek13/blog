
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Zap } from 'lucide-react';

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
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 glass-panel rounded-2xl mb-6 animate-glow">
            <Zap className="w-10 h-10 neon-accent" />
          </div>
          <h1 className="text-3xl font-bold futuristic-heading mb-4">
            Access Terminal
          </h1>
          <p className="secondary-text text-lg">
            Enter your clearance credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Clearance code"
              className="w-full px-6 py-4 glass-card rounded-2xl focus:neon-border focus-ring transition-all text-lg font-mono"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 accent-button rounded-2xl text-lg font-semibold hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Access System</span>
              </div>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-12 glass-panel rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-4 h-4 neon-accent" />
            <p className="text-sm font-medium secondary-text">Demo Credentials</p>
          </div>
          <div className="space-y-3 text-sm muted-text">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <code className="font-mono text-slate-800">cosmic-admin-2024</code>
              <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">Admin</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <code className="font-mono text-slate-800">starlight-friend</code>
              <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Friend</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <code className="font-mono text-slate-800">nebula-guest</code>
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Public</span>
            </div>
            <p className="text-center pt-3 text-xs muted-text">
              Or leave blank for public access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
