import React, { type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ErrorMessage } from './error-message';
import i18n from '../i18n/config';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_error: Error): State {
    void _error;
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 flex justify-center items-center min-h-screen">
          <div className="max-w-md w-full">
            <ErrorMessage 
              title={i18n.t('errorBoundary.title')} 
              message={i18n.t('errorBoundary.message')} 
            />
            <div className="mt-6 flex items-center gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {i18n.t('errorBoundary.reload', 'Recarregar página')}
              </button>
              <Link
                to="/"
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                {i18n.t('errorBoundary.goHome', 'Voltar ao início')}
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
