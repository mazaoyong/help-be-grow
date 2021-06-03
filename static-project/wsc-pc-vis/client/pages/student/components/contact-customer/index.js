import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import { Menu, Notify } from 'zent';
import cx from 'classnames';
import map from 'lodash/map';
import api from './api';
import isArray from 'lodash/isArray';
import assign from 'lodash/assign';
import filter from 'lodash/filter';
import get from 'lodash/get';

import './style.scss';

const { MenuItem } = Menu;

class ContactCustomer extends Component {
  state = {
    contactWay: [],
  };

  componentDidMount() {
    this.getCommunication();
  }

  getLinkUrl = item => {
    const channel = get(item, 'channel');
    const effective = get(item, 'effective', false);
    const identifyData = get(item, 'identifyData');

    const urlMap = {
      Mall_Channel: effective
        ? `${window._global.url.im}/#/?buyerId=${identifyData}&registerType=youzan`
        : '',
      WxPub_Channel: effective
        ? `${window._global.url.im}/#/?fansId=${identifyData}&registerType=weixin`
        : '',
      WxMin_Channel: effective
        ? `${window._global.url.im}/#/?fansId=${identifyData}&registerType=mmp`
        : '',
      Message_Channel: effective
        ? `${window._global.url.www}/apps/messagepush#/messagegroup/create?mobile=${identifyData}`
        : '',
    };
    return urlMap[channel];
  };

  getIconList() {
    return {
      Mall_Channel: 'https://img.yzcdn.cn/v4/scrm/customer/list/contact1.png',
      WxPub_Channel: 'https://img.yzcdn.cn/v4/scrm/customer/list/contact2.png',
      WxMin_Channel: 'https://img.yzcdn.cn/v4/scrm/customer/list/contact3.png',
      Message_Channel: 'https://b.yzcdn.cn/v4/scrm/customer/list/message.png',
    };
  }

  getDisableIconList() {
    return {
      Mall_Channel:
        'https://img.yzcdn.cn/public_files/2018/05/31/c69f95001f143e45216627dcd0a003df.png',
      WxPub_Channel:
        'https://img.yzcdn.cn/public_files/2018/05/31/30c40d389ce36e2081adc895674f551d.png',
      WxMin_Channel:
        'https://img.yzcdn.cn/public_files/2018/05/31/a0da219c75751bd2b783470c65ba5b00.png',
      Message_Channel:
        'https://img.yzcdn.cn/public_files/2018/05/31/fea6d033c95bb4d9f70228ab362937ec.png',
    };
  }

  getTextList() {
    return {
      Mall_Channel: '商城在线客服',
      WxPub_Channel: '微信公众号消息',
      WxMin_Channel: '小程序客服消息',
      Message_Channel: '短信',
    };
  }

  // 获取下拉menu列表数据
  getContactWay = res => {
    const iconList = this.getIconList();
    const disableIconList = this.getDisableIconList();
    const textList = this.getTextList();
    // 列表页过滤掉短信入口
    const data = filter(res, item => {
      return item.channel !== 'Message_Channel';
    });

    if (isArray(data) && data.length > 0) {
      return map(data, (item, idx) => {
        return assign({}, item, {
          id: idx,
          text: textList[item.channel],
          url: this.getLinkUrl(item),
          icon: item.effective ? iconList[item.channel] : disableIconList[item.channel],
        });
      });
    }

    return null;
  };

  // 获取联系通道
  getCommunication() {
    const { customerInfo } = this.props;
    const { accountId, accountType } = customerInfo;

    api
      .getCommunication({
        userId: accountId,
        accountType,
      })
      .then(res => {
        this.setState({
          contactWay: this.getContactWay(res),
        });
      })
      .catch(err => {
        Notify.error(err || '网络错误');
      });
  }

  redirectUrl = data => {
    const { url, effective } = data;
    if (effective) {
      window.open(url);
    } else {
      return null;
    }
  };

  render() {
    const { contactWay } = this.state;

    if (isArray(contactWay) && contactWay.length > 0) {
      return (
        <div className="contact-customer-wrap">
          <Menu className="way-menu">
            {map(contactWay, item => {
              return (
                <MenuItem key={item.id} className="way-menu__item" disabled={!item.effective}>
                  <img src={item.icon} className="way-menu__item-image" />
                  <span onClick={this.redirectUrl.bind(this, item)}>{item.text}</span>
                </MenuItem>
              );
            })}
          </Menu>
        </div>
      );
    }

    return (
      <div className="contact-customer-wrap">
        <img
          className="loading-img"
          src={`${window._global.url.cdnStatic}/v2/image/loader.gif`}
          alt=""
        />
      </div>
    );
  }
}

export default props => {
  const { position = 'bottom-center', className, disabled } = props;

  // 添加disabled属性
  const handleCaptureClick = evt => {
    if (props.disabled) {
      evt.stopPropagation();
    }
  };

  return (
    <Pop
      className={cx('contact-customer-pop-wrap', className)}
      trigger="click"
      position={position}
      content={<ContactCustomer {...props} />}
    >
      <div
        onClickCapture={handleCaptureClick}
        className={`contact-customer ${disabled ? 'disabled' : ''}`}
      >
        {props.children || <span className="option-item cursor-link">联系客户</span>}
      </div>
    </Pop>
  );
};
