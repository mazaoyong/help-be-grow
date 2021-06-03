/**
 * 图片压缩
 * @param source {String|File} 传入待压缩图片来源，支持两种方式：
 *                             1. 直接传入一个网络图片url（注：不处理 ios 图片旋转）
 *                             2. 传入img file对象
 * @param options {Object} 压缩配置，示例如下：
 *                         {
 *                            width: 100, 设置width固定值，高度随比例缩放
 *                            height: 100, 设置height固定值，宽度随比例缩放，同时设置则固定宽高
 *                            maxWidth: 100, 设置最大宽度不大于100，高度随比例缩放
 *                            maxHeight: 100, 设置最大高度不大于100，宽度随比例缩放
 *                            maxSide: 100, 设置最大边不大于100，另外边随比例缩放
 *                            ratio: 0.5, 设置尺寸宽高同时缩放到指定比例，取值范围 0-1
 *                            //上述参数如果同时设置，优先级由上到下生效
 *                            quality: 0.5, 图片输出质量，取值范围0-1
 *                            type: 'image/jpeg' 图片输出格式
 *                            watermark: Image 图片水印
 *                         }
 * @return promise
 */
import { getExifTags } from './exif';

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
  return new Blob([ib], { type });
}

function createCanvas(width, height, orientation) {
  const canvas = document.createElement('canvas');
  switch (orientation) {
    case 5:
    case 6:
    case 7:
    case 8:
      canvas.width = height;
      canvas.height = width;
      break;
    default:
      canvas.width = width;
      canvas.height = height;
  }
  return canvas;
}

function transformCoordinate(ctx, width, height, orientation) {
  switch (orientation) {
    case 2:
      // horizontal flip
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      // 180 rotate left
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 4:
      // vertical flip
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;
    case 5:
      // vertical flip + 90 rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6:
      // 90 rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -height);
      break;
    case 7:
      // horizontal flip + 90 rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(width, -height);
      ctx.scale(-1, 1);
      break;
    case 8:
      // 90 rotate left
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-width, 0);
      break;
    default:
      break;
  }
}

function getImageOptions(img, options) {
  // default width: origin width
  let finalWidth = img.width || 100;
  // default height: origin height
  let finalHeight = img.height || 100;

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

  options.finalWidth = finalWidth;
  options.finalHeight = finalHeight;
  options.finalType = options.type || 'image/jpeg';
  options.finalQuality = options.quality || 0.6;
}

function getImage(img, options) {
  // Init Data
  getImageOptions(img, options);
  const {
    finalType,
    orientation,
    finalQuality,
    finalFileName,
    finalWidth: width,
    finalHeight: height,
  } = options;

  // Draw Image
  const canvas = createCanvas(width, height, orientation);
  const context = canvas.getContext('2d');
  context.save();
  transformCoordinate(context, width, height, orientation);
  context.clearRect(0, 0, width, height);
  context.drawImage(img, 0, 0, width, height);
  context.restore();

  // Draw Watermark
  const { watermark } = options;
  if (watermark) {
    const { width: canvasWidth, height: canvasHeight } = canvas;
    const markScale = canvasWidth / 2 / watermark.width;
    const markWidth = watermark.width * markScale;
    const markHeight = watermark.height * markScale;
    context.drawImage(
      watermark,
      (canvasWidth - markWidth) / 2,
      (canvasHeight - markHeight) / 2,
      markWidth,
      markHeight
    );
  }

  // Canvas -> DataURI -> Blob
  const newBlob = dataURItoBlob(canvas.toDataURL(finalType, finalQuality), finalType);
  newBlob.name = finalFileName;
  return newBlob;
}

export default function compressImg(source, options) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    options = options || {};
    options.finalFileName = 'newImage';

    img.onerror = function(err) {
      reject(err);
    };

    img.onload = function() {
      getExifTags(this)
        .then(tags => {
          options.orientation = tags && tags.orientation;
          const file = getImage(this, options);
          resolve(file);
        })
        .catch(err => {
          reject(err);
        });
    };

    if (typeof source === 'string') {
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = source;
      options.finalFileName = source;
    } else if (typeof source === 'object' && /File|Blob/.test(source.toString())) {
      const reader = new FileReader();
      reader.readAsDataURL(source);
      reader.onload = function(e) {
        img.src = e.target && e.target.result;
        if (source.name) {
          options.finalFileName = source.name;
        }
      };
    } else {
      reject(new Error('Error image source context'));
    }
  });
}
