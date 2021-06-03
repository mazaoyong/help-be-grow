import Toast from 'vant/lib/toast';
import 'vant/lib/toast/index.css'; // 为了兼容 ssr

/**
 * 解析url
 *
 * @param {string} url 待解析的url
 * @return {Object}
 */
export function parseURL(url) {
  const searchString = url.match(/\?.+$/);
  const res = {};
  if (!searchString) return res;
  searchString[0]
    .substring(1)
    .split('&')
    .forEach(item => {
      const [key, value] = item.split('=');
      let _value = '';
      if (value) {
        const isNumber = !isNaN(value);
        _value = isNumber ? Number(value) : value;
      }
      res[key] = decodeURIComponent(_value);
    });
  return res;
}

/**
 * 编码url
 *
 * @export
 * @param {string} url 待编码的目标url地址
 * @param {Object} params 需要添加的参数
 */
export function encodeURL(url, params) {
  if (typeof url !== 'string') {
    console.error('[type error]', `encodeURL method require a string-type params but get ${typeof url}`);
    return '#';
  }
  const pureurl = url.split('?')[0];
  const allParams = Object.assign(parseURL(url), params);
  let res = `${pureurl}?`;
  for (const key in allParams) {
    res += `${key}=${allParams[key]}&`;
  }
  return res.substring(0, res.length - 1);
}

/**
 * @description 用于判断文本内容是否超出展示空间
 * @param {string} pattern 待匹配的字符串
 * @param {number} width 展示区域的宽度
 * @param {number[=3]} line 最多展示的行数
 * @param {number[=13]} fontSize 每个字符的字体大小
 * @returns {boolean}
 */
export function judgeOverWrite(pattern, width, line = 3, fontSize = 13) {
  let statistics = 0;
  const strArray = pattern.split('');
  strArray.forEach(char => {
    const length = char.charCodeAt(0) > 128 ? 2 : 1;
    statistics += length;
  });

  // 中文字符按照宽度等于字符高度来判断，英文相应的为字符高度的一半
  const maxNumberALine = Math.floor(width / fontSize) * 2;
  return statistics > maxNumberALine * line;
}

// 获取用户位置
export function getUserPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        message: '用户手机不支持定位API',
      });
      return;
    }
    Toast.loading({
      mask: true,
      duration: 0,
      message: '获取定位中...',
    });
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude; // 纬度
      const longitude = position.coords.longitude; // 经度
      Toast.clear();
      resolve({
        latitude,
        longitude,
      });
    }, (err) => {
      Toast.clear();
      reject(err);
    });
  });
}

/**
 * 格式化金额,返回示例： 100， 100.1，100.11
 *
 * @param money 单位为分的整数
 * @returns String
 */
export function formatPrice(money) {
  if (money % 100 === 0) {
    return money / 100;
  } else if (money % 10 === 0) {
    return (money / 100).toFixed(1);
  }
  return (money / 100).toFixed(2);
}

/**
 * 销量数据格式化，如果销量>9999,显示1.2w，1.3w
 *
 * @param {number} salesNum
 * @returns {string || number}
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
