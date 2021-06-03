/**
 * From './utils.js'
 * Modified by WangChen
 */
export const getScreenRatio = (function(context) {
  let ratio;

  return function(context) {
    if (ratio) return ratio;

    // 获取屏幕dpr/canvas-ratio
    const backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    const deviceRatio = window.devicePixelRatio || 1;

    ratio = deviceRatio / backingStore;
    return ratio;
  };
})();

/**
 * 计算文字占用行数';
 *
 * @param ctx         画布
 * @param content     内容
 * @param maxWidth    最大宽度
 * @param fontSize    字体大小
 */
export function calcLineAmount(ctx, content, maxWidth, fontSize = 12, fontFamily = 'serif') {
  ctx.font = `${fontSize}px ${fontFamily}`;
  return Math.ceil(ctx.measureText(content).width / maxWidth);
}

export function calcLineAmountV2(ctx, content, maxWidth, fontSize, fontFamily, fontWeight) {
  if (typeof content !== 'string') {
    throw new Error('The value of Text type need to be String');
  }

  const contentArr = content.split('');
  const maxFontAmount =
  (maxWidth / (calcLineWidth(ctx, content, fontSize, fontFamily, fontWeight) / contentArr.length)) >> 0;
  let line = 0;

  while (contentArr.length) {
    line += 1;
    contentArr.splice(0, maxFontAmount).join('');

    if (line > 99999) {
      throw new Error('calcLineAmount 计算超出 99999 限制');
    }
  }

  return line;
}

export function calcLineWidth(ctx, content, fontSize = 12, fontFamily = 'serif', fontWeight = 400) {
  ctx.save();
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const width = ctx.measureText(content).width;
  ctx.restore();
  return width;
}

export function loadUrlImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
  });
}

export function loadBase64Image(src) {
  return new Promise((resolve, reject) => {
    const qrImg = new Image();
    qrImg.src = src;
    qrImg.onload = () => {
      resolve(qrImg);
    };
  });
}

/**
 * 计算文字宽度
 *
 * @param ctx         画布
 * @param content     内容
 * @param fontSize    字体大小
 */
export function measureContentLength(ctx, content, fontSize = 12, fontFamily = 'serif') {
  ctx.font = `${fontSize}px ${fontFamily}`;
  return ctx.measureText(content).width;
}

/**
 * 绘制单行文字
 *
 * @param ctx         画布
 * @param content     内容
 * @param x           绘制左下角原点 x 坐标
 * @param y           绘制左下角原点 y 坐标
 * @param fontSize    字体大小
 * @param fontFamily  字体家族
 * @param color       字体颜色
 * @param textAlign   字体排布
 * @param lineHeight  设置行高
 */
export function drawTextLine(
  ctx,
  content,
  x,
  y,
  fontSize = 12,
  fontFamily = 'serif',
  color = '#333',
  textAlign = 'left',
  lineHeight = fontSize,
) {
  y -= (lineHeight - fontSize) / 2;

  ctx.textAlign = textAlign;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.fillText(content, x, y);
}

/**
 * 绘制多行片段
 *
 * @param ctx         画布
 * @param content     内容
 * @param x           绘制左下角原点 x 坐标
 * @param y           绘制左下角原点 y 坐标
 * @param maxWidth    最大宽度
 * @param fontSize    字体大小
 * @param fontFamily  字体家族
 * @param color       字体颜色
 * @param textAlign   字体排布
 * @param lineHeight  设置行高
 */
export function drawParagraph(
  ctx,
  content,
  x,
  y,
  maxWidth,
  fontSize = 12,
  fontFamily = 'serif',
  color = '#333',
  textAlign = 'left',
  lineHeight = fontSize,
  maxLine = -1,
) {
  let line = 0;
  // 获取几行文字
  const maxFontLine = calcLineAmount(ctx, content, maxWidth, fontSize);

  const maxFontAmount = (maxWidth / fontSize) >> 0;
  const contentArr = content.split('');
  while (contentArr.length) {
    line += 1;
    const drawingText = contentArr.splice(0, maxFontAmount).join('');
    if (line < maxLine || maxLine === -1) {
      drawTextLine(ctx, drawingText, x, y, fontSize, fontFamily, color, 'left', lineHeight);
    } else if (line === maxLine) {
      if (maxFontLine > maxLine) {
        drawTextLine(
          ctx,
          `${drawingText.substr(0, drawingText.length - 2)}...`,
          x,
          y,
          fontSize,
          fontFamily,
          color,
          'left',
          lineHeight,
        );
      } else {
        drawTextLine(ctx, drawingText, x, y, fontSize, fontFamily, color, 'left', lineHeight);
      }
    }
    y += lineHeight;
  }
}

/**
 * 绘制多行片段
 *
 * @param ctx         画布
 * @param content     内容
 * @param x           绘制左下角原点 x 坐标
 * @param y           绘制左下角原点 y 坐标
 * @param maxWidth    最大宽度
 * @param fontSize    字体大小
 * @param fontFamily  字体家族
 * @param color       字体颜色
 * @param textAlign   字体排布
 * @param lineHeight  设置行高
 */
