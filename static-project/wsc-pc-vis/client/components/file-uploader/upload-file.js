import ajax from 'zan-pc-ajax';

const uploadOptions = {
  categoryId: 2,
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
    timeout: 15000,
    rawResponse: true,
  });
};

const getToken = (tokenUrl, channel) => {
  return ajax({
    url: tokenUrl,
    method: 'get',
    data: { channel },
    xhrFields: {
      withCredentials: true,
    },
    noXRequestedWithHeader: true,
  });
};

// 执行上传操作
export default function processUpload(file, { tokenUrl, channel }) {
  return getToken(tokenUrl, channel)
    .then(data => {
      let token = data.uploadToken || data;
      return uploadfile(file, token)
        .then(({ data }) => {
          return data.attachment_url;
        });
    });
}
