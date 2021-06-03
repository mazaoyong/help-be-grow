/**
 * 判断是否为日食记店铺，专门开放吸顶配置
 * @author: yugang <yugang@youzan.com>
 */
import get from 'lodash/get';

// 日食记测试白名单
const rishijiWhiteList = [601083, 491391];

// 当前店铺id
const kdtId = get(_global, 'kdtId', 0);

// 当前店铺是否为日食记名单内
export const IS_RSJ = !(rishijiWhiteList.indexOf(kdtId) === -1);

export const searchDemoDialogId = 'search-demo-dialog-id';
// 热词最大可添加的数量
export const MAX_LENGTH = 5;
// 颜色
export const COLOR = {
  background: '#f9f9f9',
  border: '#fff',
  text: '#969799',
};
