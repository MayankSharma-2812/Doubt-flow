import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, CheckCircle2, User, Clock, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { timeAgo } from '../utils/timeAgo';
import toast from 'react-hot-toast';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHint, setAiHint] = useState('');
  const { token, user, fetchProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPostData();
  }, [id]);

  const fetchPostData = async () => {
    try {
      const postRes = await fetch(`http://localhost:5000/api/posts`);
      const allPosts = await postRes.json();
      const foundPost = allPosts.find(p => p.id === id);
      setPost(foundPost);

      const commentRes = await fetch(`http://localhost:5000/api/comments/${id}`);
      const commentData = await commentRes.json();
      setComments(commentData);
    } catch (err) {
      console.error("Failed to fetch post detail", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setBtnLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ content: newComment, postId: id }),
      });
      if (res.ok) {
        setNewComment('');
        toast.success(isDoubt ? 'Answer posted!' : 'Comment added!', { icon: '💬' });
        fetchPostData();
        fetchProfile(); // Update coins
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to post comment');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleGetHint = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/game/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: `Context: ${post?.title}. Details: ${post?.content}` }),
      });
      const data = await res.json();
      setAiHint(data.hint);
      toast.success('AI Hint generated!', { icon: '✨' });
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate hint');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSolve = async (commentUserId) => {
    try {
      const res = await fetch('http://localhost:5000/api/comments/solve', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ postId: id, userId: commentUserId }),
      });
      if (res.ok) {
        toast.success('Doubt marked as solved!', { icon: '✅' });
        fetchPostData();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to mark as solved');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-mesh">
    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
  </div>;

  if (!post) return <div className="min-h-screen flex flex-col items-center justify-center bg-mesh">
    <h2 className="text-2xl font-bold text-slate-700">Post not found</h2>
    <Link to="/" className="btn-primary mt-4">Back to Feed</Link>
  </div>;

  const isOwner = user?.id === post.userId;
  const isDoubt = post.type === 'DOUBT';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 bg-mesh min-h-screen">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-primary-600 transition-all mb-8 group">
        <div className="p-2 rounded-xl bg-white border border-slate-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all text-slate-400 group-hover:text-primary-600">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Feed
      </Link>

      <div className="space-y-8">
        {/* Post Content Area */}
        <article className="glass rounded-3xl p-8 md:p-10 shadow-xl border-white/50">
          <div className="flex items-center justify-between mb-8">
            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
              isDoubt 
                ? 'bg-rose-100 text-rose-600 border border-rose-200 shadow-sm' 
                : 'bg-indigo-100 text-indigo-600 border border-indigo-200 shadow-sm'
            }`}>
              {post.type}
            </span>
            
            {post.isSolved && (
              <div className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10">
                <CheckCircle2 className="w-3 h-3" />
                Doubt Solved
              </div>
            )}
          </div>

          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg mb-10">
            {post.content}
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center shadow-sm">
                <User className="w-6 h-6 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Author</span>
                <span className="text-md font-black text-slate-700">{post.user?.name || 'Anonymous User'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <span className="block text-[10px] text-slate-400 font-black uppercase tracking-widest">Posted</span>
                <span className="text-xs font-bold text-slate-500 italic">
                  {timeAgo(post.createdAt)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>
        </article>

        {/* AI Action Area for Doubts */}
        {isDoubt && !post.isSolved && (
           <div className="px-8 py-6 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 flex flex-col pointer-events-auto transition-all">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Sparkles className="w-6 h-6 text-indigo-200" />
                  </div>
                  <div>
                    <h4 className="font-black text-xl tracking-tight">Stuck with this doubt?</h4>
                    <p className="text-indigo-100 font-medium text-sm">Get an AI-generated hint to nudge you in the right direction.</p>
                  </div>
                </div>
                {!aiHint && (
                  <button onClick={handleGetHint} disabled={aiLoading} className="w-full md:w-auto px-8 py-3 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                    {aiLoading ? 'Thinking...' : 'Get AI Hint (10 Coins)'}
                  </button>
                )}
              </div>
              
              {aiHint && (
                <div className="mt-4 p-6 bg-white/10 rounded-2xl border border-white/20 text-indigo-50 font-medium italic leading-relaxed animate-fade-in shadow-inner">
                   <div className="flex items-center gap-2 mb-3 text-indigo-200 font-bold text-xs uppercase tracking-widest not-italic">
                      <Sparkles className="w-4 h-4" /> AI Hint Decrypted
                   </div>
                   {aiHint}
                </div>
              )}
           </div>
        )}

        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-slate-300" />
            {isDoubt ? 'Answers & Comments' : 'Discussion'}
            <span className="text-sm font-bold text-slate-400">({comments.length})</span>
          </h2>

          <div className="space-y-6 relative ml-4">
            {/* Thread line */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-200 -ml-8 rounded-full" />

            {comments.map((comment) => (
              <div key={comment.id} className={`glass p-6 rounded-3xl border-white/40 shadow-sm relative transition-all ${
                post.solvedBy === comment.userId ? 'ring-4 ring-emerald-500/20 bg-emerald-50/10' : ''
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <span className="block text-sm font-black text-slate-800 tracking-tight">{comment.user?.name || 'Contributor'}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        {timeAgo(comment.createdAt)}
                      </span>
                    </div>
                  </div>

                  {isOwner && isDoubt && !post.isSolved && (
                    <button 
                      onClick={() => handleSolve(comment.userId)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all transform active:scale-95 shadow-sm"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Mark Solved
                    </button>
                  )}

                  {post.solvedBy === comment.userId && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Best Answer
                    </div>
                  )}
                </div>

                <div className="text-slate-600 font-medium leading-relaxed">
                  {comment.content}
                </div>
              </div>
            ))}
          </div>

          {/* New Comment Input */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <form onSubmit={handleAddComment} className="flex flex-col gap-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isDoubt ? 'Your Answer' : 'Your Comment'}</label>
               <div className="relative group">
                 <textarea
                   rows={3}
                   placeholder={isDoubt ? "Share your solution here..." : "Add to the discussion..."}
                   className="input-field py-4 min-h-[120px] resize-none"
                   value={newComment}
                   onChange={(e) => setNewComment(e.target.value)}
                 />
                 <button 
                   type="submit" 
                   disabled={btnLoading || !newComment.trim()} 
                   className="absolute bottom-4 right-4 p-3 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none"
                 >
                   {btnLoading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                   ) : (
                      <Send className="w-5 h-5" />
                   )}
                 </button>
               </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
