import * as canvasUtils from 'fns/canvas';
import { visAjax } from 'fns/new-ajax';
const shopnameIcon = '//img.yzcdn.cn/public_files/2018/09/26/713b7b3dc3209f5aa7f6d6c6d7a52282.png';
const titleIcon = '//b.yzcdn.cn/public_files/2018/09/27/d89b76fd7b61327bf6ba686162db3654.png';
const bgImg = '//b.yzcdn.cn/public_files/2018/09/27/a39bcb8ca7fb296709cdbc056d7bb4de.png';

const drawPreviewDifferent = (cardInfo, cover, qrCode, shopnameIcon, titleIcon) => {
  const [canvas, ctx] = canvasUtils.initCanvasContext(325, +cardInfo.style === 1 ? 519 : 564);

  // 自定义变量
  const shopanmeFontSize = 12;
  const shopnameWidth = canvasUtils.measureContentLength(ctx, _global.shopName, shopanmeFontSize);
  const shopnameLeft = (325 - shopnameWidth) / 2 + 10;

  // 自定义模式调整封面图
  let verticalCover = [15, 20, 295, 342];
  if (+cardInfo.style === 2) {
    const WIDTH = 295;
    const HEIGHT = 342;
    const originRate = HEIGHT / WIDTH;
    const height = cover.height || HEIGHT;
    const width = cover.width || WIDTH;
    const rate = height / width;
    if (rate > originRate) {
      const sw = (width / height) * HEIGHT;
      const left = (WIDTH - sw) / 2 + 15;
      const top = 20;
      const sh = 342;
      verticalCover = [left, top, sw, sh];
    } else {
      const sh = (height / width) * WIDTH;
      const top = (HEIGHT - sh) / 2 + 20;
      const left = 15;
      const sw = WIDTH;
      verticalCover = [left, top, sw, sh];
    }
  }

  // 各种情况的尺寸
  const sizeMap = {
    preview: {
      normal: {
        base: [4, 0, 0, 325, 519, '#fff', undefined],
        cover: [cover, 13, 30, 295, 164],
        title: [cardInfo.title, 15, 237, 295, 16, undefined, undefined, undefined, 20, 2],
        titleIcon: [titleIcon, 15, 274, 10, 14],
        titleAmount: [
          `共${cardInfo.questionCount}道题`,
          28,
          288,
          14,
          undefined,
          '#999',
          undefined,
          18,
        ],
        dashLine: [17, 308, 295, '#e5e5e5'],
        qr: [qrCode, 106, 332, 115, 115],
        qrTitle: ['扫码免费参与测试', 107, 477, 14, undefined, undefined, undefined, 20],
        shopnameIcon: [shopnameIcon, shopnameLeft - 20, 486, 14, 14],
        shopname: [
          _global.shopName || '',
          shopnameLeft,
          500,
          shopanmeFontSize,
          undefined,
          '#999',
          undefined,
          17,
        ],
      },
      vertical: {
        base: [4, 0, 0, 325, 564, '#fff', undefined],
        cover: [cover, ...verticalCover],
        title: [cardInfo.title, 15, 394, 295, 16, undefined, undefined, undefined, 20, 2],
        titleIcon: [titleIcon, 15, 432, 10, 14],
        titleAmount: [
          `共${cardInfo.questionCount}道题`,
          28,
          445,
          14,
          undefined,
          '#999',
          undefined,
          18,
        ],
        dashLine: [19, 457, 295, '#e5e5e5'],
        qr: [qrCode, 15, 471, 80, 80],
        qrTitle: ['扫码免费参与测试', 103, 510, 14, undefined, undefined, undefined, 20],
        shopnameIcon: [shopnameIcon, 103, 518, 14, 14],
        shopname: [
          _global.shopName || '',
          123,
          532,
          shopanmeFontSize,
          undefined,
          '#999',
          undefined,
          17,
        ],
      },
    },
  };

  // 不同情况取的 size
  const sizeMapValue = sizeMap.preview[+cardInfo.style === 1 ? 'normal' : 'vertical'];

  // 绘制底框
  canvasUtils.drawRoundedRectangle(ctx, ...sizeMapValue.base);

  // 绘制封面图
  canvasUtils.drawImage(ctx, ...sizeMapValue.cover);

  // 绘制标题
  canvasUtils.drawParagraph(ctx, ...sizeMapValue.title);

  // 绘制题数
  canvasUtils.drawImage(ctx, ...sizeMapValue.titleIcon);
  canvasUtils.drawTextLine(ctx, ...sizeMapValue.titleAmount);

  // 绘制虚线
  canvasUtils.drawDashLine(ctx, ...sizeMapValue.dashLine);

  // 绘制二维码
  canvasUtils.drawImage(ctx, ...sizeMapValue.qr);

  canvasUtils.drawTextLine(ctx, ...sizeMapValue.qrTitle);

  canvasUtils.drawImage(ctx, ...sizeMapValue.shopnameIcon);

  canvasUtils.drawTextLine(ctx, ...sizeMapValue.shopname);

  return canvas.toDataURL('image/png');
};

