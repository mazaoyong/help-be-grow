import ajax from 'fns/ajax';

export const getWechatQrcode = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu/getWeappQrcode.json',
    method: 'GET',
    data,
    loading: false,
  });
};

export const getQrcode = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu/getQrcode.json',
    method: 'GET',
    data,
    loading: false,
  });
};
