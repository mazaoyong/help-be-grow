import get from 'lodash/get';
import Editor from './SocialFansEditor';

import './style/index.scss';

// 是否开通 小程序 可以展示按钮
const isValid = get(_global, 'has_order_weapp.isValid', false);
const appendable = isValid;

export default {
  type: Editor.info.type,
  editor: Editor,
  appendable,
  limit: 1,
};
