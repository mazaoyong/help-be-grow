export const ENUM_MEDIA_TYPE = {
  TEXT: 1,
  AUDIO: 2,
  VIDEO: 3,
  LIVE: 4,
};

export const ENUM_OWL_TYPE = {
  COLUMN: 1,
  CONTENT: 2,
  LIVE: 4,
  COURSE: 10,
};

export const TYPE_SUFFIX_MAP = {
  [ENUM_OWL_TYPE.COLUMN]: '人已购',
  [ENUM_OWL_TYPE.LIVE]: '次观看',
  [ENUM_OWL_TYPE.COURSE]: '人学过',
};

export const MEDIA_TYPE_SUFFIX_MAP = {
  [ENUM_MEDIA_TYPE.TEXT]: '次学习',
  [ENUM_MEDIA_TYPE.AUDIO]: '次学习',
  [ENUM_MEDIA_TYPE.VIDEO]: '次观看',
  [ENUM_MEDIA_TYPE.LIVE]: '次观看',
};

/**
 * 根据 owlType，mediaType 获取“浏览量/播放量/订阅数”的隐藏文案
 *
 * @param {string} owlType - ENUM_OWL_TYPE
 * @param {string} mediaType - ENUM_MEDIA_TYPE
 * @return {string | undefined}
 */
export const getSuffix = (owlType, mediaType) => {
  return +owlType === ENUM_OWL_TYPE.CONTENT
    ? MEDIA_TYPE_SUFFIX_MAP[mediaType]
    : TYPE_SUFFIX_MAP[owlType];
};

/**
 * 只根据 mediaType 获取“浏览量/播放量/订阅数”的隐藏文案
 *
 * @param {string} mediaType - ENUM_MEDIA_TYPE
 * @param {boolean} isSlice - 是否要省略 ‘次’ 这个字
 * @return {string | undefined}
 */
export const getMediaSuffix = (mediaType, isSlice = false) => {
  const mediaSuffix = MEDIA_TYPE_SUFFIX_MAP[mediaType];
  if (mediaSuffix && isSlice) {
    return mediaSuffix.slice(1);
  }
  return mediaSuffix;
};

/**
 * 销量数据格式化，如果销量>9999,显示1.2w，1.3w
 *
 * @param {number} salesNum - 销售数据
 * @return {string}
 */
export function formatSalesNum(salesNum = 0) {
  if (salesNum > 9999) {
    if (salesNum % 10000 === 0) {
      return `${salesNum / 10000}w`;
    } else {
      const tmpNum = (salesNum / 10000).toString().split('.');
      return `${tmpNum[0]}.${tmpNum[1].slice(0, 1)}w`;
    }
  }
  return salesNum;
}
