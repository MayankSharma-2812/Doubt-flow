import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Sparkles, ArrowLeft, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function UnansweredDoubts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchUnansweredDoubts();
  }, []);

  const fetchUnansweredDoubts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts/unanswered', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch unanswered doubts", err);
      setPosts([]);
      toast.error('Failed to load doubts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 bg-mesh min-h-screen">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-primary-600 transition-all mb-8 group">
        <div className="p-2 rounded-xl bg-white border border-slate-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all text-slate-400 group-hover:text-primary-600">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Feed
      </Link>

      <div className="glass rounded-3xl p-8 mb-10 border-white/50 bg-gradient-to-br from-indigo-600 to-primary-700 text-white shadow-xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110 group-hover:rotate-12">
            <Sparkles className="w-32 h-32" />
         </div>
         <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
               <Inbox className="w-8 h-8 text-white" />
            </div>
            <div>
               <h1 className="text-3xl font-black tracking-tight mb-1">Unanswered Doubts</h1>
               <p className="text-indigo-100 font-medium opacity-90">Help your peers by solving open doubts and earn coins.</p>
            </div>
         </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
             <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          <div className="flex flex-col gap-8 animate-slide-up pb-20">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-16 text-center border-white/50 bg-white/50">
             <h2 className="text-xl font-black text-slate-800 mb-2">You've cleared everything!</h2>
             <p className="text-slate-500 font-medium">There are no open doubts right now. Excellent work team.</p>
          </div>
        )}
      </div>
    </div>
  );
}
