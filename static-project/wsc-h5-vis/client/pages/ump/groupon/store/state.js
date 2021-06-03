import get from 'lodash/get';
import args from '@youzan/utils/url/args';
import { GOODS_TYPE } from 'constants/course/goods-type';
import { notifyAfterGotPaystate } from 'common/utils/notify-payfinished';

const { courseDetail = {}, grouponDetail = {}, skuFormatModel = {}, kdt_id: kdtId } = window._global;
const type = get(courseDetail, 'type', 0);
const state = {
  kdtId,
  proType: type,
  proDetail: type === GOODS_TYPE.COURSE ? get(courseDetail, 'offlineCourse', {}) : get(courseDetail, 'onlineCourse', {}),
  grouponDetail,
  activityType: args.get('activity_type', 0),
  isOwnAsset: get(courseDetail, 'isOwnAsset', false),
  joinGroupSetting: get(courseDetail, 'joinGroupSetting', {}),
  skuFormatModel,
  pctType: {
    1: 'columnshow',
    3: 'contentshow',
    5: 'livedetail',
  },
  selectedSku: null,

  oterGroup: {},
  isFetched: false,
  mainTip: '',
  smallTip: '',
  overTip: '',
  buttons: [],
  showCountDown: false,
  title: '',
  picture: '',
  desc: '',
  salasNum: 0,
  shareUserId: args.get('share_user_id') || '',
  alias: args.get('alias') || '',
  inviteInfo: {},
  isJoinedGroup: false,
  params: {
    page: 1,
    pageSize: 6,
  },
  joinRecords: grouponDetail.joinRecords,
  maxDiscountPrice: 0,
  showMainMaxDiscount: false,
  showSmallMaxDiscount: false,
  grouponEndAt: 0,
  showPosterPop: false,
  poster: '',

  isShowPromoteCard: 0,
  joinSettingInfo: {},

  sl: '',
};

// 获取支付状态并发送支付完成消息
try {
  notifyAfterGotPaystate();
} catch (err) {};

export default state;
