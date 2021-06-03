import { date } from '@youzan/utils';
import { compareVersion } from 'shared/fns/compare-version';
import { ActivityStatus } from './types';

const { minWeappVersion = '2.46.0' } = _global.inviteRewardConfig;
const weappVersion = _global.weappVersion && _global.weappVersion.releasedVersion;
/** 是否绑定小程序且小程序版本支持转介绍活动 */
export const hasWeappBinded = !!(weappVersion && compareVersion(weappVersion, minWeappVersion) >= 0);

// 获取时间快捷选择器时间值
let tmpDate = new Date();
// 当前时间
const nowDateTime = date.makeDateTimeStr(tmpDate);
// 本周一 00:00:00
tmpDate.setDate(tmpDate.getDate() - (tmpDate.getDay() || 7) + 1);
const currentMondayStart = `${date.makeDateStr(tmpDate)} 00:00:00`;
// 上周日 23:59:59（本周一 -1s）
const lastSundayEnd = date.makeDateTimeStr(date.parseDate(currentMondayStart, 'YYYY-MM-DD HH:mm:ss').getTime() - 1000);
// 上周一 00:00:00
tmpDate.setDate(tmpDate.getDate() - 7);
const lastMondayStart = `${date.makeDateStr(tmpDate)} 00:00:00`;
// 本月初 00:00:00
tmpDate = new Date();
tmpDate.setDate(1);
const currentMonthStart = `${date.makeDateStr(tmpDate)} 00:00:00`;
// 上月末 23:59:59（本月初 -1s）
const lastMonthEnd = date.makeDateTimeStr(date.parseDate(currentMonthStart, 'YYYY-MM-DD HH:mm:ss').getTime() - 1000);
// 上月初 00:00:00
tmpDate = date.parseDate(lastMonthEnd, 'YYYY-MM-DD HH:mm:ss');
tmpDate.setDate(1);
const lastMonthStart = `${date.makeDateStr(tmpDate)} 00:00:00`;

export const dateRangeQuickPickerPreset = {
  nowDateTime,
  currentMondayStart,
  lastSundayEnd,
  lastMondayStart,
  currentMonthStart,
  lastMonthEnd,
  lastMonthStart,
};

export const posterCardImgList = [
  '//b.yzcdn.cn/public_files/9583d45c9b77e2aa43c543111ff5a56e.png',
  '//b.yzcdn.cn/public_files/6f6774c1b0a1abe9648a65b2cb47483e.png',
  '//b.yzcdn.cn/public_files/6809e9eda9cdb1c893492a8b36be551f.png'
];

export const posterBgImgList = [
  '//b.yzcdn.cn/public_files/c6475011b41918621d9d2bbc2bbb6de5.png',
  '//b.yzcdn.cn/public_files/7313f99ef3e4fff3f20a2b4d92a9fe2d.png',
  '//b.yzcdn.cn/public_files/74333bc9b55d56eb0834d013ad47572f.png'
];

export const newStuPosterBgImgList = [
  '//b.yzcdn.cn/public_files/49bf596460342b81775b307fc86202df.png',
  '//b.yzcdn.cn/public_files/2ec3d1453c72d0aee3c2111ef5e8a477.png',
  '//b.yzcdn.cn/public_files/4790de3605ccee99760fc106be3f9c78.png'
];

export const couponItemBg = '//b.yzcdn.cn/public_files/0ab90f38c9dd64955127d81791ef5634.png';

export const presentItemBg = '//b.yzcdn.cn/public_files/7c70c5886cb6ff8ce346c6bc137c86c9.png';

export const joinedUserCount = '//b.yzcdn.cn/public_files/df89342a8c8233f3960e6d731646cfb8.png';

export const newStuJoinedUserCount = '//b.yzcdn.cn/public_files/4bca361c9e051adbe54aebdbbe1f842e.png';

export const statusLabel = {
  [ActivityStatus.all]: '全部状态',
  [ActivityStatus.notStarted]: '未开始',
  [ActivityStatus.ongoing]: '进行中',
  [ActivityStatus.ended]: '已结束',
  [ActivityStatus.invalid]: '已失效',
};

export const canEditField = [
  'name',
  'endTime',
  'posterStyle',
  'oldStudentPoster',
  'rule',
  'constitutionDesc',
  'showJoinNum',
  'showRecommendGoods',
];
