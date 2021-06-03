// 推广 H5 二维码
import React, { Component } from 'react';
import { Input, CopyButton, Button } from 'zent';
import { visAjax } from 'fns/new-ajax';

export default class Web extends Component {
  static defaultProps = {
    name: 'qrcode',
  };

  state = {
    qrcode: this.props.qrcode,
    promotionUrl: null,
  };

  componentDidMount() {
    this.getPromotionUrl(this.props.url);
  }
  // 知识付费-内容，专栏，直播 推广链接
  getPromotionUrl(url) {
    this.setState({ promotionUrl: url });
    try {
      const { qrcode } = this.props;
      if (!qrcode || qrcode === '') {
        visAjax('GET', '/pct/biz/getWscQrcode.json', {
          url: url,
          width: 280,
          height: 280,
        }).then(qrcode => this.setState({ qrcode }));
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  render() {
    const { url, name } = this.props;
    const { qrcode } = this.state;
    const style = qrcode
      ? {
        backgroundImage: `url(${qrcode})`,
        backgroundSize: '100% 100%',
      }
      : null;
    const match = qrcode ? qrcode.match(/data:image\/([^;]*)/) : null;
    // 手动添加文件后缀名，带.标题不能自动补全后缀
    const nameSuffix = match ? `${name}.${match[1]}` : name;

    return (
      <div className="qr-content">
        <div className="qr-path">
          <Input
            value={this.state.promotionUrl || url}
            disabled
            addonAfter={
              <CopyButton text={this.state.promotionUrl || url}>
                <span>复制</span>
              </CopyButton>
            }
          />
        </div>
        <div className="qr-code">
          <div className="qr-code-img weapp-code-img" style={style} />
        </div>
        <div className="qr-down-link">
          <a href={qrcode} download={nameSuffix}>
            <Button type="primary" outline>
              下载二维码
            </Button>
          </a>
        </div>
      </div>
    );
  }
}
