
import React, { useState, useEffect } from 'react';
import { Plus, Edit, LogOut, PenTool } from 'lucide-react';
import BlogPost from './BlogPost';
import MarkdownEditor from './MarkdownEditor';

interface CosmicBlogProps {
  userClearance: 'admin' | 'friend' | 'public';
  onLogout: () => void;
}

const CosmicBlog: React.FC<CosmicBlogProps> = ({ userClearance, onLogout }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const canEdit = userClearance === 'admin';

  useEffect(() => {
    const demoPosts = [
      {
        id: '1',
        title: 'Welcome to the Digital Journal',
        content: `# Welcome to the Digital Journal

A clean, minimal space for thoughts and ideas. This platform respects different levels of access while maintaining a beautiful, distraction-free reading experience.

**Key Features:**
- Multi-tier access control
- Clean, modern interface
- Markdown support

:::friend
Thank you for being a trusted friend! You have access to special content.
:::

:::admin-only
This is admin-only content with sensitive information.
:::`,
        author: 'Admin',
        date: new Date().toISOString(),
        clearanceLevel: 'public' as const
      },
      {
        id: '2',
        title: 'Building Better Digital Experiences',
        content: `# Building Better Digital Experiences

Design is not just what it looks like and feels like. **Design is how it works.** This principle guides every decision in creating meaningful digital experiences that serve users first.

## Key Principles

- *Simplicity* over complexity
- **Functionality** over aesthetics
- User needs over business requirements

:::friend
As someone in our inner circle, you understand the importance of user-centered design.
:::`,
        author: 'Content Team',
        date: new Date(Date.now() - 86400000).toISOString(),
        clearanceLevel: 'friend' as const
      },
      {
        id: '3',
        title: 'System Architecture Notes',
        content: `# System Architecture Notes

Internal documentation on the current system architecture. Performance metrics show excellent user engagement across all clearance levels with minimal overhead.

## Technical Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Storage**: LocalStorage (demo)

:::admin-only
**Sensitive Information:**
- Database credentials stored in environment variables
- API keys rotated monthly
- Security audit scheduled for next quarter
:::`,
        author: 'System Admin',
        date: new Date(Date.now() - 172800000).toISOString(),
        clearanceLevel: 'admin' as const
      }
    ];
    
    const savedPosts = localStorage.getItem('cosmic-blog-posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(demoPosts);
      localStorage.setItem('cosmic-blog-posts', JSON.stringify(demoPosts));
    }
  }, []);

  const savePosts = (updatedPosts: any[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('cosmic-blog-posts', JSON.stringify(updatedPosts));
  };

  const handleCreatePost = (content: string, title: string, clearanceLevel: 'admin' | 'friend' | 'public') => {
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      clearanceLevel,
      author: 'Administrator',
      date: new Date().toISOString()
    };
    
    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
    setShowEditor(false);
    setEditingPost(null);
  };

  const handleUpdatePost = (content: string, title: string, clearanceLevel: 'admin' | 'friend' | 'public') => {
    if (!editingPost) return;
    
    const updatedPost = {
      ...editingPost,
      title,
      content,
      clearanceLevel
    };
    
    const updatedPosts = posts.map(post => 
      post.id === editingPost.id ? updatedPost : post
    );
    savePosts(updatedPosts);
    setEditingPost(null);
    setShowEditor(false);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      savePosts(updatedPosts);
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleCancelEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold futuristic-heading mb-3">
                Digital Journal
              </h1>
              <p className="secondary-text text-lg">
                Thoughts, ideas, and insights
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="glass-card px-4 py-2 rounded-full">
                <span className="text-sm font-medium neon-accent">
                  {userClearance}
                </span>
              </div>
              
              {canEdit && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`p-3 rounded-xl transition-all ${
                      isEditMode 
                        ? 'accent-button' 
                        : 'futuristic-button hover-lift'
                    }`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowEditor(!showEditor);
                      setEditingPost(null);
                    }}
                    className="accent-button p-3 rounded-xl hover-lift"
                  >
                    <PenTool className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <button
                onClick={onLogout}
                className="p-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all hover-lift"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Markdown Editor */}
        {showEditor && canEdit && (
          <MarkdownEditor
            initialContent={editingPost?.content}
            onSave={editingPost ? handleUpdatePost : handleCreatePost}
            onCancel={handleCancelEditor}
            isEditing={!!editingPost}
          />
        )}

        {/* Blog Posts */}
        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="glass-panel rounded-2xl p-12 max-w-md mx-auto">
                <p className="muted-text text-lg">No posts yet</p>
              </div>
            </div>
          ) : (
            posts.map((post, index) => (
              <div
                key={post.id}
                className="hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BlogPost
                  post={post}
                  userClearance={userClearance}
                  isEditMode={isEditMode}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-slate-200/50 text-center">
          <div className="glass-card rounded-xl px-6 py-4 inline-block">
            <p className="text-sm muted-text">
              {posts.filter(post => {
                const clearanceLevels = { public: 0, friend: 1, admin: 2 };
                return clearanceLevels[userClearance] >= clearanceLevels[post.clearanceLevel];
              }).length} posts accessible
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CosmicBlog;
