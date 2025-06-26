
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, Star } from 'lucide-react';
import PasswordGate from '../components/PasswordGate';
import CommentSystem from '../components/CommentSystem';

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
      default: return <Eye className="w-4 h-4 text-blue-500" />;
    }
  };

  if (!userClearance) {
    return <PasswordGate onAccess={handleAccess} />;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Post not found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors focus-ring"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  if (!canView()) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">You don't have sufficient clearance to view this content.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors focus-ring"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 focus-ring rounded-lg p-1 -ml-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
        </div>

        {/* Post Content */}
        <article className="animate-fade-in">
          {/* Post Meta */}
          <div className="flex items-center space-x-2 mb-6">
            {getClearanceIcon(post.clearanceLevel)}
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {post.clearanceLevel}
            </span>
          </div>
          
          <h1 className="text-3xl font-semibold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8">
            <span>{post.author}</span>
            <span>•</span>
            <time>{new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</time>
          </div>

          {/* Post Body */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {post.content.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-6 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Comments */}
          <CommentSystem postId={post.id} userClearance={userClearance} />
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
