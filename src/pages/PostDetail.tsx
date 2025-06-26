
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, Star } from 'lucide-react';
import PasswordGate from '../components/PasswordGate';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Post not found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  if (!canView()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-lg text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">You don't have sufficient clearance to view this content.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to feed
          </button>
        </div>

        {/* Post Content */}
        <article className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Post Header */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              {getClearanceIcon(post.clearanceLevel)}
              <span className="text-sm font-medium text-gray-600 capitalize">
                {post.clearanceLevel} access
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="font-medium">{post.author}</span>
              <time>{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</time>
            </div>
          </div>

          {/* Post Body */}
          <div className="px-8 py-8">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {post.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
