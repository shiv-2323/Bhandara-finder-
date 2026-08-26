import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Bhandara Finder:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-xl border border-amber-200 text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              भंडारा खोजक लोड करने में समस्या आई
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              ऐप को पुनः लोड करने के लिए नीचे दिए गए बटन पर क्लिक करें।
            </p>
            {this.state.error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-left text-xs text-red-700 font-mono overflow-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-4 h-4" /> पुनः लोड करें (Reload)
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl flex items-center justify-center gap-2 text-sm transition"
              >
                <Home className="w-4 h-4" /> कैश साफ़ करके रीस्टार्ट करें
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


