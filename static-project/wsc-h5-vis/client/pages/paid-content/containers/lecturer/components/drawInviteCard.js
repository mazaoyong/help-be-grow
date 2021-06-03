let done = 0;
const stepAmount = 1;
let cb = () => {};

let lineAmount = 1;
let cardHeight = 391;
const cardWidth = 315;
const baseHeight = 367; // 卡片基础高度，不包括自定义消息
const lineHeight = 24;
const cardPadding = 10;
const frameLineWidth = 0.5;
const middleLineWidth = 1;
const contentPadding = 20;
let middleLineY = 0;

// 文字坐标
const titleFZ = 22;
const titleLH = 30; // 标题行高
const titleY = cardPadding + frameLineWidth + contentPadding + titleLH;
const lectorNameMT = 30; // 讲师名上边距
const lectorNameLH = 24;
const lectorNameX = cardPadding + frameLineWidth + contentPadding;
const lectorNameY = titleY + lectorNameMT + lectorNameLH;
const paragraphMT = 10;
const paragraphLH = 24;
const paragraphY = lectorNameY + paragraphMT + paragraphLH;
// const adminNameFZ = 14;
// let adminNameWidth = adminNameFZ * 3;
const adminNameMT = 20;
const adminNameLH = 24;
const adminNameX = cardWidth - cardPadding - frameLineWidth - contentPadding;
const adminNameY = paragraphY + adminNameMT + adminNameLH;

