// track 平台项目地址：http://track.qima-inc.com/projects/349

export function logInPage(params) {
  window.yzlogInstance &&
    window.yzlogInstance.log({
      et: 'display',
      ei: 'enterpage',
      en: '访问课程套餐列表页',
      pt: 'visPackageBuy',
      params,
    });
}

export function logClickSubmit(params) {
  window.yzlogInstance &&
    window.yzlogInstance.log({
      et: 'click',
      ei: 'submit',
      en: '点击购买',
      pt: 'visPackageBuy',
      params,
    });
}
