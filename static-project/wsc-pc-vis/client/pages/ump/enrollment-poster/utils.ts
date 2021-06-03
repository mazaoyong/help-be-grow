import ajax from 'zan-pc-ajax';
import { IImageCDNData } from './types';

/**
 * 图片转为base64格式
 *
 * @param {string} url 图片地址
 * @return {Promise}
 */
export function toBase64(url: string): Promise<string> {
  let canvas = document.createElement('canvas'); // 创建canvas DOM元素
  let ctx = canvas.getContext('2d');
  let img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;
  return new Promise<string>((resolve, reject) => {
    img.onload = function() {
      canvas.height = img.height; // 指定画板的高度,自定义
      canvas.width = img.width; // 指定画板的宽度，自定义
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 参数可自定义
      } else {
        reject();
      }
      let dataURL: string = canvas.toDataURL();
      // @ts-ignore
      canvas = null;
      resolve(dataURL); // 回掉函数获取Base64编码
    };
  });
}

/**
 * base64url转为blob
 *
 * @param {string} dataUrl base64图片地址
 * @return {Blob|null}
 */
export function dataUrlToBlob(dataUrl: string): Blob | null {
  // 得到base64的内容 data:MIME_TYPE/MIME_EXT,BASE-64__CONTENT
  const arr = dataUrl.split(',');
  const mimes = arr[0].match(/:(.*?);/);
  if (!mimes || mimes.length < 1) {
    return null;
  }
  // 获取mime
  const mime = mimes[1];
  /**
   * 将base64字符串内容转成ArrayBuffer
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#Appendix.3A_Decode_a_Base64_string_to_Uint8Array_or_ArrayBuffer
   * base64 encoding and decoding
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
   */
  const bStr = atob(arr[1]);
  let n = bStr.length;
  const unit8Array = new Uint8Array(n);
  while (n--) {
    unit8Array[n] = bStr.charCodeAt(n);
  }
  const blob = new Blob([unit8Array], { type: mime });
  return blob;
}

/**
 * blob类型转为file
 *
 * @param {Blob} theBlob blob实例
 * @param {string} fileName 文件名
 * @return {File}
 */
export function blobToFile(theBlob: Blob, fileName: string): File {
  var b: any = theBlob;
  // A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;

  // Cast to a File() type
  return theBlob as File;
}

/**
 * 获取店铺素材银行token
 *
 * @param {string} channel 业务名称
 * @return {Promise}
 */
export function getToken(channel: string): Promise<any> {
  return ajax({
    url: `${_global.url.materials}/shop/pubImgUploadToken.json`,
    method: 'post',
    withCredentials: true,
    noXRequestedWithHeader: true,
    data: {
      kdt_id: _global.kdtId, // required
      channel: channel,
    },
  });
}

/**
 * 获取通用素材银行token
 *
 * @param {string} channel 业务名称
 * @return {Promise}
 */
export function getCommonToken(channel: string): Promise<any> {
  return ajax({
    url: `${_global.url.materials}/storage/pubImgUploadToken.json`,
    method: 'post',
    withCredentials: true,
    noXRequestedWithHeader: true,
    data: {
      kdt_id: _global.kdtId, // required
      channel: channel,
    },
  });
}

/**
 * 上传文件到七牛
 *
 * @param {File} file 文件
 * @param {string} token token
 * @return {Promise}
 */
export function uploadfile(file: File, token: string) {
  let formData = new FormData();

  formData.append('token', token);
  formData.append('file', file);

  return ajax({
    url: '//upload.qiniup.com',
    method: 'post',
    // disableCsrfToken: true,
    data: formData,
    contentType: 'multipart/form-data; charset=UTF-8',
    timeout: 60 * 1000,
    rawResponse: true,
  });
}

/**
 * 上传二维码到CDN
 *
 * @param {string} qrcode 二维码
 * @return {Promise}
 */
export function uploadQrcodeToCDN(qrcode: string): Promise<IImageCDNData> {
  const channel = 'ckt_qr_img';
  const blob = dataUrlToBlob(qrcode);
  if (blob === null) {
    return Promise.reject();
  }
  const file = blobToFile(blob, channel);
  return new Promise((resolve, reject) => {
    getCommonToken(channel)
      .then(data => {
        const token = data.uptoken || data;
        uploadfile(file, token)
          .then(resp => {
            resolve(resp.data);
          })
          .catch(() => {
            reject();
          });
      })
      .catch(() => {
        reject();
      });
  });
}

export function createUniqueResourceAlias(): string {
  const timestamp = Date.now();
  return `${_global.kdtId}_${timestamp}`;
};
