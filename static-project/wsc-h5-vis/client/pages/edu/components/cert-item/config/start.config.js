import cdnDowngrade from '@/common/utils/cdn-downgrade';
const getStartCertConfig = (currentInfo) => {
  const DYNAMIC_CONFIG = {
    type: 'div',
    css: {
      width: '315px',
      height: '500px',
      backgroundColor: '#f8fcff',
    },
    children: [
      {
        type: 'image',
        css: {
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '315px',
          height: '500px',
        },
        url: currentInfo.bgUrl,
      },
      {
        type: 'text',
        css: {
          position: 'absolute',
          top: '54px',
          left: '34px',
          width: '247px',
          fontSize: '26px',
          lineHeight: '28px',
          textAlign: 'center',
          color: '#323233',
          fontWeight: '500',
        },
        text: currentInfo.title,
      },
      {
        type: 'image',
        css: {
          position: 'absolute',
          top: '122px',
          left: '138px',
          width: '40px',
          height: '40px',
          borderRadius: '20px',
        },
        mode: 'contain',
        url: cdnDowngrade(currentInfo.avatar),
      },
      {
        type: 'text',
        css: {
          position: 'absolute',
          top: '168px',
          left: '34px',
          width: '247px',
          fontSize: '15px',
          lineHeight: '21px',
          textAlign: 'center',
          color: '#323233',
          fontWeight: '500',
        },
        text: currentInfo.identityName,
      },
      {
        type: 'div',
        css: {
          display: 'block',
          width: '247px',
          textAlign: 'center',
          marginLeft: '34px',
          marginTop: '213px',
        },
        children: [
          {
            type: 'text',
            css: {
              display: 'block',
              maxHeight: '36px',
              width: '247px',
              lineHeight: '18px',
              textAlign: 'center',
              lineClamp: 2,
            },
            text: currentInfo.courseName,
          },
          {
            type: 'text',
            css: {
              marginTop: '10px',
              lineHeight: '14px',
              width: '247px',
              textAlign: 'center',
            },
            text: currentInfo.duration,
          },
        ],
      },
      {
        type: 'text',
        css: {
          position: 'absolute',
          top: '281px',
          left: '36px',
          fontSize: '12px',
          color: '#969799',
          lineHeight: '18px',
          width: '247px',
          height: '118px',
          marginTop: '26px',
        },
        text: currentInfo.praiseText,
      },
      {
        type: 'text',
        css: {
          position: 'absolute',
          right: '34px',
          bottom: '109px',
          fontSize: '10px',
          lineHeight: '10px',
          textAlign: 'right',
          color: '#969799',
        },
        text: currentInfo.signatureText,
      },
      {
        type: 'text',
        css: {
          position: 'absolute',
          right: '34px',
          bottom: '95px',
          fontSize: '10px',
          lineHeight: '10px',
          textAlign: 'right',
          color: '#969799',
        },
        text: currentInfo.startDate,
      },
      {
        type: 'image',
        css: {
          position: 'absolute',
          bottom: '26px',
          left: '34px',
          width: '44px',
          height: '44px',
        },
        mode: 'contain',
        url: currentInfo.qrSrc,
      },
      {
        type: 'text',
        css: {
          position: 'absolute',
          bottom: '52px',
          left: '86px',
          fontSize: '12px',
          lineHeight: '14px',
          marginTop: '2px',
          marginLeft: '8px',
          color: '#323233',
          fontWeight: 'bold',
        },
        text: currentInfo.shareText,
      },
    ],
  };

  return DYNAMIC_CONFIG;
};
export default getStartCertConfig;
