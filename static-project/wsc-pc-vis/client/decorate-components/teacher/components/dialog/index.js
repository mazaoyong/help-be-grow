import assign from 'lodash/assign';
import chooseDialog from '@youzan/react-components/es/components/choose-dialog';

import teacherConfig from './teacher-config';

import './style.scss';

/**
 * 选择老师弹窗
 * @param {Object} options
 */
export default function(options) {
  return function() {
    const tabConfig = assign({}, teacherConfig(options.config), options);
    chooseDialog({ tabs: [tabConfig] });
  };
}