export function drawParagraphV2(
  ctx,
  content,
  x,
  y,
  maxWidth,
  fontSize,
  fontFamily,
  color,
  textAlign,
  lineHeight = fontSize,
  maxLine = -1,
  fontWeight = 400,
) {
  ctx.save();

  let line = 0;
  // 获取几行文字
  const maxFontLine = calcLineAmountV2(ctx, content, maxWidth, fontSize, fontFamily, fontWeight);

  const contentArr = content.split('');
  const maxFontAmount =
  (maxWidth / (calcLineWidth(ctx, content, fontSize, fontFamily, fontWeight) / contentArr.length)) >> 0;

  while (contentArr.length) {
    line += 1;
    let countOfWrodFix = 0;
    let remainingText = contentArr.join('');
    let alreadyCount = maxFontAmount;
    let drawingText = remainingText.substr(0, alreadyCount);
    let measuredTextWidth = calcLineWidth(ctx, drawingText, fontSize, fontFamily, fontWeight);

    // 循环条件
    // 计算的当前行与容器宽度差值 大于 一个字体的宽 或者 计算的当前行大于容器宽度
    // 计算到了最后一个字符
    while (
      ((maxWidth - measuredTextWidth) > fontSize || measuredTextWidth > maxWidth) &&
      contentArr.length >= alreadyCount) {
      countOfWrodFix += 1;

      if (measuredTextWidth < maxWidth) {
        drawingText = remainingText.substr(0, ++alreadyCount);
      } else {
        drawingText = remainingText.substr(0, --alreadyCount);
      }

      measuredTextWidth = calcLineWidth(ctx, drawingText, fontSize, fontFamily, fontWeight);

      if (countOfWrodFix > 99999) {
        throw new Error('文字补齐 计算超出 99999 限制');
      }
    }

    contentArr.splice(0, alreadyCount);

    if (line < maxLine || maxLine === -1) {
      drawTextLine(
        ctx,
        drawingText,
        x, y, fontSize, fontFamily, color, textAlign, lineHeight);
    } else if (line === maxLine) {
      if (maxFontLine > maxLine) {
        drawTextLine(
          ctx,
          `${drawingText.substr(0, drawingText.length - 2)}...`,
          x,
          y,
          fontSize,
          fontFamily,
          color,
          textAlign,
          lineHeight,
        );
      } else {
        drawTextLine(
          ctx,
          drawingText,
          x, y, fontSize, fontFamily, color, textAlign, lineHeight);
      }
      break;
    }
    y += lineHeight;
  }

  ctx.restore();
}

/**
 * 绘制头像
 *
 * @param ctx      画布
 * @param x        左上角定点 x 轴坐标
 * @param y        左上角定点 y 轴坐标
 * @param radius   圆角弧度
 * @param bgColor  背景色
 * @param cb       回调
 */
export function drawAvatar(ctx, url, x, y, radius = 2, bgColor = '#fff', cb) {
  const avatar = new Image();
  radius = parseInt(radius, 10);
  const width = radius * 2;
  const height = width;

  // 计算关键端点
  const endPoints = [
    { x, y },
    { x: x + width, y },
    { x, y: y + height },
    { x: x + width, y: y + height },
  ];
  const centerPoints = [
    { x: x + radius, y },
    { x: x + width, y: y + radius },
    { x: x + radius, y: y + height },
    { x, y: y + radius },
  ];
  // 解决跨域问题
  avatar.crossOrigin = 'Anonymous';
  avatar.onload = () => {
    ctx.drawImage(avatar, x, y, width, height);

    // 绘制圆角
    if (radius) {
      drawRoundedCorner(ctx, endPoints[0], centerPoints[3], centerPoints[0], radius, bgColor);
      drawRoundedCorner(ctx, endPoints[1], centerPoints[0], centerPoints[1], radius, bgColor);
      drawRoundedCorner(ctx, endPoints[3], centerPoints[1], centerPoints[2], radius, bgColor);
      drawRoundedCorner(ctx, endPoints[2], centerPoints[2], centerPoints[3], radius, bgColor);
    }

    cb && cb();
  };
  avatar.src = url;
}

/**
 * 绘制图片(方、圆角、圆)
 *
 * @param ctx      画布
 * @param img      load好的img对象
 * @param x        左上角定点 x 轴坐标
 * @param y        左上角定点 y 轴坐标
 * @param w        宽
 * @param h        高
 * @param radius   圆角半径
 * @param bgColor  背景色
 */
