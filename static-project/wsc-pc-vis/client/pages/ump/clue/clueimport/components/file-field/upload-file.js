import ajax from 'zan-pc-ajax';

const uploadOptions = {
  categoryId: 2,
};

const options = {
  kdtId: window._global.kdtId,
  tokenUrl: '//www.youzan.com/v4/vis/edu/clue/import/getUploadToken.json',
  scope: 'kdt_file',
};

const uploadfile = (file, token) => {
  const formData = new FormData();

  formData.append('token', token);
  formData.append('file', file);
  if (uploadOptions.categoryId) {
    formData.append('x:categoryId', uploadOptions.categoryId);
  }

  return ajax({
    url: '//upload.qbox.me',
    method: 'post',
    disableCsrfToken: true,
    data: formData,
    contentType: 'multipart/form-data; charset=UTF-8',
    timeout: 5000,
    rawResponse: true,
  });
};

const getToken = () => {
  return ajax({
    url: options.tokenUrl,
    method: 'get',
    xhrFields: {
      withCredentials: true,
    },
    noXRequestedWithHeader: true,
  });
};

// 执行上传操作
export default function processUpload(file) {
  return getToken()
    .then(data => {
      let token = data.uploadToken || data;
      return uploadfile(file, token)
        .then(({ data }) => {
          return data.attachment_url;
        });
    });
}
