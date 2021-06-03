import React from 'react';
import { Notify } from 'zent';
import get from 'lodash/get';
import ajax from 'zan-pc-ajax';
import chooseShop from '@youzan/react-components/es/components/choose-dialog/dialogs/shop';
import { DesignEditor } from '../editor-base/design-editor';
import {
  ComponentTitle,
  Control,
  ControlGroup,
  Tabs,
  Divider,
  ImageEditor,
  LinkTag,
  HelpDesc,
} from '../common';
import bem from '../utils/bem';
import { WEAPP_VERSION_MAP, IS_WEAPP_SETTING } from '../common/config';
import { SHOP_BANNER_STYLE_MAP, ALIGN_TEXT } from './constants';
import './style/index.scss';

const b = bem('decorate-shop-info-editor');

export default class ShopBannerEditor extends DesignEditor {
  componentDidMount() {
    this.getFirstStoreData();
  }

  getFirstStoreData = () => {
    const {
      store: { name },
    } = this.props.value;

    ajax({ url: `${_global.url.www}/setting/teamphysical/ListInPage.json` })
      .then(data => {
        if (data.data_list && data.data_list.length > 0 && !name) {
          const firstStore = data.data_list[0];
          this.onCustomInputChange('store')({
            id: firstStore.id,
            name: firstStore.name,
            images: firstStore.image,
            address: firstStore.address,
            time: firstStore.business_hours_advanced_text,
          });
        }
      })
      .catch(msg => {
        Notify.error(msg);
      });
  };

  handleTypeChange = type => {
    this.props.onChange({ type });
  };

  handleChooseStore = () => {
    const { globalConfig } = this.props;
    const that = this;

    chooseShop({
      config: globalConfig,
      multiple: false,
      onChoose(data) {
        const store = data[0];
        that.onCustomInputChange('store')({
          id: store.id,
          name: store.name,
          images: store.image,
          address: store.address,
          time: store.business_hours_advanced_text,
        });
      },
    });
  };

  /**
   * 渲染店铺信息
   */
  renderShopBanner() {
    const { value, globalConfig = {}, uploadConfig = {}, showError, validation = {} } = this.props;
    const { background_image: backgroundImage, store_info_style: storeInfoStyle } = value;
    let bgSize = '750x370';

    if (+storeInfoStyle === 3) {
      bgSize = '750x300';
    } else if (+storeInfoStyle === 4) {
      bgSize = '750x500';
    }

    return (
      <>
        <ControlGroup
          label="背景图片"
          labelColored
          block
          helpDesc={`建议尺寸：${bgSize} 像素，尺寸不匹配时，图片将被压缩或拉伸以铺满画面`}
        >
          <ImageEditor
            globalConfig={globalConfig}
            uploadConfig={uploadConfig}
            showError={showError}
            error={validation.backgroundImage}
            imageUrl={backgroundImage}
            addText=""
            raised
            onChange={this.onCustomInputChange('background_image', img => img.attachment_url)}
          />
        </ControlGroup>

        <Divider />

        <Control
          label="显示样式"
          name="store_info_style"
          block
          valueMap={SHOP_BANNER_STYLE_MAP}
          componentProps={{ block: true }}
          options={[
            { value: '0', icon: 'shop-info-1' },
            { value: '1', icon: 'shop-info-2' },
            { value: '2', icon: 'shop-info-3' },
            { value: '3', icon: 'shop-info-4' },
            { value: '4', icon: 'shop-info-5' },
          ]}
          value={storeInfoStyle}
          onChange={this.onInputChange}
        />
      </>
    );
  }

  renderOfflineShopInfo() {
    const { value, showError, validation = {} } = this.props;
    const { logo_style: logoStyle, store } = value;

    return (
      <>
        <ControlGroup
          label="选择门店"
          labelColored
          helpDesc="展示门店地址、营业时间、门店照片等信息"
          block
          showError={showError}
          error={validation.store}
          extra={
            <a
              className={b('store-manage-link')}
              href={`${window._global.url.www}/setting/store#list`}
              target="_blank"
              rel="noopener noreferrer"
            >
              进入门店管理
            </a>
          }
        >
          {+store.id === 0 ? (
            <HelpDesc inline>请先添加门店</HelpDesc>
          ) : (
            <LinkTag className={b('store-tag')} colored onEdit={this.handleChooseStore}>
              {store.name}
            </LinkTag>
          )}
        </ControlGroup>

        <Divider />

        <Control
          label="店铺LOGO"
          name="logo_style"
          valueMap={ALIGN_TEXT}
          options={[
            { value: '0', icon: 'align-left' },
            { value: '1', icon: 'align-center' },
            { value: '2', icon: 'align-right' },
          ]}
          value={logoStyle}
          onChange={this.onInputChange}
        />
      </>
    );
  }

  render() {
    const { type = 'shop_banner_weapp', globalConfig = {} } = this.props.value;
    const noticeMsg =
      type === 'offline_shop_info' && globalConfig.is_weapp_setting === IS_WEAPP_SETTING
        ? `（需要小程序 v${WEAPP_VERSION_MAP.offline_shop_info} 版本及以上）`
        : '';

    return (
      <div className={b()}>
        <ComponentTitle name="店铺信息" noticeMsg={noticeMsg} />

        <Tabs activeId={type} onChange={this.handleTypeChange}>
          <Tabs.TabPanel id="shop_banner_weapp" tab="店铺信息">
            {this.renderShopBanner()}
          </Tabs.TabPanel>
          <Tabs.TabPanel id="offline_shop_info" tab="线下门店">
            {this.renderOfflineShopInfo()}
          </Tabs.TabPanel>
        </Tabs>
      </div>
    );
  }

  static info = {
    type: ['shop_banner_weapp', 'offline_shop_info'],
    name: '店铺信息',
    description: '店铺信息',
    icon: 'https://img.yzcdn.cn/public_files/2019/03/19/1fa070a2861badb70b7a780cd4fcd67f.png',
    maxNum: 2,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      // 默认类型
      type: 'shop_banner_weapp',

      // 店铺信息的初始数据
      store_info_style: '0',
      background_image: 'public_files/2017/07/11/f2a0a05d5a801cb51ecbc0710e6947fb.png',

      // 线下门店的初始数据
      logo_style: '0',
      logo_url: get(_global, 'shopInfo.logo', ''),
      store: {
        id: 0, // H5 的线下门店根据 id 去获取数据，其他属性没用到
        name: '',
        images: ['public_files/2017/07/11/f2a0a05d5a801cb51ecbc0710e6947fb.png'],
        address: '',
        time: '',
      },
    };
  }

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { type = 'shop_banner_weapp', background_image: backgroundImage, store = {} } = value;

      if (type === 'shop_banner_weapp') {
        if (!backgroundImage) {
          errors.backgroundImage = '请选择背景图片';
        }
      } else {
        if (!+store.id) {
          errors.store = '请先添加门店';
        }
      }

      resolve(errors);
    });
  }
}
