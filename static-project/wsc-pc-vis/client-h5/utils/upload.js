/**
 * 上传图片到 CDN
 */

import { Toast } from 'vant';
import compress from './compress';
import ajax from 'fns/ajax';

// 获取七牛上传 token
function getUploadToken() {
  const tokenUrl = window._global.url.v4 + '/vis/h5/edu/commom/material/getUploadToken.json';
  return ajax({
    url: tokenUrl,
    method: 'POST'
  });
}

// 拼接 form data
function getFormData(file, token) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('token', token);

  const exts = file.name.split('.');
  if (exts.length > 1) {
    formData.append('x:ext', `.${exts[exts.length - 1]}`);
  }

  return formData;
}

function doUploadImg(data) {
  // 调用七牛上传接口
  return ajax({
    url: '//up.qbox.me',
    method: 'POST',
    withCredentials: false,
    contentType: 'multipart/form-data',
    data
  });
}

function upload(file) {
  return getUploadToken().then(response => {
    const formData = getFormData(file, response.uptoken);
    return doUploadImg(formData);
  });
}

export default function(file, options = {}) {
  if (!options.noToast) {
    Toast('正在压缩图片，请稍候');
  }
  return new Promise((resolve, reject) => {
    compress(file, {
      maxWidth: 500,
      maxHeight: 500,
      ...options
    })
      .then(compressedFile => {
        upload(compressedFile)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}
