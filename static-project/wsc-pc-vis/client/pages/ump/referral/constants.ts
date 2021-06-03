import { EventStatus } from './types';

export const { pointsName: POINTS_NAME } = window._global as IGlobal & { pointsName: string };

/** 最大可选赠品数量 */
export const MAX_PRESENT_SELECT = 10;

export const TRACK_REFERRAL_CREATE = 'referralCreate';

export const DateFormat = 'YYYY-MM-DD HH:mm:ss';

export const UPDATE_STATE = 'UPDATE_STATE';

export const DEFAULT_POSTER_BG_URL =
  'https://img.yzcdn.cn/upload_files/2020/11/25/Fqd3lGPGKjol2IRIQvwq6zX4NAtv.png';

export const previewImages = [
  'https://img.yzcdn.cn/upload_files/2020/11/25/Fu7iNiclgZX_DCnVNLhqsJktokRZ.png',
  'https://img.yzcdn.cn/upload_files/2020/11/25/FpX5PLY7HLmlYsJqZ3x_o6XMhfr-.png',
  'https://img.yzcdn.cn/upload_files/2020/11/25/FkqMh6eQoAATQJ17Olv3DdgtK1oe.png',
];

const weappVersion = _global.weappVersion && _global.weappVersion.releasedVersion;
/** 是否绑定小程序且小程序版本支持营销活动 */
export const hasWeappBinded = !!weappVersion;

export const eventStatusMap = {
  [EventStatus.NOT_STARTED]: '未开始',
  [EventStatus.PROCESS]: '进行中',
  [EventStatus.ENDED]: '已结束',
  [EventStatus.INVALID]: '已失效',
};

export const editPageTypeMap = {
  add: '新建',
  edit: '编辑',
  copy: '复制',
  detail: '查看',
};

export const NUMBER_CHINESE_MAP = {
  0: '一',
  1: '二',
  2: '三',
  3: '四',
};

export const DEFAULT_SHOP_INFO_VALUE = {
  applicableCampusList: [],
  applicableCampusType: 0,
};

export const FIXED_RATIO_PROPS = {
  width: 112,
  max: 99,
  min: 1,
  addonAfter: '%',
  placeholder: '1-99',
};

export const FIXED_PRICE_PROPS = {
  width: 180,
  max: 99999,
  min: 0,
  decimal: 2,
  addonAfter: '元',
};
