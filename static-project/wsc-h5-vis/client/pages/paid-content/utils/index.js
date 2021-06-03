import ajax from 'captain-ajax';
import forEach from 'lodash/forEach';
import Args from 'zan-utils/url/args';
import { MEDIA_TYPE } from 'pct/constants';
import 'common/log/pageLogger';
import { isUndefined, isNull } from 'lodash';

export function appendLogParamsTo(url) {
  let {
    dc_ps: dcPs,
    from_source: fromSource,
    from_params: fromParams,
    atr_ps: atrPs,
  } = window.yzlogInstance && (window.yzlogInstance.sessionContext || {});
  const slsParam = Args.get('from_params', url);
  const params = {};
  params.is_share = 1;
  if (dcPs && dcPs !== 'undefined') {
    params.dc_ps = dcPs;
  }
  if (fromSource && fromSource !== 'undefined') {
    params.from_source = fromSource;
  }
  if (fromParams && fromParams !== 'undefined') {
    // 适配分销员特定参数'sl~3ctaZx!online_kdt_id~27635211',
    // 如果是分销员，替换from_params参数中的分销员信息为当前分销员，如果不是分销员，清掉参数中的分销员信息
    const reg = /([0-9a-zA-Z]*sl~)([a-zA-Z0-9]*)(!online_kdt_id~)([0-9]*)/;
    if (reg.test(slsParam)) {
      const newParams = reg.exec(slsParam) || [];
      if (reg.test(fromParams) && newParams.length > 0) {
        const newSlsInfo = `$1${newParams[2]}$3${newParams[4]}`;
        fromParams = fromParams.replace(reg, newSlsInfo);
      }
    } else {
      fromParams = fromParams.replace(reg, '');
    }
    params.from_params = fromParams;
  }
  if (atrPs && atrPs !== 'undefined') {
    params.atr_ps = atrPs;
  }
  return Args.add(url, params);
}

// 获取文本行数
export function countLines(ele) {
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

export function secondsToColonTimeStr(seconds) {
  let minute = parseInt(seconds / 60, 10);
  minute = minute < 10 ? `0${minute}` : `${minute}`;
  let second = Math.round(seconds % 60);
  second = second < 10 ? `0${second}` : `${second}`;
  return `${minute}:${second}`;
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
    // 针对channelType为0的特殊口子（避免多窗口重复下单）
    if (val || val === 0) {
      paramStr += `&${key}=${val}`;
    }
  });
  return paramStr.substring(1);
}

// 上传网络资源
export function uploadNetMaterial(url) {
  return ajax({
    url: '/wscvis/fetchPublicImage.json',
    type: 'POST',
    data: {
      fetchUrl: url,
    },
  }).then(res => {
    if (res.code === 0 && res.data && res.data.url) {
      res.data.url = res.data.url.replace('img.yzcdn', 'img01.yzcdn');
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

// 数字对下取整
export function numberFloor(number) {
  return Math.floor(number);
}

export const resourceProtect = {
  protectCallback: function() {},
};
