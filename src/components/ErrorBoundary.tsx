import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white p-8 font-mono">
                    <h1 className="text-3xl text-red-500 font-bold mb-4">Something went wrong.</h1>
                    <div className="p-4 bg-gray-900 rounded-xl border border-red-500/30 overflow-auto">
                        <h2 className="text-xl text-red-400 mb-2">{this.state.error?.toString()}</h2>
                        <details className="whitespace-pre-wrap text-xs text-gray-500">
                            {this.state.errorInfo?.componentStack}
                        </details>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-white text-black rounded font-bold hover:bg-gray-200"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
