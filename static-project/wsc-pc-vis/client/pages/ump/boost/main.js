import { render } from 'react-dom';
import pageHelp from 'shared/components/page-help';
import Router from './routes';
import './style.scss';

pageHelp('paidcontent_jizan');
render(Router, document.getElementById('js-react-container'));
