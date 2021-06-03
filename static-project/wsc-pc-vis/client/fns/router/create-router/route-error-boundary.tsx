import React from 'react';
import { ErrorBoundary } from 'zent';

const ErrorFallback: React.FC<any> = () => <div style={{ color: '#f00' }}>加载模块出现问题</div>;

export const RouteErrorBoundary: React.FC<{}> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={console.error}>
      {children}
    </ErrorBoundary>
  );
};
