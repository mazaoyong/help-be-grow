import * as canvasUtils from 'common/utils/canvas';

const NICK_BG = 'https://b.yzcdn.cn/public_files/2018/09/27/nick-bg.png';
const TEXT_TIP = 'https://img01.yzcdn.cn/public_files/2018/09/27/text-tip.png';

function initCanvasContext(width, height) {
  // 创建canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const ratio = canvasUtils.getScreenRatio(ctx);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return [canvas, ctx];
};

function loadUrlImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
  });
};

function loadBase64Image(src) {
  return new Promise((resolve, reject) => {
    const qrImg = new Image();
    qrImg.src = src;
    qrImg.onload = () => {
      resolve(qrImg);
    };
  });
}

// 绘制自定义海报
function drawDynamic(ctx, cardInfo, bg, avatar, nickbg, qrCode, textTip) {
  // 绘制背景图片
  canvasUtils.drawImage(ctx, bg, 0, 0, 375, 667);
  const nicknameLength = canvasUtils.measureContentLength(ctx, cardInfo.user, 14);
  const tipLength = canvasUtils.measureContentLength(ctx, '邀请您来加入', 12);
  const nickbgWidth = nicknameLength > tipLength ? (nicknameLength + 50) : (tipLength + 50);
  canvasUtils.drawImage(ctx, nickbg, 40, 32, nickbgWidth, 40);
  // 绘制头像
  canvasUtils.drawImage(ctx, avatar, 16, 26, 52, 52, 26);
  // 绘制用户名
  canvasUtils.drawTextLine(ctx, cardInfo.user, 72, 50, 14, null, '#000');
  canvasUtils.drawTextLine(ctx, '邀请您来加入', 72, 66, 12, null, '#000');
  // 绘制二维码
  canvasUtils.drawImage(ctx, qrCode, 260, 550, 70, 70);
  canvasUtils.drawImage(ctx, textTip, 235, 632, 120, 17);
  // canvasUtils.drawTextLine(ctx, '长按二维码，进入课程', 235, 645, 12, null, '#999');
}

// 绘制固定海报
function drawFix(ctx, cardInfo, bg, avatar, qrCode) {
  // 绘制背景图片
  canvasUtils.drawImage(ctx, bg, 0, 0, 375, 667);

  // 绘制头像
  canvasUtils.drawImage(ctx, avatar, 58, 118, 60, 60, 30);
  // 绘制用户名
  canvasUtils.drawTextLine(ctx, cardInfo.user, 126, 144, 17, null, cardInfo.color);
  canvasUtils.drawTextLine(ctx, '邀请您来加入', 126, 163, 13, null, cardInfo.color);
  // 绘制Title,考虑两行的情况
  if (cardInfo.title.length > 10) {
    canvasUtils.drawTextLine(ctx, cardInfo.title.slice(0, 10), 187, 257, 22, null, cardInfo.color, 'center');
    let secondLine = cardInfo.title.slice(10);
    secondLine = secondLine.length > 8 ? secondLine.slice(0, 8) + '...' : secondLine;
    canvasUtils.drawTextLine(ctx, secondLine, 187, 287, 22, null, cardInfo.color, 'center');
  } else {
    canvasUtils.drawTextLine(ctx, cardInfo.title.slice(0, 10), 187, 275, 22, null, cardInfo.color, 'center');
  }
  // 绘制讲师名字
  canvasUtils.drawTextLine(ctx, cardInfo.teacher ? `讲师：${cardInfo.teacher}` : '', 187, 317, 15, null, cardInfo.color, 'center');
  // 绘制二维码
  canvasUtils.drawImage(ctx, qrCode, 133, 364, 110, 110);
  canvasUtils.drawTextLine(ctx, '长按二维码，马上进入课程', 116, 507, 12, null, cardInfo.color);
}

export function draw(cardInfo) {
  return new Promise((resolve, reject) => {
    Promise.all([
      loadUrlImage(cardInfo.bgSrc),
      loadBase64Image(cardInfo.qrSrc),
      loadUrlImage(NICK_BG),
      loadUrlImage(cardInfo.avatarSrc),
      loadUrlImage(TEXT_TIP),
    ]).then(([bg, qrCode, nickbg, avatar, textTip]) => {
      const [canvas, ctx] = initCanvasContext(375, 667);

      if (cardInfo.type === 'dynamic') {
        drawDynamic(ctx, cardInfo, bg, avatar, nickbg, qrCode, textTip);
      } else {
        drawFix(ctx, cardInfo, bg, avatar, qrCode);
      }

      resolve(canvas.toDataURL('image/png'));
    });
  });
};
