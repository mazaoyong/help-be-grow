import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import pageHelp from 'shared/components/page-help';
import './style.scss';
pageHelp('clue-tags');

ReactDOM.render(<App />, document.getElementById('js-react-container'));
