import React, { useState, useEffect } from 'react';
import { Plus, Edit, LogOut, Settings } from 'lucide-react';
import BlogPost from './BlogPost';
import AdminPanel from './AdminPanel';

interface CosmicBlogProps {
  userClearance: 'admin' | 'friend' | 'public';
  onLogout: () => void;
}

const CosmicBlog: React.FC<CosmicBlogProps> = ({ userClearance, onLogout }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    const demoPosts = [
      {
        id: '1',
        title: 'Welcome to the Digital Journal',
        content: 'A clean, minimal space for thoughts and ideas. This platform respects different levels of access while maintaining a beautiful, distraction-free reading experience.',
        author: 'Admin',
        date: new Date().toISOString(),
        clearanceLevel: 'public' as const
      },
      {
        id: '2',
        title: 'Building Better Digital Experiences',
        content: 'Design is not just what it looks like and feels like. Design is how it works. This principle guides every decision in creating meaningful digital experiences that serve users first.',
        author: 'Content Team',
        date: new Date(Date.now() - 86400000).toISOString(),
        clearanceLevel: 'friend' as const
      },
      {
        id: '3',
        title: 'System Architecture Notes',
        content: 'Internal documentation on the current system architecture. Performance metrics show excellent user engagement across all clearance levels with minimal overhead.',
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

  const handleCreatePost = (newPost: any) => {
    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
    setShowAdminPanel(false);
  };

  const handleUpdatePost = (updatedPost: any) => {
    const updatedPosts = posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    );
    savePosts(updatedPosts);
    setEditingPost(null);
    setShowAdminPanel(false);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      savePosts(updatedPosts);
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setShowAdminPanel(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-16 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Digital Journal
              </h1>
              <p className="text-gray-600">
                Thoughts, ideas, and insights
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                {userClearance}
              </span>
              
              {userClearance === 'admin' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`p-2 rounded-lg transition-colors focus-ring ${
                      isEditMode 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowAdminPanel(!showAdminPanel);
                      setEditingPost(null);
                    }}
                    className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors focus-ring"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors focus-ring"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Admin Panel */}
        {showAdminPanel && userClearance === 'admin' && (
          <div className="mb-12 animate-scale-in">
            <AdminPanel
              onCreatePost={handleCreatePost}
              onUpdatePost={handleUpdatePost}
              editingPost={editingPost}
              onCancelEdit={() => {
                setEditingPost(null);
                setShowAdminPanel(false);
              }}
            />
          </div>
        )}

        {/* Blog Posts */}
        <div className="space-y-12">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No posts yet</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <div
                key={post.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
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
        <footer className="mt-24 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            {posts.filter(post => {
              const clearanceLevels = { public: 0, friend: 1, admin: 2 };
              return clearanceLevels[userClearance] >= clearanceLevels[post.clearanceLevel];
            }).length} posts accessible
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CosmicBlog;
