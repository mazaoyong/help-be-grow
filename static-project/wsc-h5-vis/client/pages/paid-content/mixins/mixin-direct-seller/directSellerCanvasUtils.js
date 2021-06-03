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

function getOriginSizeImg(src) {
  // 商品详情从小webp 转回原有
  const regex = /\/w\/\d+\/h\/\d+/g;
  if (!regex.test(src)) {
    return src;
  }
  return src.replace(regex, '/w/980/h/980');
};

function drawRoundRect(x, y, width, height, radius, context) {
  // 绘制圆角矩形
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
  context.fill();
};

function drawImage(src, x, y, w, h, context) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      context.drawImage(img, x, y, w, h);
      resolve();
    };
  });
};

function drawCoverImage(src, destShape, destPositionX, destPositionY, context) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = function() {
      const w = img.width;
      const h = img.height;
      const scale = Math.min(w, h) / destShape;
      const beginPoint = (Math.max(w, h) - (destShape * scale)) / 2;
      if (w > h) {
        context.drawImage(
          img,
          beginPoint,
          0,
          destShape * scale,
          destShape * scale,
          destPositionX,
          destPositionY,
          destShape,
          destShape
        );
      } else {
        context.drawImage(
          img,
          0,
          beginPoint,
          destShape * scale,
          destShape * scale,
          destPositionX,
          destPositionY,
          destShape,
          destShape
        );
      }
      resolve();
    };
  });
};

// 业务方法，不公用
function handleText(text, context) {
  // 多行文字处理
  if (text.length < 22) {
    // 单行显示
    context.fillText(text, 150, 310);
  } else {
    const textTop = text.slice(0, 22);
    let textBottom;
    if (text.length > 44) {
      textBottom = text.slice(22, 42) + '...';
    } else {
      textBottom = text.slice(22, 44);
    }
    context.textAlign = 'center';
    context.fillText(textTop, 150, 310);
    context.fillText(textBottom, 150, 330);
  }
};

function drawGoodsPrice(price, context) {
  let width;
  // canvas 对‘撑开’ 不易实现，只能写死计算
  price += '';
  if (price.indexOf('.') !== -1) {
    width = 15 + (price.length - 1) * 8.9;
  } else {
    width = 15 + price.length * 8.9;
  }
  // 计算完容器宽度
  const beginX = 280 - width;
  const beginY = 257;
  context.fillStyle = 'rgba(0, 0, 0, 0.2)';
  drawRoundRect(beginX, beginY, width, 20, 3, context);
  context.fillStyle = '#fff';
  context.font = '12px Arial';
  context.fillText('￥' + price, beginX + (width / 2) - 1, beginY + 14);
};

function generateQr(qrSrc) {
  // 生成二维码
  const [canvas, ctx] = initCanvasContext(300, 330);
  ctx.fillStyle = '#fff';
  drawRoundRect(0, 0, 300, 330, 4, ctx);
  ctx.fill();
  return drawImage(qrSrc, 25, 40, 250, 250, ctx)
    .then(() => {
      return canvas.toDataURL('image/png');
    });
};

function generateSimpleImgQr(qrSrc) {
  // 非商品页图文二维码
  const [canvas, ctx] = initCanvasContext(300, 415);
  const src = 'https://img01.yzcdn.cn/public_files/2017/09/01/37855a4757f3fdc90051eccdfa41d660.png';
  return drawImage(src, 0, 0, 300, 415, ctx).then(() => {
    ctx.fillStyle = '#333';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('发现一些好货，邀你一起看看', 150, 44);

    return drawImage(qrSrc, 50, 125, 200, 200, ctx).then(() => {
      ctx.fillStyle = '#666';
      ctx.font = '14px Arial';
      ctx.fillText('长按识别二维码', 150, 347);
      return canvas.toDataURL('image/png');
    });
  });
};

function generateImgQr(goodsImg, qrSrc, price, title, logo) {
  const [canvas, ctx] = initCanvasContext(300, 470);
  ctx.fillStyle = '#fff';
  drawRoundRect(0, 0, 300, 470, 4, ctx);
  ctx.fill();
  const src = getOriginSizeImg(goodsImg);
  return drawCoverImage(src, 280, 10, 10, ctx).then(() => {
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    handleText(title, ctx);
    // 根据字数调整二维码位置
    const beginHeight = (title.length > 22) ? 340 : 327;
    return drawImage(qrSrc, 102.5, beginHeight, 95, 95, ctx).then(() => {
      const tips = '长按识别二维码';
      ctx.fillText(tips, 150, beginHeight + 113);
      if (+price !== 0) {
        drawGoodsPrice(price, ctx);
      }
      return drawImage(logo, 140, beginHeight + 40, 20, 20, ctx).then(() => {
        return canvas.toDataURL('image/png');
      });
    });
  });
};

export default {
  generateQr,
  generateSimpleImgQr,
  generateImgQr,
};
