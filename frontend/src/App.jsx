import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Dashboard from './pages/Dashboard';

// Components
import Navbar from './components/Navbar';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  if (!token) return <Navigate to="/login" replace />;
  
  return children;
};

function AppRoutes() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="animate-fade-in transition-all">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } />
          
          <Route path="/post/:id" element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          } />

          <Route path="/create" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      {/* Dynamic Footer or Background Mesh */}
      <div className="fixed inset-0 -z-10 bg-mesh opacity-50 pointer-events-none" />
    </div>
  );
}

import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <Toaster 
            position="top-center" 
            toastOptions={{ 
              duration: 4000, 
              style: { background: '#1e293b', color: '#fff', borderRadius: '16px', fontWeight: 'bold' } 
            }} 
          />
          <AppRoutes />
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}