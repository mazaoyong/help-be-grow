import React from 'react';
import { Provider as CourseProvider } from './contexts/course';
import App from './App';

export default function Refund(props) {
  return (
    <CourseProvider>
      <App />
    </CourseProvider>
  );
}
