import ajax from 'captain-ajax';

const commonLoginRequest = (url, data) => {
  return ajax({
    url,
    type: 'POST',
    dataType: 'json',
    data,
    withCredentials: true,
    timeout: 15000,
  });
};

// 同步登录状态

const syncKDTLoginStatus = (ticket) => {
  return ajax({
    url: 'https://uic.koudaitong.com/sso/ticket/auth',
    type: 'GET',
    dataType: 'json',
    timeout: 15000,
    data: {
      ticket: ticket,
    },
    withCredentials: true,
  });
};

const wapUrl = (window._global.wap_url || {}).wap || '';
const syncWapLoginStaus = (ticket) => {
  return ajax({
    url: wapUrl + '/buyer/auth/ssoConsist.json',
    type: 'GET',
    dataType: 'json',
    timeout: 15000,
    data: {
      /* eslint-disable */
      uic_login_token: ticket || ''
      /* eslint-enable */
    },
    withCredentials: true,
  });
};

export {
  commonLoginRequest,
  syncKDTLoginStatus,
  syncWapLoginStaus,
};
