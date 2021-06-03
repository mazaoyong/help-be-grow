import React from 'react';
import { DesignEditor } from '../editor-base/design-editor';
import { Checkbox } from 'zent';
import chooseDiscount from '@youzan/react-components/es/components/choose-dialog/dialogs/ump-limited-discount';
import chooseDiscountGoods from '@youzan/react-components/es/components/choose-dialog/dialogs/ump-limited-discount-goods';
import isEmpty from 'lodash/isEmpty';
import ComponentTitle from '../common/component-title';
import EditorCard from '../common/editor-card';
import GoodsImage from '../common/goods-image';
import ControlGroup from '../common/control-group';
import LinkTag from '../common/link-tag';
import Divider from '../common/divider';
import * as Utils from '../common/utils';
import { WEAPP_VERSION_MAP, IS_WEAPP_SETTING } from '../common/config';
import TemplateUpload from '../common/template-upload';
import { WEAPP_NOT_SUPPROTED_HOTEL_MSG_LIMIT_DISCOUNT } from '../common/utils/weapp-not-supported-link';
import GoodsStyleEditor from '../common-goods-layout';
import timelimitAdaptor from '@youzan/feature-adaptor/lib/timelimit-discount-v2';
import * as Constants from '../common-goods-layout/constants';
import { COM_STATUS } from '../common/constants';

const { LAYOUT_MAP } = Constants;

export default class LimitDiscountEditor extends DesignEditor {
  extraComponent = () => {
    const { handleCheckboxChange } = this;
    const { value } = this.props;
    const {
      size,
      // buy_btn_express: buyBtnExpress,
      // process_bar_num_type: processBarNumType,
      price,
      origin_price: originPrice,
      show_stock_num: _showStockNum,
      count_down: _countDown,
      show_progress_info: _showProgressInfo,
      // process_bar_type: processBarType,
    } = value;

    const showPrice = Utils.numberToBoolean(price);
    const showOriginPrice = Utils.numberToBoolean(originPrice);
    const showStockNum = Utils.numberToBoolean(_showStockNum);
    const showCountDown = Utils.numberToBoolean(_countDown);
    const showProgressInfo = Utils.numberToBoolean(_showProgressInfo);
    const isThreeOrSwipe = +size !== LAYOUT_MAP.SWIPE && +size !== LAYOUT_MAP.THREE;

    return (
      <div className="decorate-limit-discount-editor">
        <ControlGroup label="商品原价" value={showOriginPrice ? '显示' : '不显示'}>
          <Checkbox
            checked={showOriginPrice}
            disabled={!showPrice}
            name="origin_price"
            onChange={handleCheckboxChange}
          />
        </ControlGroup>

        <ControlGroup label="剩余库存" value={showStockNum ? '显示' : '不显示'}>
          <Checkbox checked={showStockNum} name="show_stock_num" onChange={handleCheckboxChange} />
        </ControlGroup>

        <ControlGroup label="抢购倒计时" value={showCountDown ? '显示' : '不显示'}>
          <Checkbox checked={showCountDown} name="count_down" onChange={handleCheckboxChange} />
        </ControlGroup>

        {isThreeOrSwipe && (
          <ControlGroup label="抢购进度条" value={showProgressInfo ? '显示' : '不显示'}>
            <Checkbox
              checked={showProgressInfo}
              name="show_progress_info"
              onChange={handleCheckboxChange}
            />
          </ControlGroup>
        )}

        {/* {isThreeOrSwipe &&
          showProgressInfo && (
            <Control
              label="进度条"
              valueMap={{
                1: '样式一',
                2: '样式二',
              }}
              name="process_bar_type"
              options={[{ value: '1', icon: 'font-regular' }, { value: '2', icon: 'font-bold' }]}
              value={processBarType}
              onChange={onInputChange}
            />
          )} */}
      </div>
    );
  };

