
import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

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
    
    // Simulate loading for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Password mapping
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden grain">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full twinkle-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              backgroundColor: ['#00ff88', '#ff0088', '#0088ff', '#ffff00'][Math.floor(Math.random() * 4)],
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
        
        {[...Array(5)].map((_, i) => (
          <div
            key={`blob-${i}`}
            className="absolute floating-blob opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              background: `radial-gradient(circle, ${['#ff00ff', '#00ffff', '#ffff00', '#ff8800'][Math.floor(Math.random() * 4)]}22 0%, transparent 70%)`,
              borderRadius: '50%',
              animationDelay: `${Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="glass rounded-2xl p-8 neon-border">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-space">
              COSMIC CLEARANCE
            </h1>
            <p className="text-gray-400 mt-2 font-code">
              Enter your cosmic key to access the digital realm
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="cosmic-key-here"
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg focus:border-cyan-400 focus:outline-none text-white placeholder-gray-500 font-code"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 font-space"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                'ENTER THE COSMOS'
              )}
            </button>
          </form>

          <div className="mt-6 text-xs text-gray-500 font-code">
            <p>🌌 Try: cosmic-admin-2024, starlight-friend, or nebula-guest</p>
            <p>🚀 Or leave blank for public access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
