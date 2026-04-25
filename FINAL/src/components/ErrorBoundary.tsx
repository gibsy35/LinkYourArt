import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { children } = this.props;
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let isFirestoreError = false;
      
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Database Error: ${parsed.error} during ${parsed.operationType} on ${parsed.path || 'unknown path'}`;
            isFirestoreError = true;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-surface-low border border-red-500/30 p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 rounded-full">
                <AlertTriangle size={32} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black font-headline tracking-tighter uppercase italic text-white">
                System Failure
              </h2>
              <p className="text-on-surface-variant text-xs font-mono uppercase tracking-widest leading-relaxed opacity-70">
                {errorMessage}
              </p>
              {isFirestoreError && (
                <p className="text-[10px] text-accent-gold font-mono uppercase tracking-widest mt-4">
                  Please check your connection or institutional permissions.
                </p>
              )}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-white text-surface-dim font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-cyan transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} />
              Reboot Terminal
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
