import { Toast } from 'vant';
import { ajax } from '@youzan/vis-ui';
import rawAjax from 'captain-ajax';
import compressImg from 'common/utils/compressImg';

// 最大上传大小
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// 开启压缩的临界值
const COMPRESS_THRESHOLD_SIZE = 3 * 1024 * 1024;

function buildUploadData({ file, token, saveToShop }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('token', token);
  // 用户上传的图片不需要存储到对应店铺的文件夹下
  if (saveToShop === false) {
    formData.append('x:skip_save', 1);
  }

  let ext = '';
  const exts = file.name.split('.');
  if (exts.length > 1) {
    ext = `.${exts[exts.length - 1]}`;
  }
  formData.append('x:ext', ext);

  return formData;
}

function handleUploadImg(file, options) {
  if (file.size > MAX_FILE_SIZE) {
    return Promise.reject('图片太大了~');
  }

  const { token = '', saveToShop = false } = options;
  let formData;

  if (token) {
    formData = buildUploadData({ file, token, saveToShop });
    return doUploadImg(formData);
  }

  return getUploadToken(file).then((data) => {
    formData = buildUploadData({ file, token: data.uptoken, saveToShop });
    return doUploadImg(formData);
  });
}

function getUploadToken(file) {
  return ajax({
    url: '/wscvis/getUploadToken.json',
    type: 'POST',
    errorMsg: '获取token失败',
  });
}

function doUploadImg(data) {
  // 调用七牛上传接口
  return rawAjax({
    url: '//up.qbox.me',
    type: 'POST',
    contentType: 'multipart/form-data',
    data,
  });
}

function uploadImg(file, options = {}) {
  if (file.size > COMPRESS_THRESHOLD_SIZE) {
    Toast('正在尝试压缩处理图片，请稍等');
    return compressImg(file, {
      // 压缩后最大边不大于4000，为了规避微信内执行图片压缩时，如果输出图片size过大，网页会闪退
      maxSide: 4000,
    }).then((compressedFile) => {
      return handleUploadImg(compressedFile, options);
    }).catch((err) => {
      console.log(err);
      return handleUploadImg(file, options);
    });
  }

  return handleUploadImg(file, options);
}

export default uploadImg;
