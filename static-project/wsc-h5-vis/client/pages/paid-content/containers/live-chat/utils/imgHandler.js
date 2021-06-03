import get from 'lodash/get';
import apis from 'pct/api';
import { newMsg } from './msg';
import compressImg from './imgCompress';
import { Toast } from 'vant';

import { IMG_UPLOAD_MAX } from '../constants';

let imgCallbackFn = () => {};
let errorFn = () => {};

export default class ImgHandler {
  static addImgStatusListener = (fn) => {
    imgCallbackFn = fn;
  }

  static addErrorListener = (fn) => {
    errorFn = fn;
  }

  static uploadImg = ({
    msgObj = null,
  }) => {
    return new Promise((resolve, reject) => {
      // 调服务端接口
      // 发送成功后抛出成功事件
      const msg = msgObj || {};
      apis.getImgUploadToken({
        size: IMG_UPLOAD_MAX,
      }, true)
        .then((data) => {
          const token = data;

          let formData = new FormData();
          formData.append('token', token);
          formData.append('file', msg.fromMsg.mediaUrl.file);

          apis.postImg(formData)
            .then((data) => {
              msg.fromMsg.mediaUrl = data.attachment_url;
              msg.fromMsg.content = data.attachment_url;
              imgCallbackFn({
                type: 'end-parsed',
                value: msg,
              });
              resolve(msg);
              formData = null;
            })
            .catch(() => {
              errorFn({
                type: 'error',
                value: msg,
              });
              formData = null;
            });
        })
        .catch(() => {
          errorFn({
            type: 'error',
            value: msg,
          });
        });
    });
  }

  constructor({ file, maxSize = 0 }) {
    console.log('初始的图片', file);
    this.maxSize = maxSize;
    this.file = file;
  }

  uploadImg() {
    const makeMsg = (sourceFile) => {
      compressImg(sourceFile.file, {
        type: get(sourceFile, 'file.type'),
      }, (err, file) => {
        console.log('err', err);
        if (err) {
          return Toast('此图片上传失败');
        }
        const compressFile = {
          ...sourceFile,
          file,
        };
        console.log('压缩完的图片', compressFile);

        // maxSize 不传则不校验大小
        if (compressFile.file.size > this.maxSize && this.maxSize > 0) {
          return Toast(`图片需要小于${parseInt(this.maxSize / 1024 / 1024)}MB`);
        }
        const msg = newMsg({
          content: compressFile,
          msgType: 'image',
        });
        imgCallbackFn({
          type: 'end',
          value: msg,
        });
        ImgHandler.uploadImg({
          msgObj: msg,
        });
      });
    };

    if (Array.isArray(this.file)) {
      this.file.forEach(element => {
        makeMsg(element);
      });
    } else {
      makeMsg(this.file);
    }
  }
};
