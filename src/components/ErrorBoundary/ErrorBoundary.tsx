import React from 'react';

export class ErrorBoundary extends React.Component {
    public state = { error: null };
  
    static getDerivedStateFromError(error: Error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: error };
    }
  
    componentDidCatch(error: Error, info: any) {
      // You can also log the error to an error reporting service
      // logErrorToMyService(error, info);
    }
  
    render() {
      if ( this.state.error ) {
        // You can render any custom fallback UI
        return <pre>{ this.state.error }</pre>;
      }
  
      return this.props.children; 
    }
  }