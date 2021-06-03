import React from 'react';
import { DesignEditor } from '../editor-base/design-editor';
import ControlGroup from '../common/control-group';
import { Radio, Checkbox } from 'zent';
import chooseSeckill from '@youzan/react-components/es/components/choose-dialog//dialogs/ump-seckill';
import isEmpty from 'lodash/isEmpty';
import indexOf from 'lodash/indexOf';
import ComponentTitle from '../common/component-title';
import GoodsStyleEditor from '../common-goods-layout';
import GoodsImage from '../common/goods-image';
import EditorCard from '../common/editor-card';
import Divider from '../common/divider';
import * as Utils from '../common/utils';
import TemplateUpload from '../common/template-upload';
import { WEAPP_VERSION_MAP, IS_WEAPP_SETTING } from '../common/config';
import { COM_STATUS } from '../common/constants';

const RadioGroup = Radio.Group;

export default class SeckillEditor extends DesignEditor {
  extraComponent = () => {
    const { handleCheckboxChange } = this;
    const { value } = this.props;
    const { size, show_count_down: _showCountDown, show_stock_num: _showStockNum } = value;
    const isThreeOrSwipe = size === '5' || size === '6';
    const showCountDown = Utils.numberToBoolean(_showCountDown);
    const showStockNum = Utils.numberToBoolean(_showStockNum);

    return (
      <div className="rc-design-component-seckill-editor">
        {this.priceComponent()}

        <ControlGroup label="抢购倒计时" value={showCountDown ? '显示' : '不显示'}>
          <Checkbox
            checked={showCountDown}
            name="show_count_down"
            onChange={handleCheckboxChange}
            disabled={isThreeOrSwipe}
          />
        </ControlGroup>

        <ControlGroup label="剩余库存" value={showStockNum ? '显示' : '不显示'}>
          <Checkbox checked={showStockNum} name="show_stock_num" onChange={handleCheckboxChange} />
        </ControlGroup>
      </div>
    );
  };

