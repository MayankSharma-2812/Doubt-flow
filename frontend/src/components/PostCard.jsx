import { CheckCircle2, User, ArrowRight, Heart, MessageSquare, Share2, Sparkles, Trash2, Tag, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../utils/timeAgo';
import toast from 'react-hot-toast';

export default function PostCard({ post }) {
  const isDoubt = post.type === 'DOUBT';
  const { token, user } = useAuth();
  const isOwner = user?.id === post.userId;
  const [isDeleted, setIsDeleted] = useState(false);
  const [isBoosted, setIsBoosted] = useState(post.isBoosted);
  
  // Reputation Tag Calculation
  const coins = post.user?.coins || 0;
  let repTag = { label: 'Beginner', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500' };
  if (coins >= 500) repTag = { label: 'Expert', color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100', dot: 'bg-fuchsia-500' };
  else if (coins >= 100) repTag = { label: 'Helper', color: 'text-blue-600 bg-blue-50 border-blue-100', dot: 'bg-blue-500' };

  // Priority badge config
  let priorityColor = 'bg-slate-50 text-slate-500 border-slate-200';
  if (post.priority === 'EASY') priorityColor = 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-emerald-100/50';
  if (post.priority === 'URGENT') priorityColor = 'bg-red-50 text-red-600 border-red-200 shadow-red-100/50';

  // Local state for instant feedback
  const [upvotes, setUpvotes] = useState(post._count?.upvotes || 0);
  const [isUpvoted, setIsUpvoted] = useState(false); // We don't have isUpvoted from backend currently, just keep Local state naive
  const [isAnimating, setIsAnimating] = useState(false);
  const [boosting, setBoosting] = useState(false);

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

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Post deleted");
        setIsDeleted(true);
      } else {
        toast.error("Failed to delete post");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  const handleBoost = async (e) => {
    e.preventDefault();
    if (isBoosted || boosting) return;
    if (!window.confirm("Spend 100 coins to boost this post?")) return;

    setBoosting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post.id}/boost`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Post Boosted! 🔥");
        setIsBoosted(true);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to boost post");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while boosting");
    } finally {
      setBoosting(false);
    }
  };

  if (isDeleted) return null;

  return (
    <div className={`glass rounded-3xl p-6 md:p-8 card-hover group flex flex-col backdrop-blur-xl transition-all duration-300 relative overflow-hidden ${
      isBoosted 
        ? 'border-amber-400/50 shadow-[0_0_40px_-10px_rgba(251,191,36,0.3)] bg-gradient-to-br from-white/90 to-amber-50/50' 
        : 'border-white/40 shadow-lg shadow-slate-200/50'
    }`}>
      {isBoosted && (
        <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
           <Rocket className="w-24 h-24 text-amber-500 transform rotate-45" />
        </div>
      )}
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-white border-2 border-white shadow-sm flex items-center justify-center p-0.5 relative overflow-hidden">
             <User className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-800">{post.user?.name || 'Anonymous'}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${repTag.color}`}>
                 <span className={`w-1.5 h-1.5 rounded-full ${repTag.dot}`}></span>
                 {repTag.label}
              </span>
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
          {post.type === 'DOUBT' && post.priority !== 'NORMAL' && (
             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${priorityColor}`}>
                {post.priority} Prio
             </span>
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

      {/* Tags section */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
           {post.tags.map((tag, i) => (
             <span key={i} className="text-[10px] font-bold text-slate-400 bg-slate-100/50 px-2 py-1 rounded-lg border border-slate-100 flex items-center gap-1 group-hover:bg-white transition-all">
                <Tag className="w-3 h-3 text-slate-300" />
                {tag}
             </span>
           ))}
        </div>
      )}

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

        {isOwner && !isBoosted && (
          <button 
            onClick={handleBoost}
            disabled={boosting}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 active:scale-95 transition-all ml-2"
          >
             {boosting ? 'Boosting...' : (
               <>
                 <Rocket className="w-3 h-3" />
                 Boost
               </>
             )}
          </button>
        )}

        {isOwner && (
          <button 
            onClick={handleDelete}
            className="p-2 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all ml-auto md:ml-2"
            title="Delete post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
