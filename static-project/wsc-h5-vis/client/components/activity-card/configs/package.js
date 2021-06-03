import { themeTypeMap, themeColor as themeColorMap } from 'common/constants';

function splitPrice(price) {
  let integer = 0;
  let decimal = 0;

  const yuan = price / 100;
  decimal = yuan.toFixed(2).slice(-2);
  if (yuan < 1) {
    integer = '0';
  } else {
    integer = (yuan >> 0).toString();
  }

  return [integer, decimal];
}

const themeType = themeTypeMap[_global.themeType];
const defaultThemeColor = themeColorMap[themeType] || '#00b389';

export default function getConfig(
  type,
  avatarUrl,
  username,
  imageUrl,
  title,
  packagePrice,
  originPrice,
  qrcodeUrl,
  decrease,
  themeColor = defaultThemeColor,
) {
  return {
    // 容器
    type: 'div',
    css: {
      width: '311px',
      height: '455px',
      backgroundColor: '#fff',
    },
    children: [
      // header
      {
        type: 'div',
        css: {
          width: '100%',
          marginLeft: '16px',
          marginTop: '16px',
          marginRight: '16px',
        },
        children: [
          // 左边头像
          {
            type: 'image',
            mode: 'fill',
            css: {
              display: 'inline-block',
              width: '40px',
              height: '40px',
              borderRadius: '20px',
            },
            url: avatarUrl,
          },

          // 右边信息
          {
            type: 'div',
            css: {
              display: 'inline-block',
              marginLeft: '10px',
            },
            children: [
              {
                type: 'text',
                css: {
                  marginTop: '2px',
                  lineHeight: '18px',
                  fontSize: '14px',
                  color: '#323233',
                },
                text: username,
              },
              {
                type: 'text',
                css: {
                  lineHeight: '18px',
                  fontSize: '14px',
                  color: '#969799',
                },
                text: '给你推荐了一个好东西',
              },
            ],
          },
        ],
      },

      // 主图：居中
      {
        type: 'image',
        css: {
          marginTop: '12px',
          marginLeft: '16px',
          marginRight: '16px',
          width: '279px',
          height: '279px',
        },
        url: imageUrl,
      },

      // footer
      {
        type: 'div',
        css: {
          marginTop: '14px',
          marginLeft: '16px',
          marginRight: '16px',
          width: '279px',
        },
        children: [
          // 左边信息
          type === 0
            ? getFixInfo(title, originPrice, packagePrice, themeColor)
            : getMixInfo(title, decrease, themeColor),

          // 右边二维码
          {
            type: 'image',
            css: {
              display: 'inline-block',
              marginLeft: '10px',
              width: '80px',
              height: '80px',
            },
            url: qrcodeUrl,
          },
        ],
      },
    ],
  };
};

function getFixInfo(title, originPrice, packagePrice, themeColor = '#00b389') {
  const [
    packagePriceInt,
    packagePriceDecimal,
  ] = splitPrice(packagePrice);

  return {
    type: 'div',
    css: {
      display: 'inline-block',
      width: '190px',
      height: '80px',
    },
    children: [
      // 标题
      {
        type: 'text',
        css: {
          display: 'inline-block',
          width: '190px',
          height: '32px',
          lineHeight: '16px',
          color: '#323233',
          fontSize: '14px',
          fontWeight: 600,
          lineClamp: 2,
        },
        text: title,
      },

      // 套餐价
      {
        type: 'div',
        css: {
          marginTop: '8px',
          width: '100%',
          height: '20px',
          customVerticalAlign: 'down',
        },
        children: [
          {
            type: 'text',
            css: {
              display: 'inline-block',
              marginBottom: '2px',
              width: '40px',
              textAlign: 'center',
              lineHeight: '14px',
              fontSize: '10px',
              color: '#fff',
              backgroundColor: themeColor,
              borderRadius: '2px',
            },
            text: '套餐价',
          },
          {
            type: 'text',
            css: {
              display: 'inline-block',
              marginLeft: '4px',
              marginRight: '1px',
              marginBottom: '1px',
              lineHeight: '14px',
              fontSize: '14px',
              color: themeColor,
            },
            text: '¥',
          },
          {
            type: 'text',
            css: {
              display: 'inline-block',
              lineHeight: '20px',
              fontSize: '20px',
              color: themeColor,
            },
            text: packagePriceInt,
          },
          {
            type: 'text',
            css: {
              display: 'inline-block',
              marginBottom: '1px',
              lineHeight: '12px',
              fontSize: '12px',
              color: themeColor,
            },
            text: `.${packagePriceDecimal}`,
          },
        ],
      },

      // 划线价
      {
        type: 'text',
        css: {
          marginTop: '2px',
          lineHeight: '16px',
          fontSize: '12px',
          color: '#969799',
          textDecoration: 'line-through',
        },
        text: `价格：¥${(originPrice / 100).toFixed(2)}`,
      },
    ],
  };
}

function getMixInfo(title, decrease, themeColor = '#00b389') {
  return {
    type: 'div',
    css: {
      display: 'inline-block',
      width: '190px',
      height: '80px',
    },
    children: [
      // 标题
      {
        type: 'text',
        css: {
          display: 'inline-block',
          width: '190px',
          height: '32px',
          lineHeight: '16px',
          color: '#323233',
          fontSize: '14px',
          fontWeight: 600,
          lineClamp: 2,
        },
        text: title,
      },

      // 最多省
      {
        type: 'div',
        css: {
          marginTop: '20px',
          width: '100%',
          height: '20px',
          customVerticalAlign: 'down',
        },
        children: [
          {
            type: 'text',
            css: {
              display: 'inline-block',
              lineHeight: '14px',
              fontSize: '12px',
              color: '#323233',
            },
            text: '搭配购买，最多省',
          },
          {
            type: 'text',
            css: {
              marginLeft: '4px',
              display: 'inline-block',
              lineHeight: '16px',
              fontSize: '16px',
              fontWeight: 600,
              color: themeColor,
            },
            text: `${decrease < 1000000 ? decrease / 100 : (decrease / 1000000).toFixed(2)}`,
          },
          {
            type: 'text',
            css: {
              marginLeft: '4px',
              display: 'inline-block',
              lineHeight: '14px',
              fontSize: '12px',
            },
            text: `${decrease < 1000000 ? '' : '万'}元`,
          },
        ],
      },
    ],
  };
}
