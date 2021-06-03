import _ajax from 'captain-ajax';

const baseUrl = 'https://www.youzan.com';

// const { kdtId } = window._global;

// 对ajax进行包裹
const ajax = options => {
  const { url, data, ...resOpts } = options;
  return new Promise((resolve, reject) => {
    _ajax({
      ...resOpts,
      withCredentials: true,
      url: options.absolutePath ? url : `${baseUrl}${url}`,
      // data: Object.assign({ kdtId }, data),
      data,
    })
      .then(res => {
        if (res && res.code === 0) {
          const data = res.data || {};
          resolve(data);
        } else {
          reject({
            code: res.code || -1,
            msg: res.msg || '',
          });
        }
      })
      .catch(error => {
        reject({
          code: -1,
          msg: error.msg || '',
        });
      });
  });
};

export default ajax;
