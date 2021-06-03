import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import pageHelp from 'shared/components/page-help';
import './styles.scss';

pageHelp('clue-transfer');

ReactDOM.render(<App />, document.getElementById('js-react-container'));