export function drawImage(ctx, img, x, y, w, h, radius = 0) {
  ctx.save();
  const width = w;
  const height = h || w;
  // 绘制圆角
  if (radius) {
    // 计算四个断点
    const endPoints = [
      { x, y },
      { x: x + width, y },
      { x, y: y + height },
      { x: x + width, y: y + height },
    ];
    // 计算横矩形的四个点
    const horRectPoints = [
      { x, y: y + radius },
      { x: x + width, y: y + radius },
      { x, y: y + height - radius },
      { x: x + width, y: y + height - radius },
    ];
    // 计算垂直矩形的四个点
    const verRectPoints = [
      { x: x + radius, y },
      { x: x + width - radius, y },
      { x: x + radius, y: y + height },
      { x: x + width - radius, y: y + height },
    ];
    ctx.beginPath();
    ctx.moveTo(horRectPoints[0].x, horRectPoints[0].y);
    ctx.arcTo(endPoints[0].x, endPoints[0].y, verRectPoints[0].x, verRectPoints[0].y, radius);
    ctx.lineTo(verRectPoints[1].x, verRectPoints[1].y);
    ctx.arcTo(endPoints[1].x, endPoints[1].y, horRectPoints[1].x, horRectPoints[1].y, radius);
    ctx.lineTo(horRectPoints[3].x, horRectPoints[3].y);
    ctx.arcTo(endPoints[3].x, endPoints[3].y, verRectPoints[3].x, verRectPoints[3].y, radius);
    ctx.lineTo(verRectPoints[2].x, verRectPoints[2].y);
    ctx.arcTo(endPoints[2].x, endPoints[2].y, horRectPoints[2].x, horRectPoints[2].y, radius);
    ctx.closePath();
    ctx.clip();
  }
  ctx.drawImage(img, x, y, width, height);
  ctx.restore();
}

/**
 * 绘制圆角
 */
export function drawRoundedCorner(ctx, endPoint, centerPointStart, centerPointEnd, radius, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerPointStart.x, centerPointStart.y);
  ctx.arcTo(endPoint.x, endPoint.y, centerPointEnd.x, centerPointEnd.y, radius);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

/**
 * 绘制圆角矩形
 */
export function drawRoundedRectangle(ctx, radius, x, y, width, height, color, mode = 'fill', fn) {
  fn && fn();

  // 计算四个断点
  const endPoints = [
    { x, y },
    { x: x + width, y },
    { x, y: y + height },
    { x: x + width, y: y + height },
  ];
  // 计算横矩形的四个点
  const horRectPoints = [
    { x, y: y + radius },
    { x: x + width, y: y + radius },
    { x, y: y + height - radius },
    { x: x + width, y: y + height - radius },
  ];
  // 计算垂直矩形的四个点
  const verRectPoints = [
    { x: x + radius, y },
    { x: x + width - radius, y },
    { x: x + radius, y: y + height },
    { x: x + width - radius, y: y + height },
  ];

  // ctx[`set${mode.replace(/./, mode[0].toUpperCase())}Style`](color);
  ctx[`${mode}Style`] = color;
  ctx.beginPath();
  ctx.moveTo(horRectPoints[0].x, horRectPoints[0].y);
  ctx.arcTo(endPoints[0].x, endPoints[0].y, verRectPoints[0].x, verRectPoints[0].y, radius);
  ctx.lineTo(verRectPoints[1].x, verRectPoints[1].y);
  ctx.arcTo(endPoints[1].x, endPoints[1].y, horRectPoints[1].x, horRectPoints[1].y, radius);
  ctx.lineTo(horRectPoints[3].x, horRectPoints[3].y);
  ctx.arcTo(endPoints[3].x, endPoints[3].y, verRectPoints[3].x, verRectPoints[3].y, radius);
  ctx.lineTo(verRectPoints[2].x, verRectPoints[2].y);
  ctx.arcTo(endPoints[2].x, endPoints[2].y, horRectPoints[2].x, horRectPoints[2].y, radius);
  ctx.closePath();
  ctx[mode]();
}

/**
 * @description 绘制虚线
 * @param {*} ctx
 * @param {Number 左x起点} x
 * @param {Number 左y起点} y
 * @param {Number 宽} width
 * @param {String 颜色} color
 */
export function drawDashLine(ctx, x, y, width, color) {
  ctx.setLineDash([4, 2]);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(width + x, y);
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * @description 绘制实线
 * @param {*} ctx
 * @param {Number 左x起点} x
 * @param {Number 左y起点} y
 * @param {Number 宽} width
 * @param {String 颜色} color
 */
export function drawLine(ctx, x, y, width, color) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(width + x, y);
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * 小程序适配器（未完善）
 */
export function weappAdapter(ctx) {
  ctx.setFontSize = function(fz) {
    ctx.font = `${fz}px serif`;
  };
  ctx.setLineWidth = function(lw) {
    ctx.lineWidth = lw;
  };
  ctx._fillText = ctx.fillText;
  ctx.setTextAlign = function(ta) {
    ctx.textAlign = ta;
  };
  ctx.setFillStyle = function(fillStyle) {
    ctx.fillStyle = fillStyle;
  };
  ctx.setStrokeStyle = function(strokeStyle) {
    ctx.strokeStyle = strokeStyle;
  };
}
