// 二维码推广
import React, { Component } from 'react';
import { Input, CopyButton } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import { isEduBranchStore } from '@youzan/utils-shop';
import buildUrl from '@youzan/utils/url/buildUrl';
import { ShowWrapper } from 'fns/chain';

import get from 'lodash/get';

// 是否为服务号
const isMpAccount = get(window._global, 'mpAccount.serviceType') === 2;
export default class QrcodePromote extends Component {
  render() {
    const { focusQrBase64, gciAlias, weappQrcode, wscQr } = this.props.data;

    let weappQrstyle = {};
    let focusQrStyle = {};
    let wscQrStyle = {};

    if (focusQrBase64 !== '') {
      focusQrStyle.backgroundImage = `url(${focusQrBase64})`;
      focusQrStyle.backgroundSize = '100% 100%';
    }

    if (weappQrcode !== '') {
      let base64 = weappQrcode;
      weappQrstyle.backgroundImage = `url(${base64})`;
      weappQrstyle.backgroundSize = '100% 100%';
    }

    if (wscQr !== '') {
      wscQrStyle.backgroundImage = `url(${wscQr})`;
      wscQrStyle.backgroundSize = '100% 100%';
    }

    let weappPath = `packages/new-punch/introduction/index?kdt_id=${_global.kdtId}&alias=${gciAlias}`;
    let encodePath = encodeURIComponent(weappPath);
    let sharePath = `pages/common/blank-page/index?weappSharePath=${encodePath}`;
    let wscPath = buildUrl(
      `https://h5.youzan.com/wscvis/supv/punch/introduction?kdt_id=${_global.kdtId}&alias=${gciAlias}`,
      '',
      _global.kdtId
    );

    return (

      <div className="qrcode">
        <ShowWrapper isInStoreCondition={!isEduBranchStore}>
          {isMpAccount && (
            <div className="qrcode__office">
              <h4>公众号二维码</h4>
              <p>学员扫码可关注公众号并及时获取打卡推送</p>
              <div className="bottom">
                <div className="qrcode-img" style={focusQrStyle} />
                {focusQrBase64 !== '' && (
                  <SamButton type="primary" outline href={focusQrBase64} download="qrcode.jpg">
                    下载二维码
                  </SamButton>
                )}
              </div>
            </div>
          )}
        </ShowWrapper>

        <div className="qrcode__wsc">
          <h4>微商城码</h4>
          <p>学员可扫码直接进入打卡页</p>
          <div className="qr-path">
            <Input
              value={wscPath}
              disabled
              addonAfter={
                <CopyButton text={wscPath}>
                  <span>复制</span>
                </CopyButton>
              }
            />
          </div>
          <div className="bottom">
            <div className="qrcode-img" style={wscQrStyle} />
            {wscQr !== '' && (
              <SamButton type="primary" outline href={wscQr} download="qrcode.jpg">
                下载二维码
              </SamButton>
            )}
          </div>
        </div>

        <div className="qrcode__weapp">
          <h4>小程序码</h4>
          <p>学员可扫码直接进入打卡页</p>
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
          <div className="bottom">
            <div className="qrcode-img" style={weappQrstyle} />
            {weappQrcode !== '' && (
              <SamButton type="primary" outline href={weappQrcode} download="qrcode.jpg">
                下载二维码
              </SamButton>
            )}
          </div>
        </div>

        <ShowWrapper isInStoreCondition={!isEduBranchStore}>
          {!isMpAccount && (
            <div className="qrcode__office disable">
              <img
                className="weixin_logo"
                src="https://img.yzcdn.cn/public_files/2018/10/18/23216d8291c2b2c196014e91aeed8d6d.png"
                alt=""
              />
              <h4 className="qrcode__office-title">无法生成公众号二维码</h4>
              <p className="qrcode__office-desc">你的店铺尚未绑定微信服务号</p>
              <SamButton
                className="qrcode__office-opera"
                type="primary"
                outline
                href={`${window._global.url.www}/setting/wxsettled#step_1`}
              >
                去绑定
              </SamButton>
            </div>
          )}
        </ShowWrapper>
      </div>
    );
  }
}
