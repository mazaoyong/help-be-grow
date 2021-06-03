import React, { PureComponent } from 'react';
import { BlockLoading } from 'zent';
import { Canvas } from '@youzan/vis-ui';
import { getCertificateQrCode } from '../../../api';

const canvas = Canvas.coreDraw;

const admissionStyleUrls = [
  'https://img.yzcdn.cn/public_files/2019/06/11/e895db8b271fc14f0d6ea5305f65f1c8.png',
  'https://img.yzcdn.cn/public_files/2019/06/11/0e88c96be2a05203c611d69e739f85df.png',
  'https://img.yzcdn.cn/public_files/2019/06/11/78b52a992a0d2d56a4a0b376c0abe92e.png',
];

const h5 = window._global && window._global.url && window._global.url.h5;

export default class AdminssionPreview extends PureComponent {
  state = {
    value: {},
    loading: true,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      return { value: props.value };
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

  getDefaultQrCode = (alias, kdtId = window._global.kdtId) => {
    const url = `${h5}/wscvis/edu/prod-detail?alias=${alias}&kdt_id=${kdtId}`;
    const urlParams = {
      width: 160,
      height: 160,
      url,
    };
    if (this[urlParams.url]) {
      return Promise.resolve(this[url]);
    }
    return getCertificateQrCode(urlParams).then(data => {
      this[url] = data;
      return data;
    });
  };

  renderCanvas = async data => {
    const isCustomCert = data.bgNo === 0;
    const bgUrl = isCustomCert ? data.bgUrl : admissionStyleUrls[data.bgNo - 1];
    const title = data.title || '证书标题';
    const sourceTitle = data.sourceTitle ? `《${data.sourceTitle}》` : '《线下课名称》';
    const sourceSku = '100天';
    const praiseText = data.praiseText;
    const signatureText = data.signatureText;
    const shareText = data.shareText || '分享语';
    const qrCode = (data.qrType && data.qrUrl) ? data.qrUrl : await this.getDefaultQrCode(data.sourceId, data.kdtId);
    const showCourse = data.showCourse;
    const showDuration = data.issueType && data.showDuration;

    const showInformation = [].concat(showCourse ? [
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
        text: sourceTitle,
      },
    ] : []).concat(showDuration ? [
      {
        type: 'text',
        css: {
          marginTop: '10px',
          lineHeight: '14px',
          width: '247px',
          textAlign: 'center',
        },
        text: sourceSku,
      },
    ] : []
    );
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
              top: '54px',
              left: '34px',
              width: '247px',
              fontSize: '26px',
              lineHeight: '28px',
              textAlign: 'center',
              color: '#323233',
              fontWeight: '500',
            },
            text: title,
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
            url: 'https://img.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png',
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
            text: '用户名',
          },
          {
            type: 'div',
            css: {
              display: 'block',
              width: '247px',
              textAlign: 'center',
              marginLeft: '34px',
              marginTop: '213px',
              height: showInformation.length ? 'auto' : '0px',
            },
            children: showInformation,
          },
          {
            type: 'text',
            css: {
              position: 'absolute',
              top: '281px',
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
              bottom: '109px',
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
              bottom: '95px',
              fontSize: '10px',
              lineHeight: '10px',
              textAlign: 'right',
              color: '#969799',
            },
            text: '2019年06月10日',
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
      this.dom.src = canvasData.toDataURL('image/png');
      if (this.state.loading) {
        this.setState({ loading: false });
      }
    } catch (error) {
      // TODO
    }
  };
}
