
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Lock, Star, Edit, Trash2 } from 'lucide-react';
import { renderMarkdown } from '../utils/markdownRenderer';

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
  const navigate = useNavigate();

  const canView = () => {
    const clearanceLevels = { public: 0, friend: 1, admin: 2 };
    return clearanceLevels[userClearance] >= clearanceLevels[post.clearanceLevel];
  };

  const getClearanceIcon = (level: string) => {
    switch (level) {
      case 'admin': return <Lock className="w-3 h-3 text-red-500" />;
      case 'friend': return <Star className="w-3 h-3 text-amber-500" />;
      default: return <Eye className="w-3 h-3 neon-accent" />;
    }
  };

  const getClearanceColor = (level: string) => {
    switch (level) {
      case 'admin': return 'text-red-500 bg-red-50 border-red-200';
      case 'friend': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-blue-500 bg-blue-50 border-blue-200';
    }
  };

  const handleClick = () => {
    if (!isEditMode && canView()) {
      navigate(`/post/${post.id}`);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(post);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(post.id);
  };

  // Extract preview from content (first paragraph)
  const getPreview = () => {
    const lines = post.content.split('\n').filter(line => line.trim());
    // Skip the title line and get the first meaningful content
    const contentLines = lines.slice(1).filter(line => !line.startsWith('#'));
    return contentLines[0] || 'No preview available';
  };

  if (!canView()) {
    return (
      <article className="glass-panel rounded-2xl p-8 opacity-60">
        <div className="flex items-center space-x-3 mb-4">
          <Lock className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-medium text-slate-500">Restricted Content</span>
        </div>
        <p className="secondary-text">
          Insufficient clearance level to view this post
        </p>
      </article>
    );
  }

  return (
    <article 
      className={`glass-card rounded-2xl p-8 transition-all duration-300 ${
        !isEditMode ? 'cursor-pointer hover-lift hover-glow' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-medium ${getClearanceColor(post.clearanceLevel)}`}>
            {getClearanceIcon(post.clearanceLevel)}
            <span className="uppercase tracking-wide">
              {post.clearanceLevel}
            </span>
          </div>
        </div>
        
        {isEditMode && userClearance === 'admin' && (
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all focus-ring"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all focus-ring"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold futuristic-heading mb-4 hover:neon-accent transition-colors">
        {post.title}
      </h2>

      <div className="secondary-text mb-6 line-clamp-3 leading-relaxed">
        {getPreview()}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{post.author}</span>
        <time className="muted-text">
          {new Date(post.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </time>
      </div>
    </article>
  );
};

export default BlogPost;
