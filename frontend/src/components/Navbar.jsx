import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Coins, LogOut, User as UserIcon, Plus, Bell, Check, MessageSquare, Heart } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
export default function Navbar() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const timeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (user && token) {
      fetchNotifications();
    }
  }, [user, token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Notifications fetch failed", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-black bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
          DoubtFlow
        </Link>

        <div className="flex items-center gap-4 lg:gap-8">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 font-bold text-sm">
                  <Coins className="w-4 h-4" />
                  {user.coins || 0}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100 font-bold text-sm">
                  <Flame className="w-4 h-4" />
                  {user.streak || 0}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link 
                  to="/create" 
                  className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all active:scale-95 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  New Post
                </Link>
                
                <Link to="/dashboard" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                
                <Link to="/profile" className="p-2 hover:bg-slate-100 rounded-xl transition-colors" title="My Profile">
                  <UserIcon className="w-5 h-5 text-slate-600" />
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-primary-50 text-primary-600' : 'hover:bg-slate-100 text-slate-600'}`}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 glass border border-white/40 shadow-2xl rounded-[24px] overflow-hidden animate-slide-up origin-top-right">
                       <div className="p-4 border-b border-slate-100 bg-white/50 flex items-center justify-between">
                          <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Notifications</h3>
                          <span className="text-[10px] font-bold text-slate-400">{notifications.length} Total</span>
                       </div>
                       <div className="max-h-[400px] overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map(n => (
                              <div 
                                key={n.id} 
                                onClick={() => {
                                  markAsRead(n.id);
                                  if (n.postId) navigate(`/post/${n.postId}`);
                                  setShowNotifications(false);
                                }}
                                className={`p-4 border-b border-slate-50 flex gap-3 cursor-pointer transition-all hover:bg-slate-50/80 ${!n.isRead ? 'bg-primary-50/30' : ''}`}
                              >
                                 <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${
                                   n.type === 'SOLVED' ? 'bg-emerald-100 text-emerald-600' :
                                   n.type === 'COMMENT' ? 'bg-indigo-100 text-indigo-600' :
                                   'bg-rose-100 text-rose-600'
                                 }`}>
                                    {n.type === 'SOLVED' ? <Check className="w-5 h-5" /> : 
                                     n.type === 'COMMENT' ? <MessageSquare className="w-5 h-5" /> : 
                                     <Heart className="w-5 h-5 fill-rose-600" />}
                                 </div>
                                 <div className="flex flex-col gap-0.5">
                                    <p className="text-xs font-medium text-slate-600 leading-snug">
                                       <span className="font-black text-slate-800">{n.actor?.name}</span> {n.message}
                                    </p>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                       {timeAgo(n.createdAt)}
                                    </span>
                                 </div>
                                 {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 ml-auto" />}
                              </div>
                            ))
                          ) : (
                            <div className="p-10 text-center">
                               <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                               <p className="text-sm font-bold text-slate-400">All caught up!</p>
                            </div>
                          )}
                       </div>
                       <Link 
                        to="/notifications" 
                        onClick={() => setShowNotifications(false)}
                        className="block p-3 text-center text-[10px] font-black text-primary-600 uppercase tracking-widest bg-slate-50/50 hover:bg-slate-100 transition-all"
                       >
                          View All Activity
                       </Link>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-600 font-semibold hover:text-primary-600">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
