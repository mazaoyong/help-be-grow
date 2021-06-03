import React from 'react';
import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';
import App from './App';

pageHelp('clue-trigger');

ReactDOM.render(<App />, document.getElementById('js-react-container'));
