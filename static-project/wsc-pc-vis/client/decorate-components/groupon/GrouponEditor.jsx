import { Pop, Select } from '@zent/compat';
import React from 'react';
import { DesignEditor } from '../editor-base/design-editor';
import { Radio, Icon, Checkbox, Input, Notify } from 'zent';
import chooseGroupon from '@youzan/react-components/es/components/choose-dialog/dialogs/groupon';
import get from 'lodash/get';
import omit from 'lodash/omit';

import { ControlGroup, EditorCard, ComponentTitle, GoodsImage, HelpDesc } from '../common/';
import openViewExampleDialog from '../common/view-example';
import GoodsStyleEditor from '../common-goods-layout';
import * as Utils from '../common/utils';
import { COM_STATUS } from '../common/constants';
import TemplateUpload from '../common/template-upload';

import './style/index.scss';

const RadioGroup = Radio.Group;
const Option = Select.Option;

const kdtId = get(_global, 'kdt_id', 0);
const IS_MEITUAN = [41217689, 16719442, 63077].indexOf(+kdtId) !== -1;
const MAX_GOODS_NUM = IS_MEITUAN ? 300 : 30;
const DEFAULT_BTN_TEXT = ['去开团', '0元开团'];
const IN_UMP_GROUPON_V4 = get(_global, 'in_ump_groupon_v4', false);

export default class GrouponEditor extends DesignEditor {
  componentDidMount() {
    this.props.onChange({ is_groupon_pro: true });
  }

  // 加上版本号
  handleChange = value => {
    this.props.onChange(this.goods2Groupon(value));
  };

  // 统一各个 change 方法
  handleAnyChange = param => {
    // 替换 onCustomInputChange
    if (typeof param === 'string') {
      return value => {
        this.setMetaProperty(param, 'dirty');
        this.handleChange({
          [param]: value,
        });
      };
    }

    let res;

    if (typeof param === 'object') {
      // 替换 onInputChange
      if (Utils.isEventLikeObject(param)) {
        const { target } = param;
        const { name, type } = target;
        let { value } = target;

        // 如果是 checkbox，则把布尔值转换成字符串
        if (type === 'checkbox') {
          value = Utils.booleanToString(target.checked);
        }

        res = { [name]: value };
        this.setMetaProperty(name, 'dirty');
      } else {
        // 普通的 onChange
        res = param;
      }
    }

    this.handleChange(res);
  };

  handleGrouponTypeChange = e => {
    const { name, value } = e.target;
    const needUpdate = {
      [name]: value,
      goods: [],
      goods_ids: [],
      activity_ids: [],
      show_price: '1',
      button_text: DEFAULT_BTN_TEXT[value],
    };

    // 抽奖拼团，默认不显示活动价格
    if (+value === 1) {
      needUpdate.show_price = '0';
    }

    this.handleChange(needUpdate);
  };

  handleGrouponSourceChange = e => {
    const { target } = e;
    const { name, value } = target;

    if (value === '0') {
      this.handleChange({
        [name]: value,
        goods: [],
        goods_ids: [],
        activity_ids: [],
      });
    } else {
      this.handleChange({
        [name]: value,
      });
    }
  };

  handleAddGroupon = () => {
    const { value, globalConfig } = this.props;
    const self = this;
    const options = {
      url: `/v4/shop/design/groupon/list.json?groupon_type=${value.groupon_type}`,
      config: globalConfig,
      multiple: true,
      onChoose(list) {
        self.onGrouponSelect(list);
      },
    };

    if (+value.groupon_type === 1) {
      // 抽奖拼团
      options.url = '/v4/shop/design/groupon/lucky_list.json';
    }

    chooseGroupon(options);
  };

  onGrouponSelect = grouponGoods => {
    const { value } = this.props;
    const goods = [...value.goods];
    const goodsIds = [...value.goods_ids];
    const activityIds = [...value.activity_ids];
    const originLen = goodsIds.length;
    let overflow = false;
    grouponGoods.forEach((item, i) => {
      const len = i + 1;
      const index = value.activity_ids.indexOf(item.activity_id);
      if (!overflow && index === -1) {
        goods.push({
          title: item.goods_title || item.title, // 使用商品标题
          start_at: item.start_at,
          end_at: item.end_at,
          condition_num: item.condition_num,
          image_url: item.thumb_url,
          min_sku_price: this.getSkuMinPrice(item.sku_prices),
          origin_price: this.getSkuMinPrice(item.origin_sku_price),
          activity_id: item.activity_id,
          goods_id: item.goods_id,
          goods_type: get(item, ['goods_info', 'goods_type']),
          url: `${window._global.url.wap}/showcase/goods?alias=${
            item.goods_info ? item.goods_info.alias : ''
          }`,
        });
        goodsIds.push(item.goods_id);
        activityIds.push(item.activity_id);

        overflow = originLen + len >= MAX_GOODS_NUM;
      }
    });
    if (overflow) {
      Notify.success(`商品不能多于 ${MAX_GOODS_NUM} 个，已经自动删除多余的商品`);
    }
    this.handleChange({
      goods,
      activity_ids: activityIds,
      goods_ids: goodsIds,
    });
  };

