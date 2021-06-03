// 复制于 react-component，暂无法用 ts 重构
import { Notify } from 'zent';
import ajax from 'zan-pc-ajax';
import format from 'date-fns/format';
import { responseParse, createObjectURL, formatError } from './utils';

const uploadfile = (options, file, token, uploadOptions) => {
  let formData = new FormData();

  file = file.file;
  const newName = options.fileName(format(+new Date(), 'YYYYMMDDHHmmss'));

  formData.append('token', token);
  formData.append('file', file, newName);
  if (uploadOptions.categoryId) {
    formData.append('x:categoryId', uploadOptions.categoryId);
  }

  return ajax({
    url: options.uploadUrl,
    method: 'post',
    disableCsrfToken: true,
    data: formData,
    contentType: 'multipart/form-data; charset=UTF-8',
    timeout: options.timeout,
    rawResponse: true,
    onUploadProgress(evt) {
      options.onProgress((evt.loaded * 100) / evt.total);
    },
  });
};

let getToken = options => {
  return ajax({
    url: options.tokenUrl,
    method: 'post',
    xhrFields: {
      withCredentials: true,
    },
    noXRequestedWithHeader: true,
    data: {
      kdt_id: options.kdtId, // required
      scope: options.scope,
    },
  });
};

// 执行上传操作
export default function processUpload(options, files, uploadOptions) {
  if (typeof options.onGetToken === 'function') {
    getToken = options.onGetToken;
  }

  let values = files.filter(item => item);
  if (!(values && values.length > 0)) return;

  let resolve;
  let reject;
  // eslint-disable-next-line
  let promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  getToken(options)
    .then(data => {
      let token = data.uptoken || data;
      let uploadResult = [];
      files = values;
      let upload = index => {
        if (files[index]) {
          uploadfile(
            {
              ...options,
              onProgress: (idx => progress => {
                let onProgress =
                  typeof options.onProgress === 'function'
                    ? options.onProgress
                    : uploadOptions.onProgress;
                if (typeof onProgress === 'function') {
                  onProgress(progress, idx, createObjectURL(files[idx].file));
                }
              })(index),
            },
            files[index],
            token,
            uploadOptions,
          )
            .then(file => {
              file = file.data;
              file = responseParse(file);
              uploadResult.push(file);
              upload(index);
            })
            .catch(resp => {
              let errorMsg = resp && (resp.error || resp.msg);
              !options.silent && Notify.error(formatError(resp, { maxSize: options.maxSize }));
              options.onError(errorMsg);
              reject();
            });
        } else if (uploadResult.length > 0) {
          !options.silent && Notify.success('上传成功');
          options.onSuccess(uploadResult);
          resolve();
        }
        index++;
      };
      upload(0);
    })
    .catch(resp => {
      !options.silent && Notify.error(formatError(resp));
      options.onError(resp);
      reject();
    });

  return promise;
}
