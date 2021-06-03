import ajax from 'captain-ajax';
import forEach from 'lodash/forEach';
import { BURING_POINT_MAP, MEDIA_TYPE } from './constants';
import makeUrlLog from 'common/log/makeUrlLog';
import 'common/log/pageLogger';
import { isUndefined, isNull } from 'lodash';

// 小测试音频时长格式转化
export function pad(number) {
  return number < 10 ? `0${number}` : `${number}`;
}

/**
 * seconds -> '0:00'
 *
 * @param {number} seconds
 */
export function formatTime(seconds) {
  if (!seconds) return '0:00';

  let minute = parseInt(seconds / 60, 10);
  let second = Math.ceil(seconds % 60, 10);
  if (second === 60) {
    minute++;
    second = 0;
  }
  return `${minute}:${pad(second)}`;
}

// 根据路由名设置对应的埋点信息
export const setBuringPoint = (type, logId) => {
  window._global.spm = {
    logType: type in BURING_POINT_MAP ? BURING_POINT_MAP[type] : 'fake',
    logId,
  };
  // 埋点需求， 在_global.spm 添加对应路由的logType
  window.Logger.setSpm();
};

export const makeLog = ({ name, id = window._global.kdt_id, link }) => {
  setBuringPoint(name, id);

  /* eslint-disable */
  window.Logger.log({
    fm: 'display',
    link: makeUrlLog(link),
    act_name: 'unknown',
    act_ver: window._global.page_version || 'unknown',
    platform: window._global.platform
  });
  window.Logger.uaLog();
}

// 获取文本行数
export function countLines (ele) {
  var styles = window.getComputedStyle(ele, null);
  var lh = parseInt(styles.lineHeight, 10);
  var h = parseInt(styles.height, 10);
  var lc = Math.round(h / lh);
  console.log('line count:', lc, 'line-height:', lh, 'height:', h);
  return lc;
}

// 将秒数转化为“分:秒”的形式
export function secondsToTimeStr(seconds) {
  const minute = parseInt(seconds / 60, 10);
  const second = Math.round(seconds % 60);
  return `${minute}分${second}秒`;
}

// 详情内容文案
export function getContentInfoText({ isColumn, author, contentsCount, mediaType, videoDuration, audioDuration }) {
  const authorText = author ? `作者：${author}` : '';
  let descText = '';
  if (isColumn) {
    descText = contentsCount ? `已更新${contentsCount}期` : '';
  } else if (mediaType === MEDIA_TYPE.VIDEO) {
    descText = videoDuration ? `${secondsToTimeStr(videoDuration)}` : '';
  } else if (mediaType === MEDIA_TYPE.AUDIO) {
    descText = audioDuration ? `${secondsToTimeStr(audioDuration)}` : '';
  }
  return authorText && descText ? `${authorText} | ${descText}` : authorText || descText;
}

// 获取分享url参数
export function getShareParamStr(params) {
  let paramStr = '';
  forEach(params, (val, key) => {
    paramStr += `&${key}=${val}`;
  });
  return paramStr.substring(1);
}


// 上传网络资源
export function uploadNetMaterial(url, categoryId) {
  return ajax({
    url: '/wscvis/fetchPublicImage.json',
    type: 'POST',
    data: {
      fetchUrl: url
    },
  }).then(res => {
    if (res && res.url) {
      res.url = res.url.replace('img.yzcdn', 'img01.yzcdn');
    }

    return res;
  });
}

export function getScreenRatio(context) {
  // 获取屏幕dpr/canvas-ratio
  const backingStore = context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
  const deviceRatio = window.devicePixelRatio || 1;
  return deviceRatio / backingStore;
}

export function parsePrice(price) {
  let priceCharList = (String(price) || '').split('');
  // 补充零位
  if (priceCharList.length < 3) {
    priceCharList = (new Array(3 - priceCharList.length)).fill('0').concat(priceCharList);
  }
  priceCharList.splice(-2, 0, '.');
  return priceCharList.join('');
}

export function isExits(obj) {
  return !isNull(obj) && !isUndefined(obj);
}

export function getImageWidth(img, imageWidth, imageHeight) {
  const ratio = imageHeight / img.height;
  const image = {
    width: img.width * ratio,
    height: img.height * ratio,
  };
  return image;
}

// 区分res.code 的api调用
export function invoke(apifn, ...params) {
  return apifn(...params)
    .then((res) => {
      if (res.code === 0) {
        return res.data;
      } else {
        throw new Error(res.msg);
      }
    });
}
