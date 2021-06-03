// 推广 公众号 二维码
import React, { Component } from 'react';
import { Button } from 'zent';
import cx from 'classnames';
import get from 'lodash/get';

import drawImg from './draw-img';
import { omitDots } from '../../utils';

const cacheImgMap = {};
export default class H5Code extends Component {
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
    qrcode: '',
    promotionUrl: '',
    card: null,
    downloadCard: null,
  };

  componentDidMount() {
    const props = this.props || {};
    const cardInfo = props.info || {};
    const qrCode = props.qrCode;
    const alias = cardInfo.alias;

    this.setState({ promotionUrl: get(this.props, 'info.redirectUrl', '') });

    if (qrCode) {
      cardInfo.qrCode = qrCode;
      drawImg(cardInfo).then(([previewImg, virtualImg]) => {
        this.setState({
          card: previewImg,
          downloadCard: virtualImg,
        });
        cacheImgMap[alias] = {
          previewImg,
          virtualImg,
        };
      });
    }
  }

  render() {
    const props = this.props || {};
    const cardInfo = props.info || {};
    const { qrCode: qrcode, title: name = 'qr' } = cardInfo;
    const { card, downloadCard } = this.state;
    let backgroundImage = '//b.yzcdn.cn/v2/image/loader.gif';
    let qrCodeImgClass = cx({
      'qr-code-img': true,
      'qr-code-img--loading': !card,
    });
    if (card) {
      backgroundImage = card;
    }

    return (
      <div className="qr-content">
        <div className="qr-path">
          用户扫码关注公众号后获得活动链接
        </div>
        <div className="qr-code">
          <div className={qrCodeImgClass}>
            <img src={backgroundImage} alt="" />
          </div>
        </div>
        <div className="down-link">
          {downloadCard ? (
            <span>
              <Button href={qrcode} download={omitDots(name)} type="primary" outline>
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
