import React from 'react';

import { Provider as CourseOrderProvider } from './contexts/course-order';
import App from './App';

export default function Enrollment() {
  return (
    <CourseOrderProvider>
      <App />
    </CourseOrderProvider>
  );
}
