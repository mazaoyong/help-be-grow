import { EventStatus } from './types';

export const previewImages = [
  '//b.yzcdn.cn/public_files/278fc0d655dad0a811d5302c8313beb2.jpg',
  '//b.yzcdn.cn/public_files/38a066c185d0a59c5770281cddf94ecf.jpg',
];

const weappVersion = _global.weappVersion && _global.weappVersion.releasedVersion;
/** 是否绑定小程序且小程序版本支持营销活动 */
export const hasWeappBinded = !!(weappVersion);

export const eventStatusMap = {
  [EventStatus.all]: '全部状态',
  [EventStatus.notStarted]: '未开始',
  [EventStatus.ongoing]: '进行中',
  [EventStatus.ended]: '已结束',
  [EventStatus.invalid]: '已失效',
};

export const editPageTypeMap = {
  add: '新建',
  edit: '编辑',
  detail: '查看',
  copy: '新建',
};

export const APPID = 50899;

export const AbilityCode = 'zanxuefei_ability';

export const AppName = '攒学费';
