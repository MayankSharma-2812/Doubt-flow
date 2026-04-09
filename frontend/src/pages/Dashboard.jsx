import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Flame, Coins, Trophy, Sparkles, Brain, Lightbulb, User, ChevronRight, Play, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, token, fetchProfile } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizTopic, setQuizTopic] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('LEADERBOARD'); // LEADERBOARD, AI

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/game/leaderboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!quizTopic.trim()) return;
    setLoading(true);
    setAiResult(null);

    try {
      // Simulate "thinking"
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch('http://localhost:5000/api/game/quiz', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic: quizTopic }),
      });
      const data = await res.json();
      setAiResult({ type: 'QUIZ', content: data.quiz });
      toast.success('AI Quiz Generated!', { icon: '🧠' });
      fetchProfile(); // Update coins if needed
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleGetHint = async () => {
    setLoading(true);
    setAiResult(null);

    try {
      // Simulate "thinking"
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await fetch('http://localhost:5000/api/game/hint', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: "Top trending computer science topics" }),
      });
      const data = await res.json();
      setAiResult({ type: 'HINT', content: data.hint });
      toast.success('AI Hint Unlocked!', { icon: '💡' });
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error('Failed to unlock hint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-mesh min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-3xl p-8 relative overflow-hidden group border-white/50 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-all duration-700" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-black mb-1">{user?.name || 'Student'}</h1>
              <p className="text-indigo-100 font-medium text-sm mb-8 opacity-80 uppercase tracking-widest font-black">Free Learner Plan</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-center">
                   <div className="flex items-center justify-center gap-2 mb-1">
                     <Coins className="w-4 h-4 text-amber-300" />
                     <span className="text-2xl font-black tracking-tighter">{user?.coins || 0}</span>
                   </div>
                   <span className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">Doubt Coins</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-center">
                   <div className="flex items-center justify-center gap-2 mb-1">
                     <Flame className="w-4 h-4 text-orange-400" />
                     <span className="text-2xl font-black tracking-tighter">{user?.streak || 0}</span>
                   </div>
                   <span className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">Day Streak</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border-white/50 bg-white/80 overflow-hidden">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-2 flex items-center gap-2 outline-none">
                <Sparkles className="w-4 h-4 text-amber-500" />
                DoubtFlow Pro Logic
             </h3>
             <ul className="space-y-3">
               <li className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                   <CheckCircle2 className="w-4 h-4" />
                 </div>
                 <div className="text-xs font-bold text-slate-600">Solve Doubts: <span className="text-emerald-600">+20 Coins</span></div>
               </li>
               <li className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                   <Play className="w-4 h-4" />
                 </div>
                 <div className="text-xs font-bold text-slate-600">Daily Quiz: <span className="text-indigo-600">+50 Coins</span></div>
               </li>
             </ul>
          </div>

          <div className="glass rounded-3xl p-8 border-white/50 bg-gradient-to-br from-indigo-50 to-white shadow-xl">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-600" />
                Impact Dashboard
             </h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                         <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-600">Doubts Solved</span>
                   </div>
                   <span className="text-xl font-black text-slate-800">{user?.solvedCount || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                         <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-600">Total Influence</span>
                   </div>
                   <span className="text-xl font-black text-slate-800">
                      {Math.floor(((user?.coins || 0) / 10) + ((user?.solvedCount || 0) * 5))}
                   </span>
                </div>

                <div className="pt-4 border-t border-slate-100">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                      Top 15% of Scholars this week
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Dynamic Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 w-full md:w-auto self-start">
             <button 
               onClick={() => setActiveTab('LEADERBOARD')}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'LEADERBOARD' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <Trophy className="w-4 h-4" />
               Global Rankings
             </button>
             <button 
               onClick={() => setActiveTab('AI')}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'AI' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <Brain className="w-4 h-4" />
               AI Learning Tools
             </button>
          </div>

          <div className="mt-8">
            {activeTab === 'LEADERBOARD' ? (
               <div className="glass rounded-3xl p-8 border-white/50 overflow-hidden shadow-xl">
                 <div className="flex items-end justify-between mb-10">
                   <div>
                     <h2 className="text-3xl font-black text-slate-800 tracking-tight">Top Scholars</h2>
                     <p className="text-slate-500 font-semibold text-sm">Real-time leaderboard based on earned coins.</p>
                   </div>
                   <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
                     <Trophy className="w-8 h-8" />
                   </div>
                 </div>

                 <div className="space-y-4">
                   {leaderboard.map((u, i) => (
                     <div key={u.id} className="group relative flex items-center justify-between p-5 bg-white/40 border border-white/50 rounded-2xl hover:bg-white hover:shadow-lg transition-all transform hover:-translate-y-1">
                        <div className="flex items-center gap-5">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shadow-sm ${
                             i === 0 ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-500/10' : 
                             i === 1 ? 'bg-slate-100 text-slate-600' :
                             i === 2 ? 'bg-orange-100 text-orange-600' :
                             'bg-white text-slate-400'
                           }`}>
                             {i + 1}
                           </div>
                           <div className="flex flex-col">
                             <span className="font-black text-slate-800 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{u.name}</span>
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{u.streak} Day Streak 🔥</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-black flex items-center gap-2 shadow-lg shadow-slate-900/10 group-hover:bg-primary-600 group-hover:shadow-primary-500/20 transition-all">
                              <Coins className="w-3.5 h-3.5 text-amber-300" />
                              {u.coins}
                           </div>
                           <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-primary-300 transition-all" />
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
            ) : (
               <div className="space-y-8 animate-fade-in">
                  {/* AI Section Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass rounded-3xl p-8 border-white/50 flex flex-col items-center text-center group hover:bg-white transition-all shadow-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all group-hover:shadow-lg group-hover:shadow-indigo-500/10">
                         <Brain className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-2">Practice Quiz</h3>
                      <p className="text-slate-500 font-medium text-sm mb-8 px-4 leading-relaxed">Enter any topic and get 3 AI-curated MCQ questions to test your knowledge.</p>
                      
                      <form onSubmit={handleGenerateQuiz} className="w-full space-y-4">
                         <input 
                           type="text" 
                           placeholder="Recursion, React, OOP..." 
                           className="input-field text-center font-bold h-14"
                           value={quizTopic}
                           onChange={(e) => setQuizTopic(e.target.value)}
                         />
                         <button type="submit" disabled={loading} className="w-full btn-primary h-14 shadow-indigo-600/20">
                            {loading ? 'Thinking...' : 'Generate (5 Coins)'}
                         </button>
                      </form>
                    </div>

                    <div className="glass rounded-3xl p-8 border-white/50 flex flex-col items-center text-center group hover:bg-white transition-all shadow-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all group-hover:shadow-lg group-hover:shadow-rose-500/10">
                         <Lightbulb className="w-8 h-8 text-rose-600" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-2">General Hint</h3>
                      <p className="text-slate-500 font-medium text-sm mb-8 px-4 leading-relaxed">Need a push? Get a personalized hint for your current learning path.</p>
                      <button 
                        onClick={handleGetHint}
                        disabled={loading}
                        className="w-full mt-auto bg-slate-900 text-white rounded-2xl h-14 font-black uppercase tracking-widest text-xs hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-900/10"
                      >
                         {loading ? 'Consulting AI...' : 'Unlock Hint (10 Coins)'}
                      </button>
                    </div>
                  </div>

                  {/* AI Result Area */}
                  {aiResult && (
                    <div className="glass rounded-3xl p-10 border-white/50 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                           <Sparkles className="w-32 h-32 rotate-12" />
                        </div>
                        
                        <div className="flex items-center gap-4 mb-8">
                               {loading ? (
                                  <div className="flex flex-col items-center justify-center py-20 space-y-6">
                                     <div className="relative">
                                        <div className="w-20 h-20 border-4 border-white/10 rounded-full" />
                                        <div className="absolute top-0 w-20 h-20 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent" />
                                        <Brain className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                     </div>
                                     <div className="text-center">
                                        <h4 className="text-xl font-black italic tracking-tighter mb-2">AI is Thinking...</h4>
                                        <p className="text-slate-400 text-sm font-medium animate-pulse">Sifting through DoubtFlow knowledge banks</p>
                                     </div>
                                  </div>
                               ) : (
                                  <h4 className="text-xl font-black uppercase tracking-tighter italic">
                                     AI Response {aiResult.type === 'QUIZ' ? 'Generated' : 'Unlocked'}
                                  </h4>
                               )}
                            </div>
    
                            {!loading && aiResult && (
                            <div className="prose prose-invert max-w-none text-slate-200 font-medium leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/10 italic">
                           {aiResult.type === 'QUIZ' ? (
                             <div className="space-y-6">
                                {(() => {
                                  try {
                                    if (!aiResult.content) return <p className="text-slate-400">Empty response from AI.</p>;
                                    const cleanedContent = typeof aiResult.content === 'string' ? aiResult.content.trim() : JSON.stringify(aiResult.content);
                                    const questions = JSON.parse(cleanedContent);
                                    if (!Array.isArray(questions)) throw new Error("Not an array");
                                    return questions.map((q, i) => (
                                      <div key={i} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/50">
                                        <p className="font-black text-lg text-white mb-4 not-italic font-sans">{i + 1}. {q.q}</p>
                                        <ul className="space-y-2 not-italic font-sans">
                                          {(q.options || []).map((opt, j) => {
                                            const isCorrect = opt === q.a;
                                            return (
                                              <li key={j} className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${
                                                isCorrect ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-bold' : 'border-slate-700 bg-slate-900 text-slate-300'
                                              }`}>
                                                 <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${
                                                   isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                                                 }`}>
                                                   {String.fromCharCode(65 + j)}
                                                 </div>
                                                 {opt}
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      </div>
                                    ));
                                  } catch (e) {
                                    console.error("Quiz Parse Error:", e);
                                    return <p className="text-slate-400 italic">Received AI content, but it couldn't be parsed as a quiz format. Try a different topic!</p>;
                                  }
                                })()}
                             </div>
                           ) : (
                             aiResult.content
                           )}
                        </div>
                      )}
                    </div>
                  )}
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}