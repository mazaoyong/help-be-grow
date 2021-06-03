import React, { PureComponent } from 'react';
import CodeDrawer from './code-drawer';
import { Switch, Notify, Button } from 'zent';
import * as api from 'components/delivery/self-fetch/api';

interface IState {
  qrUrl: string;
  hasWeapp: boolean;
  weappUrl: string;
  qr_code: string;
  weapp_code: string;
  loading: boolean;
  selfWriteOffType: boolean; // 自主核销是否开启
}
/**
 * 扫一扫提货按钮
 */
class ScanCodeModalContent extends PureComponent<{}, IState> {
  canvasQrRef = React.createRef<any>();
  canvasWeappRef = React.createRef<any>();
  state: IState = {
    qrUrl: '',
    hasWeapp: false,
    weappUrl: '',
    /* eslint-disable @typescript-eslint/camelcase */
    qr_code: '',
    weapp_code: '',
    loading: false,
    selfWriteOffType: false,
  };
  componentDidMount() {
    this.getCodeRequest();
  }
  getCodeRequest = () => {
    Promise.all<any>([api.fetchSelfFetchCodes(), api.getWriteOffConfig()])
      .then(([{ qr_code, weapp_code }, selfWriteOffType]) => {
        const hasWeapp = !!weapp_code;
        this.setState({
          hasWeapp,
          qr_code,
          weapp_code,
          selfWriteOffType,
        });
        if (hasWeapp) {
          this.drawCode('weapp', weapp_code);
        }
        this.drawCode('qr', qr_code);
      })
      .catch(error => {
        Notify.error(error);
      });
  };
  /* eslint-enable @typescript-eslint/camelcase */
  drawCode = (type: 'qr' | 'weapp', imgUrl: string) => {
    const canvas = type === 'qr' ? this.canvasQrRef.current : this.canvasWeappRef.current;
    const ctx = canvas.getContext('2d');
    const shopName = _global.shopName;
    const data = {
      imgUrl,
      name: shopName,
      type: type === 'qr' ? '二维码' : '小程序码',
    };
    new CodeDrawer(ctx, canvas, data, () => {
      if (type === 'qr') {
        this.setState({
          qrUrl: canvas.toDataURL('image/png'),
        });
      } else {
        this.setState({
          weappUrl: canvas.toDataURL('image/png'),
        });
      }
    });
  };
  toggleSelfWriteOff = () => {
    api
      .setWriteOffConfig({
        selfWriteOffType: this.state.selfWriteOffType ? 0 : 1,
      })
      .then(success => {
        if (success) {
          this.setState({ selfWriteOffType: !this.state.selfWriteOffType });
        }
      })
      .catch(error => {
        Notify.error(error);
      });
  };
  renderSelfWriteOff = () => {
    const { loading, selfWriteOffType } = this.state;
    return (
      <div className="write-off-wrap">
        <p>自主核销：</p>
        <div className="write-off-switcher">
          <Switch
            size="small"
            loading={loading}
            checked={selfWriteOffType}
            onChange={this.toggleSelfWriteOff}
          />
        </div>
        <p className="selffetch-code__tip">开启后买家可以在扫码打开的提货凭证页中进行自助核销</p>
      </div>
    );
  };
  renderCodeContainer = () => {
    const { qrUrl, hasWeapp, weappUrl } = this.state;
    const name = _global.shopName;
    return (
      <div className="selffetch-code__container">
        <div className="selffetch-code__content-wrap">
          <div className="selffetch-code__content">
            <div className="selffetch-code__code">
              {!qrUrl ? (
                <div className="ui-page-loading" />
              ) : (
                <div className="selffetch-code__code__content">
                  <img alt="" src={qrUrl} />
                </div>
              )}
              <canvas ref={this.canvasQrRef} width="567" height="822" style={{ display: 'none' }} />
            </div>
            <div className="selffetch-code__save">
              <Button type="primary" href={qrUrl} download={`${name}-自提二维码`} outline>
                保存图片
              </Button>
            </div>
          </div>
        </div>
        {hasWeapp ? (
          <div className="selffetch-code__content-wrap">
            <div className="selffetch-code__content">
              <div className="selffetch-code__code">
                {!weappUrl ? (
                  <div className="ui-page-loading" />
                ) : (
                  <div className="selffetch-code__code__content">
                    <img alt="" src={weappUrl} />
                  </div>
                )}
                <canvas
                  ref={this.canvasWeappRef}
                  width="567"
                  height="822"
                  style={{ display: 'none' }}
                />
              </div>
              <div className="selffetch-code__save">
                <Button type="primary" href={weappUrl} download={`${name}-自提二维码`} outline>
                  保存图片
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  };
  renderUsage = () => {
    return (
      <div className="selffetch-code__usage">
        <p className="selffetch-code__usage__title">使用流程：</p>
        <ul className="selffetch-code__usage__bg">
          <li className="selffetch-code__usage__step">
            <span className="selffetch-code__usage__step__link selffetch-code__usage__step__link--after" />
            <span className="selffetch-code__usage__step__label">
              <span>1</span>
            </span>
            <div className="selffetch-code__usage__step__msg">将二维码贴在店里</div>
          </li>
          <li className="selffetch-code__usage__step">
            <span className="selffetch-code__usage__step__link selffetch-code__usage__step__link--before" />
            <span className="selffetch-code__usage__step__link selffetch-code__usage__step__link--after" />
            <span className="selffetch-code__usage__step__label">
              <span>2</span>
            </span>
            <div className="selffetch-code__usage__step__msg">买家扫一扫快速打开提货码</div>
          </li>
          <li className="selffetch-code__usage__step">
            <span className="selffetch-code__usage__step__link selffetch-code__usage__step__link--before" />
            <span className="selffetch-code__usage__step__link selffetch-code__usage__step__link--after" />
            <span className="selffetch-code__usage__step__label">
              <span>3</span>
            </span>
            <div className="selffetch-code__usage__step__msg">店员扫提货码或买家点击确认提货</div>
          </li>
          <li className="selffetch-code__usage__step">
            <span className="selffetch-code__usage__step__link selffetch-code__usage__step__link--before" />
            <span className="selffetch-code__usage__step__label">
              <span>4</span>
            </span>
            <div className="selffetch-code__usage__step__msg">完成核销</div>
          </li>
        </ul>
      </div>
    );
  };
  render() {
    return (
      <div className="selffetch-code">
        {this.renderSelfWriteOff()}
        {this.renderCodeContainer()}
        {this.renderUsage()}
        <div className="selffetch-code__help">
          <a
            href="https://bbs.youzan.com/thread-670384-1-1.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            查看教程
          </a>
        </div>
      </div>
    );
  }
}

export default ScanCodeModalContent;