  getSkuMinPrice = (sku = {}) => {
    const keys = Object.keys(sku);
    let min;
    keys.forEach((key, index) => {
      const price = sku[key];
      if (index === 0) {
        min = price;
      }
      if (min > price) {
        min = price;
      }
    });
    return min || 0;
  };

  handleGrouponChange = list => {
    const goodsIds = list.map(goods => {
      return goods.goods_id;
    });
    const activityIds = list.map(goods => {
      return goods.activity_id;
    });
    this.handleChange({
      goods: list,
      activity_ids: activityIds,
      goods_ids: goodsIds,
    });
  };

  handleUploadSuccess = defaultImageUrl => {
    this.handleAnyChange('default_image_url')(defaultImageUrl);
  };

  // 适配 goods-style-editor
  groupon2Goods(value) {
    const { show_title: showTitle, show_buy_btn: showBuyBtn } = value;
    const res = {};
    const omitKeys = [];

    if (showTitle) {
      res.title = showTitle;
      omitKeys.push('show_title');
    }

    if (showBuyBtn) {
      res.buy_btn = showBuyBtn;
      omitKeys.push('show_buy_btn');
    }

    return Object.assign(res, omit(value, omitKeys));
  }

  goods2Groupon(value) {
    const {
      size,
      title,
      buy_btn: buyBtn,
      buy_btn_type: buyBtnType,
      text_align_type: textAlignType,
    } = value;
    const res = {};
    const omitKeys = [];

    // 一行三个、横向滑动，并且是多人拼团，则不显示倒计时
    if (size) {
      if (size === '5' || size === '6') {
        res.show_count_down = '0';
      } else {
        res.show_count_down = '1';
      }
    }

    if (title) {
      res.show_title = title;
      omitKeys.push('title');
    }

    if (buyBtn) {
      res.show_buy_btn = buyBtn;
      omitKeys.push('buy_btn');
    }

    if (textAlignType === 'center' && buyBtnType === '3') {
      res.buy_btn_type = '8';
      omitKeys.push('buy_btn_type');
    }

    return Object.assign(res, omit(value, omitKeys));
  }

  renderExtraComponent = () => {
    const {
      size,
      groupon_type: grouponType = '0',
      show_price: _showPrice = '1',
      show_origin_price: _showOriginPrice = '1',
      show_count_down: _showCountDown = '0',
      show_groupon_num: _showGrouponNum,
      hide_goods_sold: _hideGoodsSold,
    } = this.props.value;
    const showPrice = Utils.numberToBoolean(_showPrice);
    const showOriginPrice = Utils.numberToBoolean(_showOriginPrice);
    const showCountDown = Utils.numberToBoolean(_showCountDown);
    const showGrouponNum = Utils.numberToBoolean(_showGrouponNum);
    const isThreeOrSwipe = size === '5' || size === '6';
    const hideGoodsSold = Utils.numberToBoolean(_hideGoodsSold);

    return (
      <>
        <ControlGroup label="拼团价" value={showPrice ? '显示' : '不显示'}>
          <Checkbox checked={showPrice} name="show_price" onChange={this.handleAnyChange} />
        </ControlGroup>
        <ControlGroup label="单买价" value={showOriginPrice ? '显示' : '不显示'}>
          <Checkbox
            checked={showOriginPrice}
            name="show_origin_price"
            onChange={this.handleAnyChange}
          />
        </ControlGroup>
        <ControlGroup label="抢购倒计时" value={showCountDown ? '显示' : '不显示'}>
          <Checkbox
            name="show_count_down"
            checked={showCountDown}
            disabled={isThreeOrSwipe}
            onChange={this.handleAnyChange}
          />
        </ControlGroup>
        <ControlGroup label="已团人数" value={showGrouponNum ? '显示' : '不显示'}>
          <Checkbox
            name="show_groupon_num"
            checked={showGrouponNum}
            onChange={this.handleAnyChange}
          />
        </ControlGroup>
        {/* 抽奖拼团不支持隐藏售罄这个参数 */}
        {+grouponType !== 1 && (
          <ControlGroup label="已售罄拼团商品" value={hideGoodsSold ? '隐藏' : '不隐藏'}>
            <Checkbox
              checked={hideGoodsSold}
              name="hide_goods_sold"
              onChange={this.handleAnyChange}
            />
          </ControlGroup>
        )}
      </>
    );
  };

