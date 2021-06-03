import POSTER_WITH_COVER_CONFIG from './poster_with_cover.config';
import POSTER_1_CONFIG from './poster_1.config';
import POSTER_2_CONFIG from './poster_2.config';
import POSTER_3_CONFIG from './poster_3.config';
import POSTER_4_CONFIG from './poster_4.config';
import POSTER_5_CONFIG from './poster_5.config';
import POSTER_KNOWLEDGE_1_CONFIG from './poster_knowledge_1.config';
import POSTER_KNOWLEDGE_2_CONFIG from './poster_knowledge_2.config';

const OPTIONS_ARRAY = [
  POSTER_WITH_COVER_CONFIG,
  POSTER_WITH_COVER_CONFIG,
  POSTER_WITH_COVER_CONFIG,
  POSTER_1_CONFIG,
  POSTER_2_CONFIG,
  POSTER_3_CONFIG,
  POSTER_4_CONFIG,
  POSTER_5_CONFIG,
  POSTER_KNOWLEDGE_1_CONFIG,
  POSTER_KNOWLEDGE_1_CONFIG,
  POSTER_KNOWLEDGE_2_CONFIG,
  POSTER_KNOWLEDGE_2_CONFIG,
];

let lock = false;

const getPosterConfig = (drawInfos, length) => {
  if (!lock) {
    for (let i = 0; i < length; i++) {
      OPTIONS_ARRAY.unshift({});
    }
    lock = true;
  }

  const POSTER_CONFIG = {
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
          position: 'absolute',
          top: OPTIONS_ARRAY[drawInfos.index].avatar.top,
          left: OPTIONS_ARRAY[drawInfos.index].avatar.left || '42px',
          width: '666px',
          height: '90px',
        },
        children: [
          {
            type: 'image',
            css: {
              position: 'absolute',
              top: '0px',
              left: '48px',
              width: '90px',
              height: '90px',
              borderRadius: '45px',
            },
            url: drawInfos.avatarSrc || '',
          },
          {
            type: 'text',
            css: {
              position: 'absolute',
              top: '6px',
              left: '155px',
              fontSize: '34px',
              width: '500px',
              height: '34px',
              color: OPTIONS_ARRAY[drawInfos.index].avatar.color || '#333',
            },
            text: drawInfos.user || '',
          },
          {
            type: 'text',
            css: {
              position: 'absolute',
              top: '50px',
              left: '155px',
              width: '500px',
              height: '28px',
              fontSize: '28px',
              color: OPTIONS_ARRAY[drawInfos.index].avatar.color || '#333',
            },
            text: '邀请你来加入',
          },
        ],
      },
      // 标题和价格
      {
        type: 'div',
        css: {
          position: 'absolute',
          top: OPTIONS_ARRAY[drawInfos.index].title.top,
          left: '109px',
          width: '532px',
          height: '150px',
        },
        children: [
          {
            type: 'text',
            css: {
              position: 'absolute',
              top: '0px',
              left: '0px',
              fontSize: '46px',
              width: '532px',
              height: '112px',
              lineHeight: '56px',
              lineClamp: 2,
              color: OPTIONS_ARRAY[drawInfos.index].title.color,
              textAlign: OPTIONS_ARRAY[drawInfos.index].title.textAlign || 'center',
            },
            text: drawInfos.title,
          },
          {
            type: 'div',
            css: {
              position: 'absolute',
              top: '150px',
              left: '0',
              marginTop: '150px',
              width: '532px',
              height: '34px',
              textAlign: OPTIONS_ARRAY[drawInfos.index].title.textAlign || 'center',
            },
            children: [
              {
                type: 'text',
                css: {
                  fontSize: '34px',
                  color: OPTIONS_ARRAY[drawInfos.index].title.color,
                  textAlign: OPTIONS_ARRAY[drawInfos.index].title.textAlign || 'center',
                },
                text: drawInfos.owlType === 10 ? `${drawInfos.price}` : drawInfos.teacher ? `讲师：${drawInfos.teacher}` : '',
              },
            ],
          },
        ],
      },
      // 上课时间
      {
        type: 'text',
        css: {
          position: 'absolute',
          top: OPTIONS_ARRAY[drawInfos.index].time.top,
          left: '109px',
          width: '532px',
          height: '150px',
          textAlign: 'center',
          fontSize: '30px',
          color: OPTIONS_ARRAY[drawInfos.index].time.color || '#333',
        },
        text: drawInfos.time ? `上课时间：${drawInfos.time}` : '',
      },
      // 二维码
      {
        type: 'image',
        css: {
          position: 'absolute',
          top: OPTIONS_ARRAY[drawInfos.index].qr.top,
          left: '275px',
          width: '200px',
          height: '200px',
        },
        url: drawInfos.qrSrc,
      },
      // 文字：长按二维码，进入课程
      {
        type: 'text',
        css: {
          position: 'absolute',
          top: OPTIONS_ARRAY[drawInfos.index].text.top,
          left: '109px',
          width: '532px',
          height: '150px',
          textAlign: 'center',
          fontSize: '26px',
          color: OPTIONS_ARRAY[drawInfos.index].text.color,
        },
        text: '长按二维码，进入课程',
      },
    ],
  };
  const NEW_POSTER_CONFIG = {
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
          position: 'absolute',
          top: OPTIONS_ARRAY[drawInfos.index].avatar.top,
          left: OPTIONS_ARRAY[drawInfos.index].avatar.left || '42px',
          width: '666px',
          height: '90px',
        },
        children: [
          {
            type: 'image',
            css: {
              position: 'absolute',
              top: '0px',
              left: '48px',
              width: '90px',
              height: '90px',
              borderRadius: '45px',
            },
            url: drawInfos.avatarSrc || '',
          },
          {
            type: 'text',
            css: {
              position: 'absolute',
              top: '8px',
              left: '155px',
              fontSize: '34px',
              width: '500px',
              height: '34px',
              color: OPTIONS_ARRAY[drawInfos.index].avatar.color || '#333',
            },
            text: drawInfos.user || '',
          },
          {
            type: 'text',
            css: {
              position: 'absolute',
              top: '52px',
              left: '155px',
              width: '500px',
              height: '28px',
              fontSize: '28px',
              color: OPTIONS_ARRAY[drawInfos.index].avatar.color || '#333',
            },
            text: '邀请你来加入',
          },
        ],
      },
      // 标题和价格
      {
        type: 'div',
        css: {
          position: 'absolute',
          top: OPTIONS_ARRAY[drawInfos.index].title.top,
          left: '119px',
          width: '513px',
          height: '130px',
        },
        children: [
          {
            type: 'text',
            css: {
              position: 'absolute',
              top: '0px',
              left: '0px',
              fontSize: '46px',
              width: '532px',
              height: '112px',
              lineHeight: '56px',
              lineClamp: 2,
              color: OPTIONS_ARRAY[drawInfos.index].title.color,
              textAlign: OPTIONS_ARRAY[drawInfos.index].title.textAlign || 'center',
            },
            text: drawInfos.title,
          },
          {
            type: 'div',
            css: {
              position: 'absolute',
              top: '150px',
              left: '0',
              marginTop: '0px',
              width: '532px',
              height: '34px',
              textAlign: OPTIONS_ARRAY[drawInfos.index].title.textAlign || 'center',
            },
            children: [
              {
                type: 'text',
                css: {
                  fontSize: '34px',
                  color: OPTIONS_ARRAY[drawInfos.index].title.color,
                  textAlign: OPTIONS_ARRAY[drawInfos.index].title.textAlign || 'center',
                },
                text: drawInfos.owlType === 10 ? `${drawInfos.price}` : drawInfos.teacher ? `讲师：${drawInfos.teacher}` : '',
              },
            ],
          },
        ],
      },
      // 商品主图
      OPTIONS_ARRAY[drawInfos.index].cover && {
        type: 'image',
        css: {
          position: 'absolute',
          top: OPTIONS_ARRAY[drawInfos.index].cover.top,
          left: '170px',
          width: '410px',
          height: '230px',
          borderRadius: '8px',
        },
        url: drawInfos.shareImg,
        mode: 'contain',
      },
      // 二维码
      {
        type: 'image',
        css: {
          position: 'absolute',
          top: OPTIONS_ARRAY[drawInfos.index].qr.top,
          left: '285px',
          width: '200px',
          height: '200px',
        },
        url: drawInfos.qrSrc,
      },
      // 文字：长按二维码，进入课程
      {
        type: 'text',
        css: {
          position: 'absolute',
          top: OPTIONS_ARRAY[drawInfos.index].text.top,
          left: '119px',
          width: '513px',
          height: '150px',
          textAlign: 'center',
          fontSize: '25px',
          color: OPTIONS_ARRAY[drawInfos.index].text.color,
        },
        text: '长按二维码，进入课程',
      },
    ],
  };

  return drawInfos.type === 'active' ? NEW_POSTER_CONFIG : POSTER_CONFIG;
};

export default getPosterConfig;
