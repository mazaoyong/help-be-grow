import YZLocalStorage from 'zan-utils/browser/local_storage';
import get from 'lodash/get';
import { getGlobalConfig } from './index';

const {
  liveId,
} = getGlobalConfig();

/**
 * 直接改变传入的 list
 * 与本地存储比较 已读数据标明 hasRead
 */

export default (list) => {
  const storageStr = YZLocalStorage.getItem('yz_live_chat_read_list') || '{}';
  const storageObj = JSON.parse(storageStr) || {};
  const readList = storageObj[liveId] || [];

  console.log('[checkRead] 当前 live 已读记录', readList);
  list.forEach(item => {
    if (readList.indexOf(get(item, 'fromMsg.msgId')) > -1) {
      item.hasRead = true;
    } else {
      item.hasRead = false;
    }
  });
};