  render() {
    const { value, showError, validation, globalConfig, uploadConfig } = this.props;
    const {
      groupon_type: grouponType = '0',
      goods_source: goodsSource,
      goods_num: goodsNum,
      show_all_btn: _showAllBtn,
      order_rule: orderRule,
      goods,
      default_image_url: defaultImageUrl,
    } = value;

    const showAllBtn = Utils.numberToBoolean(_showAllBtn);

    const noticeMsg = (
      <>
        <p>小程序 v2.22 及以上版本支持，小程序仅支持显示实物（含分销）、虚拟、电子卡券商品。</p>
        <p>
          10月25日起微信内打开的H5页面中不展示抽奖拼团组件，小程序页面正常展示。
          <a
            href="https://bbs.youzan.com/forum.php?mod=viewthread&tid=677881&page=1&extra=#pid3858390"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#155bd4' }}
          >
            查看公告详情
          </a>
        </p>
        <p>
          多人拼团组件升级，此前创建的多人拼团活动（普通拼团和老带新）默认在升级后的“普通拼团”分组下，此后创建的拼团活动会按照“普通拼团”“老带新拼团”“阶梯拼团”进行分组。
        </p>
      </>
    );

    return (
      <div className="rc-design-component-groupon-editor">
        <ComponentTitle
          name="拼团"
          noticeMsg={noticeMsg}
          url="https://help.youzan.com/qa?cat_sys=K#/menu/2196/detail/11760?_k=vyi820"
        />

        <ControlGroup label="拼团类型" focusOnLabelClick={false}>
          <RadioGroup value={grouponType} onChange={this.handleGrouponTypeChange}>
            <Radio name="groupon_type" value="0">
              普通拼团
            </Radio>
            <Radio name="groupon_type" value="2">
              老带新拼团
            </Radio>
            {IN_UMP_GROUPON_V4 && (
              <Radio name="groupon_type" value="3">
                阶梯拼团
              </Radio>
            )}
            <Radio name="groupon_type" value="1">
              抽奖拼团
            </Radio>
          </RadioGroup>
        </ControlGroup>

        <ControlGroup label="添加方式" focusOnLabelClick={false}>
          <RadioGroup value={goodsSource} onChange={this.handleGrouponSourceChange}>
            <Radio name="goods_source" value="1">
              手动添加
            </Radio>
            <Radio name="goods_source" value="0">
              自动获取
              <Pop
                trigger="hover"
                position="bottom-right"
                content="系统自动获取店铺拼团商品, 建议选择"
                centerArrow
              >
                <Icon type="help-circle" />
              </Pop>
            </Radio>
          </RadioGroup>
        </ControlGroup>
        {+goodsSource === 0 && (
          <div className="controls-card">
            <ControlGroup
              label="显示个数"
              className="rc-design-component-groupon-editor__goods-num no-mb"
              bgColored
              showError={showError}
              error={validation.goods_num}
            >
              <HelpDesc inline style={{ marginRight: '16px' }}>
                最多显示 {MAX_GOODS_NUM} 个
              </HelpDesc>
              <Input value={goodsNum} name="goods_num" onChange={this.onInputChange} />
            </ControlGroup>

            <ControlGroup label="全部按钮" value={showAllBtn ? '显示' : '不显示'} bgColored>
              <Checkbox checked={showAllBtn} name="show_all_btn" onChange={this.handleAnyChange} />
              <span
                className="view-examples"
                onClick={() =>
                  openViewExampleDialog(
                    '拼团',
                    '/public_files/2017/11/13/c56344c79c8f9b5570d991105294a3c8.png'
                  )
                }
              >
                查看示例
              </span>
            </ControlGroup>

            {+grouponType === 0 && (
              <ControlGroup label="排序规则" focusOnLabelClick={false} className="no-mb" bgColored>
                <Select value={orderRule} name="order_rule" onChange={this.onInputChange}>
                  <Option value="0">销量越高越靠前</Option>
                  <Option value="1">浏览次数越多越靠前</Option>
                  <Option value="2">开始时间越晚越靠前</Option>
                  <Option value="3">结束时间越早越靠前</Option>
                </Select>
              </ControlGroup>
            )}
          </div>
        )}
        {+goodsSource === 1 && (
          <div className="controls-card-manual">
            <ControlGroup
              focusOnLabelClick={false}
              showError={showError}
              error={validation.goods}
              bgColored
            >
              <EditorCard
                list={goods}
                canDelete
                canAdd={goods.length < MAX_GOODS_NUM}
                isInline
                onChange={this.handleGrouponChange}
                onAdd={this.handleAddGroupon}
              >
                {goods.map((item, index) => (
                  <GoodsImage globalConfig={globalConfig} key={index} data={item} />
                ))}
              </EditorCard>
            </ControlGroup>
          </div>
        )}

        <TemplateUpload defaultImageUrl={defaultImageUrl} onSuccess={this.handleUploadSuccess} />

        <GoodsStyleEditor
          globalConfig={globalConfig}
          uploadConfig={uploadConfig}
          value={this.groupon2Goods(value)}
          onInputChange={this.onInputChange}
          onChange={this.handleChange}
          priceComponent={() => null}
          extraComponent={this.renderExtraComponent}
          showError={showError}
          error={validation}
        />
      </div>
    );
  }

