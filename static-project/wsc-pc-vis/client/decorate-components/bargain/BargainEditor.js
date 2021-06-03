import React from 'react';
import { Radio, Input, Notify, Checkbox } from 'zent';
import {
  ControlGroup,
  EditorCard,
  ComponentTitle,
  GoodsImage,
  HelpDesc,
  Divider,
} from '../common/';
import { DesignEditor } from '../editor-base/design-editor';
import chooseBargain from '@youzan/react-components/es/components/choose-dialog/dialogs/bargain';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import * as Utils from '../common/utils';
import TemplateUpload from '../common/template-upload';
import { WEAPP_NOT_SUPPROTED_BARGAIN_MSG } from '../common/utils/weapp-not-supported-link';
import GoodsStyleEditor from '../common-goods-layout';
import { MAX_GOODS_NUM, TUTORIAL_URL } from './constants';
import * as Helper from './helper';
import BuyButton from './components/buy-button';

const RadioGroup = Radio.Group;
// const BOOLEAN_TYPE_ARR = ['show_count_down', 'show_stock_num', 'show_origin_price'];

const prefix = 'decorate-bargain-editor';

export default class LimitBarginEditor extends DesignEditor {
  componentWillMount() {
    // 之后去掉了显示原价选项 要求之前未显示原价老数据一进来 只要点击了编辑就转成显示原价
    if (this.props.value.show_origin_price === '0') {
      this.props.onChange({ show_origin_price: '1' });
    }

    this.oldValueAdapter(this.props.value);
  }

  // 获取添加商品的模块
  getGoodsAddWrapper() {
    const { value, showError, validation, globalConfig } = this.props;
    const { goods_source: mode } = value;
    if (+mode === 1) {
      // 手动添加
      const { goods } = value;
      const helpDesc = `最多添加 ${MAX_GOODS_NUM} 个商品`;

      return (
        <div className={`${prefix}__controls-card`}>
          <ControlGroup
            bgColored
            focusOnLabelClick={false}
            showError={showError}
            error={validation.goods}
            helpDesc={helpDesc}
            className={`${prefix}__editor-card`}
          >
            <EditorCard
              list={goods}
              canDelete
              isInline
              canDrag={false}
              canAdd={goods.length < MAX_GOODS_NUM}
              onChange={this.handleBargainChange}
              onAdd={this.handleAddBargain}
            >
              {goods.map((item, index) => {
                // 旧版数据兼容
                if (item.imageUrl) {
                  item.image_url = item.imageUrl;
                }
                return <GoodsImage globalConfig={globalConfig} key={index} data={item} />;
              })}
            </EditorCard>
          </ControlGroup>
        </div>
      );
    } else if (+mode === 0) {
      // 自动获取
      const goodsNum = value.goods_num;
      return (
        <div className="controls-card bargain-editor-auto">
          <ControlGroup
            label="显示个数"
            bgColored
            className="bargain-editor-auto__container"
            focusOnLabelClick={false}
            showError={showError}
            error={validation.goods_num}
          >
            <HelpDesc inline style={{ marginRight: '16px' }}>
              最多显示 {MAX_GOODS_NUM} 个
            </HelpDesc>
            <Input
              className="bargain-editor-input-wrapper"
              value={goodsNum}
              name="goods_num"
              onChange={this.onInputChange}
              onBlur={this.onInputBlur}
            />
          </ControlGroup>
        </div>
      );
    }
    return null;
  }
  // 唤起商品选择窗口

  handleAddBargain = () => {
    const { globalConfig } = this.props;
    const _this = this;
    chooseBargain({
      config: globalConfig,
      multiple: true,
      onChoose(list) {
        _this.onBargainSelect(list);
      },
    });
  };

  // 商品拖动排序触发事件

  handleBargainChange = list => {
    const goodsIds = [];
    const activityIds = [];
    list.forEach(goods => {
      goodsIds.push(goods.goods_id);
      activityIds.push(goods.id);
    });

    this.props.onChange({
      goods: list,
      goods_ids: goodsIds,
      activity_ids: activityIds,
    });
  };

