import assign from 'lodash/assign';
import chooseDialog from '@youzan/react-components/es/components/choose-dialog';

import courseConfig from './course';
import liveConfig from './live';
import contentConfig from './content';
import columnConfig from './column';

import './style.scss';

/**
 * 知识商品调用弹窗（课程/内容/专栏/直播）
 * @param {Object} options
 */
export default function(options) {
  return function(goodsFrom) {
    const configMap = {
      course: courseConfig,
      content: contentConfig,
      column: columnConfig,
      live: liveConfig,
    };
    const tabConfig = assign({}, configMap[goodsFrom](options.config), options);
    chooseDialog({ tabs: [tabConfig] });
  };
}
