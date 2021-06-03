import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import { Notify, BlockLoading, previewImage, Sweetalert } from 'zent';
import './style.scss';

import SettingItem from '../../components/SettingItem';
import { getSettingList, settingItem } from '../../api';
import { SETTING_TEXT_DATA, SHOW_TYPE } from '../../constants';

export default class Setting extends Component {
  state = {
    settingList: [],
    formatedSettingList: [],
    loading: false,
    pagination: {
      page: 1,
      size: 20,
    },
  };

  componentDidMount() {
    this.getSettingListData();
    if (window._global.isYZEdu) {
      Sweetalert.alert({
        title: '下线提醒',
        content: '本应用即将下线，您可以访问“设置-课程设置”来变更您的设置。',
      });
    }
  }

  /**
   * getSettingListData
   *
   * @description 通过接口/setting/lists.json在线获取接口信息并加以渲染
   */
  getSettingListData() {
    this.setState({ loading: true });
    getSettingList(this.state.pagination)
      .then(({ items }) => {
        this.setState({ settingList: items });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  setLock = index => {
    const settingInfo = this.state.settingList[index];
    const param = {
      serialNo: settingInfo.serialNo,
      switchDesc: settingInfo.switchDesc,
      showType: settingInfo.showType !== SHOW_TYPE.ALL ? SHOW_TYPE.ALL : SHOW_TYPE.NONE,
      switchFunction: settingInfo.switchFunction,
      visibilityId: settingInfo.visibilityId,
    };
    this.setState({ loading: true });
    settingItem(param)
      .then(() => {
        this.getSettingListData();
      })
      .catch(msg => {
        Notify.error(msg);
        this.setState({ loading: false });
      });
  };

  // 判断switch状态
  isChecked = showType => {
    if (showType === SHOW_TYPE.FORCECLOSE) return false;
    return showType === SHOW_TYPE.NONE;
  };

  genWechatLimitSettingItemBody = settingInfo => {
    const handlePreview = e => {
      const { photo } = settingInfo;
      previewImage({
        images: photo.links,
        index: 0,
        parentComponent: this,
        scaleRatio: 3,
      });
    };
    return (
      <div>
        {settingInfo.desc}
        <a className="setting-item-supply" onClick={handlePreview}>
          {settingInfo.photo.title}
        </a>
      </div>
    );
  };

  genDistributorSettingItemBody = (settingInfo = {}) => {
    const { descClosable, checked, desc } = settingInfo;
    return descClosable ? (checked ? desc : descClosable) : desc;
  };

  genFreeGoodsSettingItemBody = settingInfo => {
    return (
      <div>
        {settingInfo.desc}
        <Pop trigger="hover" position="bottom-center" content={settingInfo.pop.desc}>
          <a className="setting-item-supply">{settingInfo.pop.title}</a>
        </Pop>
      </div>
    );
  };

  getSettingItemBody = (settingKey, settingInfo) => {
    let bodyComponent = null;
    switch (settingKey) {
      case 'content_media':
        bodyComponent = this.genWechatLimitSettingItemBody(settingInfo);
        break;
      case 'owl_distributor':
        bodyComponent = this.genDistributorSettingItemBody(settingInfo);
        break;
      case 'zero_owl_product':
        bodyComponent = this.genFreeGoodsSettingItemBody(settingInfo);
        break;
      default:
        bodyComponent = null;
    }

    return bodyComponent;
  };

  getSettingListElement() {
    const { settingList } = this.state;
    if (settingList.length) {
      return settingList.map((item = {}, index) => {
        const { showType, switchDesc } = item;
        const checked = this.isChecked(showType);
        const settingInfo = { ...SETTING_TEXT_DATA[switchDesc], checked };

        return (
          <SettingItem
            key={index}
            title={settingInfo.title}
            checked={checked}
            component={this.getSettingItemBody(switchDesc, settingInfo)}
            onChange={() => this.setLock(index)}
          />
        );
      });
    } else {
      return <div className="setting-content__no-data">没有更多设置~</div>;
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <div>
        <BlockLoading loading={loading}>
          <div className="setting-content">{this.getSettingListElement()}</div>
        </BlockLoading>
      </div>
    );
  }
}
