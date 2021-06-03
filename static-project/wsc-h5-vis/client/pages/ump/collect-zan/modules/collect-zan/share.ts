import { getVuePoster } from './apis';
import {
  setShareData as setWxShareData,
  getShareLink as getWxShareLink,
} from '@youzan/wxsdk';
import { getCommonWeappCode, getCommonSwanCode } from '@/common-api/utils';
import YZLocalStorage from '@youzan/utils/local_storage';

let qrcodeUrl = '';
function getShareQrcode(h5url: string, h5Qrcode: string): Promise<string> {
  return new Promise((resolve) => {
    if (qrcodeUrl) return qrcodeUrl;

    const miniprogram = _global.miniprogram || {};
    const { isWeapp, isSwanApp } = miniprogram;
    if (isWeapp) {
      // 生成小程序码
      const data = {
        page: `/packages/edu/webview/index`,
        targetUrl: encodeURIComponent(h5url),
      };
      getCommonWeappCode(data)
        .then((res: string) => {
          resolve(res);
        })
        .catch((errMsg: string) => {
          console.error(errMsg);
          resolve(h5Qrcode);
        });
    } else if (isSwanApp) {
      const data = {
        targetUrl: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(h5url)}`,
      };
      getCommonSwanCode(data)
        .then((res: string) => {
          resolve(res);
        })
        .catch((errMsg: string) => {
          console.warn(errMsg);
          resolve(h5Qrcode);
        });
    } else {
      resolve(h5Qrcode); // h5二维码
    }
  });
}

interface IPosterData {
  pathname: string;
  username: string;
  userAvatar: string;
  rewardText: string;
  limitText?: string;
  qrcode?: string;
  courseCover?: string;
  courseTitle?: string;
  coursePrice?: string;
}
const posterConfig: {
  [key: string]: { width: number; height: number }
} = {
  'ump/collect-zan/ailey': {
    width: 300,
    height: 529,
  },
  'ump/collect-zan/billy': {
    width: 300,
    height: 506,
  },
};
function fetchSharePoster(posterData: IPosterData) {
  return getVuePoster({
    pathname: posterData.pathname,
    data: posterData,
    snapshotConfig: {
      ...posterConfig[posterData.pathname],
    },
  })
    .then(res => {
      if (res) {
        return res.img;
      }
      return '';
    });
}

export function getSharePoster(h5url: string, h5Qrcode: string, posterData: IPosterData) {
  return getShareQrcode(h5url, h5Qrcode)
    .then((res: string) => {
      qrcodeUrl = res;
      posterData.qrcode = qrcodeUrl;

      return fetchSharePoster(posterData);
    })
    .catch((errMsg: string) => {
      console.error(errMsg);
    });
}

export function drawShareCover(data: {
  userAvatar: string;
  username: string;
  isCourseReward: boolean;
  couponText: string;
  courseName: string;
}) {
  return getVuePoster({
    pathname: 'ump/collect-zan/share',
    data,
    snapshotConfig: {
      width: 500,
      height: 400,
    },
  })
    .then(res => {
      if (res) {
        return res.img;
      }
      return '';
    });
}

export function setShareData(data: {
  userAvatar: string;
  username: string;
  isCourseReward: boolean;
  couponText: string;
  courseName: string;
}) {
  const shareData = {
    notShare: false,
    desc: '',
    link: getWxShareLink(window.location.href),
    title: `快来帮我助力，加入《${data.courseName}》的学习中吧！`,
    cover: '',
  };
  setWxShareData(shareData);

  drawShareCover(data)
    .then((res: string) => {
      if (res) {
        setWxShareData({
          ...shareData,
          cover: res || '',
        });
      }
    })
    .catch((errMsg: string) => console.error(errMsg));
}

// 邀请好友
export function inviteFriend(openGuidePopup: () => any) {
  // 打开分享引导弹窗
  openGuidePopup && openGuidePopup();
}

const invitedKeyPrefix = 'ump:collect-zan:invited:';
export function getInvited(zanAlias: string): Boolean {
  let hasInvited = false;
  try {
    hasInvited = YZLocalStorage.getItem(`${invitedKeyPrefix}${zanAlias}`);
  } catch (err) {}
  return hasInvited;
}

export function setInvited(zanAlias: string) {
  try {
    YZLocalStorage.setItem(`${invitedKeyPrefix}${zanAlias}`, '1');
  } catch (err) {}
}