  // 选择商品
  onBargainSelect = bargainGoods => {
    const { value } = this.props;
    const goodsList = [...value.goods]; // 商品集合
    const goodsIds = [...value.goods_ids]; // 商品id集合
    const activityIds = [...value.activity_ids]; // 活动id集合
    const originLen = goodsIds.length;
    let isBeyondLimit = false; // 是否超出最大展示的商品数量

    bargainGoods.forEach((item, i) => {
      const len = i + 1;
      const index = value.goods_ids.indexOf(item.goodsId); // 判断是否已选择改商品
      if (!isBeyondLimit && index === -1) {
        goodsList.push({
          ...item,
          imageUrl: item.thumbUrl,
        });
        goodsIds.push(item.goodsId);
        activityIds.push(item.id);

        isBeyondLimit = originLen + len >= MAX_GOODS_NUM;
      }
    });

    if (isBeyondLimit) {
      Notify.success(`商品不能多于 ${MAX_GOODS_NUM} 个，已经自动删除多余的商品`);
    }

    this.props.onChange({
      goods: goodsList,
      goods_ids: goodsIds,
      activity_ids: activityIds,
    });
  };

  onBooleanToStringChange = name => e => {
    const { onChange } = this.props;
    const value = e.target.checked;

    onChange({
      [name]: value,
    });
  };

  handleUploadSuccess = defaultImageUrl => {
    this.onCustomInputChange('default_image_url')(defaultImageUrl);
  };

  handleGrouponSourceChange = e => {
    const { onChange } = this.props;
    onChange({
      goods_source: e.target.value,
    });
  };

  // 是否显示商品名称
  onShowTitleChange = e => {
    const { onChange } = this.props;
    const value = e.target.checked;
    const showTitle = Utils.booleanToString(value);
    onChange({
      title: showTitle,
      show_title: value,
    });
  };

  oldValueAdapter = value => {
    const { onChange } = this.props;
    let { order_rule: orderRule, size, radio, isNew } = value;
    // 老数据转化
    if (orderRule !== undefined && !isNew) {
      if (+size === 0) {
        radio = '1,1';
      }
      if (+size === 2) {
        value.size = '3';
      }
      value.show_stock_num = true;
      value.buy_btn_type = '3';
      value.size_type = '0';
      value.button_text = '发起砍价';
      value.radio = radio;
    }
    onChange({ ...value });
  };

  handleChange = value => {
    this.props.onChange(this.goods2Bargain(value));
  };

  bargian2Goods(value) {
    const { show_buy_btn: showBuyBtn } = value;
    const res = {};
    const omitKeys = [];

    if (showBuyBtn) {
      res.buy_btn = showBuyBtn;
      omitKeys.push('show_buy_btn');
    }

    return Object.assign(res, omit(value, omitKeys));
  }

  goods2Bargain(value) {
    const { buy_btn: buyBtn } = value;

    const res = {};
    const omitKeys = [];

    if (buyBtn) {
      res.show_buy_btn = buyBtn;
      omitKeys.push('buy_btn');
    }

    return Object.assign(res, omit(value, omitKeys));
  }

  renderExtraComponent = () => {
    const { value } = this.props;
    const { size, show_count_down: _showCountDown = '0', show_stock_num: _showStockNum } = value;
    const showCountDown = Utils.numberToBoolean(_showCountDown);
    const showStockNum = Utils.numberToBoolean(_showStockNum);
    return (
      <>
        <ControlGroup
          label="倒计时"
          value={showCountDown ? '显示' : '不显示'}
          focusOnLabelClick={false}
        >
          <Checkbox
            disabled={+size === 5 || +size === 6}
            checked={showCountDown}
            name="show_count_down"
            onChange={this.onBooleanToStringChange('show_count_down')}
          />
        </ControlGroup>
        <ControlGroup
          label="剩余库存"
          value={showStockNum ? '显示' : '不显示'}
          focusOnLabelClick={false}
        >
          <Checkbox
            checked={showStockNum}
            name="show_stock_num"
            onChange={this.onBooleanToStringChange('show_stock_num')}
          />
        </ControlGroup>
      </>
    );
  };

