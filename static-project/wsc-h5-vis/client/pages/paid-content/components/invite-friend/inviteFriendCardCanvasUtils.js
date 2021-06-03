import { getImageWidth } from 'pct/utils';

function getScreenRatio(context) {
  // 获取屏幕dpr/canvas-ratio
  const backingStore = context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
  const deviceRatio = window.devicePixelRatio || 1;
  return deviceRatio / backingStore;
};

function initCanvasContext(width, height) {
  // 创建canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const ratio = getScreenRatio(ctx);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return [canvas, ctx];
};

/**
 * left圆角矩形
 */
function drawLeftRoundRect(x, y, width, height, radius, context) {
  context.beginPath();
  context.moveTo(x + radius, y);
  // top right radius
  context.arcTo(x + width, y, x + width, y, radius);
  // buttom right radius
  context.arcTo(x + width, y + height, x + width, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
  context.fill();
};

/**
 * top圆角矩形
 */
function drawTopRoundRect(x, y, width, height, radius, context) {
  context.beginPath();
  context.moveTo(x + radius, y);
  // top right radius
  context.arcTo(x + width, y, x + width, y + height, radius);
  // bottom right radius
  context.arcTo(x + width, y + height, x + width, y + height, radius);
  // bottom left radius
  context.arcTo(x, y + height, x, y + height, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
  context.fill();
};

/**
 * fill text
 *
 * @param {string} text 内容
 * @param {number} x 坐标
 * @param {number} y 坐标
 * @param {*} context ctx
 */
function fillText(text, x, y, fillStyle, font, textAlign, context) {
  context.save();
  setFillTextOptions(fillStyle, font, textAlign, context);
  if (text.length < 22) {
    // 单行显示
    context.fillText(text, x, y);
  } else { // 多行文字处理
    const textTop = text.slice(0, 22);
    let textBottom;
    if (text.length > 44) {
      textBottom = text.slice(22, 42) + '...';
    } else {
      textBottom = text.slice(22, 44);
    }
    context.fillText(textTop, x, y);
    context.fillText(textBottom, x, y + 20);
  }
  context.restore();
};

// 绘制商品类型
function drawContentType(contentType, context) {
  const width = 44;
  const beginX = 280 - width;
  const beginY = 20;
  context.save();
  context.fillStyle = 'rgba(0, 0, 0, 0.4)';
  drawLeftRoundRect(beginX, beginY, width, 20, 10, context);
  context.fillStyle = '#fff';
  context.font = '12px Arial';
  context.textAlign = 'center';
  context.fillText(contentType, beginX + (width / 2) + 2, beginY + 14);
  context.restore();
};

function setFillTextOptions(fillStyle, font, textAlign, ctx) {
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
  }
  if (font) {
    ctx.font = font;
  }
  if (textAlign) {
    ctx.textAlign = textAlign;
  }
  return ctx;
}

// 二维码为base64,image对象设置跨域参数后在ios9及10下有兼容性问题，故单独处理
function loadQrImage(src) {
  return new Promise((resolve, reject) => {
    const qrImg = new Image();
    qrImg.src = src;
    qrImg.onload = () => {
      resolve(qrImg);
    };
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
  });
}

function drawGoodsImage(x, y, width, height, radius, img, context) {
  context.save();
  drawTopRoundRect(x, y, width, height, radius, context);
  context.clip();
  const imgSize = getImageWidth(img, width, height);
  context.drawImage(img, (width - imgSize.width) / 2, (height - imgSize.height) / 2, imgSize.width, imgSize.height);
  context.restore();
}

// 画圆形图片
function circleRect(ctx, img, x, y, r) {
  var cx = x + r;
  var cy = y + r;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.closePath();
}

function drawAvatarImage(x, y, radius, img, context) {
  context.save();
  circleRect(context, img, x, y, radius);
  context.clip();
  const d = 2 * radius;
  context.drawImage(img, x, y, d, d);
  context.restore();
}

function getContentTitle(title) {
  if (title.length > 15) {
    return `${title.slice(0, 14)}...`;
  }
  return title;
}

function drawInviteCard(cardInfo) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = cardInfo.qrSrc;
    const cardBackgroundUrl = `https://img01.yzcdn.cn/public_files/2018/05/07/3b773de852d622ec59a6ca4ff719e2bd.png`;
    Promise.all([
      loadImage(cardBackgroundUrl),
      loadImage(cardInfo.goodsImgSrc),
      loadQrImage(cardInfo.qrSrc),
      loadImage(cardInfo.avatarSrc),
    ]).then((res) => {
      const [canvas, ctx] = initCanvasContext(280, 470);

      // 绘制背景图片
      ctx.drawImage(res[0], 0, 0, 280, 460);

      // 绘制商品图片
      drawGoodsImage(0, 0, 280, 160, 4, res[1], ctx);

      // 绘制右上角商品类型
      drawContentType(cardInfo.contentType, ctx);

      // 内容title
      const contentTitle = getContentTitle(cardInfo.title);
      fillText(contentTitle, 20, 190, '#4A4A4A', '500 16px PingFang SC', 'start', ctx);
      // 内容描述信息
      fillText(cardInfo.contentInfoText, 20, 210, '#999999', '12px PingFang SC', 'start', ctx);

      // 绘制二维码
      // 二维码起始位置
      const beginHeight = 260;
      ctx.drawImage(res[2], 100, beginHeight, 90, 90);
      const tips = '长按扫码查看内容';
      fillText(tips, 145, beginHeight + 100, '#999999', '10px PingFang SC', 'center', ctx);

      // 头像绘制
      drawAvatarImage(20, 404, 20, res[3], ctx);
      // 头像信息
      fillText(cardInfo.nicname, 70, 424, '#4A4A4A', '16px PingFang SC', 'start', ctx);
      fillText(cardInfo.inviteText, 70, 444, '#999999', '12px PingFang SC', 'start', ctx);

      resolve(canvas.toDataURL('image/png'));
    });
  });
}

export default {
  drawInviteCard,
};