const drawVirtualDifferent = (cardInfo, previewImg, bgImg) => {
  const [canvas, ctx] = canvasUtils.initCanvasContext(375, 667);

  const isNormalMode = +cardInfo.style === 1;
  const size = isNormalMode ? [25, 74, 325, 519] : [25, 52, 325, 564];

  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 39;
  ctx.shadowColor = 'rgba(200, 201, 204, .5)';

  canvasUtils.drawImage(ctx, bgImg, 0, 0, 375, 667);
  canvasUtils.drawImage(ctx, previewImg, ...size);

  return canvas.toDataURL('image/png');
};

const uploadNetMaterial = url => {
  return visAjax('POST',
    '/commom/material/fetchPublicImage.json',
    {
      fetchUrl: url
    },
  );
};

export default function draw(cardInfo) {
  return new Promise((resolve, reject) => {
    const mainCoverImg = +cardInfo.style === 1 ? cardInfo.coverPic.url : cardInfo.backgroundPic.url;
    const custQrcode = cardInfo.qrCode;
    // 1 表示公众号二维码
    if (custQrcode.indexOf('http') === 0) {
      uploadNetMaterial(cardInfo.qrCode)
        .then(res => {
          cardInfo.qrCode = res.url;
          Promise.all([
            canvasUtils.loadUrlImage(mainCoverImg),
            canvasUtils.loadUrlImage(cardInfo.qrCode),
            canvasUtils.loadUrlImage(shopnameIcon),
            canvasUtils.loadUrlImage(titleIcon),
          ])
            .then(([cover, qrCode, shopnameIcon, titleIcon]) => {
              const previewImg = drawPreviewDifferent(cardInfo, cover, qrCode, shopnameIcon, titleIcon);

              return Promise.all([
                canvasUtils.loadBase64Image(previewImg),
                canvasUtils.loadUrlImage(bgImg),
                Promise.resolve(previewImg),
              ]);
            })
            .then(([previewImgObj, bgObj, previewImg]) => {
              const virtualImg = drawVirtualDifferent(cardInfo, previewImgObj, bgObj);

              resolve([previewImg, virtualImg]);
            })
            .catch(err => {
              reject(err);
            });
        });
    } else {
      Promise.all([
        canvasUtils.loadUrlImage(mainCoverImg),
        canvasUtils.loadBase64Image(cardInfo.qrCode),
        canvasUtils.loadUrlImage(shopnameIcon),
        canvasUtils.loadUrlImage(titleIcon),
      ])
        .then(([cover, qrCode, shopnameIcon, titleIcon]) => {
          const previewImg = drawPreviewDifferent(cardInfo, cover, qrCode, shopnameIcon, titleIcon);

          return Promise.all([
            canvasUtils.loadBase64Image(previewImg),
            canvasUtils.loadUrlImage(bgImg),
            Promise.resolve(previewImg),
          ]);
        })
        .then(([previewImgObj, bgObj, previewImg]) => {
          const virtualImg = drawVirtualDifferent(cardInfo, previewImgObj, bgObj);

          resolve([previewImg, virtualImg]);
        })
        .catch(err => {
          reject(err);
        });
    }
  });
}

// 缩小的版本
// const sizeMap = {
//   preview: {
//     normal: {
//       base: [4, 0, 0, 310, 460, '#fff', undefined],
//       cover: [cover, 13, 20, 285, 156],
//       title: [cardInfo.title, 14, 206, 285, 14, undefined, undefined, undefined, 20, 2],
//       titleIcon: [titleIcon, 15, 240, 10, 14],
//       titleAmount: [
//         `共${cardInfo.questionCount}道题`,
//         28,
//         253,
//         12,
//         undefined,
//         '#999',
//         undefined,
//         17,
//       ],
//       dashLine: [15, 261, 285, '#e5e5e5'],
//       qr: [qrCode, 99, 274, 115, 115],
//       qrTitle: ['扫码免费参与测试', 109, 418, 12, undefined, undefined, undefined, 17],
//       shopnameIcon: [shopnameIcon, shopnameLeft - 20, 428, 15, 15],
//       shopname: [
//         _global.shopName || '',
//         shopnameLeft,
//         443,
//         shopanmeFontSize,
//         undefined,
//         '#999',
//         undefined,
//         17,
//       ],
//     },
//     vertical: {
//       base: [4, 0, 0, 310, 460, '#fff', undefined],
//       cover: [cover, 13, 20, 285, 330],
//       title: [cardInfo.title, 14, 380, 285, 14, undefined, undefined, undefined, 20, 2],
//       titleIcon: [titleIcon, 15, 407, 10, 14],
//       titleAmount: [
//         `共${cardInfo.questionCount}道题`,
//         28,
//         420,
//         12,
//         undefined,
//         '#999',
//         undefined,
//         17,
//       ],
//       dashLine: [15, 431, 285, '#e5e5e5'],
//       qr: [qrCode, 25, 444, 60, 60],
//       qrTitle: ['扫码免费参与测试', 93, 470, 12, undefined, undefined, undefined, 17],
//       shopnameIcon: [shopnameIcon, 93, 482, 15, 15],
//       shopname: [
//         _global.shopName || '',
//         113,
//         495,
//         shopanmeFontSize,
//         undefined,
//         '#999',
//         undefined,
//         17,
//       ],
//     },
//   },
// };
