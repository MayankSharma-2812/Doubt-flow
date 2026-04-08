import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, BookOpen, MessageCircleQuestion, Tag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('NOTE'); // NOTE or DOUBT
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ title, content, type }),
      });
      
      if (res.ok) {
        navigate('/');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create post');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 bg-mesh min-h-screen">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-primary-600 transition-all mb-8 group">
        <div className="p-2 rounded-xl bg-white border border-slate-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Feed
      </Link>

      <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl border-white/40">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Create New Post</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Share your knowledge or get help from the community. Choose your post type below.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-500 px-4 py-3 rounded-xl mb-8 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Post Type Toggle */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType('NOTE')}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all group ${
                type === 'NOTE' 
                  ? 'border-indigo-500 bg-indigo-50/50 ring-4 ring-indigo-500/10' 
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className={`p-3 rounded-xl transition-all ${
                type === 'NOTE' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
              }`}>
                <BookOpen className="w-6 h-6" />
              </div>
              <span className={`font-black uppercase tracking-widest text-xs ${type === 'NOTE' ? 'text-indigo-600' : 'text-slate-400'}`}>
                Share a Note
              </span>
            </button>

            <button
              type="button"
              onClick={() => setType('DOUBT')}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all group ${
                type === 'DOUBT' 
                  ? 'border-rose-500 bg-rose-50/50 ring-4 ring-rose-500/10' 
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className={`p-3 rounded-xl transition-all ${
                type === 'DOUBT' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
              }`}>
                <MessageCircleQuestion className="w-6 h-6" />
              </div>
              <span className={`font-black uppercase tracking-widest text-xs ${type === 'DOUBT' ? 'text-rose-600' : 'text-slate-400'}`}>
                Ask a Doubt
              </span>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Title</label>
              <input
                type="text"
                required
                placeholder={type === 'NOTE' ? "e.g. Summary of React Hooks" : "e.g. Why is my useEffect looping?"}
                className="input-field text-lg font-bold h-14"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Content</label>
              <textarea
                required
                rows={6}
                placeholder={type === 'NOTE' ? "Describe the key points..." : "Describe your problem in detail..."}
                className="input-field py-4 resize-none leading-relaxed"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" disabled={loading} className="w-full btn-primary h-16 text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3">
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Publish Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}