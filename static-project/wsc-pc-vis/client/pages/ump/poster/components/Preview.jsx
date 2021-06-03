// 海报预览图
import React, { Component } from 'react';

import classnames from 'classnames';
import fullfillImage from 'zan-utils/fullfillImage';

import { CUSTOM_DEFAULT_BG, customBgs, BG_MAPS } from '../constants';

export default class Preview extends Component {
  constructor() {
    super();
    this.state = {
      configObj: this.getConfigMap(),
    };
  }

  renderHeader = url => {
    const { logo, name, shopName } = window._global.shopInfo;
    const styleMap = {
      [BG_MAPS.a.main]: {
        main: {
          color: '#333',
          left: '41px',
          top: '36px',
        },
        avatar: {
          width: '45px',
          height: '45px',
        },
        name: {
          paddingTop: '0px',
        },
      },
      [BG_MAPS.b.main]: {
        main: {
          color: '#333',
          left: '45px',
          top: '54px',
        },
        avatar: {
          width: '45px',
          height: '45px',
        },
        name: {
          paddingTop: '0px',
        },
      },
      [BG_MAPS.c.main]: {
        main: {
          color: '#fff',
          left: '30px',
          top: '31px',
        },
        avatar: {
          width: '45px',
          height: '45px',
        },
        name: {
          paddingTop: '0px',
        },
      },
      [BG_MAPS.d.main]: {
        main: {
          color: '#333',
          left: '30px',
          top: '31px',
        },
        avatar: {
          width: '45px',
          height: '45px',
        },
        name: {
          paddingTop: '0px',
        },
      },
      [BG_MAPS.e.main]: {
        main: {
          color: '#fff',
          left: '63px',
          top: '73px',
        },
        avatar: {
          width: '45px',
          height: '45px',
        },
        name: {
          paddingTop: '0px',
        },
      },
      [BG_MAPS.f.main]: {
        main: {
          color: '#fff',
        },
        avatar: {
          width: '60px',
          height: '60px',
        },
      },
      [BG_MAPS.g.main]: {
        main: {
          color: '#fff',
        },
        avatar: {
          width: '60px',
          height: '60px',
        },
      },
      [BG_MAPS.h.main]: {
        main: {
          color: '#333',
        },
        avatar: {
          width: '60px',
          height: '60px',
        },
      },
      [BG_MAPS.i.main]: {
        main: {
          color: '#333',
        },
        avatar: {
          width: '60px',
          height: '60px',
        },
      },
    };
    return (
      <div className="user" style={styleMap[url].main}>
        <img className="avatar" style={styleMap[url].avatar} src={logo} alt="" />
        <div className="user-content">
          <p className="name" style={styleMap[url].name}>
            {name || shopName}
          </p>
          <p className="desc">邀请你来加入</p>
        </div>
      </div>
    );
  };

  renderBody = url => {
    const { product = {}, content } = this.props.data;
    const title = product.title || '';
    const styleMap = {
      [BG_MAPS.a.main]: {
        title: {
          color: '#333',
          paddingTop: '155px',
          paddingLeft: '49px',
          paddingRight: '49px',
        },
        lecturer: {
          color: '#333',
          top: '225px',
        },
        desc: {
          color: '#333',
          top: '272px',
        },
      },
      [BG_MAPS.b.main]: {
        title: {
          color: '#2994ff',
          paddingTop: '194px',
          paddingLeft: '54px',
          paddingRight: '54px',
        },
        lecturer: {
          color: '#2994ff',
          top: '255px',
        },
        desc: {
          color: '#333',
          top: '363px',
        },
      },
      [BG_MAPS.c.main]: {
        title: {
          color: '#000',
          paddingTop: '209px',
          paddingLeft: '54px',
          paddingRight: '54px',
        },
        lecturer: {
          color: '#000',
          top: '275px',
        },
        desc: {
          color: '#fff',
          top: '347px',
        },
      },
      [BG_MAPS.d.main]: {
        title: {
          color: '#fff',
          paddingTop: '173px',
          paddingLeft: '54px',
          paddingRight: '54px',
        },
        lecturer: {
          color: '#fff',
          top: '254px',
        },
        desc: {
          color: '#fff',
          top: '347px',
        },
      },
      [BG_MAPS.e.main]: {
        title: {
          color: '#fff',
          paddingTop: '207px',
          paddingLeft: '54px',
          paddingRight: '54px',
        },
        lecturer: {
          color: '#fff',
          top: '276px',
        },
        desc: {
          color: '#fff',
          top: '376px',
        },
      },
      [BG_MAPS.f.main]: {},
      [BG_MAPS.g.main]: {},
      [BG_MAPS.h.main]: {
        title: {
          color: '#333',
        },
        lecturer: {
          color: '#333',
        },
        desc: {
          color: '#333',
        },
      },
      [BG_MAPS.i.main]: {
        title: {
          color: '#333',
        },
        lecturer: {
          color: '#333',
        },
        desc: {
          color: '#333',
        },
      },
    };
    return (
      <div className="main">
        <div className="content" style={styleMap[url].title}>
          {title.length > 9 ? (
            <div>
              <h2 className="ellipsis">{title.substring(0, 9)}</h2>
              <h2 className="ellipsis">{title.substring(9)}</h2>
            </div>
          ) : (
            <h2 className="ellipsis-2">{title || '商品标题'}</h2>
          )}
          {product.lecturer && (
            <p className="teller" style={styleMap[url].lecturer}>
              讲师：
              {product.lecturer}
            </p>
          )}
          {[BG_MAPS.f.main, BG_MAPS.g.main, BG_MAPS.h.main, BG_MAPS.i.main].indexOf(url) > -1 ? (
            <p className="free">
              课程原价
              {product.price ? (product.price / 100).toFixed(2) : 'xxx'}
              ，现免费
            </p>
          ) : null}
          <p className="desc" style={styleMap[url].desc}>
            {content || '这里是海报文案位置，非必填'}
          </p>
        </div>
      </div>
    );
  };

