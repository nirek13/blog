
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
      case 'admin': return <Lock className="w-4 h-4 text-red-500" />;
      case 'friend': return <Star className="w-4 h-4 text-amber-500" />;
      default: return <Eye className="w-4 h-4 text-blue-500" />;
    }
  };

  const getClearanceColor = (level: string) => {
    switch (level) {
      case 'admin': return 'bg-red-50 text-red-700 border-red-200';
      case 'friend': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
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
      <div className="post-card p-6 opacity-60 cursor-not-allowed">
        <div className="flex items-center justify-center space-x-3 text-gray-500 mb-4">
          <Lock className="w-6 h-6" />
          <span className="font-medium">Restricted Content</span>
        </div>
        <p className="text-center text-sm text-gray-500">
          Insufficient clearance level
        </p>
      </div>
    );
  }

  return (
    <article 
      className={`post-card p-6 ${!isEditMode ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getClearanceColor(post.clearanceLevel)}`}>
          {getClearanceIcon(post.clearanceLevel)}
          <span className="capitalize">{post.clearanceLevel}</span>
        </div>
        
        {isEditMode && userClearance === 'admin' && (
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors apple-button"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors apple-button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
        {post.title}
      </h2>

      <div className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
        {post.content}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <span className="font-medium">{post.author}</span>
        <time>{new Date(post.date).toLocaleDateString()}</time>
      </div>
    </article>
  );
};

export default BlogPost;
