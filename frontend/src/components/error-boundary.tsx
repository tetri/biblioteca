import React, { type ErrorInfo, type ReactNode } from 'react';
import { ErrorMessage } from './error-message';

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
              title="Algo deu errado" 
              message="Ocorreu um erro inesperado na interface. Estamos trabalhando para resolver!" 
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