function enhanceCtx(ctx) {
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

/**
 * @param ctx
 * @param name
 * @param title
 * @param adminName
 * @param avatar
 * @param qrcode
 */
function drawCard(...args) {
  done = 0;
  cb = args[args.length - 1];

  getCtxHeight(args[0], args[2]);
  drawFrame(...args);
  drawText(...args);
  drawImages(...args);
}

// function drawCardFile(pixelRatio, ...args) {
//   const ctx = args[0];
//   ctx.scale(pixelRatio, pixelRatio);
//   drawCard(...args);
// }

function getCtxHeight(ctx, liveName) {
  ctx.setFontSize(titleFZ);
  lineAmount = Math.ceil(ctx.measureText(`邀请你成为直播间『${liveName}』的讲师。`).width / 255); // 自定义消息占用行数
  console.log('自定义消息占用行数：', lineAmount);
  cardHeight = baseHeight + lineHeight * lineAmount;

  return cardHeight;
}

function drawFrame(ctx, lectorName, liveName, adminName, adminAvatarURL, qrcodeURL, ratio) {
  const cardRadius = 6;

  // 绘制卡片背景
  drawRoundedRectangle(ctx, cardRadius * ratio, 0, 0, cardWidth * ratio, cardHeight * ratio, '#fff');

  // 绘制线框
  const frameRadius = 4;
  const frameLineColor = '#ede9df';
  const frameWidth = (cardWidth - cardPadding * 2);
  const frameHeight = (cardHeight - cardPadding * 2);
  drawRoundedRectangle(
    ctx,
    frameRadius * ratio,
    cardPadding * ratio,
    cardPadding * ratio,
    frameWidth * ratio,
    frameHeight * ratio,
    frameLineColor,
    'stroke',
    () => ctx.setLineWidth(frameLineWidth * ratio)
  );

  // 绘制中部分割线
  ctx.setLineWidth(middleLineWidth * ratio);
  const baseY = 208;
  middleLineY = baseY + lineHeight * lineAmount;
  const middleLinePoints = [
    { x: (cardPadding + frameLineWidth + contentPadding) * ratio, y: middleLineY * ratio },
    { x: (cardWidth - cardPadding - frameLineWidth - contentPadding) * ratio, y: middleLineY * ratio },
  ];
  ctx.moveTo(middleLinePoints[0].x, middleLinePoints[0].y);
  ctx.lineTo(middleLinePoints[1].x, middleLinePoints[1].y);
  ctx.stroke();
}

function drawRoundedRectangle(ctx, radius, x, y, width, height, color, mode = 'fill', fn) {
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

  ctx[`set${mode.replace(/./, mode[0].toUpperCase())}Style`](color);
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

function drawText(ctx, lectorName, liveName, adminName, adminAvatarURL, qrcodeURL, ratio) {
  // 绘制标题
  drawTextOnce(
    ctx,
    '讲师邀请函',
    titleFZ * ratio,
    '#4a4a4a',
    cardWidth * ratio / 2,
    titleY * ratio,
    'center',
    titleLH * ratio
  );

  // 绘制称呼
  drawTextOnce(
    ctx,
    lectorName,
    14 * ratio,
    '#333',
    lectorNameX * ratio,
    lectorNameY * ratio,
    'left',
    lectorNameLH * ratio
  );

  // 绘制自定义片段
  drawParagraph(
    ctx,
    `邀请你成为直播间『${liveName}』的讲师。`,
    255 * ratio,
    paragraphLH * ratio,
    14 * ratio,
    '#333',
    lectorNameX * ratio,
    paragraphY * ratio
  );

  // 绘制签名
  drawTextOnce(
    ctx,
    adminName,
    14 * ratio,
    '#333',
    adminNameX * ratio,
    (adminNameY + (lineHeight * (lineAmount - 1))) * ratio, // 动态计算
    'right',
    24 * ratio
  );
  // adminNameWidth = ctx.measureText(adminName).width; // 测量长度，便于绘制头像时定位

  // 二维码提示
  const qrcodeTipY = cardHeight - cardPadding - frameLineWidth - 30;
  drawTextOnce(
    ctx,
    '长按识别二维码成为讲师',
    12 * ratio,
    '#666',
    cardWidth * ratio / 2,
    qrcodeTipY * ratio,
    'center',
    18 * ratio
  );
}

/**
 * 绘制文字
 *
 * @param ctx
 * @param content
 * @param fontSize
 * @param color
 * @param x           绘制左下角原点 x 坐标
 * @param y           绘制左下角原点 y 坐标
 * @param textAlign
 */
function drawTextOnce(ctx, content, fontSize = 12, color = '#333', x, y, textAlign = 'left', lineHeight = fontSize) {
  y -= (lineHeight - fontSize) / 2;

  ctx.setTextAlign(textAlign);
  ctx.setFontSize(fontSize);
  ctx.setFillStyle(color);
  ctx.fillText(content, x, y);
}

function drawParagraph(ctx, content, maxWidth, lineHeight, fontSize = 12, color = '#333', x, y) {
  const maxFontAmount = (maxWidth / fontSize) >> 0;
  // const contentArr = [...content];
  const contentArr = content.split('');
  while (contentArr.length) {
    const drawingText = contentArr.splice(0, maxFontAmount).join('');
    drawTextOnce(ctx, drawingText, fontSize, color, x, y, 'left', lineHeight);
    y += lineHeight;
  }
}

function drawImages(ctx, lectorName, liveName, adminName, adminAvatarURL, qrcodeURL, ratio) {
  // 绘制管理员头像
  // const adminAvatarML = 5;
  // const adminAvatarMT = 22;
  // const adminAvatarWidth = 20;
  // const adminAvatarHeight = 20;
  // const adminAvatarX = adminNameX - adminNameWidth - adminAvatarML - adminAvatarWidth;
  // const adminAvatarY = paragraphY + adminAvatarMT + (lineHeight * (lineAmount - 1));
  // drawAvatar(ctx, adminAvatarURL, adminAvatarX, adminAvatarY, adminAvatarWidth / 2);

  const qrcodeWidth = 60;
  const qrcodeHeight = 60;
  const qrcodeX = cardWidth / 2 - qrcodeWidth / 2;
  const qrcodeY = middleLineY + middleLineWidth + 30;
  const qrcode = new Image();
  qrcode.onload = () => {
    ctx.drawImage(qrcode, qrcodeX * ratio, qrcodeY * ratio, qrcodeWidth * ratio, qrcodeHeight * ratio);
    if (++done === stepAmount) endDraw();
  };
  qrcode.src = qrcodeURL;
}

// function drawAvatar(ctx, url, x, y, radius, bgColor = '#fff') {
//   const avatar = new Image();
//   radius = parseInt(radius, 10);
//   const width = radius * 2;
//   const height = width;

//   // 计算关键端点
//   const endPoints = [
//     { x, y },
//     { x: x + width, y },
//     { x, y: y + height },
//     { x: x + width, y: y + height }
//   ];
//   const centerPoints = [
//     { x: x + radius, y },
//     { x: x + width, y: y + radius },
//     { x: x + radius, y: y + height },
//     { x, y: y + radius }
//   ];
//   avatar.crossOrigin = 'Anonymous';
//   avatar.onload = () => {
//     ctx.drawImage(avatar, x, y, width, height);
//     if (++done === stepAmount) endDraw();
//   };
//   avatar.src = url;

//   // 绘制圆角
//   drawRoundedCorner(ctx, endPoints[0], centerPoints[3], centerPoints[0], radius, bgColor);
//   drawRoundedCorner(ctx, endPoints[1], centerPoints[0], centerPoints[1], radius, bgColor);
//   drawRoundedCorner(ctx, endPoints[3], centerPoints[1], centerPoints[2], radius, bgColor);
//   drawRoundedCorner(ctx, endPoints[2], centerPoints[2], centerPoints[3], radius, bgColor);
// }

// function drawRoundedCorner(ctx, endPoint, centerPointStart, centerPointEnd, radius, color) {
//   ctx.setStrokeStyle(color);
//   ctx.setFillStyle(color);
//   ctx.beginPath();
//   ctx.moveTo(centerPointStart.x, centerPointStart.y);
//   ctx.arcTo(endPoint.x, endPoint.y, centerPointEnd.x, centerPointEnd.y, radius);
//   ctx.lineTo(endPoint.x, endPoint.y);
//   ctx.closePath();
//   ctx.stroke();
//   ctx.fill();
// }

function endDraw() {
  cb && cb();
}

export default {
  enhanceCtx,
  drawCard,
  // drawCardFile,
  getCtxHeight,
};
