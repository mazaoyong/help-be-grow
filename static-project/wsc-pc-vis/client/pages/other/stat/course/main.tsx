import * as React from 'react';
import * as ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';
import App from './App';

ReactDOM.render(<App />, document.getElementById('js-react-container') as HTMLElement);
pageHelp('stat_course');
