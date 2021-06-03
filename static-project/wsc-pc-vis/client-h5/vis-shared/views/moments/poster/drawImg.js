import { canvas } from '@youzan/zan-media-sdk';
import { Toast } from 'vant';
import format from 'date-fns/format';
import get from 'lodash/get';
import ua from '@youzan/utils/browser/ua.js';
import { bgs, cardBg, cardBgForSpecial, quoteImg } from './constants';
import { USER_AVATAR } from '../constants';

const cdnDowngrade = (url) => {
  if (!url) {
    return url;
  }
  return url.replace('img.yzcdn.cn', 'img01.yzcdn.cn');
};

const drawImg = (index, visualIndex, config) => {
  console.log('configaaa', config);
  const shareCode = config.shareCode;
  const extraContents = get(config, 'extraContents', []);
  const isOnlyContent = extraContents.length === 0;
  const extraContent = extraContents[visualIndex] || {};
  const time = format(config.createdAt, 'YYYY-MM-DD');
  const avator = cdnDowngrade(config.senderAvatar) || USER_AVATAR;
  const userName = config.senderName;
  const content = config.textContent;
  let cover = extraContent.contentType === 0 ? extraContent.url : get(extraContent, 'videoDTO.coverUrl');
  cover = cdnDowngrade(cover);
  const address = ((location) => {
    if (location) {
      if (location.eduCourseName) {
        return `${location.schoolName}·${location.eduCourseName}`;
      } else {
        return `${location.schoolName}`;
      }
    }
    return '';
  })(config.location);

  const bg = bgs[index];
  Toast.loading();

  // 头像昵称
  const headerConfig = {
    type: 'div',
    css: {
      customVerticalAlign: 'center',
      marginTop: '15px',
    },
    children: [
      {
        type: 'image',
        css: {
          width: '35px',
          height: '35px',
          borderRadius: '17px',
          marginRight: '8px',
          display: 'inline-block',
        },
        url: avator,
      },
      {
        type: 'text',
        css: {
          fontWeight: 'bold',
          fontSize: '16px',
          lineHeight: '22px',
          display: 'inline-block',
        },
        text: userName,
      },
    ],
  };

  // tips
  const tipsConfig = {
    type: 'text',
    css: {
      fontSize: '14px',
      lineHeight: '20px',
      color: '#C8C9CC',
      marginTop: '15px',
    },
    text: '快来看看我们的精彩瞬间',
  };

  // 文字区域
  const textConfig = {
    type: 'div',
    css: {
      width: '285px',
      height: '213px',
      borderRadius: '4px',
      backgroundColor: '#F7F8FA',
      marginTop: '10px',
    },
    children: [
      {
        type: 'image',
        css: {
          width: '33px',
          height: '31px',
          position: 'absolute',
          top: '5px',
          right: '5px',
        },
        url: quoteImg,
      },
      {
        type: 'text',
        css: {
          width: '258px',
          marginTop: '10px',
          fontSize: '14px',
          marginLeft: '10px',
          lineClamp: 9,
          lineHeight: '20px',
        },
        text: content,
      },
    ],
  };

  // 图片区域
  const imageConfig = cover ? {
    type: 'image',
    css: {
      width: '285px',
      height: '213px',
      borderRadius: '4px',
      marginTop: '10px',
    },
    mode: 'contain',
    url: cover,
  } : null;

  // 显示在内容区域
  const contentConfig = isOnlyContent ? textConfig : imageConfig;

  // 地址信息
  const addressConfig = address ? {
    type: 'text',
    css: {
      fontSize: '14px',
      lineHeight: '20px',
      color: '#646566',
      marginTop: '10px',
    },
    text: address,
  } : null;

  // 时间信息
  const timeConfig = {
    type: 'text',
    css: {
      fontSize: '14px',
      lineHeight: '20px',
      color: '#646566',
      marginTop: '2px',
    },
    text: time,
  };

  // 分享信息
  const shareConfig = {
    type: 'div',
    css: {
      customVerticalAlign: 'center',
      // marginTop: '35px',
      position: 'absolute',
      left: '0px',
      top: '395px',
    },
    children: [
      {
        type: 'image',
        css: {
          width: '90px',
          height: '90px',
          display: 'inline-block',
        },
        url: shareCode,
      },
      {
        type: 'div',
        css: {
          display: 'inline-block',
          marginLeft: '19px',
        },
        children: [
          {
            type: 'text',
            css: {
              fontSize: '14px',
              lineHeight: '20px',
              color: '#969799',
            },
            text: ua.isWeappWebview() ? '长按识别小程序码' : '长按识别二维码',
          },
          {
            type: 'text',
            css: {
              fontSize: '18px',
              lineHeight: '25px',
              color: '#323233',
              marginTop: '4px',
              fontWeight: 'bold',
            },
            text: '立刻围观',
          },
        ],
      },
    ],
  };

  return canvas.coreDraw({
    type: 'div',
    css: {
      width: '375px',
      height: '667px',
      backgroundColor: '#fff',
    },
    children: [
      {
        type: 'image',
        css: {
          width: '375px',
          height: '667px',
        },
        url: bg,
        mode: 'contain',
      },
      {
        type: 'image',
        css: {
          width: '315px',
          height: '500px',
          position: 'absolute',
          left: '30px',
          top: '83px',
        },
        url: index === 4 ? cardBgForSpecial : cardBg,
        mode: 'contain',
      },
      {
        type: 'div',
        css: {
          width: '285px',
          height: '500px',
          position: 'absolute',
          left: '45px',
          top: '83px',
        },
        children: [
          headerConfig,
          tipsConfig,
          contentConfig,
          addressConfig,
          timeConfig,
          shareConfig,
        ].filter(item => item),
      },
    ],
  })
    .then(res => {
      Toast.clear();
      return Promise.resolve(res);
    })
    .catch(err => {
      Toast.clear();
      return Promise.reject(err);
    });
};

export default drawImg;
