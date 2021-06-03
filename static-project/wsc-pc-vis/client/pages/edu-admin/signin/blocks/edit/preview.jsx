import React, { PureComponent } from 'react';
import { Canvas } from '@youzan/vis-ui';
import { Button, Notify, CopyButton, BlockLoading } from 'zent';
import has from 'lodash/has';
import fetchWeappQrcode from 'fns/qrcode/fetch-weapp-code';
import { getSignInQrCode } from '../../domain/apis/edit';
import { loadImage, downloadImage } from '../../utils';
import { compareVersion } from 'shared/fns/compare-version';
import { get } from 'lodash';

const weappVersion = get(window._global, 'weappVersion.releasedVersion');

const hasOfflineCourseWeapp = weappVersion && compareVersion(weappVersion, '2.37.5') >= 0;

const canvas = Canvas.coreDraw;

const kdtId = _global.kdtId;
const shopName = _global.shopName;
const h5Prefix = _global.url && _global.url.h5;
const logoUrl = _global.shopInfo && _global.shopInfo.logo;
const linkUrl = `${h5Prefix}/wscvis/edu/sign-in-list?kdt_id=${kdtId}`;
const pagepath = `packages/edu/webview/index?targetUrl=${encodeURIComponent(`https://h5.youzan.com/wscvis/edu/sign-in-list?kdt_id=${kdtId}`)}`;
const hasWeappBinded = has(window._global, 'weappAccount.appId');

export default class Preview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      activeTab: 'h5',
      weappCode: '',
      imgSrc: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.renderCanvas(nextProps);
    }
  }

  componentDidMount() {
    this.wrapLoading(this.renderCanvas());
  }

  render() {
    return (
      <>
        <div className="tab">
          <div
            className={`tab-item ${this.state.activeTab === 'h5' ? 'tab-item_active' : ''}`}
            href="javascript: void(0);"
            onClick={() => { this.onSelectCode('h5'); }}
          >
            H5签到码
          </div>
          {
            hasOfflineCourseWeapp
              ? <div
                className={`tab-item ${this.state.activeTab === 'weapp' ? 'tab-item_active' : ''}`}
                href="javascript: void(0);"
                onClick={() => { this.onSelectCode('weapp'); }}
              >
                小程序签到码
              </div> : null
          }
        </div>
        <BlockLoading loading={this.state.loading} height={410}>
          <img className="signin-edit_canvas" src={this.state.imgSrc} />
        </BlockLoading>
        <div className="text-center signin-edit_btn-group">
          <Button type="primary" outline size="small" onClick={this.handleTemplateDownload}>
            下载签到码模版
          </Button>
          <Button type="primary" outline size="small" onClick={this.handleQrCodeDownload}>
            下载二维码
          </Button>
          <CopyButton text={this.state.activeTab === 'h5' ? linkUrl : pagepath} onCopySuccess="复制链接完成">
            <Button type="primary" outline size="small">
              复制链接
            </Button>
          </CopyButton>
        </div>
      </>
    );
  }

  onSelectCode = type => {
    this.setState({
      activeTab: type,
      loading: true,
    }, () => {
      if (this.props.onTabChange) {
        this.props.onTabChange(type);
      }
      if (type === 'weapp') {
        this.getWeappCode();
      } else {
        this.renderCanvas();
      }
    });
  };

  handleTemplateDownload = () => {
    downloadImage(this.state.imgSrc, shopName);
  };

  handleQrCodeDownload = () => {
    downloadImage(this.joinedQrCode, shopName);
  };

  wrapLoading(promise) {
    this.setState({ loading: true });
    promise
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  renderCanvas = async props => {
    const { value } = props || this.props;
    const organizationName = value.organizationName || shopName;
    const scanGuideCopy = value.scanGuideCopy || '微信扫一扫，签到消课';

    const joinedQrCode = await this.renderImg(props);

    if (!joinedQrCode) {
      return;
    }

    const config = {
      type: 'div',
      css: {
        width: '300px',
        height: '410px',
        backgroundColor: '#00B389',
      },
      children: [
        {
          type: 'text',
          css: {
            fontSize: '22px',
            lineHeight: '30px',
            color: '#FFFFFF',
            marginTop: '54px',
            fontWeight: 'bold',
            textAlign: 'center',
          },
          text: scanGuideCopy,
        },
        {
          type: 'image',
          url: joinedQrCode,
          css: {
            width: '160px',
            height: '160px',
            marginTop: '40px',
            marginLeft: '70px',
          },
        },
        {
          type: 'text',
          css: {
            fontSize: '22px',
            lineHeight: '30px',
            color: '#FFFFFF',
            marginTop: '36px',
            fontWeight: 'bold',
            textAlign: 'center',
          },
          text: organizationName,
        },
      ],
    };
    const canvasData = await canvas(config);
    this.setState({
      imgSrc: canvasData.toDataURL('image/png'),
      loading: false,
    });
  };

  renderImg = async props => {
    const { value } = props || this.props;
    const { codeStyle } = value;
    const { activeTab, weappCode } = this.state;
    let qrCode, logo;
    if (activeTab === 'h5') {
      const codeAndLogo = await this.getQrCodeAndLogo();
      qrCode = codeAndLogo.qrCode;
      logo = codeAndLogo.logo;
    } else {
      qrCode = weappCode;
    }

    if (!qrCode) {
      return null;
    }

    const imgConfig = {
      type: 'div',
      css: {
        width: '160px',
        height: '160px',
      },
      children: [
        {
          type: 'image',
          url: qrCode,
          css: {
            width: '160px',
            height: '160px',
            borderRadius: activeTab === 'h5' ? '0' : '80px',
          },
        },
      ],
    };
    if (codeStyle === 1 && activeTab === 'h5') {
      imgConfig.children.push({
        type: 'image',
        url: logo,
        css: {
          position: 'absolute',
          width: '36px',
          height: '36px',
          left: '62px',
          top: '62px',
        },
      });
    }
    try {
      const imgData = await canvas(imgConfig);
      const joinedQrCode = imgData.toDataURL('image/png');
      this.joinedQrCode = joinedQrCode;
      return joinedQrCode;
    } catch (err) {
      Notify.error(err);
    }
    return '';
  };

  getQrCodeAndLogo = async () => {
    if (!window._components) {
      window._components = {};
    }
    let signin = window._components.signin;
    if (!signin) {
      const urlParams = {
        width: 160,
        height: 160,
        url: linkUrl,
      };
      const [qrCode, logo] = await Promise.all([getSignInQrCode(urlParams), loadImage(logoUrl)]);
      window._components.signin = signin = { qrCode, logo };
    }
    return signin;
  };

  getWeappCode = () => {
    if (hasWeappBinded) {
      if (this.state.weappCode) {
        this.renderCanvas();
        return;
      }

      return fetchWeappQrcode(pagepath)
        .then((data) => {
          if (data) {
            const base64 = `data:image/png;base64,${data}`;
            this.setState({ weappCode: base64 });
            this.renderCanvas();
          }
        })
        .catch(({ code, msg }) => {
          if (code === 41030) {
            Notify.error('你未开通小程序或小程序版本过低，请升级！');
          } else {
            Notify.error(msg);
          }
        });
    }
  }
}
