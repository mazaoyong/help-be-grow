const getGraduateCertConfig = (drawInfos) => {
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
        url: 'https://img01.yzcdn.cn/public_files/2019/04/23/bb69a36c222d6c07c0f8760e5d616857.png',
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
        text: '毕业通知书',
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
        url: 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png',
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
        text: '花菜椰大强',
      },
      {
        type: 'div',
        css: {
          position: 'absolute',
          top: '215px',
          left: '34px',
          height: '43px',
          width: '247px',
        },
        children: [
          {
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
                    text: '12',
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
          },
          {
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
                    text: '120',
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
          },
        ],
      },
      {
        type: 'text',
        css: {
          position: 'absolute',
          top: '279px',
          left: '34px',
          fontSize: '12px',
          color: '#969799',
          lineHeight: '18px',
          width: '247px',
          height: '118px',
          marginTop: '26px',
        },
        text: '杨过，名过，字改之，是金庸武侠小说神雕侠侣中的主人公，前作射雕英雄传中杨康与穆念慈之子，西毒欧阳锋的义子。名字为郭靖、黄蓉取有过则改之之意。杨过叛逆机智、情绪激烈、风流英俊.',
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
        text: '有赞教育学院',
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
        text: '2019年04月22日',
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
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAtFBMVEUAAAD/RUX/RET/RUX/RUX/T0//RUX/RET/RET/RUX/RUX/RET/RET/RUX/RUX/Rkb/RET/R0f/RUX/Rkb/RET/SUn/RUX/RET/////iYn/2Nj/e3v/TEz/9/f/uLj/nZ3/R0f/+/v/Xl7/09P/u7v/jo7/amr/4+P/ycn/Zmb/3t7/tbX/qKj/oqL/8PD/7e3/wsL/goL/d3f/5ub/r6//V1f/UFD/zs7/w8P/mpr/fHz/cXFpizzqAAAAF3RSTlMA+e3qfw7f1dLLxKWOjXNiYVM7Mx4VsRwyTSEAAAJKSURBVFjDpdfpeuogEAbgyVLrUreq/UZNNHGvdavVrvd/X0c91kcc0KS8/4gEIQMDkEmj6hdyGddx3Eyu4FcblEqtmMWFbLFGCd2V7qF1X7pL8rrvwsj1bzZR8XCVV6Fr6nnclK+T0aOHBLxHMig7SMQpk9YDEnsgjSek8GT4f4s+lJFS+eL7O0jJeVTi7yE173w+5PEH+bP5e3o44cUmQEKV0/rxzhpgHiQexO/K8nFmFMbvSMg/dkBdv31eIyH3fxdKUGzYLO4/41yJ9i7yT5OvWUZKjjrkP6hGPIZJMOWR8mCfJ4tQRXEcwWTM6hiKRJQ1VpLeOVQbzxI1RK0VN2HwzR9QNagqas15BoMZz6Gqki9qvfIEgmmO+FQQtXr8Br0o5MtZWqCcrBZzAK0RT3EhRxkIx2BLX/yCCxlyIQxMYfiUP7jkQOiawrDknshssgFzGHq8hGzAReIwfPEn5BAyuB2GaPu8bnZXMX9DfsQcpOlhNQS9n9fhvDNpLWM+iOcQclSAtOJ+fxye5ZHFdDKYDXuQCuRDmvOCmcO3/mrTHbZH2+haWqxCF4b+Ty9Zdq9SQxuvRYBkGoeEInzwuPOy0zkZ7MzkULKHlCZtx6wjM1XxmFSFaNQc7jQVawg1kdbTuT9tLEK7Fbba2pLcWO5czfu81xYl7damm0st7gZdbomSyle2d0XIAQIORUm/vVPlbz2oiCNOum+QF4esdFHw6rbHPNuDpu1R1/qwbX/ct79w2F957C9d9tc++4un/dXX/vJtff3/B3jVKiHBQlNAAAAAAElFTkSuQmCC',
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
        text: '精彩课堂、完美名师尽在这里',
      },
    ],
  };

  return DYNAMIC_CONFIG;
};
export default getGraduateCertConfig;
