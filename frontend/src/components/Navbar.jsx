import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Coins, LogOut, User as UserIcon, Plus } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
                
                <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <UserIcon className="w-5 h-5 text-slate-600" />
                </Link>

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
