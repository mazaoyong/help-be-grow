import assign from 'lodash/assign';
import { ChooseDialog } from '@youzan/react-components';
import config from './config';

export default function chooseCard(options) {
  const tabConfig = assign({}, config(options.config), options);
  return ChooseDialog({ tabs: [tabConfig] });
}
