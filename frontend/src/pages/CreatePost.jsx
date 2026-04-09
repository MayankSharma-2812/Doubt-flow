import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, BookOpen, MessageCircleQuestion, Tag, ArrowLeft, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('NOTE'); // NOTE or DOUBT
  const [loading, setLoading] = useState(false);
  const [tagLoading, setTagLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [priority, setPriority] = useState('NORMAL');
  const [error, setError] = useState('');
  
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleGenerateTags = async () => {
    if (!title && !content) {
      toast.error('Add title or content first!');
      return;
    }
    setTagLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/posts/generate-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (data.tags) {
        setTags(data.tags);
        toast.success('AI Tags generated!', { icon: '✨' });
      }
    } catch (err) {
      toast.error('AI tagging failed');
    } finally {
      setTagLoading(false);
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

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
        body: JSON.stringify({ title, content, type, tags, priority }),
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

          {/* Priority Selection - Only for Doubts */}
          {type === 'DOUBT' && (
            <div className="animate-fade-in">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Set Priority</label>
              <div className="grid grid-cols-3 gap-3">
                {['EASY', 'NORMAL', 'URGENT'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                      priority === p 
                        ? p === 'URGENT' ? 'border-red-500 bg-red-50 text-red-600' :
                          p === 'EASY' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' :
                          'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                   <Tag className="w-3 h-3" />
                   Smart Tags
                </label>
                <button
                  type="button"
                  onClick={handleGenerateTags}
                  disabled={tagLoading}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-all group"
                >
                  {tagLoading ? (
                    <div className="w-3 h-3 border border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                  )}
                  {tagLoading ? 'Analyzing...' : 'AI Auto-Tag'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                {tags.length > 0 ? (
                  tags.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 shadow-sm animate-fade-in">
                       {tag}
                       <button onClick={() => removeTag(i)} type="button" className="text-slate-300 hover:text-rose-500 transition-colors">
                          <X className="w-3 h-3" />
                       </button>
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-300 font-medium italic ml-2 mt-1">
                    No tags generated yet. Click AI Auto-Tag!
                  </span>
                )}
              </div>
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