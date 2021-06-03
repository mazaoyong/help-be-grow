import * as canvasUtils from 'common/utils/canvas';

// const NICK_BG = 'https://b.yzcdn.cn/public_files/2018/09/27/nick-bg.png';
const fontFamily = 'Arial,Helvetica,"STHeiti STXihei","Microsoft YaHei",Tohoma,sans-serif';

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

// 绘制文字结果
function drawWithText(ctx, cardInfo, avatar, qrCode) {
  const shareTitleWidth = canvasUtils.calcLineWidth(ctx, cardInfo.shareTitle, 14, fontFamily);
  let staticWordsTop = 0;
  let shareTitleTop = 0;
  if (shareTitleWidth > 200) {
    staticWordsTop = 526;
    shareTitleTop = 490;
  } else {
    staticWordsTop = 518;
    shareTitleTop = 498;
  }
  canvasUtils.drawRoundedRectangle(ctx, 4, 0, 0, 310, 551, '#fff', undefined);

  if (cardInfo.displayFinishDesc === 0) {
    canvasUtils.drawImage(ctx, avatar, 22, 20, 62, 62, 31);
    canvasUtils.drawTextLine(ctx, cardInfo.user, 90, 58, 16, fontFamily, '#333', null, 20);
    canvasUtils.drawTextLine(ctx, cardInfo.resultTitle, 22, 130, 17, null, '#333');
    canvasUtils.drawParagraphV2(ctx, cardInfo.resultDesc, 22, 170, 264, 14, fontFamily, '#666', 'left', 20);
    canvasUtils.drawLine(ctx, 22, 456, 264, '#e5e5e5');
    canvasUtils.drawImage(ctx, qrCode, 22, 470, 60, 60);
    canvasUtils.drawParagraphV2(ctx, cardInfo.shareTitle, 90, shareTitleTop, 200, 14, fontFamily, '#333', 'left', 20, 2);
    canvasUtils.drawTextLine(ctx, '长按保存图片或识别二维码', 90, staticWordsTop, 13, null, '#999', 'left', 19);
  } else {
    // 绘制头像
    canvasUtils.drawImage(ctx, avatar, 22, 20, 62, 62, 31);
    // 绘制用户名
    canvasUtils.drawTextLine(ctx, cardInfo.user, 90, 58, 16, fontFamily, '#333', null, 20);
    // 绘制成绩
    canvasUtils.drawParagraphV2(ctx, cardInfo.finishDesc, 22, 110, 264, 13, fontFamily, '#666', 'left', 20, 2);
    // 绘制结果标题
    canvasUtils.drawTextLine(ctx, cardInfo.resultTitle, 22, 168, 17, null, '#333');
    // 绘制结果文字
    canvasUtils.drawParagraphV2(ctx, cardInfo.resultDesc, 22, 208, 264, 13, fontFamily, '#666', 'left', 18);
    canvasUtils.drawLine(ctx, 22, 456, 264, '#e5e5e5');
    // 绘制二维码
    canvasUtils.drawImage(ctx, qrCode, 22, 470, 60, 60);
    canvasUtils.drawParagraphV2(ctx, cardInfo.shareTitle, 90, shareTitleTop, 200, 14, fontFamily, '#333', 'left', 20, 2);
    canvasUtils.drawTextLine(ctx, '长按保存图片或识别二维码', 90, staticWordsTop, 13, null, '#999', 'left', 19);
  }
}

// 绘制图片结果
function drawWithPic(ctx, cardInfo, avatar, qrCode, resultPic) {
  const shareTitleWidth = canvasUtils.calcLineWidth(ctx, cardInfo.shareTitle, 14, fontFamily);
  let staticWordsTop = 0;
  let shareTitleTop = 0;
  if (shareTitleWidth > 200) {
    staticWordsTop = 526;
    shareTitleTop = 490;
  } else {
    staticWordsTop = 518;
    shareTitleTop = 498;
  }
  canvasUtils.drawRoundedRectangle(ctx, 4, 0, 0, 310, 551, '#fff', undefined);
  if (cardInfo.displayFinishDesc === 0) {
    canvasUtils.drawImage(ctx, avatar, 22, 20, 62, 62, 31);
    canvasUtils.drawTextLine(ctx, cardInfo.user, 90, 58, 16, fontFamily, '#333', null, 20);
    canvasUtils.drawTextLine(ctx, cardInfo.resultTitle, 22, 130, 17, null, '#333');
    canvasUtils.drawImage(ctx, resultPic, 22, 150, 250, 250);
    canvasUtils.drawLine(ctx, 22, 456, 264, '#e5e5e5');
    canvasUtils.drawImage(ctx, qrCode, 22, 470, 60, 60);
    canvasUtils.drawParagraphV2(ctx, cardInfo.shareTitle, 90, shareTitleTop, 200, 14, fontFamily, '#333', 'left', 20, 2);
    canvasUtils.drawTextLine(ctx, '长按保存图片或识别二维码', 90, staticWordsTop, 12, null, '#999');
  } else {
    canvasUtils.drawImage(ctx, avatar, 22, 20, 62, 62, 31);
    canvasUtils.drawTextLine(ctx, cardInfo.user, 90, 58, 16, fontFamily, '#333', null, 20);
    canvasUtils.drawParagraph(ctx, cardInfo.finishDesc, 22, 110, 264, 13, fontFamily, '#666', 'left', 20, 2);
    canvasUtils.drawTextLine(ctx, cardInfo.resultTitle, 22, 168, 17, null, '#333');
    canvasUtils.drawImage(ctx, resultPic, 22, 188, 250, 250);
    canvasUtils.drawLine(ctx, 22, 456, 264, '#e5e5e5');
    canvasUtils.drawImage(ctx, qrCode, 22, 470, 60, 60);
    canvasUtils.drawParagraphV2(ctx, cardInfo.shareTitle, 90, shareTitleTop, 200, 14, fontFamily, '#333', 'left', 20, 2);
    canvasUtils.drawTextLine(ctx, '长按保存图片或识别二维码', 90, staticWordsTop, 12, null, '#999');
  }
}

export function draw(cardInfo) {
  return new Promise((resolve, reject) => {
    // 判断是链接还是base64图片
    const flag = (cardInfo.qrSrc).indexOf('http') === 0;
    // 对应结果为文本
    if (cardInfo.resultStyle === 1) {
      Promise.all([
        flag ? loadUrlImage(cardInfo.qrSrc) : loadBase64Image(cardInfo.qrSrc),
        loadUrlImage(cardInfo.avatarSrc),
      ]).then(([qrCode, avatar]) => {
        const [canvas, ctx] = initCanvasContext(310, 551);

        drawWithText(ctx, cardInfo, avatar, qrCode);

        resolve(canvas.toDataURL('image/png'));
      });
    }
    // 对应结果为图片
    if (cardInfo.resultStyle === 2) {
      Promise.all([
        flag ? loadUrlImage(cardInfo.qrSrc) : loadBase64Image(cardInfo.qrSrc),
        loadUrlImage(cardInfo.avatarSrc),
        loadUrlImage(cardInfo.resultPic),
      ]).then(([qrCode, avatar, resultPic]) => {
        const [canvas, ctx] = initCanvasContext(310, 551);

        drawWithPic(ctx, cardInfo, avatar, qrCode, resultPic);

        resolve(canvas.toDataURL('image/png'));
      });
    }
  });
};
