
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <Lock className="w-6 h-6 text-gray-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome
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
              placeholder="Access key"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-ring"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              'Continue'
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center mb-3">Demo credentials</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p><code className="bg-white px-2 py-1 rounded font-mono text-xs">cosmic-admin-2024</code> → Admin</p>
            <p><code className="bg-white px-2 py-1 rounded font-mono text-xs">starlight-friend</code> → Friend</p>
            <p><code className="bg-white px-2 py-1 rounded font-mono text-xs">nebula-guest</code> → Public</p>
            <p className="text-center pt-2 text-gray-400">or leave blank for public access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