  handleCheckboxChange = e => {
    const { onChange } = this.props;
    const { target } = e;
    const { name, checked } = target;

    onChange({
      [name]: Utils.booleanToString(checked),
    });
    this.setMetaProperty(name, 'dirty');
  };

  onChangeBuyBtnType = e => {
    const { onChange } = this.props;
    const buyBtnType = e.target.value;

    onChange({
      buy_btn_type: buyBtnType,
    });
  };

  componentWillMount() {
    // 之后去掉了显示原价选项 要求之前未显示原价老数据一进来 只要点击了编辑就转成显示原价
    if (this.props.value.show_origin_price === '0') {
      this.props.onChange({ show_origin_price: '1' });
    }

    Object.assign(
      this.props.value,
      timelimitAdaptor.old2new(this.props.value),
      { v: 2 } // 加上版本标志v2
    );
  }

  handleCheckboxChange = e => {
    const { onChange } = this.props;
    const { target } = e;
    const { name, checked } = target;

    onChange({
      [name]: Utils.booleanToString(checked),
    });
    this.setMetaProperty(name, 'dirty');
  };

  handleShowTimeLimitChange = e => {
    const { onChange } = this.props;
    const { checked } = e.target;
    onChange({
      show_time_limit: Utils.booleanToString(checked),
      show_stock_num: Utils.booleanToString(checked),
    });
  };

  handleChooseActivity = () => {
    const self = this;
    chooseDiscount({
      config: this.props.globalConfig,
      onChoose: data => {
        const { id, name } = data[0];
        self.props.onChange({
          activity: {
            id,
            name,
          },
          activity_id: id,
          goods: [],
        });
      },
    });
  };

  handleGoodsChange = this.onCustomInputChange('goods');

  isGoodSelected = goodsId => {
    const { goods } = this.props.value;

    return goods.some(g => g.goods_id === goodsId);
  };

  // 商品展示编辑区域
  handleGoodsStyleChange = e => {
    const { onChange } = this.props;
    const { target } = e;
    const { name, checked } = target;

    onChange({
      [name]: Utils.booleanToString(checked),
    });
    this.setMetaProperty(name, 'dirty');
  };

  onChooseGood = selected => {
    const { goods } = this.props.value;
    // 拼接商品跳转链接
    selected.forEach(item => {
      if (item.goods_alias) {
        item.url = `${window._global.url.wap}/showcase/goods?alias=${item.goods_alias}`;
      }
    });

    this.handleGoodsChange(goods.concat(selected));
  };

  handleChooseGoods = () => {
    const { globalConfig } = this.props;
    const { id, name } = this.props.value.activity;

    chooseDiscountGoods({
      activityId: id,
      activityTitle: name,
      isGoodSelected: this.isGoodSelected,
      onChoose: this.onChooseGood,
      config: globalConfig,
    });
  };

  handleUploadSuccess = defaultImageUrl => {
    this.onCustomInputChange('default_image_url')(defaultImageUrl);
  };

