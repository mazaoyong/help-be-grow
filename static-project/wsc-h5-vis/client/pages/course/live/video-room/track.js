export const logVideoRoom = alias => {
  window.yzlogInstance &&
    window.yzlogInstance.log({
      et: 'display',
      ei: 'enterpage',
      en: '浏览页面',
      pt: 'pclm',
      params: {
        alias,
      },
    });
};

export const logRewardEntry = alias => {
  window.yzlogInstance &&
    window.yzlogInstance.log({
      et: 'click', // 事件类型
      ei: 'reward_entry', // 事件标识
      en: '打赏入口', // 事件名称
      pt: 'liveVideoRoom', // 页面类型
      params: {
        alias,
      },
    });
};

export const logRewardPrice = (alias, realPay, type) => {
  window.yzlogInstance &&
    window.yzlogInstance.log({
      et: 'click', // 事件类型
      ei: 'reward_price', // 事件标识
      en: '打赏金额', // 事件名称
      pt: 'liveVideoRoom', // 页面类型
      params: {
        alias,
        realPay,
        type,
      },
    });
};
