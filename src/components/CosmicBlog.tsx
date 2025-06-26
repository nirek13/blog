
import React, { useState, useEffect } from 'react';
import { Eye, Lock, Star, Plus, Edit, LogOut } from 'lucide-react';
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
        title: 'Welcome to Our Digital Sanctuary',
        content: 'Step into a world where thoughts flow freely and ideas take shape. This is your gateway to curated content, designed with intention and crafted with care. Every post here tells a story, shares an insight, or opens a door to new possibilities.',
        author: 'Content Curator',
        date: new Date().toISOString(),
        clearanceLevel: 'public' as const
      },
      {
        id: '2',
        title: 'Exclusive Insights for Friends',
        content: 'Welcome to the inner circle! Here we share deeper thoughts, behind-the-scenes glimpses, and exclusive content meant for those who\'ve earned our trust. Thank you for being part of this special community where authentic connections flourish.',
        author: 'Community Manager',
        date: new Date(Date.now() - 86400000).toISOString(),
        clearanceLevel: 'friend' as const
      },
      {
        id: '3',
        title: 'Admin Protocol: System Updates',
        content: 'Internal memo: All systems are operating at optimal performance. User engagement metrics show positive trends across all clearance levels. Remember to maintain content quality and ensure appropriate access controls are in place.',
        author: 'System Administrator',
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

  const getClearanceIcon = (level: string) => {
    switch (level) {
      case 'admin': return <Lock className="w-5 h-5 text-red-500" />;
      case 'friend': return <Star className="w-5 h-5 text-amber-500" />;
      default: return <Eye className="w-5 h-5 text-blue-500" />;
    }
  };

  const getClearanceName = (level: string) => {
    switch (level) {
      case 'admin': return 'Administrator';
      case 'friend': return 'Trusted Friend';
      default: return 'Guest';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="apple-card p-6 mb-8 animate-fade-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Digital Journal
              </h1>
              <p className="text-gray-600">
                Thoughtfully curated content for every clearance level
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl">
                {getClearanceIcon(userClearance)}
                <span className="font-medium text-gray-700 text-sm">
                  {getClearanceName(userClearance)}
                </span>
              </div>
              
              {userClearance === 'admin' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`px-4 py-2 rounded-2xl font-medium text-sm transition-all apple-button ${
                      isEditMode 
                        ? 'bg-orange-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Edit className="w-4 h-4 inline mr-2" />
                    {isEditMode ? 'Exit Edit' : 'Edit Mode'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowAdminPanel(!showAdminPanel);
                      setEditingPost(null);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-2xl font-medium text-sm apple-button"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    New Post
                  </button>
                </div>
              )}
              
              <button
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all apple-button"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Admin Panel */}
        {showAdminPanel && userClearance === 'admin' && (
          <div className="mb-8 animate-scale-in">
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
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="apple-card p-12 text-center animate-fade-up">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No posts yet</p>
              <p className="text-gray-500 text-sm mt-1">Check back soon for new content</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <div
                key={post.id}
                className="animate-fade-up"
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
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p className="mb-2">
            {posts.filter(post => {
              const clearanceLevels = { public: 0, friend: 1, admin: 2 };
              return clearanceLevels[userClearance] >= clearanceLevels[post.clearanceLevel];
            }).length} posts accessible with your current clearance
          </p>
          <p>Designed with care and attention to detail</p>
        </footer>
      </div>
    </div>
  );
};

export default CosmicBlog;
