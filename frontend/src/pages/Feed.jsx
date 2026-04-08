import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PostCard from '../components/PostCard';
import { Search, MessageCircleQuestion, BookOpen, LayoutGrid, ChevronRight, Sparkles, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, NOTE, DOUBT
  const [searchQuery, setSearchQuery] = useState('');
  const [bonusLoading, setBonusLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token, fetchProfile } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesFilter = filter === 'ALL' || p.type === filter;
    const matchesSearch = !searchQuery.trim() || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleEarnBonus = async () => {
    setBonusLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/game/bonus', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
         toast.success('Bonus coins earned!', { icon: '💰' });
         fetchProfile(); // update coins globally
      }
    } catch(err) {
      console.error(err);
      toast.error('Failed to earn bonus');
    } finally {
      setBonusLoading(false);
    }
  };
  const unansweredDoubts = posts.filter(p => p.type === 'DOUBT' && !p.isSolved).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-mesh min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content */}
        <div className="flex-grow">
          {/* Header & Search */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4 flex items-center gap-3">
              Learning Feed
              <div className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-black uppercase tracking-widest border border-primary-200">
                Live
              </div>
            </h1>
            <p className="text-slate-500 font-medium max-w-xl leading-relaxed mb-8">
              Explore doubts and notes shared by your community. Help others to earn coins and build your streak!
            </p>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-md">
                <input 
                  type="text" 
                  placeholder="Search topics, questions, or notes..." 
                  className="input-field pl-12 h-14"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>

              <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 w-full md:w-auto">
                <button 
                  onClick={() => setFilter('ALL')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${filter === 'ALL' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  All
                </button>
                <button 
                  onClick={() => setFilter('NOTE')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${filter === 'NOTE' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <BookOpen className="w-4 h-4" />
                  Notes
                </button>
                <button 
                  onClick={() => setFilter('DOUBT')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${filter === 'DOUBT' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <MessageCircleQuestion className="w-4 h-4" />
                  Doubts
                </button>
              </div>
            </div>
          </div>
          {/* Inline Composer */}
          <div className="glass rounded-3xl p-4 md:p-6 mb-8 border-white/50 bg-white/80 flex items-center gap-4 cursor-text group transition-all hover:bg-white hover:shadow-xl shadow-md" onClick={() => window.location.href = '/create'}>
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="w-full bg-slate-100 rounded-full h-12 px-6 flex items-center text-slate-400 font-medium group-hover:bg-slate-50 border border-slate-200 transition-colors cursor-text">
              Start a post, or share a doubt...
            </div>
          </div>

          {/* Posts Grid -> List */}
          {loading ? (
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass h-48 rounded-3xl animate-pulse bg-white/40" />
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="flex flex-col gap-8 pb-20 animate-slide-up">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-3xl p-16 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No posts found yet</h3>
              <p className="text-slate-400 font-medium max-w-sm">
                Be the first to share a note or ask a doubt to start the conversation!
              </p>
              <Link to="/create" className="btn-primary mt-8">Create First Post</Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col gap-6">
          <div className="glass rounded-3xl p-6 border-white/50 bg-gradient-to-br from-white/80 to-white/40">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Need help?
            </h3>
            
            <div className="space-y-4">
              {unansweredDoubts.length > 0 ? (
                unansweredDoubts.map(doubt => (
                  <Link 
                    key={doubt.id} 
                    to={`/post/${doubt.id}`}
                    className="block group p-4 bg-white/50 rounded-2xl border border-slate-100 hover:border-primary-200 hover:bg-white transition-all shadow-sm"
                  >
                    <p className="text-sm font-bold text-slate-700 mb-2 truncate group-hover:text-primary-600 transition-colors">
                      {doubt.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-full">unsolved</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm font-semibold text-slate-400 italic py-4">No unanswered doubts right now. Good job community!</p>
              )}
            </div>
            
            <button 
              onClick={handleEarnBonus}
              disabled={bonusLoading}
              className="w-full mt-6 py-4 px-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              {bonusLoading ? "Earning..." : "Earn Bonus Coins"}
            </button>
          </div>

          <div className="glass rounded-3xl p-6 border-white/50 bg-indigo-600 text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-all duration-700" />
             <h3 className="text-xl font-black mb-2 relative z-10">AI Power</h3>
             <p className="text-indigo-100 text-sm font-medium mb-6 relative z-10 leading-relaxed">
               Stuck on a tricky concept? Use our AI hint system to guide you without giving the answer away!
             </p>
             <Link to="/dashboard" className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest inline-block relative z-10 shadow-lg shadow-indigo-900/20 active:scale-95 transition-all">
               Try AI Now
             </Link>
          </div>
        </aside>

      </div>
    </div>
  );
}