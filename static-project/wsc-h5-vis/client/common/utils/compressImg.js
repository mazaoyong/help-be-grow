/**
 * 图片压缩
 *
 * @param source {String|File}     传入待压缩图片来源，支持两种方式：
 *                                   1直接传入一个网络图片url
 *                                   2传入img file对象
 * @param options {Object}   压缩配置，示例如下：
 *                           {
 *                               width: 100, 设置width固定值，高度随比例缩放
 *                               height: 100, 设置height固定值，宽度随比例缩放，同时设置则固定宽高
 *                               maxWidth: 100, 设置最大宽度不大于100，高度随比例缩放
 *                               maxHeight: 100, 设置最大高度不大于100，宽度随比例缩放
 *                               maxSide: 100, 设置最大边不大于100，另外边随比例缩放
 *                               ratio: 0.5, 设置尺寸宽高同时缩放到指定比例，取值范围 0-1
 *                               //上述参数如果同时设置，优先级由上到下生效
 *                               quality: 0.5, 图片输出质量，取值范围0-1
 *                               type: 'image/jpeg' 图片输出格式
 *                           }
 * @return promise
 */
function dataURItoBlob(dataURI, type) {
  const img = dataURI.split(',')[1];
  const decode = window.atob(img);
  /* eslint-disable */
    let ab = new ArrayBuffer(decode.length);
    let ib = new Uint8Array(ab);
    /* eslint-enable */
  for (let i = 0; i < decode.length; i++) {
    ib[i] = decode.charCodeAt(i);
  }
  return new Blob([ib], {
    type: type,
  });
}

export default function compressImg(source, options) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let finalFileName = 'newImage';

    img.onerror = function(err) {
      reject(err);
    };

    img.onload = function() {
      try {
        options = options || {};

        // default width: origin width
        let finalWidth = this.width || 100;
        // default height: origin height
        let finalHeight = this.height || 100;

        // defalut quality: 0.6
        const finalQuality = options.quality || 0.6;

        // default type: 'image/jpeg'
        const finalType = options.type || 'image/jpeg';

        // calculate finalWidth & finalHeight
        if (options.width && options.height) {
          finalWidth = options.width;
          finalHeight = options.height;
        } else if (options.width && !options.height) {
          finalHeight = parseInt(finalHeight * (options.width / finalWidth), 10);
          finalWidth = options.width;
        } else if (options.height && !options.width) {
          finalWidth = parseInt(finalWidth * (options.height / finalHeight), 10);
          finalHeight = options.height;
        } else if (options.maxWidth) {
          if (finalWidth > options.maxWidth) {
            finalHeight = parseInt(finalHeight * (options.maxWidth / finalWidth), 10);
            finalWidth = options.maxWidth;
          }
        } else if (options.maxHeight) {
          if (finalHeight > options.maxHeight) {
            finalWidth = parseInt(finalWidth * (options.maxHeight / finalHeight), 10);
            finalHeight = options.maxHeight;
          }
        } else if (options.maxSide) {
          if (finalHeight >= finalWidth && finalHeight > options.maxSide) {
            finalWidth = parseInt(finalWidth * (options.maxSide / finalHeight), 10);
            finalHeight = options.maxSide;
          } else if (finalWidth > finalHeight && finalWidth > options.maxSide) {
            finalHeight = parseInt(finalHeight * (options.maxSide / finalWidth), 10);
            finalWidth = options.maxSide;
          }
        } else if (options.ratio) {
          finalWidth = parseInt(finalWidth * options.ratio, 10);
          finalHeight = parseInt(finalHeight * options.ratio, 10);
        }

        const canvas = document.createElement('canvas');
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, finalWidth, finalHeight);
        context.drawImage(this, 0, 0, finalWidth, finalHeight);

        const newBlob = dataURItoBlob(canvas.toDataURL(finalType, finalQuality), finalType);
        // 天坑告警：使用new File（）在ios上会有问题，生成的file放到formdata里content-length会变为0，上传会失败，特此记录！！！
        // const newFile = new File([newBlob], finalFileName, {type: finalType});
        // console.log('After compress:' + newFile.size / 1024 + 'kb');
        newBlob.name = finalFileName;
        resolve(newBlob);
      } catch (err) {
        reject(err);
      }
    };

    if (typeof source === 'string') {
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = source;
      finalFileName = source;
    } else if (typeof source === 'object' && source.toString().indexOf('File') >= 0) {
      // console.log('Before compress:' + source.size / 1024 + 'kb');
      const reader = new FileReader();
      reader.readAsDataURL(source);
      reader.onload = function(e) {
        img.src = e.target && e.target.result;
        if (source.name) {
          finalFileName = source.name;
        }
      };
    } else {
      reject(new Error('Error image source context'));
    }
  });
};
