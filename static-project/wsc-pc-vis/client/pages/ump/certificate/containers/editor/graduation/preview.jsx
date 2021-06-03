import React, { PureComponent } from 'react';
import { BlockLoading } from 'zent';
import { Canvas } from '@youzan/vis-ui';

const canvas = Canvas.coreDraw;

const graduationStyleUrls = [
  'https://img.yzcdn.cn/publicPath/20190506/certificate.png',
  'https://img.yzcdn.cn/public_files/2019/04/23/4976b4a5a1aaf0ceb0e1235f09f35dae.png',
  'https://img.yzcdn.cn/public_files/2019/04/23/6c0c6f79fed61c0a440d5243a141ee91.png',
];

const defaultQrCode = 'https://b.yzcdn.cn/fix-base64/dba0801a7a68fa2929faaa941566d2352ec7fa7e0a1c252a01316b6d1130a79f.png';

export default class GraduationPreview extends PureComponent {
  state = {
    initialized: false,
    value: {},
    loading: true,
  };

  static getDerivedStateFromProps(props, state) {
    if (!state.initialized || props.value !== state.value) {
      return { value: props.value, initialized: true };
    }
    return null;
  }

  componentDidMount() {
    this.renderCanvas(this.state.value);
  }

  componentDidUpdate() {
    this.renderCanvas(this.state.value);
  }

  ref = dom => {
    this.dom = dom;
  }

  render() {
    return (
      <div className="certificate-preview">
        <BlockLoading loading={this.state.loading}>
          <img ref={this.ref} src="" alt="" />
        </BlockLoading>
      </div>
    );
  }

  renderCanvas = async data => {
    const isCustomCert = data.bgNo === 0;
    const bgUrl = isCustomCert ? data.bgUrl : graduationStyleUrls[data.bgNo - 1];
    const title = data.title || '证书标题';
    const praiseText = data.praiseText;
    const signatureText = data.signatureText;
    const shareText = data.shareText || '分享语';
    const qrCode = (data.qrType && data.qrUrl) ? data.qrUrl : defaultQrCode;
    const showConsumeCount = data.showConsumeCount;
    const showCheckinDays = data.showCheckinDays;
    try {
      let config = {
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
            url: bgUrl,
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
            text: title,
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
            url: 'https://img.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png',
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
            text: '用户名',
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
            children: [].concat(showConsumeCount ? [
              {
                type: 'div',
                css: {
                  width: '123px',
                  height: '43px',
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
                        text: '10',
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
            ] : []).concat(showCheckinDays ? [
              {
                type: 'div',
                css: {
                  display: 'inline-block',
                  width: '123px',
                  height: '43px',
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
                        text: '100',
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
            ] : []),
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
            text: praiseText,
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
            text: signatureText,
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
            url: qrCode,
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
            text: shareText,
          },
        ],
      };
      const canvasData = await canvas(config);
      const img = canvasData.toDataURL('image/png');
      this.dom.src = img;
      if (this.state.loading) {
        this.setState({ loading: false });
      }
    } catch (error) {
      // TODO
    }
  };
}
