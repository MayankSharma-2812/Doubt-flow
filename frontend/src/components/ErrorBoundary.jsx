import { Component } from 'react';
import { AlertCircle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-8 max-w-md w-full text-center border-white/50 shadow-xl">
            <div className="w-16 h-16 mx-auto bg-rose-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Oops! Something snapped.</h2>
            <p className="text-slate-500 font-medium mb-8">
              We hit a snag loading this page. Our team has been notified.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-2xl w-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
