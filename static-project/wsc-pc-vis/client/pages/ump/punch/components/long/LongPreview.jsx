import React, { Component } from 'react';

const defaultBg = 'https://b.yzcdn.cn/wsc/paidcontent/punch/long-bg.png';

export default class SignPreview extends Component {
  render() {
    const {
      longFigureLinkSetting,
      focusQrBase64,
      longFigureCustomQr,
      weappQrcode,
    } = this.props.data;

    let qr = weappQrcode;
    if (longFigureLinkSetting === 3 && longFigureCustomQr) {
      qr = longFigureCustomQr;
    } else if (longFigureLinkSetting === 2 && weappQrcode !== '') {
      qr = focusQrBase64;
    }

    return (
      <div className="long__preview">
        <div className="preview">
          <div className="preview__title">今日任务</div>
          <div className="preview__subtitle">如何打造日本系民宿</div>
          <div
            className="preview__bg"
            style={{
              backgroundImage: `url(${defaultBg})`,
            }}
          />
          <div className="preview__footer">
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
