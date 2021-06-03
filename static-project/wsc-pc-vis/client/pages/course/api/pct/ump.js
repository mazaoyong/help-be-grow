// 营销相关接口
import ajax from 'fns/ajax';

const urlHead = window._global.url.www || '//www.youzan.com/v2';

const makeRequest = (method, path, data = {}) => {
  const options = {
    url: `${urlHead}${path}`,
    method,
    data,
  };
  return ajax(options);
};

// 检测当前商品是否在拼团
export const checkGrouponAPI = alias => {
  return makeRequest('GET', '/ump/paidcontent/goodsPromotion.json', {
    alias,
  });
};
