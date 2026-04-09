import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { User, Coins, Flame, Trophy, LayoutGrid, MessageCircleQuestion, Sparkles, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, token, fetchProfile } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('POSTS'); // POSTS, CONTRIBUTIONS

  const fetchMyPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMyPosts(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load your posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyPosts();
      fetchProfile();
    }
  }, [token]);

  // Mock stats - in a real app these would come from the backend's user object or a stats endpoint
  const solvedCount = myPosts.filter(p => p.isSolved).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 bg-mesh min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass rounded-[40px] p-8 text-center border-white/50 relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-br from-primary-600 to-indigo-600 -z-10" />
            <div className="w-24 h-24 rounded-3xl bg-white border-4 border-slate-50 flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10">
              <User className="w-12 h-12 text-slate-300" />
            </div>
            
            <h1 className="text-2xl font-black text-slate-800 mb-1 leading-tight">{user?.name}</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Scholar Level 1</p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
               <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                  <span className="block text-2xl font-black text-slate-800">{user?.streak || 0}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day Streak</span>
               </div>
               <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                  <span className="block text-2xl font-black text-slate-800">{user?.coins || 0}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Coins</span>
               </div>
            </div>

            <button className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-900/10">
               Edit Profile
            </button>
          </div>

          <div className="glass rounded-[32px] p-8 border-white/50 bg-white/50">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Achievements
             </h3>
             <div className="space-y-4">
                <div className="flex items-center gap-4 group cursor-help">
                   <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                      <Flame className="w-6 h-6 text-amber-500" />
                   </div>
                   <div>
                      <span className="block text-sm font-extrabold text-slate-700">Early Bird</span>
                      <span className="text-[10px] font-bold text-slate-400">Post 5 times in a week</span>
                   </div>
                </div>
                <div className="flex items-center gap-4 group cursor-help">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                      <Sparkles className="w-6 h-6 text-indigo-500" />
                   </div>
                   <div>
                      <span className="block text-sm font-extrabold text-slate-700">Solution Master</span>
                      <span className="text-[10px] font-bold text-slate-400">Solve a doubt for a peer</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
             <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 w-full md:w-auto">
                <button 
                  onClick={() => setActiveTab('POSTS')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'POSTS' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  My Posts
                </button>
                <button 
                  disabled
                  title="Coming soon"
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all text-slate-300 opacity-50 cursor-not-allowed`}
                >
                  <MessageCircleQuestion className="w-4 h-4" />
                  My Solutions
                </button>
             </div>

             <div className="flex items-center gap-6">
                <div className="text-center">
                   <span className="block text-2xl font-black text-slate-800">{myPosts.length}</span>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Posts Created</span>
                </div>
                <div className="w-[1px] h-10 bg-slate-200" />
                <div className="text-center">
                   <span className="block text-2xl font-black text-slate-800 tracking-tight">{solvedCount}</span>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Solved</span>
                </div>
             </div>
          </div>

          <div className="space-y-8 min-h-[400px]">
            {loading ? (
              <div className="flex flex-col gap-6">
                 {[1, 2].map(i => <div key={i} className="glass h-48 rounded-3xl animate-pulse bg-white/40" />)}
              </div>
            ) : myPosts.length > 0 ? (
              <div className="flex flex-col gap-8 animate-slide-up pb-20">
                {myPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="glass rounded-[40px] p-20 flex flex-col items-center justify-center text-center opacity-80">
                 <div className="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center mb-8">
                    <BookOpen className="w-12 h-12 text-slate-300" />
                 </div>
                 <h2 className="text-2xl font-black text-slate-700 mb-2">Wait, it's empty here!</h2>
                 <p className="text-slate-400 font-medium max-w-sm leading-relaxed mb-8">
                    You haven't shared any notes or asked any doubts yet. Your profile looks much cooler once you start contributing!
                 </p>
                 <button onClick={() => window.location.href = '/create'} className="btn-primary">Start Contributing</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
