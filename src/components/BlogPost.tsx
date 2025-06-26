
import React from 'react';
import { Eye, Lock, Star } from 'lucide-react';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
    clearanceLevel: 'admin' | 'friend' | 'public';
  };
  userClearance: 'admin' | 'friend' | 'public';
  isEditMode?: boolean;
  onEdit?: (post: any) => void;
  onDelete?: (id: string) => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ 
  post, 
  userClearance, 
  isEditMode = false, 
  onEdit, 
  onDelete 
}) => {
  const canView = () => {
    const clearanceLevels = { public: 0, friend: 1, admin: 2 };
    return clearanceLevels[userClearance] >= clearanceLevels[post.clearanceLevel];
  };

  const getClearanceIcon = (level: string) => {
    switch (level) {
      case 'admin': return <Lock className="w-4 h-4 text-red-400" />;
      case 'friend': return <Star className="w-4 h-4 text-yellow-400" />;
      default: return <Eye className="w-4 h-4 text-green-400" />;
    }
  };

  const getClearanceColor = (level: string) => {
    switch (level) {
      case 'admin': return 'border-red-500/50 shadow-red-500/20';
      case 'friend': return 'border-yellow-500/50 shadow-yellow-500/20';
      default: return 'border-green-500/50 shadow-green-500/20';
    }
  };

  if (!canView()) {
    return (
      <div className="glass rounded-2xl p-6 border border-gray-500/30 opacity-50">
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Lock className="w-6 h-6" />
          <span className="font-code">CLASSIFIED CONTENT</span>
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          Clearance level insufficient for this transmission
        </p>
      </div>
    );
  }

  return (
    <article className={`glass rounded-2xl p-6 border ${getClearanceColor(post.clearanceLevel)} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getClearanceIcon(post.clearanceLevel)}
          <span className="text-xs font-code uppercase tracking-wider text-gray-400">
            {post.clearanceLevel} clearance
          </span>
        </div>
        
        {isEditMode && userClearance === 'admin' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit?.(post)}
              className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-code"
            >
              EDIT
            </button>
            <button
              onClick={() => onDelete?.(post.id)}
              className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-code"
            >
              DELETE
            </button>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-white mb-3 font-space">
        {post.title}
      </h2>

      <div className="prose prose-invert max-w-none mb-4">
        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-700 pt-4">
        <span className="font-code">BY {post.author.toUpperCase()}</span>
        <time className="font-code">{new Date(post.date).toLocaleDateString()}</time>
      </div>
    </article>
  );
};

export default BlogPost;
