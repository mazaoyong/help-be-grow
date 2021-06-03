/**
 * 图片压缩
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
 * @param cb {Function}    处理结果的回调，参数为（err, file),第一个参数为出错时的error对象，第二个为处理后的图片file对象
 * @return void
 */

import EXIF from 'exif-js';

function dataURItoBlob(dataURI, type) {
  var img = dataURI.split(',')[1];
  var decode = window.atob(img);
  /* eslint-disable */
  var ab = new ArrayBuffer(decode.length);
  var ib = new Uint8Array(ab);
  /* eslint-enable */
  for (var i = 0; i < decode.length; i++) {
    ib[i] = decode.charCodeAt(i);
  }
  return new Blob([ib], {
    type: type,
  });
}

export default function compressImg(source, options, cb) {
  var img = new Image();
  var finalFileName = 'newImage';
  let orientation;
  let degree = 0;
  let width;
  let height;

  img.onerror = function(err) {
    cb(err);
  };

  img.onload = function() {
    try {
      options = options || {};

      // default width: origin width
      var finalWidth = this.width || 100;
      // default height: origin height
      var finalHeight = this.height || 100;

      // defalut quality: 0.6
      var finalQuality = options.quality || 0.6;

      // default type: 'image/jpeg'
      var finalType = options.type || 'image/jpeg';

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

      var canvas = document.createElement('canvas');
      canvas.width = width = finalWidth;
      canvas.height = height = finalHeight;
      var context = canvas.getContext('2d');

      switch (orientation) {
      // iphone横屏拍摄，此时home键在左侧
        case 3:
          degree = 180;
          finalWidth = -width;
          finalHeight = -height;
          break;
        // iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
        case 6:
          canvas.width = height;
          canvas.height = width;
          degree = 90;
          finalWidth = width;
          finalHeight = -height;
          break;
        // iphone竖屏拍摄，此时home键在上方
        case 8:
          canvas.width = height;
          canvas.height = width;
          degree = 270;
          finalWidth = -width;
          finalHeight = height;
          break;
      }

      context.clearRect(0, 0, finalWidth, finalHeight);
      // 使用canvas旋转校正
      context.rotate(degree * Math.PI / 180);
      context.drawImage(this, 0, 0, finalWidth, finalHeight);

      var newBlob = dataURItoBlob(canvas.toDataURL(finalType, finalQuality), finalType);
      // 天坑告警：使用new File（）在ios上会有问题，生成的file放到formdata里content-length会变为0，上传会失败，特此记录！！！
      // var newFile = new File([newBlob], finalFileName, {type: finalType});
      // console.log('After compress:' + newFile.size / 1024 + 'kb');
      newBlob.name = finalFileName;
      cb(null, newBlob);
    } catch (err) {
      cb(err);
    }
  };

  if (typeof source === 'string') {
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = source;
    finalFileName = source;
  } else if (typeof source === 'object' && source.toString().indexOf('File') >= 0) {
    // console.log('Before compress:' + source.size / 1024 + 'kb');

    EXIF.getData(source, function() {
      orientation = EXIF.getTag(this, 'Orientation');
      var reader = new FileReader();
      reader.readAsDataURL(source);
      reader.onload = function(e) {
        img.src = e.target && e.target.result;
        if (source.name) {
          finalFileName = source.name;
        }
      };
    });
  } else {
    cb(new Error('Error image source context'));
  }
};
