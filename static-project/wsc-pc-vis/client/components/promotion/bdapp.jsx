// 小程序二维码pop组件
import React, { Component } from 'react';
import { Input, CopyButton, Notify, Button } from 'zent';
import { visAjax } from 'fns/new-ajax';

export default class Qrcode extends Component {
  static defaultProps = {
    name: 'weappcode',
  };

  state = {
    weappCode: null,
  };

  componentDidMount() {
    this.getBdappCode();
  }

  getBdappCode() {
    const { alias, webviewpath } = this.props;
    if (alias) {
      this.fetchCode({ path: webviewpath, businessType: 1 })
        .then(res => {
          this.setState({ weappCode: res });
        })
        .catch(err => {
          Notify.error(err);
        });
    }
  }

  fetchCode(data) {
    return visAjax('GET', '/channel/getBaiduAppCode.json', data);
  }

  render() {
    const { name, webviewpath } = this.props;

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
        <div className="qr-path">
          <Input
            value={webviewpath}
            disabled
            addonAfter={
              <CopyButton text={webviewpath}>
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
      </div>
    );
  }
}
