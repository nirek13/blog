
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, Star } from 'lucide-react';
import PasswordGate from '../components/PasswordGate';
import CommentSystem from '../components/CommentSystem';
import { renderMarkdown } from '../utils/markdownRenderer';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [userClearance, setUserClearance] = useState<'admin' | 'friend' | 'public' | null>(
    localStorage.getItem('user-clearance') as any
  );
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const savedPosts = localStorage.getItem('cosmic-blog-posts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const foundPost = posts.find((p: any) => p.id === slug);
      setPost(foundPost);
    }
  }, [slug]);

  const handleAccess = (clearanceLevel: 'admin' | 'friend' | 'public') => {
    setUserClearance(clearanceLevel);
    localStorage.setItem('user-clearance', clearanceLevel);
  };

  const canView = () => {
    if (!post || !userClearance) return false;
    const clearanceLevels = { public: 0, friend: 1, admin: 2 };
    return clearanceLevels[userClearance] >= clearanceLevels[post.clearanceLevel];
  };

  const getClearanceIcon = (level: string) => {
    switch (level) {
      case 'admin': return <Lock className="w-4 h-4 text-red-500" />;
      case 'friend': return <Star className="w-4 h-4 text-amber-500" />;
      default: return <Eye className="w-4 h-4 neon-accent" />;
    }
  };

  const getClearanceColor = (level: string) => {
    switch (level) {
      case 'admin': return 'text-red-500 bg-red-50 border-red-200';
      case 'friend': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-blue-500 bg-blue-50 border-blue-200';
    }
  };

  if (!userClearance) {
    return <PasswordGate onAccess={handleAccess} />;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel rounded-2xl p-12 text-center max-w-md">
          <h1 className="text-2xl font-bold futuristic-heading mb-4">Post not found</h1>
          <button
            onClick={() => navigate('/')}
            className="accent-button px-6 py-3 rounded-xl hover-lift"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  if (!canView()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel rounded-2xl p-12 text-center max-w-md">
          <Lock className="w-16 h-16 text-slate-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold futuristic-heading mb-4">Access Restricted</h1>
          <p className="secondary-text mb-8">You don't have sufficient clearance to view this content.</p>
          <button
            onClick={() => navigate('/')}
            className="accent-button px-6 py-3 rounded-xl hover-lift"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors mb-8 hover-lift p-2 -ml-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to posts</span>
          </button>
        </div>

        {/* Post Content */}
        <article className="glass-card rounded-2xl p-8 lg:p-12">
          {/* Post Meta */}
          <div className="flex items-center space-x-3 mb-8">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-medium ${getClearanceColor(post.clearanceLevel)}`}>
              {getClearanceIcon(post.clearanceLevel)}
              <span className="uppercase tracking-wide">
                {post.clearanceLevel}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm secondary-text mb-12">
            <span className="font-medium text-slate-700">{post.author}</span>
            <span>•</span>
            <time>{new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</time>
          </div>

          {/* Post Body */}
          <div className="mb-16">
            {renderMarkdown(post.content, userClearance)}
          </div>

          {/* Comments */}
          <CommentSystem postId={post.id} userClearance={userClearance} />
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
