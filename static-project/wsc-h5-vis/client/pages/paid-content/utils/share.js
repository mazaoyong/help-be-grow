import UrlHelper from 'zan-utils/url/helper';
import Args from 'zan-utils/url/args';
import { getShareLink, setShareData } from '@youzan/wxsdk';
import { appendLogParamsTo } from './index';

const mpData = window._global.mp_data || {};
const shopLogo = UrlHelper.getCdnImageUrl(mpData.logo);

export const shareConfig = {
  AllColumns: {
    title: '全部专栏',
    cover: shopLogo,
  },
  AllContents: {
    title: '全部内容',
    cover: shopLogo,
  },
  AllMembers: {
    title: '全部会员权益',
    cover: shopLogo,
  },
  MyPay: {
    title: '我的课程',
    cover: shopLogo,
  },
  InviteCard: {
    notShare: true,
  },
};

export const getPaidContentShareLink = (link, route) => {
  link = appendLogParamsTo(link);
  let params = {
    page: route.name.toLowerCase(),
    is_share: 1,
  };

  // 埋点需要，具体见：https://jira.qima-inc.com/browse/WSCFR-1944
  const context = window.yzlogInstance ? window.yzlogInstance.sessionContext : {};
  if (context.dc_ps) params.dc_ps = context.dc_ps;
  if (context.from_source) params.from_source = context.from_source;
  if (context.from_params) params.from_params = context.from_params;

  params = Object.assign(params, route.query);
  // route.query.alias && (params.alias = route.query.alias);
  // 针对微信认证需要处理对应的分享链接
  return getShareLink(Args.add(link, params));
};

export function setDefaultShareData(route) {
  // 针对微信认证需要处理对应的分享链接
  const link = getPaidContentShareLink(window.location.href, route);
  const shareData = shareConfig[route.name];
  console.log('shareData', shareData);
  if (shareData) {
    shareData.link = link;
    setShareData(shareData);
  }
};

export function setShareCallBack() {
  // 注册分享回调
  const getShareCallback = (from = '') => (res) => {
    window.yzlogInstance && window.yzlogInstance.log({
      et: 'custom',
      ei: 'share',
      en: '分享',
      params: {
        from,
        title: document.title,
        spm: window._global.pctSpm,
      },
    });
  };

  window.__onShareTimeline = getShareCallback('timeline');
  window.__onShareAppMessage = getShareCallback('appmessage');
  window.__onShareQQ = getShareCallback('qq');
  window.__onShareQZone = getShareCallback('qzone');
};
