import React from 'react';
import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';
import CourseSettingEntry from './App';

pageHelp('course-setting');

ReactDOM.render(<CourseSettingEntry />, document.getElementById('js-react-container'));