  renderFooter = url => {
    const { targetFansNum, instructions } = this.props.data;
    const isNewPoster =
      [BG_MAPS.a.main, BG_MAPS.b.main, BG_MAPS.c.main, BG_MAPS.d.main, BG_MAPS.e.main].indexOf(
        url,
      ) > -1;
    const wrapStyle = {};
    const descStyle = {};
    const longPressStyle = {};

    if (isNewPoster) {
      descStyle.color = '#333';

      longPressStyle.color = '#999';
      longPressStyle.left = '85px';
    }

    if ([BG_MAPS.e.main].indexOf(url) > -1) {
      descStyle.color = '#fff';

      longPressStyle.color = '#fff';
    }

    if ([BG_MAPS.a.main, BG_MAPS.c.main, BG_MAPS.d.main].indexOf(url) > -1) {
      wrapStyle.left = '41px';
      wrapStyle.bottom = '27px';
    }

    if ([BG_MAPS.b.main, BG_MAPS.e.main].indexOf(url) > -1) {
      wrapStyle.left = '41px';
      wrapStyle.bottom = '84px';
    }

    return (
      <div className="qrcode-wrapper" style={wrapStyle}>
        <img className="qrcode" src="https://b.yzcdn.cn/wsc/paidcontent/youzan.png" alt="" />

        {isNewPoster ? (
          <p style={descStyle} className="qrcode-wrapper__new-poster">
            {instructions}
          </p>
        ) : (
          <div>
            <p className="qrcode-wrapper__desc1">
              邀请
              <span>{targetFansNum || 0}</span>
              位好友后，
            </p>
            <p className="qrcode-wrapper__desc2">即有机会获得学习奖励！</p>
          </div>
        )}
        <p className="qrcode-wrapper__desc3" style={longPressStyle}>
          长按识别二维码关注
        </p>
      </div>
    );
  };

  getConfigMap = () => {
    const config = {};
    customBgs.forEach((item, index) => {
      const url = item.main;
      config[url] = {
        header: () => {
          return this.renderHeader(url);
        },
        body: () => {
          return this.renderBody(url);
        },
        footer: () => {
          return this.renderFooter(url);
        },
      };
    });
    return config;
  };

  renderCustomView = config => {
    const { logo, name, shopName } = window._global.shopInfo;
    return (
      <div>
        <div className="custom-user">
          <img className="custom-user__avatar" src={logo} alt="" />
          <div className="custom-user__user-content">
            <p className="custom-user__name">{name || shopName}</p>
            <p className="custom-user__desc">邀请你来加入</p>
          </div>
        </div>
        <div className="custom-qrcode-wrapper">
          <img
            className="custom-qrcode-wrapper__qrcode"
            src="https://b.yzcdn.cn/wsc/paidcontent/youzan.png"
            alt=""
          />
          <p className="custom-qrcode-wrapper__desc">长按二维码，进入课程</p>
        </div>
      </div>
    );
  };

  renderTemplateView = () => {
    const { url } = this.props.data;
    const config = this.state.configObj[url];

    let dom = null;
    if (config) {
      dom = (
        <div>
          {config.header()}
          {config.body()}
          {config.footer()}
        </div>
      );
    }
    return dom;
  };

  render() {
    const { url, custom } = this.props.data;
    const currUrl = fullfillImage(url || CUSTOM_DEFAULT_BG, '!750x1334q40.jpg');
    const previewClass = classnames({
      'poster-preview': true,
    });

    let dom;
    if (custom === 1) {
      dom = this.renderCustomView();
    } else if (custom === 0) {
      dom = this.renderTemplateView();
    }

    return (
      <div className={previewClass}>
        <img className="bg" src={currUrl} alt="" />
        {dom}
      </div>
    );
  }
}
