
import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';

interface AdminPanelProps {
  onCreatePost: (post: any) => void;
  onUpdatePost: (post: any) => void;
  editingPost?: any;
  onCancelEdit: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onCreatePost, 
  onUpdatePost, 
  editingPost, 
  onCancelEdit 
}) => {
  const [formData, setFormData] = useState({
    title: editingPost?.title || '',
    content: editingPost?.content || '',
    clearanceLevel: editingPost?.clearanceLevel || 'public' as 'admin' | 'friend' | 'public'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const post = {
      id: editingPost?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      clearanceLevel: formData.clearanceLevel,
      author: 'Administrator',
      date: editingPost?.date || new Date().toISOString()
    };

    if (editingPost) {
      onUpdatePost(post);
    } else {
      onCreatePost(post);
    }

    setFormData({ title: '', content: '', clearanceLevel: 'public' });
    onCancelEdit();
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '', clearanceLevel: 'public' });
    onCancelEdit();
  };

  return (
    <div className="apple-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-blue-500" />
          {editingPost ? 'Edit Post' : 'Create New Post'}
        </h3>
        {editingPost && (
          <button
            onClick={handleCancel}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all apple-button"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-400 focus:outline-none text-gray-900 transition-all duration-200"
            placeholder="Enter post title..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Level
          </label>
          <select
            value={formData.clearanceLevel}
            onChange={(e) => setFormData({ ...formData, clearanceLevel: e.target.value as 'admin' | 'friend' | 'public' })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-400 focus:outline-none text-gray-900 transition-all duration-200"
          >
            <option value="public">🌐 Public Access</option>
            <option value="friend">⭐ Friend Access</option>
            <option value="admin">🔒 Admin Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={8}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-400 focus:outline-none text-gray-900 resize-none transition-all duration-200"
            placeholder="Write your post content..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl apple-button flex items-center justify-center"
        >
          <Save className="w-5 h-5 mr-2" />
          {editingPost ? 'Update Post' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
