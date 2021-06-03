import ajax from 'captain-ajax';
const salesmanWapUrl = window._global.url.wap.slice(0, -2) + 'salesman';

const Api = {
  // 获取分销员信息
  getShareData(data) {
    return ajax({
      url: `${salesmanWapUrl}/share/recommend/getShare`,
      data,
      loading: false,
      withCredentials: true,
    });
  },
  // 分销员
  getSellerData(data) {
    return ajax({
      url: `${salesmanWapUrl}/share/recommend/popboxJson`,
      dataType: 'json',
      data,
      loading: false,
      withCredentials: true,
    });
  },
};

export default Api;
