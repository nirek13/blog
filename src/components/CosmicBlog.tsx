
import React, { useState, useEffect } from 'react';
import { Eye, Lock, Star, Plus, Edit } from 'lucide-react';
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
    // Load initial demo posts
    const demoPosts = [
      {
        id: '1',
        title: 'Welcome to the Cosmic Realm',
        content: 'Greetings, fellow travelers of the digital cosmos! This is a public transmission visible to all who enter our realm. The stars align to bring you stories from across the galaxy.',
        author: 'Cosmic Admin',
        date: new Date().toISOString(),
        clearanceLevel: 'public' as const
      },
      {
        id: '2',
        title: 'Secret Friend Gathering',
        content: 'Hey friends! 🌟 This message is for those with friend clearance. We\'re planning something special under the constellation of Andromeda. The stardust whispers secrets only we can hear.',
        author: 'Stellar Friend',
        date: new Date(Date.now() - 86400000).toISOString(),
        clearanceLevel: 'friend' as const
      },
      {
        id: '3',
        title: 'Admin Protocol: Galaxy Maintenance',
        content: 'CLASSIFIED: Weekly maintenance of the cosmic database. All quantum pathways will be recalibrated at 0300 GMT. Backup protocols are in effect. Remember: with great power comes great responsibility in the digital cosmos.',
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
    if (confirm('Are you sure you want to delete this transmission?')) {
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
      case 'admin': return <Lock className="w-5 h-5 text-red-400" />;
      case 'friend': return <Star className="w-5 h-5 text-yellow-400" />;
      default: return <Eye className="w-5 h-5 text-green-400" />;
    }
  };

  const getClearanceName = (level: string) => {
    switch (level) {
      case 'admin': return 'COSMIC ADMIN';
      case 'friend': return 'STELLAR FRIEND';
      default: return 'SPACE VISITOR';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden grain">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full twinkle-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: ['#00ff88', '#ff0088', '#0088ff', '#ffff00', '#ff8800'][Math.floor(Math.random() * 5)],
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
        
        {[...Array(8)].map((_, i) => (
          <div
            key={`blob-${i}`}
            className="absolute floating-blob opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 150}px`,
              height: `${Math.random() * 300 + 150}px`,
              background: `radial-gradient(circle, ${['#ff00ff', '#00ffff', '#ffff00', '#ff8800', '#8800ff'][Math.floor(Math.random() * 5)]}15 0%, transparent 70%)`,
              borderRadius: '50%',
              animationDelay: `${Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="glass rounded-2xl p-6 mb-8 border border-purple-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent font-space typewriter">
                COSMIC TRANSMISSIONS
              </h1>
              <p className="text-gray-400 mt-2 font-code">
                Broadcasting from the edge of the digital galaxy
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 glass rounded-lg border border-gray-600">
                {getClearanceIcon(userClearance)}
                <span className="font-code text-sm">{getClearanceName(userClearance)}</span>
              </div>
              
              {userClearance === 'admin' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`px-4 py-2 rounded-lg font-code text-sm transition-all ${
                      isEditMode 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Edit className="w-4 h-4 inline mr-2" />
                    {isEditMode ? 'EXIT EDIT' : 'EDIT MODE'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowAdminPanel(!showAdminPanel);
                      setEditingPost(null);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-code text-sm hover:from-purple-700 hover:to-cyan-700 transition-all"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    NEW POST
                  </button>
                </div>
              )}
              
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors font-code text-sm"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </header>

        {/* Admin Panel */}
        {showAdminPanel && userClearance === 'admin' && (
          <div className="mb-8">
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
        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center border border-gray-600">
              <Star className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 font-code">No transmissions detected in this sector...</p>
            </div>
          ) : (
            posts.map((post) => (
              <BlogPost
                key={post.id}
                post={post}
                userClearance={userClearance}
                isEditMode={isEditMode}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 font-code text-sm">
          <p>🌌 Powered by cosmic energy and digital stardust 🌌</p>
          <p className="mt-2">
            {posts.filter(post => {
              const clearanceLevels = { public: 0, friend: 1, admin: 2 };
              return clearanceLevels[userClearance] >= clearanceLevels[post.clearanceLevel];
            }).length} transmissions accessible with your clearance level
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CosmicBlog;
