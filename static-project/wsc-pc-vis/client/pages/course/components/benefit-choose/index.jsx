import { ChooseDialog } from '@youzan/react-components';
import config from './config';
import './style.scss';

export default function chooseBenefit(options) {
  const tabConfig = Object.assign({}, config(options.config), options);
  return ChooseDialog({ tabs: [tabConfig] });
}
