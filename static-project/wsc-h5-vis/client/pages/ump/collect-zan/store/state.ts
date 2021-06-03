import Args from '@youzan/utils/url/args';
import UA from '@youzan/utils/browser/ua_browser';
import { IZanState } from './types';

export default {
  alias: Args.get('alias') || '',
  zanAlias: Args.get('zanAlias') || '',
  userInfo: {
    username: _global.visBuyer.finalUsername,
    avatar: _global.visBuyer.finalAvatar,
  },
  shopInfo: {},
  isAndroid: UA.isAndroid(),
  evnInfo: {
  },

  zanDetail: {} as any,
  goodsData: {},
  qrcodeUrl: '',
  posterUrl: '',
  shareCoverUrl: '',

  inited: false,
  showShareGuide: false, // todo: 确定需要吗？
  showPoster: false, // todo: 确定需要吗？
  showHostDialog: false,
  showGuestDialog: false,
} as IZanState;
