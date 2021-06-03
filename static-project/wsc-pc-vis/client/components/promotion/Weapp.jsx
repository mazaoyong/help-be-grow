// 小程序二维码pop组件
import React, { Component } from 'react';
import { Input, CopyButton, Notify, Button } from 'zent';
import fetchWeappQrcode from 'fns/qrcode/fetch-weapp-code';
import has from 'lodash/has';
import get from 'lodash/get';

const hasWeappBinded = has(window._global, 'weappAccount.appId');
const weAppVersion = get(window._global, 'weappVersion.releasedVersion');
// const hasVipWeappBinded = has(window._global, 'weappVersion.releasedVersion');
const isVip = get(window._global, 'weappStatus.isValid');

export default class Qrcode extends Component {
  static defaultProps = {
    name: 'weappcode',
  };

  state = {
    weappCode: null,
  };

  componentDidMount() {
    this.getWeappCode();
  }

  getWeappCode() {
    if (hasWeappBinded && weAppVersion) {
      const { alias } = this.props;
      const { pagepath } = this.props;

      return fetchWeappQrcode(pagepath, alias)
        .then((data) => {
          this.setState({ weappCode: data });
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

  render() {
    const { name } = this.props;
    const { pagepath: weappPath } = this.props;
    let encodePath = encodeURIComponent(weappPath);
    let sharePath = `pages/common/blank-page/index?weappSharePath=${encodePath}`;

    const style = {};
    let href = '';
    if (this.state.weappCode) {
      const base64 = `data:image/png;base64,${this.state.weappCode}`;
      href = base64;
      style.backgroundImage = `url(${base64})`;
      style.backgroundSize = '100% 100%';
    }
    return (
      <div className="qr-content">
        {hasWeappBinded && weAppVersion ? (
          <>
            <div className="qr-path">
              <Input
                value={sharePath}
                disabled
                addonAfter={
                  <CopyButton text={sharePath}>
                    <span>复制</span>
                  </CopyButton>
                }
              />
            </div>
            <div className="qr-code">
              <div className="qr-code-img weapp-code-img" style={style} />
            </div>
            <div className="qr-down-link">
              {href ? (
                <a href={href} download={name}>
                  <Button type="primary" outline>
                    下载小程序码
                  </Button>
                </a>
              ) : null}
            </div>
          </>
        ) : (
          <div className="qr-tips">
            <img
              className="qr-tips_img"
              src="https://b.yzcdn.cn/public_files/2019/01/18/promotion-weapp.png"
              alt=""
            />
            <p>二维码不存在</p>
          </div>
        )}
        {!hasWeappBinded || (isVip && !weAppVersion) ? (
          <div className="qr-redirect">
            你现在可以
            <a
              href={`${_global.url.www}/showcase/weapp/settings`}
              target="_blank"
              rel="noreferrer noopener"
            >
              绑定专享版小程序
            </a>
          </div>
        ) : null}
      </div>
    );
  }
}