  priceComponent = () => {
    const { value } = this.props;
    const { price, origin_price: _showOriginPrice } = value;
    // const { size, price, origin_price } = value;
    // const isThreeOrSwipe = size === '5' || size === '6';
    const showPrice = Utils.numberToBoolean(price);
    const showOriginPrice = Utils.numberToBoolean(_showOriginPrice);

    return (
      <div>
        <ControlGroup label="商品原价" value={showOriginPrice ? '显示' : '不显示'}>
          <Checkbox
            checked={showOriginPrice}
            disabled={!showPrice}
            name="origin_price"
            onChange={this.handleCheckboxChange}
          />
        </ControlGroup>
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

  handleGoodsChange = data => {
    const ids = data.map(item => item.id);
    this.props.onChange({ activity_ids: ids, goods: data });
  };

  handleChooseGoods = () => {
    const self = this;
    const { globalConfig, value } = this.props;
    const { goods, activity_ids: activityIds = [] } = value;
    chooseSeckill({
      config: {
        ...globalConfig,
        isWeapp: globalConfig.is_weapp_setting === IS_WEAPP_SETTING,
      },
      multiple: true,
      onChoose: data => {
        data = data.filter(item => indexOf(activityIds, item.id) === -1);
        data.forEach(item => {
          if (item.alias) {
            item.url = `${window._global.url.wap}/seckill/${item.alias}`;
          }
        });
        const ids = data.map(item => item.id);
        self.props.onChange({
          goods: goods.concat(data),
          activity_ids: activityIds.concat(ids),
        });
      },
    });
  };

  handleUploadSuccess = defaultImageUrl => {
    this.onCustomInputChange('default_image_url')(defaultImageUrl);
  };

  onListStyleChange = e => {
    const { onChange } = this.props;
    const changeObj = e;
    const listStyle = e.size;
    if (listStyle === '5' || listStyle === '6') {
      changeObj.show_count_down = '0';
    } else {
      changeObj.show_count_down = '1';
    }
    onChange(changeObj);
  };

  render() {
    const { value, globalConfig, onChange, showError, validation } = this.props;
    const {
      goods,
      hide_goods_sold: _hideGoodsSold,
      hide_goods_end: _hideGoodsEnd,
      goods_end_type: goodsEndType,
      default_image_url: defaultImageUrl,
    } = value;
    const hideGoodsSold = Utils.numberToBoolean(_hideGoodsSold);
    const hideGoodsEnd = Utils.numberToBoolean(_hideGoodsEnd);

    const noticeMsg =
      '小程序 v2.20及以上版本支持秒杀组件、支持显示实物（含分销）、虚拟、电子卡券，且小程序 v2.43.2及以上版本支持显示线下课';

    return (
      <div className="rc-design-component-seckill-editor">
        <ComponentTitle
          name="秒杀"
          noticeMsg={noticeMsg}
          url="https://help.youzan.com/qa?cat_sys=K#/menu/2199/detail/11757?_k=09y7g2"
          withMargin
        />

        <ControlGroup
          label="选择活动"
          required
          labelAlign="top"
          focusOnLabelClick={false}
          showError={showError}
          error={validation.goods}
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
              <GoodsImage globalConfig={globalConfig} key={item.id} data={item} />
            ))}
          </EditorCard>
        </ControlGroup>

        <Divider />

        <GoodsStyleEditor
          globalConfig={globalConfig}
          value={value}
          onInputChange={this.onInputChange}
          onChange={onChange}
          extraComponent={this.extraComponent}
          showError={showError}
          error={validation}
        />

        <TemplateUpload defaultImageUrl={defaultImageUrl} onSuccess={this.handleUploadSuccess} />

        <ControlGroup
          label="更多设置"
          className="no-mb rc-design-component-seckill-editor__more-design"
          focusOnLabelClick={false}
        />

        <ControlGroup label="隐藏已售罄商品" value={hideGoodsSold ? '隐藏' : '不隐藏'}>
          <Checkbox
            checked={hideGoodsSold}
            name="hide_goods_sold"
            onChange={this.handleCheckboxChange}
          />
        </ControlGroup>
        <ControlGroup label="隐藏活动结束商品" value={hideGoodsEnd ? '隐藏' : '不隐藏'}>
          <Checkbox
            checked={hideGoodsEnd}
            name="hide_goods_end"
            onChange={this.handleCheckboxChange}
          />
        </ControlGroup>

        {hideGoodsEnd && (
          <ControlGroup
            className="rc-design-component-seckill-editor__hide"
            showLabel={false}
            focusOnLabelClick={false}
            bgColored
          >
            <RadioGroup value={goodsEndType} onChange={this.onInputChange}>
              <Radio name="goods_end_type" value="0">
                24小时后隐藏
              </Radio>
              <Radio name="goods_end_type" value="1">
                立即隐藏
              </Radio>
            </RadioGroup>
          </ControlGroup>
        )}
      </div>
    );
  }

  // 组件的类型
  static designType = 'ump_seckill';
  // 组件的描述
  static designDescription = '秒杀';

  static info = {
    icon: ' https://img.yzcdn.cn/public_files/2019/03/19/d510254899bc6ca94de5f5644b95c542.png',
    type: 'ump_seckill',
    name: '秒杀',
    maxNum: 10,
    usedNum: 0,
    status: COM_STATUS.NORMAL,
  };

  static getInitialValue({ settings }) {
    return {
      type: 'ump_seckill',
      goods: [],
      activity_ids: [],
      show_count_down: '1', // 是否显示抢购倒计时 0 不显示  1 显示
      show_stock_num: '1', // 是否显示剩余库存 0 不显示  1 显示
      hide_goods_sold: '1', // 隐藏已售罄商品
      hide_goods_end: '1', // 隐藏活动结束商品
      goods_end_type: '0', // 0 24小时隐藏  1 立即隐藏
      // 显示比例
      display_scale: '0',
      // 列表样式（0: 大图, 1: 小图, 2: 一大两小, 3: 详细列表)
      size: '0',

      // (0: 卡片1, 1: 瀑布流, 2: 极简样式, 3: 促销样式, 5: 卡片2)
      size_type: '0',

      // 显示购买按钮（0: 不显示, 1: 显示）
      buy_btn: '1',

      // 购买按钮样式
      buy_btn_type: '1',

      // 一行三个以及横向滚动：是否显示购买按钮。
      // 这两种情况下 buy_btn 是不生效的。
      // 默认不显示
      buy_btn_express: '0',

      // 购买按钮自定义文案
      button_text: '',

      // 显示商品名（0: 不显示, 1: 显示）
      title: '1',

      // 显示商品描述
      show_sub_title: '1',

      // 显示价格（0: 不显示, 1: 显示）
      price: '1',

      // 显示原价（0: 不显示, 1: 显示）
      origin_price: '1',

      // 是否显示角标 (0: 不显示, 1: 显示)
      show_corner_mark: '0',

      // 角标样式（0: 新品, 1: 热卖, 2: NEW, 3: HOT, 4: 自定义）
      corner_mark_type: '0',

      // 自定义角标图片
      corner_mark_image: '',

      // 编辑时的默认占位图片，一般通过各个微页面模板指定
      default_image_url: '',

      // 图片填充方式
      image_fill_style: settings.fillStyle || '1',

      // 页面边距
      page_margin: 15,

      // 商品间距
      goods_margin: 10,

      // 商品倒角 (1: 直角, 2: 圆角)
      border_radius_type: '1',

      // 文本对齐方式（left: 左对齐, center: 居中）
      text_align_type: 'left',

      // 文本样式 (1: 常规体, 2: 加粗体)
      text_style_type: '1',
    };
  }

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { goods } = value;

      if (isEmpty(goods)) {
        errors.goods = '请选择商品';
      }
      resolve(errors);
    });
  }
}
