import { Canvas } from '@youzan/vis-ui';
const canvasUtils = Canvas.utils;

// 取用户头像宽度
const getUserBoxWidth = (a, b) => {
  const aLength = canvasUtils.measureContentLength(a, 34);
  const bLength = canvasUtils.measureContentLength(b, 28);
  const plus = 120;
  if (aLength < bLength) {
    return `${bLength + plus}px`;
  }
  return `${aLength + plus}px`;
};

const getDynamicConfig = (drawInfos) => {
  const DYNAMIC_CONFIG = {
    type: 'div',
    css: {
      width: '750px',
      height: '1334px',
    },
    children: [
      // 海报背景图
      {
        type: 'image',
        css: {
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '750px',
          height: '1334px',
        },
        url: drawInfos.bgSrc,
      },
      // 头像和昵称
      {
        type: 'div',
        css: {
          display: 'block',
          marginTop: '59px',
          width: getUserBoxWidth(drawInfos.user || '', '邀请你来加入'),
          marginLeft: '32px',
          height: '90px',
          borderRadius: '45px',
          backgroundColor: '#fff',
        },
        children: [
          {
            type: 'image',
            css: {
              position: 'absolute',
              top: '0px',
              left: '0px',
              width: '90px',
              height: '90px',
              borderRadius: '45px',
            },
            url: drawInfos.avatarSrc || '',
          },
          {
            type: 'text',
            css: {
              marginTop: '6px',
              marginLeft: '97px',
              fontSize: '34px',
              height: '34px',
              color: '#333',
            },
            text: drawInfos.user || '',
          },
          {
            type: 'text',
            css: {
              marginTop: '15px',
              marginLeft: '97px',
              height: '28px',
              fontSize: '28px',
              color: '#333',
            },
            text: '邀请你来加入',
          },
        ],
      },
      // 二维码
      {
        type: 'image',
        css: {
          position: 'absolute',
          top: '1100px',
          right: '91px',
          width: '140px',
          height: '140px',
        },
        url: drawInfos.qrSrc,
      },
      // 文字：长按二维码，进入课程
      {
        type: 'div',
        css: {
          position: 'absolute',
          top: '1254px',
          right: '24px',
          width: '275px',
          height: '48px',
          borderRadius: '24px',
          backgroundColor: '#fff',
        },
        children: [
          {
            type: 'text',
            css: {
              textAlign: 'center',
              lineHeight: '48px',
              fontSize: '24px',
              color: '#333',
            },
            text: '长按二维码，进入课程',
          },
        ],
      },
    ],
  };

  return DYNAMIC_CONFIG;
};

export default getDynamicConfig;
