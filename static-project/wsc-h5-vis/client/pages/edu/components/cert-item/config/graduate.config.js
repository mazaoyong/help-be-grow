import cdnDowngrade from '@/common/utils/cdn-downgrade';
const getGraduateCertConfig = (currentInfo) => {
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
          top: '79px',
          left: '34px',
          width: '247px',
          fontSize: '24px',
          lineHeight: '21px',
          textAlign: 'center',
          color: '#ab5900',
          fontWeight: '500',
        },
        text: currentInfo.title,
      },
      {
        type: 'image',
        css: {
          position: 'absolute',
          top: '128px',
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
          top: '174px',
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
          position: 'absolute',
          top: '215px',
          left: '34px',
          height: '43px',
          width: '247px',
          textAlign: 'center',
        },
        children: [].concat(currentInfo.consumeCount ? {
          type: 'div',
          css: {
            width: '123px',
            display: 'inline-block',
            textAlign: 'center',
          },
          children: [
            {
              type: 'div',
              css: {
                width: '123px',
                textAlign: 'center',
              },
              children: [
                {
                  type: 'text',
                  css: {
                    display: 'inline-block',
                    fontSize: '21px',
                    color: '#323233',
                    fontWeight: '500',
                    marginRight: '2px',
                  },
                  text: `${currentInfo.consumeCount}`,
                },
                {
                  type: 'text',
                  css: {
                    display: 'inline-block',
                    fontSize: '12px',
                    lineHeight: '14px',
                    color: '#323233',
                    marginTop: '7px',
                  },
                  text: '次',
                },
              ],
            },
            {
              type: 'text',
              css: {
                width: '123px',
                textAlign: 'center',
                marginTop: '5px',
                fontSize: '12px',
                lineHeight: '14px',
                color: '#969799',
              },
              text: '上课次数',
            },
          ],
        } : []).concat(currentInfo.checkinDays ? {
          type: 'div',
          css: {
            display: 'inline-block',
            width: '123px',
            textAlign: 'center',
          },
          children: [
            {
              type: 'div',
              css: {
                width: '123px',
                textAlign: 'center',
              },
              children: [
                {
                  type: 'text',
                  css: {
                    fontSize: '21px',
                    color: '#323233',
                    fontWeight: '500',
                    marginRight: '2px',
                    display: 'inline-block',
                  },
                  text: `${currentInfo.checkinDays}`,
                },
                {
                  type: 'text',
                  css: {
                    fontSize: '12px',
                    lineHeight: '14px',
                    color: '#323233',
                    display: 'inline-block',
                    marginTop: '7px',
                  },
                  text: '天',
                },
              ],
            },
            {
              type: 'text',
              css: {
                width: '123px',
                textAlign: 'center',
                marginTop: '5px',
                fontSize: '12px',
                lineHeight: '14px',
                color: '#969799',
              },
              text: '学习时长',
            },
          ],
        } : []),
      },
      {
        type: 'text',
        css: {
          position: 'absolute',
          top: '279px',
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
          bottom: '104px',
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
          bottom: '91px',
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
export default getGraduateCertConfig;
