import React from 'react';

import '@youzan/react-components/es/components/choose-dialog/style';
import { DesignEditor } from '../editor-base/design-editor';
import GoodsStyleEditor from '../common-goods-layout';

import { ComponentTitle, Tabs } from '../common';

import GoodsHeader from './components/goods';
import TagListHeader from './components/tag-list';

import CornerMark from '../common-goods-layout/components/corner-mark';
import OriginPrice from '../common-goods-layout/components/origin-price';

import { WEAPP_NOT_SUPPORTED_MSG } from '../common/utils/weapp-not-supported-link';
import { GOODS, TAG_LIST_TOP } from './default-component';

import goodsValidate from './validate';

import './style/index.scss';

export default class GoodsEditor extends DesignEditor {
  handleActiveIdChange = tabsId => {
    const { onChange, settings } = this.props;
    let params = {};
    if (+tabsId === 0) {
      params = {
        ...GOODS,
        image_fill_style: settings.fillStyle || '1',
      };
    } else {
      params = {
        ...TAG_LIST_TOP,
        image_fill_style: settings.fillStyle || '1',
      };
    }
    onChange(params, true);
    this.updateMetaProperty();
  };

  updateMetaProperty = () => {
    this.setMetaProperty('type', 'dirty', true);
  };

  extraComponent = () => {
    const { value, globalConfig, onChange, showError, validation, uploadConfig } = this.props;

    return (
      <CornerMark
        globalConfig={globalConfig}
        uploadConfig={uploadConfig}
        showError={showError}
        error={validation}
        value={value}
        onInputChange={this.onInputChange}
        onChange={onChange}
      />
    );
  };

  priceComponent = () => {
    const { value, onChange } = this.props;

    return <OriginPrice value={value} onChange={onChange} />;
  };

  render() {
    const { value, globalConfig, onChange, showError, validation } = this.props;
    const { type } = value;

    const isGoods = type === 'goods';

    const isTagList = type === 'tag_list_top' || type === 'tag_list_left';

    const isTagListLeft = type === 'tag_list_left';

    const tabsId = isTagList ? '1' : '0';

    return (
      <div className="rc-design-component-goods-editor">
        <ComponentTitle
          name="商品"
          noticeMsg={WEAPP_NOT_SUPPORTED_MSG}
          url="https://help.youzan.com/qa?cat_sys=K#/menu/2211/detail/11788?_k=3mic0j"
        />

        {/* 商品 or 商品分组*/}
        <Tabs activeId={tabsId} onChange={this.handleActiveIdChange}>
          <Tabs.TabPanel tab="商品" id="0" />
          <Tabs.TabPanel tab="商品分组" id="1" />
        </Tabs>

        {/* 商品的逻辑*/}
        {isGoods && (
          <GoodsHeader
            onChange={onChange}
            onCustomInputChange={this.onCustomInputChange}
            onInputBlur={this.onInputBlur}
            onInputChange={this.onInputChange}
            value={value}
            globalConfig={globalConfig}
            showError={showError}
            validation={validation}
          />
        )}

        {/* 商品分组的逻辑*/}
        {isTagList && (
          <TagListHeader
            onChange={onChange}
            setMetaProperty={this.updateMetaProperty}
            onInputChange={this.onInputChange}
            onCustomInputChange={this.onCustomInputChange}
            value={value}
            globalConfig={globalConfig}
            showError={showError}
            validation={validation}
          />
        )}

        {/* 公共布局逻辑 */}
        <GoodsStyleEditor
          value={value}
          onInputChange={this.onInputChange}
          onChange={onChange}
          extraComponent={!isTagListLeft && this.extraComponent}
          priceComponent={isGoods && this.priceComponent}
        />
      </div>
    );
  }

  // 保存验证
  static validate(value) {
    return new Promise(resolve => {
      resolve(goodsValidate(value));
    });
  }

  static info = {
    icon: ' https://img.yzcdn.cn/public_files/2019/02/12/a6806f6ff8c220aa7a57eb89d253e126.png',
    type: ['goods_weapp', 'goods', 'tag_list_top', 'tag_list_left', 'goods_group'],
    name: '商品',
    description: '商品',
    maxNum: 30,
    usedNum: 0,
    status: '',
  };

  static getInitialValue({ settings = {} }) {
    return {
      ...GOODS,
      image_fill_style: settings.fillStyle || '1',
    };
  }
}
