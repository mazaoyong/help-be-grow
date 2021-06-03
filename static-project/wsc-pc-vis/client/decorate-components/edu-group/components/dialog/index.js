import assign from 'lodash/assign';
import { ChooseDialog } from '@youzan/react-components';

import groupConfig from './group';

import './style.scss';

// 分组弹窗
export default function(options) {
  return function() {
    const tabConfig = assign({}, groupConfig(options.config), options);
    ChooseDialog({ tabs: [tabConfig] });
  };
}
