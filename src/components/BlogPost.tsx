
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Lock, Star, Edit, Trash2 } from 'lucide-react';

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
      default: return <Eye className="w-3 h-3 text-blue-500" />;
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

  if (!canView()) {
    return (
      <div className="py-8 border-b border-gray-200 opacity-50">
        <div className="flex items-center space-x-2 mb-3">
          <Lock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Restricted Content</span>
        </div>
        <p className="text-sm text-gray-400">
          Insufficient clearance level to view this post
        </p>
      </div>
    );
  }

  return (
    <article 
      className={`group py-8 border-b border-gray-200 last:border-b-0 ${
        !isEditMode ? 'cursor-pointer hover-lift' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getClearanceIcon(post.clearanceLevel)}
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {post.clearanceLevel}
          </span>
        </div>
        
        {isEditMode && userClearance === 'admin' && (
          <div className="flex space-x-1">
            <button
              onClick={handleEdit}
              className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors focus-ring"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors focus-ring"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
        {post.title}
      </h2>

      <div className="prose text-gray-600 mb-4 line-clamp-3">
        {post.content}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{post.author}</span>
        <time>{new Date(post.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })}</time>
      </div>
    </article>
  );
};

export default BlogPost;
