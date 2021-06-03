import assign from 'lodash/assign';
import choose from '@youzan/react-components/es/components/choose-dialog/index';
import config from './config';
import '@youzan/react-components/es/components/choose-dialog/style';
import './style.scss';

export default function chooseMember(options) {
  const tabConfig = assign({}, config(options.config), options);
  return choose({ tabs: [tabConfig] });
}
