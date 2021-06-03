import { getScreenRatio } from 'pct/utils';

let done = 0;
const steps = 2;

let ratio = 2;
const name = 'Dear,';
let cardWidth = 315;
let cardHeight = 0;

// 计算文字行数
// const fontSize = 14;
const lineHeight = 24;
const baseHeight = 367;
const baseWidth = 60;
// const baseLineAmount = 14;
// const lineFontAmount = ((cardWidth - baseWidth) / fontSize) >> 0;
let lineAmount = 1;

// 图片们
const bg = new Image();
// const avatarImage = new Image();
const qrCode = new Image();

let callback = function() {};

/**
 * 绘制背景和文字，使用 svg
 */
function _drawBgAndText(ctx, liveTitle, adminName, canvas) {
  const data =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" 
          style="
            box-sizing: border-box;
            padding: ${10 * ratio}px;
            border-radius: ${6 * ratio}px;
            background: #fff;">
          <div style="
            overflow: hidden;
            padding: 0 ${20 * ratio}px;
            border: ${1 * ratio}px solid #EDE9DF;
            border-radius: ${4 * ratio}px;">
            <h1 style="
              margin: 0;
              margin-top: ${30 * ratio}px;
              padding: 0;
              line-height: ${30 * ratio}px;
              text-align: center;
              letter-spacing: ${2 * ratio}px;
              color: #4A4A4A;
              font-size: ${22 * ratio}px;">
              讲师邀请函
            </h1>
            <p style="
              margin: 0;
              margin-top: ${30 * ratio}px;
              padding: 0;
              line-height: ${24 * ratio}px;
              color: #333;
              font-size: ${14 * ratio}px;">
              ${name}：
            </p>
            <p style="
              margin: 0;
              margin-top: ${10 * ratio}px;
              padding: 0;
              line-height: ${24 * ratio}px;
              color: #333;
              font-size: ${14 * ratio}px;">
              邀请你成为直播间『${liveTitle}』的讲师。
            </p>
            <div style="
              float: right;
              margin-top: ${20 * ratio}px;
              line-height: ${24 * ratio}px;
              color: #333;
              font-size: ${14 * ratio}px;">
              ${adminName}
            </div>
            <div style="clear: both"></div>
            <div style="
              margin-top: ${30 * ratio}px;
              border-top: ${1 * ratio}px solid #EDE9DF;">
              <p style="
                margin: ${100 * ratio}px 0 ${30 * ratio}px;
                padding: 0;
                line-height: ${18 * ratio}px;
                text-align: center;
                color: #666;
                font-size: ${12 * ratio}px;">
                长按识别二维码成为讲师
              </p>
            </div>
          </div>
        </div>
      </foreignObject>
    </svg>`;

  var svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
  const reader = new FileReader();
  reader.onload = function() {
    bg.src = this.result;
  };
  reader.readAsDataURL(svg);

  bg.crossOrigin = 'Anonymous';
  bg.onload = () => {
    console.log('svg载入成功');
    if (++done === steps) {
      draw(ctx, canvas);
    }
  };
}

/**
 * 绘制头像
 */
// function _drawAvatar(ctx, adminAvatar, canvas) {
//   console.log('头像图片：', adminAvatar);
//   // 绘制圆角头像
//   avatarImage.setAttribute('crossOrigin', 'Anonymous');
//   avatarImage.crossOrigin = 'Anonymous';
//   avatarImage.style.borderRadius = '50%';

//   avatarImage.onload = () => {
//     console.log('头像图片载入成功');
//     if (++done === steps) {
//       draw(ctx, canvas);
//     }
//   };
//   avatarImage.src = adminAvatar;
// }

/**
 * 绘制二维码
 */
function _drawQrcode(ctx, code, canvas) {
  qrCode.onload = () => {
    console.log('二维码载入成功');
    if (++done === steps) {
      draw(ctx, canvas);
    }
  };
  qrCode.src = code;
}

// function drawAvatar(ctx) {
//   const x = cardWidth - 112 * ratio;
//   const y = (156 + lineAmount * 24) * ratio;
//   ctx.drawImage(avatarImage, x, y, 20 * ratio, 20 * ratio);
//   // 画圆角
//   ctx.strokeWidth = 1 * ratio;
//   ctx.fillStyle = '#fff';
//   ctx.strokeStyle = '#fff';
//   ctx.beginPath();
//   ctx.moveTo(x, y);
//   ctx.lineTo(x, y + 10 * ratio);
//   ctx.arcTo(x, y, x + 10 * ratio, y, 10 * ratio);
//   ctx.closePath();
//   ctx.fill();
//   ctx.beginPath();
//   ctx.moveTo(x + 20 * ratio, y);
//   ctx.lineTo(x + 20 * ratio, y + 10 * ratio);
//   ctx.arcTo(x + 20 * ratio, y, x + 10 * ratio, y, 10 * ratio);
//   ctx.closePath();
//   ctx.fill();
//   ctx.beginPath();
//   ctx.moveTo(x + 20 * ratio, y + 20 * ratio);
//   ctx.lineTo(x + 20 * ratio, y + 10 * ratio);
//   ctx.arcTo(x + 20 * ratio, y + 20 * ratio, x + 10 * ratio, y + 20 * ratio, 10 * ratio);
//   ctx.closePath();
//   ctx.fill();
//   ctx.beginPath();
//   ctx.moveTo(x, y + 20 * ratio);
//   ctx.lineTo(x, y + 10 * ratio);
//   ctx.arcTo(x, y + 20 * ratio, x + 10 * ratio, y + 20 * ratio, 10 * ratio);
//   ctx.closePath();
//   ctx.fill();
// }
function drawQrcode(ctx) {
  const qrBottom = 128;
  const qrTop = cardHeight - qrBottom * ratio;
  const x = cardWidth / 2 - 30 * ratio;
  const y = qrTop;
  ctx.drawImage(qrCode, x, y, 60 * ratio, 60 * ratio);
}

function draw(ctx, canvas) {
  ctx.drawImage(bg, 0, 0, cardWidth, cardHeight);
  // drawAvatar(ctx);
  drawQrcode(ctx);

  callback && callback();
}

export default function(canvas, liveTitle, adminName, adminAvatar, qrcode, cb) {
  callback = cb;
  const ctx = canvas.getContext('2d');
  ratio = getScreenRatio(ctx);

  // 计算卡片高度
  // 因为样式统一性，其实没有必要动态调整卡片大小，所有屏幕保持一致即可
  // 但是宽度 <= 320 的，展示的时候需要等比缩小处理
  cardWidth = 315;
  if (window.innerWidth < 375) {
    canvas.style.zoom = +(window.innerWidth / 375).toFixed(2);
  } else {
    canvas.style.width = '100%';
  }

  // 计算文字行数
  ctx.font = '14px Arial';
  const textWidth = ctx.measureText(`邀请你成为直播间『${liveTitle}』的讲师。`).width;
  lineAmount = Math.ceil(textWidth / (cardWidth - baseWidth));
  console.log('计算的行数：', lineAmount);

  // 计算卡片高度
  cardHeight = baseHeight + lineAmount * lineHeight;
  canvas.style.height = `${cardHeight}px`;

  // 绘制时，乘以像素比
  cardWidth = cardWidth * ratio;
  cardHeight = cardHeight * ratio;
  canvas.width = cardWidth;
  canvas.height = cardHeight;

  _drawBgAndText(ctx, liveTitle, adminName, canvas);
  // _drawAvatar(ctx, adminAvatar, canvas);
  _drawQrcode(ctx, qrcode, canvas);
}
