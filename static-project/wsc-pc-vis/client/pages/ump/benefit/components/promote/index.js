import React, { Component } from 'react';
import { CopyButton, BlockLoading, Notify } from 'zent';
import './style.scss';
import { getQrcode } from '../../api';

export default class Promote extends Component {
  state = {
    qrcode: '',
  };
  componentDidMount() {
    const { url } = this.props.item;
    getQrcode({
      url,
    })
      .then(data => {
        this.setState({
          qrcode: data.qrCode,
        });
      })
      .catch(msg => {
        Notify.error(msg);
      });
  }
  getQrcode = () => {
    const { item } = this.props;
    if (item.qrcode || this.state.qrcode) {
      return (
        <img className="qrcode" src={item.qrcode || this.state.qrcode} alt="" role="presentation" />
      );
    }
    return (
      <div className="qrcode">
        <BlockLoading loading />
      </div>
    );
  };
  render() {
    const { item } = this.props;

    return (
      <div className="shop-qr-code">
        <p className="title">微信扫码直接访问</p>
        {this.getQrcode()}
        <p className="links">
          <CopyButton text={item.url} onCopySuccess="复制成功！">
            <span className="copy">复制页面链接</span>
          </CopyButton>
          <a href={item.url} target="_blank" className="open" rel="noopener noreferrer">
            电脑上查看
          </a>
        </p>
      </div>
    );
  }
}