  render() {
    const { value, globalConfig, showError, validation, onChange } = this.props;
    const { activity, goods, default_image_url: defaultImageUrl, uploadConfig } = value;

    const noticeMsg =
      globalConfig.is_weapp_setting === IS_WEAPP_SETTING
        ? `（填充方式等新功能需要小程序 v${WEAPP_VERSION_MAP.limit_discount} 版本及以上）`
        : '';

    return (
      <div className="decorate-limit-discount-editor">
        <ComponentTitle
          name="限时折扣"
          noticeMsg={noticeMsg}
          tipsMsg={
            globalConfig.showDesignWeappNotice ? WEAPP_NOT_SUPPROTED_HOTEL_MSG_LIMIT_DISCOUNT : ''
          }
          url="https://help.youzan.com/qa?cat_sys=K#/menu/2189/detail/11763?_k=7cn9z4"
        />

        <ControlGroup
          label="选择活动"
          focusOnLabelClick={false}
          showError={showError}
          error={validation.activity_id}
          bgColored={!!activity.name}
          block
        >
          {activity.name ? (
            <LinkTag colored onEdit={this.handleChooseActivity}>
              {activity.name}
            </LinkTag>
          ) : (
            <div className="deco-control-group__content" onClick={this.handleChooseActivity}>
              <div className="zent-sortable deco-editor-card decorate-image-ad-editor-card">
                <div className="deco-editor-card-add deco-editor-card--disable-drag">
                  <i className="zenticon zenticon-plus deco-editor-card-add-icon" />
                  <span className="deco-editor-card-add-text">添加限时折扣活动</span>
                </div>
              </div>
            </div>
          )}
        </ControlGroup>

        {!activity.name && <Divider />}

        {activity.id !== 0 && (
          <ControlGroup
            label="添加商品"
            focusOnLabelClick={false}
            labelAlign="top"
            showError={showError}
            error={validation.goods}
            bgColored
            block
          >
            <EditorCard
              list={goods}
              canDelete
              canAdd
              isInline
              onChange={this.handleGoodsChange}
              onAdd={this.handleChooseGoods}
            >
              {goods.map(item => (
                <GoodsImage globalConfig={globalConfig} key={item.goods_id} data={item} />
              ))}
            </EditorCard>
          </ControlGroup>
        )}

        <TemplateUpload defaultImageUrl={defaultImageUrl} onSuccess={this.handleUploadSuccess} />

        <GoodsStyleEditor
          globalConfig={globalConfig}
          uploadConfig={uploadConfig}
          value={value}
          onInputChange={this.onInputChange}
          onChange={onChange}
          extraComponent={this.extraComponent}
          showError={showError}
          error={validation}
        />
      </div>
    );
  }

  // 组件的类型
  static designType = 'ump_limitdiscount';
  // 组件的描述
  static designDescription = <span>限时折扣</span>;

  static getInitialValue() {
    return {
      type: 'ump_limitdiscount',
      activity: {
        id: 0,
        name: '',
      },
      activity_id: '',
      goods: [],
      size: '3', // 大图模式：0 一行两个：1 一行三个：5 详细列表：3 一大两小：2 横向滑动：6
      size_type: '0', // 商品样式: 0: 无边白底
      page_margin: 15, // 页面边距
      goods_margin: 10, // 商品间距
      text_align_type: 'left', // 文字对齐方向 left center
      text_style_type: '1', // 文字粗细 1. 常规 2. 粗体
      border_radius_type: '1', // 是否圆角 1. 直角 2. 圆角
      display_scale: '1', // 显示比例   0,1,2,3 => 3:2 1:1 3:4 16:9
      title: '1', // 是否显示商品名称 0 不显示  1 显示
      show_sub_title: '1', // 商品描述
      show_origin_price: '1', // 是否显示商品原价  0 不显示  1显示
      buy_btn: '1', // 是否显示购买按钮 0 不显示 1 显示
      buy_btn_type: '8', // 购买按钮样式,
      count_down: '1', // 显示倒计时,
      price: '1', // 价格
      show_progress_info: '1', // 显示抢购进度条,
      origin_price: '1', // 原价-划掉价
      show_stock_num: '0', // 显示剩余库存，默认不显示
      process_bar_type: '1', // 进度条样式类型
      process_bar_num_type: '1', // 进度条数字形式
      image_fill_style: '1', // 图片填充方式
      default_image_url: '',
      button_text: '立即抢购',
      v: 2,
    };
  }

  static info = {
    icon: 'https://img.yzcdn.cn/public_files/2019/02/12/e2364ce837893b27e065e449e06489cc.png',
    type: 'ump_limitdiscount',
    name: '限时折扣',
    maxNum: 10,
    usedNum: 0,
    status: COM_STATUS.NORMAL,
  };

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { activity_id: activityId, goods } = value;

      if (activityId === '') {
        errors.activity_id = '请添加限时折扣活动';
      }
      if (isEmpty(goods)) {
        errors.goods = '请选择商品';
      }
      resolve(errors);
    });
  }
}
