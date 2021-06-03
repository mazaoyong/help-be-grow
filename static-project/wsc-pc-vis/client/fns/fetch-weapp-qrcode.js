// 获取小程序码
// https://doc.qima-inc.com/pages/viewpage.action?pageId=47037959
import ajax from 'zan-pc-ajax/lib';
import get from 'lodash/get';

export default (pagepath, alias) => {
  const isVip = get(window._global, 'weappStatus.isValid');

  if (isVip) {
    // 专享版
    return ajax({
      url: `${_global.url.www}/weapp/config/WeappCode.json`,
      method: 'GET',
      rawResponse: true,
      data: { pagepath: `${pagepath}?alias=${alias}` },
    });
  } else {
    // 共享版
    let data = {
      isShare: 1,
      kdtId: 40419900,
      page: 'pages/common/blank-page/index',
      scene: {
        page: pagepath,
        kdtId: 40419900,
        guestKdtId: _global.kdt_id || _global.kdtId,
        alias,
      },
    };

    return ajax({
      url: `${_global.url.www}/weapp/config/WeappCodeUltra.json`,
      method: 'POST',
      rawResponse: true,
      data,
    });
  }
};
