
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
      author: 'Cosmic Admin',
      date: editingPost?.date || new Date().toISOString()
    };

    if (editingPost) {
      onUpdatePost(post);
    } else {
      onCreatePost(post);
    }

    // Reset form
    setFormData({ title: '', content: '', clearanceLevel: 'public' });
    onCancelEdit();
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '', clearanceLevel: 'public' });
    onCancelEdit();
  };

  return (
    <div className="glass rounded-2xl p-6 border border-purple-500/30 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-space flex items-center">
          <Plus className="w-5 h-5 mr-2 text-purple-400" />
          {editingPost ? 'EDIT TRANSMISSION' : 'NEW TRANSMISSION'}
        </h3>
        {editingPost && (
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 font-code">
            TRANSMISSION TITLE
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:border-cyan-400 focus:outline-none text-white font-space"
            placeholder="Enter cosmic message title..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 font-code">
            CLEARANCE LEVEL
          </label>
          <select
            value={formData.clearanceLevel}
            onChange={(e) => setFormData({ ...formData, clearanceLevel: e.target.value as 'admin' | 'friend' | 'public' })}
            className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:border-cyan-400 focus:outline-none text-white font-code"
          >
            <option value="public">🌍 PUBLIC ACCESS</option>
            <option value="friend">⭐ FRIEND CLEARANCE</option>
            <option value="admin">🔒 ADMIN ONLY</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 font-code">
            MESSAGE CONTENT
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={8}
            className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:border-cyan-400 focus:outline-none text-white resize-none"
            placeholder="Begin your cosmic transmission..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 font-space flex items-center justify-center"
        >
          <Save className="w-5 h-5 mr-2" />
          {editingPost ? 'UPDATE TRANSMISSION' : 'BROADCAST TRANSMISSION'}
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
