import React, { Component } from 'react';

const defaultBg = 'https://img.yzcdn.cn/wsc/paidcontent/punch/default-bg.png';

export default class SignPreview extends Component {
  render() {
    const { logo } = window._global.shopInfo;
    const shopName = window._global.shopName || 'nickname';
    const {
      daySignBgPicUrl,
      daySignQuotes,
      daySignLinkSetting,
      focusQrBase64,
      daySignCustomQr,
      weappQrcode,
    } = this.props.data;

    let qr = weappQrcode;
    if (daySignLinkSetting === 3 && daySignCustomQr) {
      qr = daySignCustomQr;
    } else if (daySignLinkSetting === 2 && weappQrcode !== '') {
      qr = focusQrBase64;
    }

    return (
      <div className="sign__preview">
        <div className="sign__preview__content">
          <div
            className="sign__preview__content__top"
            style={{
              backgroundImage: `url(${daySignBgPicUrl === '' ? defaultBg : daySignBgPicUrl})`,
            }}
          >
            <div className="sign__preview__content__top__mask">
              <p className="head">
                <img src={logo} alt="" />
                <span className="head__name">{shopName}</span>
              </p>
              <p className="quotes">{daySignQuotes}</p>
              <p className="days-label">已坚持打卡/天</p>
              <p className="days">09</p>
            </div>
          </div>
          <div className="sign__preview__content__bottom">
            <div className="left">
              <h3>每天一个养生小知识</h3>
              <p>1234人正在打卡</p>
              <p className="desc">长按识别二维码参与打卡</p>
            </div>
            <div className="right">
              <img src={qr} alt="" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
