
import React, { useState, useEffect } from 'react';
import { MessageCircle, Reply, Heart } from 'lucide-react';

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
  parentId?: string;
  likes: number;
  clearanceLevel: 'admin' | 'friend' | 'public';
}

interface CommentSystemProps {
  postId: string;
  userClearance: 'admin' | 'friend' | 'public';
}

const CommentSystem: React.FC<CommentSystemProps> = ({ postId, userClearance }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    const savedComments = localStorage.getItem(`comments-${postId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [postId]);

  const saveComments = (updatedComments: Comment[]) => {
    setComments(updatedComments);
    localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments));
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      author: userClearance === 'admin' ? 'Admin' : userClearance === 'friend' ? 'Friend' : 'Guest',
      content: newComment,
      date: new Date().toISOString(),
      likes: 0,
      clearanceLevel: userClearance
    };

    const updatedComments = [...comments, comment];
    saveComments(updatedComments);
    setNewComment('');
  };

  const handleSubmitReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: Date.now().toString(),
      postId,
      author: userClearance === 'admin' ? 'Admin' : userClearance === 'friend' ? 'Friend' : 'Guest',
      content: replyContent,
      date: new Date().toISOString(),
      parentId,
      likes: 0,
      clearanceLevel: userClearance
    };

    const updatedComments = [...comments, reply];
    saveComments(updatedComments);
    setReplyContent('');
    setReplyingTo(null);
  };

  const canViewComment = (comment: Comment) => {
    const clearanceLevels = { public: 0, friend: 1, admin: 2 };
    return clearanceLevels[userClearance] >= clearanceLevels[comment.clearanceLevel];
  };

  const topLevelComments = comments.filter(c => !c.parentId && canViewComment(c));
  const getReplies = (commentId: string) => 
    comments.filter(c => c.parentId === commentId && canViewComment(c));

  return (
    <div className="mt-16 border-t border-gray-200 pt-8">
      <div className="flex items-center space-x-2 mb-8">
        <MessageCircle className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({topLevelComments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-ring"
        >
          Post Comment
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {topLevelComments.map((comment) => (
          <div key={comment.id} className="animate-fade-in">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {comment.author[0]}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{comment.author}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{comment.content}</p>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>{comment.likes}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                      rows={2}
                    />
                    <div className="flex space-x-2 mt-2">
                      <button
                        type="submit"
                        disabled={!replyContent.trim()}
                        className="px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                      >
                        Reply
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="px-3 py-1.5 text-gray-600 text-sm hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Replies */}
                {getReplies(comment.id).length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
                    {getReplies(comment.id).map((reply) => (
                      <div key={reply.id} className="flex space-x-3">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {reply.author[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 text-sm">{reply.author}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(reply.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {topLevelComments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSystem;