  renderPriceComponent = () => {
    const { value, onChange } = this.props;
    const {
      size,
      size_type: sizeType = '0',
      title = 1,
      price = 1,
      show_origin_price: showOriginPrice = 1,
    } = value;
    const showTitle = Utils.numberToBoolean(title);
    const showPrice = Utils.numberToBoolean(price);

    return (
      <>
        <ControlGroup
          label="商品名称"
          value={showTitle ? '显示' : '不显示'}
          focusOnLabelClick={false}
        >
          <Checkbox
            checked={showTitle}
            disabled={Helper.isDisabledTitle(size, sizeType)}
            name="title"
            onChange={this.onShowTitleChange}
          />
        </ControlGroup>

        <ControlGroup
          label="商品现价"
          value={showPrice ? '显示' : '不显示'}
          focusOnLabelClick={false}
        >
          <Checkbox
            checked={showPrice}
            name="price"
            onChange={this.onBooleanToStringChange('price')}
          />
        </ControlGroup>
        <ControlGroup
          label="商品原价"
          value={showOriginPrice ? '显示' : '不显示'}
          focusOnLabelClick={false}
        >
          <Checkbox
            checked={showOriginPrice}
            name="show_origin_price"
            onChange={this.onBooleanToStringChange('show_origin_price')}
          />
        </ControlGroup>
        <BuyButton value={value} onChange={onChange} />
      </>
    );
  };

  render() {
    const { value } = this.props;
    const { default_image_url: defaultImageUrl, goods_source: goodsSource } = value;

    return (
      <div className={prefix}>
        <ComponentTitle
          name="助力砍价"
          noticeMsg={WEAPP_NOT_SUPPROTED_BARGAIN_MSG}
          url={TUTORIAL_URL}
        />
        <ControlGroup label="添加方式:" focusOnLabelClick={false}>
          <RadioGroup value={goodsSource} onChange={this.handleGrouponSourceChange}>
            <Radio name="goods_source" value="1">
              手动添加
            </Radio>
            <Radio name="goods_source" value="0">
              自动获取
            </Radio>
          </RadioGroup>
        </ControlGroup>
        {this.getGoodsAddWrapper()}
        <TemplateUpload defaultImageUrl={defaultImageUrl} onSuccess={this.handleUploadSuccess} />

        <Divider />

        <GoodsStyleEditor
          value={this.bargian2Goods(value)}
          onInputChange={this.onInputChange}
          onChange={this.handleChange}
          hideSubTitle
          hideTitle
          hideBuyButton
          priceComponent={this.renderPriceComponent}
          extraComponent={this.renderExtraComponent}
        />
      </div>
    );
  }

  // 组件的类型
  static designType = 'bargain';
  // 组件的描述
  static designDescription = <span>助力砍价</span>;

  static info = {
    type: 'bargain',
    icon: 'https://img.yzcdn.cn/public_files/2019/03/19/4a4f910fb225dbd2c212d013cc67e389.png',
    name: '砍价',
    description: '砍价',
    maxNum: 5,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      activity_ids: [],
      goods_source: '1',
      goods_ids: [],
      goods: [],
      size: '0', // 列表样式 0大图 1小图 2详细列表,
      size_type: '0',
      display_scale: '0', // 显示比例   '3,2' 3:2   '1,1' 1:1
      title: '1', // 是否显示商品名称 0 不显示  1 显示
      show_title: true,
      price: '1', // 是否展示商品现价 0 不显示  1 显示
      show_origin_price: true, // 是否显示商品原价  0 不显示  1显示
      show_buy_btn: '1', // 是否显示购买按钮 0 不显示 1 显示
      buy_btn_type: '1', // 购买按钮样式,
      show_count_down: false, // 显示倒计时,s
      show_time_limit: false,
      show_stock_num: false, // 显示剩余库存
      show_process_bar: false, // 显示进度条
      process_bar_type: '0', // 进度条样式类型
      process_bar_num_type: '0', // 进度条数字形式
      image_fill_style: '1', // 图片填充方式
      default_image_url: '',
      layout: '0',
      button_text: '立即砍价',
      page_margin: 15,
      goods_margin: 10,
      text_align_type: 'left',
      text_style_type: '1',
      border_radius_type: '1',
      type: 'bargain',
    };
  }
  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { goods } = value;
      if (isEmpty(goods) && +value.goods_source === 1) {
        errors.goods = '请选择商品';
      }
      if (+value.goods_source === 0) {
        if (value.goods_num <= 0) {
          errors.goods_num = '请输入大于0的数字';
        } else if (value.goods_num > 30) {
          errors.goods_num = '请输入小于等于30的数字';
        } else if (/\D/.test(value.goods_num)) {
          errors.goods_num = '请输入正整数';
        }
      }
      resolve(errors);
    });
  }
}