  static info = {
    type: ['groupon', 'groupon_weapp'],
    icon: 'https://img.yzcdn.cn/public_files/2019/02/12/a720ac454ce6854bf58bc1395761a320.png',
    name: '拼团',
    maxNum: 10,
    usedNum: 0,
    status: COM_STATUS.NORMAL,
  };

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { goods_source: goodsSource, goods, goods_num: goodsNum } = value;

      if (goodsSource === '1' && goods.length === 0) {
        errors.goods = '请选择商品';
      }

      if (goodsSource === '0') {
        if (!/^[0-9]*$/.test(goodsNum) || !+goodsNum) {
          errors.goods_num = '请填写大于0的数字';
        } else if (goodsNum > MAX_GOODS_NUM) {
          errors.goods_num = `商品最多展示${MAX_GOODS_NUM}个`;
        }
      }

      resolve(errors);
    });
  }

  static getInitialValue() {
    return {
      type: 'groupon',
      v: '2', // 组件版本号（无: 老配置，2: 新配置）
      groupon_type: '0', // 拼团类型（0: 普通拼团，1: 抽奖拼团，2: 老带新拼团，3: 阶梯拼团）
      goods_source: '0', // 获取方式（0: 自动，1: 手动）
      goods_num: '20', // 个数
      show_all_btn: '1', // 显示查看全部按钮
      order_rule: '0', // 排序规则
      goods: [],
      goods_ids: [], // 商品 ids
      activity_ids: [], // 活动 ids
      size: '0', // 列表样式（0: 大图，1: 一行两个， 2: 详细列表， 3: 一大两小，5: 一行三个，6: 左右滑动）
      page_margin: 15, // 页面边距
      goods_margin: 10, // 商品边距
      size_type: '0', // 商品样式（0: 无边白底，2: 无边透明，5: 描边白底，7：卡片投影）
      border_radius_type: '1', // 倒角（1: 直角，2: 圆角）
      display_scale: '0', // 图片显示比例（0：`3:2`， 1：`1:1`，2: `3:4`，3: `16:9`）
      image_fill_style: '1', // 图片填充方式（1: 填充，2: 留白）
      text_style_type: '1', // 文本样式：（1: 常规体 2: 加粗体)
      text_align_type: 'left', // 文本对齐
      show_title: '1', // 显示商品标题 1 显示 0 不显示
      show_sub_title: '1', // 显示副标题
      show_price: '1', // 拼团价
      show_origin_price: '1', // 单买价
      show_count_down: '1', // 倒计数
      show_groupon_num: '1', // 显示已团人数 1 显示 0 不显示
      show_buy_btn: '1', // 显示购买按钮
      buy_btn_type: '8', // 购买按钮样式
      button_text: '去开团', // 购买按钮文字
      hide_goods_sold: '0', // 隐藏已售罄拼团商品
      default_image_url: '', // 默认图片
      is_groupon_pro: true, // 是否拼团pro
    };
  }

  static info = {
    type: ['groupon_weapp', 'groupon'],
    icon: 'https://img.yzcdn.cn/public_files/2019/02/12/a720ac454ce6854bf58bc1395761a320.png',
    name: '拼团',
    maxNum: 10,
    usedNum: 0,
    status: COM_STATUS.NORMAL,
  };
}
