import chooseDialog from '@youzan/react-components/es/components/choose-dialog';
import assign from 'lodash/assign';
import getEduCourseConfig from './config/educourse-config.js';
import '@youzan/react-components/es/components/choose-dialog/style';

/**
 * options 弹窗配置，至少传入onChoose(data){}函数作为回调
 * dialogType 弹窗类型，目前为‘educourse’课程类型
 */
export default function popupDialog(options, dialogType) {
  let getConfig = null;
  switch (dialogType) {
    case 'course':
      getConfig = getEduCourseConfig;
      break;
    default:
      getConfig = getEduCourseConfig;
  }
  const tabConfig = assign({}, getConfig(options.config), options);
  return chooseDialog({ tabs: [tabConfig] });
}
