import { CheckCircle2, User, ArrowRight, Heart, MessageSquare, Share2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../utils/timeAgo';
import toast from 'react-hot-toast';

export default function PostCard({ post }) {
  const isDoubt = post.type === 'DOUBT';
  const { token } = useAuth();
  
  // Local state for instant feedback
  const [upvotes, setUpvotes] = useState(post._count?.upvotes || 0);
  const [isUpvoted, setIsUpvoted] = useState(false); // We don't have isUpvoted from backend currently, just keep Local state naive
  const [isAnimating, setIsAnimating] = useState(false);

  const handleUpvote = async (e) => {
    e.preventDefault();
    if (isAnimating) return;
    
    // Optimistic UI updates
    setIsUpvoted(!isUpvoted);
    setUpvotes(prev => isUpvoted ? prev - 1 : prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    try {
      await fetch(`http://localhost:5000/api/posts/${post.id}/upvote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(isUpvoted ? 'Upvote removed' : 'Post upvoted!', {
        icon: isUpvoted ? '📉' : '🔥',
      });
    } catch (err) {
      console.error("Failed to upvote", err);
      toast.error('Failed to update upvote');
    }
  };

  return (
    <div className={`glass rounded-3xl p-6 md:p-8 card-hover group flex flex-col border-white/40 shadow-lg shadow-slate-200/50 backdrop-blur-xl transition-all duration-300`}>
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-white border-2 border-white shadow-sm flex items-center justify-center p-0.5 relative overflow-hidden">
             <User className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-800">{post.user?.name || 'Anonymous'}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Scholar</span>
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-tight">
              {timeAgo(post.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {post.isSolved && (
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Solved
            </div>
          )}
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
            isDoubt 
              ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-100/50' 
              : 'bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-indigo-100/50'
          }`}>
            {post.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <Link to={`/post/${post.id}`} className="block mb-6">
        <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-primary-600 transition-colors leading-tight">
          {post.title}
        </h3>
        <p className="text-slate-600 text-[15px] line-clamp-4 leading-relaxed font-medium">
          {post.content}
        </p>
      </Link>

      {/* Action Bar */}
      <div className="pt-4 border-t border-slate-100 flex items-center gap-6 md:gap-8 mt-auto">
        <button 
          onClick={handleUpvote}
          className={`flex items-center gap-2 text-sm font-black transition-all ${isUpvoted ? 'text-rose-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <div className={`p-2 rounded-full transition-all ${isUpvoted ? 'bg-rose-50 border border-rose-100' : 'hover:bg-slate-100 border border-transparent'} ${isAnimating ? 'scale-125' : 'scale-100'}`}>
             <Heart className={`w-5 h-5 ${isUpvoted ? 'fill-rose-500' : ''}`} />
          </div>
          <span className={`${isAnimating ? 'animate-bounce' : ''}`}>{upvotes} Upvotes</span>
        </button>

        <Link to={`/post/${post.id}`} className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-indigo-600 transition-all group/comment">
          <div className="p-2 rounded-full group-hover/comment:bg-indigo-50 border border-transparent group-hover/comment:border-indigo-100 transition-all">
             <MessageSquare className="w-5 h-5 group-hover/comment:fill-indigo-100" />
          </div>
          {post._count?.comments || 0} Answers
        </Link>

        {isDoubt && !post.isSolved && (
          <Link to={`/post/${post.id}`} className="flex items-center gap-2 text-sm font-black text-amber-500 hover:text-amber-600 transition-all ml-auto">
             <Sparkles className="w-4 h-4" />
             Solve
          </Link>
        )}
      </div>
    </div>
  );
}
