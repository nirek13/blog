
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save, X } from 'lucide-react';

interface MarkdownEditorProps {
  initialContent?: string;
  onSave: (content: string, title: string, clearanceLevel: 'admin' | 'friend' | 'public') => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ 
  initialContent = '', 
  onSave, 
  onCancel,
  isEditing = false 
}) => {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState('');
  const [clearanceLevel, setClearanceLevel] = useState<'admin' | 'friend' | 'public'>('public');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEditing && initialContent) {
      // Extract title from first line if it's a heading
      const lines = initialContent.split('\n');
      const firstLine = lines[0];
      if (firstLine.startsWith('# ')) {
        setTitle(firstLine.substring(2));
        setContent(lines.slice(1).join('\n'));
      } else {
        setContent(initialContent);
      }
    }
  }, [initialContent, isEditing]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    const fullContent = `# ${title}\n\n${content}`;
    onSave(fullContent, title, clearanceLevel);
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown renderer for preview
    let html = text
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-slate-900 mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-slate-900 mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-slate-900 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:text-blue-600 underline">$1</a>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/:::admin-only\n([\s\S]*?)\n:::/g, '<div class="border-l-4 border-red-500 pl-4 my-4 bg-red-50/50"><p class="text-sm text-red-600 font-medium mb-2">Admin Only</p>$1</div>')
      .replace(/:::friend\n([\s\S]*?)\n:::/g, '<div class="border-l-4 border-amber-500 pl-4 my-4 bg-amber-50/50"><p class="text-sm text-amber-600 font-medium mb-2">Friend Access</p>$1</div>');
    
    return `<div class="prose prose-slate max-w-none"><p class="mb-4">${html}</p></div>`;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl futuristic-heading flex items-center">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="futuristic-button px-3 py-2 rounded-xl flex items-center space-x-2"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm">{showPreview ? 'Edit' : 'Preview'}</span>
          </button>
          <button
            onClick={onCancel}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium secondary-text mb-2">
            Post Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 glass-card rounded-xl focus:neon-border focus-ring transition-all"
            placeholder="Enter post title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium secondary-text mb-2">
            Access Level
          </label>
          <select
            value={clearanceLevel}
            onChange={(e) => setClearanceLevel(e.target.value as 'admin' | 'friend' | 'public')}
            className="w-full px-4 py-3 glass-card rounded-xl focus:neon-border focus-ring transition-all"
          >
            <option value="public">🌐 Public Access</option>
            <option value="friend">⭐ Friend Access</option>
            <option value="admin">🔒 Admin Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className={showPreview ? 'hidden lg:block' : ''}>
          <label className="block text-sm font-medium secondary-text mb-2">
            Content (Markdown)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="w-full px-4 py-3 glass-card rounded-xl focus:neon-border focus-ring transition-all resize-none font-mono text-sm"
            placeholder="Write your post in Markdown...

**Bold text** or *italic text*
[Link text](https://example.com)
`inline code`

:::admin-only
This content is only visible to admins
:::

:::friend
This content is visible to friends and admins
:::"
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="lg:block">
            <label className="block text-sm font-medium secondary-text mb-2">
              Preview
            </label>
            <div className="glass-card rounded-xl p-4 h-96 overflow-y-auto">
              {title && (
                <h1 className="text-2xl font-bold text-slate-900 mb-4">{title}</h1>
              )}
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className="accent-button px-6 py-3 rounded-xl flex items-center space-x-2 font-medium"
          disabled={!title.trim() || !content.trim()}
        >
          <Save className="w-4 h-4" />
          <span>{isEditing ? 'Update Post' : 'Publish Post'}</span>
        </button>
      </div>
    </div>
  );
};

export default MarkdownEditor;
