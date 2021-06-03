// 公众号引导canvas配置
export const getGuideConfig = (drawInfos) => {
  const GUIDECONFIG = {
    type: 'div',
    css: {
      width: '375px',
      height: '400px',
      borderRadius: '20px',
      customAlign: 'center',
      backgroundColor: '#fff',
    },
    children: [
      {
        type: 'image',
        css: {
          width: '56px',
          height: '56px',
          marginTop: '44px',
        },
        url: drawInfos.logo,
      },
      {
        type: 'text',
        css: {
          color: '#111',
          fontSize: '16px',
          marginTop: '12px',
          textAlign: 'center',
        },
        text: drawInfos.shopName,
      },
      {
        type: 'image',
        css: {
          width: '178px',
          height: '178px',
          marginTop: '12px',
        },
        url: drawInfos.qrUrl,
      },
      {
        type: 'text',
        css: {
          fontSize: '14px',
          color: '#333',
          marginTop: '12px',
          textAlign: 'center',
        },
        text: '长按识别二维码关注公众号，及时了解学员动态',
      },
    ],
  };
  return GUIDECONFIG;
}

// 带logo的公众号
export const getQrcodeConfig = (drawInfos) => {
  return {
    type: 'div',
    css: {
      width: '178px',
      height: '178px',
      backgroundColor: '#fff',
    },
    children: [
      {
        type: 'image',
        url: drawInfos.qrUrl,
        css: {
          width: '178px',
          height: '178px',
        },
      },
      {
        type: 'image',
        url: drawInfos.logo,
        css: {
          width: '36px',
          height: '36px',
          position: 'absolute',
          left: '71px',
          top: '71px',
        },
      },
    ],
  };
}
