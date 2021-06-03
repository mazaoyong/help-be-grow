// 小程序二维码pop组件
import React, { Component } from 'react';
import { Input, CopyButton, Button } from 'zent';
import cx from 'classnames';
import get from 'lodash/get';

import drawImg from './draw-img';
import { omitDots } from '../../utils';

const cacheImgMap = {};
export default class Qrcode extends Component {
  static defaultProps = {
    info: {
      backgroundPic: {},
      coverPic: {},
      title: '',
      questionCount: 0,
      joinUserCount: 0,
      style: 1,
      qrCode: '',
      kdtId: 0,
      redirectUrl: '',
    },
  };

  state = {
    weappCode: null,
    card: null,
    downloadCard: null,
  };

  componentDidMount() {
    const { alias, bdCode } = this.props;
    if (bdCode) {
      const qrCode = `data:image/png;base64,${bdCode}`;
      drawImg(
        Object.assign({}, get(this.props, 'info'), { qrCode: qrCode })
      )
        .then(([previewImg, virtualImg]) => {
          this.setState({
            card: previewImg,
            downloadCard: virtualImg,
            weappCode: qrCode,
          });
          cacheImgMap[alias] = {
            previewImg,
            virtualImg,
          };
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  render() {
    const { alias, info = {} } = this.props;
    const { card, weappCode, downloadCard } = this.state;
    const cardInfo = info || {};
    const { title: name = 'qr' } = cardInfo; // 添加默认值 防止为空时图片无法下载

    let sharePath = `/packages/edu/webview/index?targetUrl=${encodeURIComponent(`https://h5.youzan.com/wscvis/exam/detail?examId=${alias}&kdt_id=${window._global.kdtId || 0}`)}`;

    // 生成的图
    let backgroundImage = '//b.yzcdn.cn/v2/image/loader.gif';
    // 小程序二维码
    let href = '';

    const qrCodeImgClass = cx({
      'qr-code-img': true,
      'qr-code-img--loading': !card,
    });

    if (card) {
      const base64 = weappCode;
      href = base64;
      backgroundImage = card;
    }

    return (
      <div className="qr-content">
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
          <div className={qrCodeImgClass}>
            <img src={backgroundImage} alt="" />
          </div>
        </div>
        <div className="down-link">
          {downloadCard ? (
            <span>
              <Button href={href} download={omitDots(name)} type="primary" outline>
                下载二维码
              </Button>
              <Button href={downloadCard} download={omitDots(name)} type="primary" outline>
                下载推广图
              </Button>
            </span>
          ) : null}
        </div>
      </div>
    );
  }
}
