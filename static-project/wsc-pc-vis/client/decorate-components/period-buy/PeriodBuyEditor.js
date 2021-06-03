import { Select, Pop } from '@zent/compat';
import React from 'react';
import {
  ControlGroup,
  EditorCard,
  ComponentTitle,
  GoodsImage,
  HelpDesc,
  Control,
  Divider,
} from '../common/';
import { DesignEditor } from '../editor-base/design-editor';
import cx from 'classnames';
import { Radio, Input, Checkbox, Icon } from 'zent';
import choosePeriodBuy from '@youzan/react-components/es/components/choose-dialog/dialogs/period-buy';
import openViewExampleDialog from '../common/view-example';
import * as Utils from '../common/utils';
import * as Helper from './helper';
import TemplateUpload from '../common/template-upload';
import '@youzan/react-components/es/components/choose-dialog/style';

const RadioGroup = Radio.Group;
const Option = Select.Option;
const MAX_GOODS_NUM = 8;
const prefix = 'decorate-period-buy-editor';

export default class PeriodBuyEditor extends DesignEditor {
  handleGoodsSourceChange = e => {
    const { onChange } = this.props;
    const { target } = e;
    const { name, value } = target;

    if (value === '0') {
      onChange({
        [name]: value,
        goods: [],
        goods_ids: [],
        activity_ids: [],
      });
    } else {
      onChange({
        [name]: value,
      });
    }

    this.setMetaProperty(name, 'dirty');
  };

  handleSizeChange = e => {
    const value = e.target.value;
    const data = {
      size: value,
    };

    if (value === '0' || value === '2') {
      data.show_title = '1';
      data.show_desc = '1';
    } else if (value === '1') {
      data.show_desc = '0';
    }

    this.props.onChange(data);
  };

  handleShowTitleChange = e => {
    const { onChange } = this.props;
    const { checked, name } = e.target;

    onChange({
      show_title: Utils.booleanToString(checked),
      show_desc: Utils.booleanToString(checked),
    });
    this.setMetaProperty(name, 'dirty');
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

  handleAddGoods = () => {
    const { globalConfig, value } = this.props;
    const { goods } = value;
    const self = this;
    choosePeriodBuy({
      config: globalConfig,
      multiple: true,
      onChoose(list) {
        const filterGoods = Helper.validGoods(goods, list, MAX_GOODS_NUM);
        const goodsIds = filterGoods.map(i => {
          return i.goods_id;
        });
        const activityIds = filterGoods.map(i => {
          return i.id;
        });
        self.props.onChange({
          goods_ids: goodsIds,
          activity_ids: activityIds,
          goods: filterGoods,
        });
      },
    });
  };

  handleGoodsChange = list => {
    const goodsIds = list.map(goods => {
      return goods.goods_id;
    });
    const activityIds = list.map(goods => {
      return goods.id;
    });
    this.props.onChange({
      goods_ids: goodsIds,
      activity_ids: activityIds,
      goods: list,
    });
  };

  handleUploadSuccess = defaultImageUrl => {
    this.onCustomInputChange('default_image_url')(defaultImageUrl);
  };

  render() {
    const { value, showError, validation, globalConfig } = this.props;
    let {
      goods,
      goods_source: goodsSource,
      goods_num: goodsNum,
      show_all: showAll,
      order_rule: orderRule,
      size,
      show_buy_btn: showBuyBtn,
      buy_btn_type: buyBtnType,
      show_title: showTitle,
      show_desc: showDesc,
      hide_goods_end: hideGoodsEnd,
      image_fill_style: imageFillStyle,
      default_image_url: defaultImageUrl,
    } = value;
    showAll = Utils.numberToBoolean(showAll);
    showBuyBtn = Utils.numberToBoolean(showBuyBtn);
    showTitle = Utils.numberToBoolean(showTitle);
    showDesc = Utils.numberToBoolean(showDesc);
    hideGoodsEnd = Utils.numberToBoolean(hideGoodsEnd);

    return (
      <div className={prefix}>
        <ComponentTitle
          name="周期购"
          url="https://help.youzan.com/qa?cat_sys=K#/menu/3096/detail/11764?_k=jydfz4"
        />

        <ControlGroup label="添加方式:" focusOnLabelClick={false}>
          <RadioGroup value={goodsSource} onChange={this.handleGoodsSourceChange}>
            <Radio name="goods_source" value="1">
              手动添加
            </Radio>
            <Radio name="goods_source" value="0">
              自动获取
              <Pop
                trigger="hover"
                position="bottom-right"
                content="系统自动获取店铺周期购商品, 建议选择"
                centerArrow
              >
                <Icon type="help-circle" />
              </Pop>
            </Radio>
          </RadioGroup>
        </ControlGroup>
        {+goodsSource === 0 && (
          <div className={`${prefix}__controls-card`}>
            <ControlGroup
              label="显示个数"
              bgColored
              focusOnLabelClick={false}
              showError={showError}
              error={validation.goods_num}
              className={`${prefix}__goods-num`}
            >
              <HelpDesc inline style={{ marginRight: '16px' }}>
                最多显示 {MAX_GOODS_NUM} 个
              </HelpDesc>
              <Input
                name="goods_num"
                value={goodsNum}
                onChange={this.onInputChange}
                onBlur={this.onInputBlur}
              />
            </ControlGroup>
            <ControlGroup
              label="查看全部按钮"
              value={showAll ? '显示' : '不显示'}
              focusOnLabelClick={false}
              bgColored
            >
              <span
                className="view-examples"
                onClick={() =>
                  openViewExampleDialog(
                    '周期购',
                    '/public_files/2017/9/11/f0baa9d5f4685ff70a33b3841bb6a691.png'
                  )
                }
              >
                查看示例
              </span>
              <Checkbox checked={showAll} name="show_all" onChange={this.handleCheckboxChange} />
            </ControlGroup>
            <ControlGroup label="排序规则:" focusOnLabelClick={false} className="no-mb" bgColored>
              <Select value={orderRule} name="order_rule" onChange={this.onInputChange}>
                <Option value="0">销量越高越靠前</Option>
                <Option value="1">浏览次数越多越靠前</Option>
              </Select>
            </ControlGroup>
          </div>
        )}
        {+goodsSource === 1 && (
          <div className="controls-card">
            <ControlGroup
              bgColored
              focusOnLabelClick={false}
              showError={showError}
              error={validation.goods}
              helpDesc={`最多添加 ${MAX_GOODS_NUM} 个商品${
                goods.length > 1 ? '，拖动调整商品顺序' : ''
              }`}
              className={`${prefix}__editor-card`}
            >
              <EditorCard
                list={goods}
                canDelete
                canAdd={goods.length < MAX_GOODS_NUM}
                isInline
                onChange={this.handleGoodsChange}
                onAdd={this.handleAddGoods}
              >
                {goods.map(item => (
                  <GoodsImage
                    globalConfig={globalConfig}
                    key={item.id}
                    data={{
                      url: `${window._global.url.wap}/showcase/goods?alias=${
                        item.goods_info ? item.goods_info.alias : ''
                      }`,
                      image_url: item.goods_info ? item.goods_info.attachment_url : '',
                    }}
                  />
                ))}
              </EditorCard>
            </ControlGroup>
          </div>
        )}

        <TemplateUpload defaultImageUrl={defaultImageUrl} onSuccess={this.handleUploadSuccess} />

        <Divider />
        <Control
          label="列表样式"
          valueMap={{
            0: '大图模式',
            1: '一行两个',
            2: '详细列表',
          }}
          name="size"
          options={[
            { value: '0', icon: 'big' },
            { value: '1', icon: 'small' },
            { value: '2', icon: 'list' },
          ]}
          value={size}
          componentProps={{ block: true }}
          onChange={this.handleSizeChange}
        />

        <Divider />

        <div className="controls-card">
          {/* <ControlGroup label="图片填充方式:" focusOnLabelClick={false}>
            <RadioGroup value={imageFillStyle} onChange={this.onInputChange}>
              <Radio name="image_fill_style" value="1">
                填充
              </Radio>
              <Radio name="image_fill_style" value="2">
                留白
              </Radio>
            </RadioGroup>
          </ControlGroup> */}
          <Control
            label="图片填充"
            valueMap={{
              1: '填充',
              2: '周边留白',
            }}
            name="image_fill_style"
            options={[{ value: '1', icon: 'img-cover' }, { value: '2', icon: 'img-contain' }]}
            value={imageFillStyle}
            onChange={this.onInputChange}
          />

          <Divider />

          {/* <ControlGroup
            label="显示内容:"
            focusOnLabelClick={false}
            labelAlign="top"
            className="no-mb"
          > */}

          {/* </ControlGroup> */}
        </div>
        {/* <ControlGroup label="更多设置:" focusOnLabelClick={false}>
          <Checkbox
            checked={hideGoodsEnd}
            name="hide_goods_end"
            onChange={this.handleCheckboxChange}
          >
            隐藏已售罄周期购商品
          </Checkbox>
        </ControlGroup> */}

        <ControlGroup label="隐藏售罄商品" value={hideGoodsEnd ? '显示' : '不显示'}>
          <Checkbox
            checked={hideGoodsEnd}
            name="hide_goods_end"
            onChange={this.handleCheckboxChange}
          />
        </ControlGroup>

        {+size !== 2 && (
          <ControlGroup label="活动标题" value={showTitle ? '显示' : '不显示'}>
            <Checkbox checked={showTitle} name="show_title" onChange={this.handleShowTitleChange} />
          </ControlGroup>
        )}
        {((+size === 0 && showTitle) || +size === 2) && (
          <ControlGroup
            label="活动描述"
            value={showDesc ? '显示' : '不显示'}
            className={cx({ 'cg-adjust': +size === 0, 'no-mb': true })}
          >
            <Checkbox checked={showDesc} name="show_desc" onChange={this.handleCheckboxChange} />
          </ControlGroup>
        )}

        <ControlGroup label="购买按钮" value={showBuyBtn ? '显示' : '不显示'}>
          <Checkbox checked={showBuyBtn} name="show_buy_btn" onChange={this.handleCheckboxChange} />
        </ControlGroup>

        {showBuyBtn && (
          <ControlGroup
            showLabel={false}
            focusOnLabelClick={false}
            bgColored
            className={`${prefix}__btn-style`}
          >
            <RadioGroup onChange={this.onInputChange} value={buyBtnType}>
              <Radio name="buy_btn_type" value="0">
                样式1
              </Radio>
              <Radio name="buy_btn_type" value="1">
                样式2
              </Radio>
              <Radio name="buy_btn_type" value="2">
                样式3
              </Radio>
            </RadioGroup>
          </ControlGroup>
        )}
      </div>
    );
  }

  static designType = 'period_buy';

  static designDescription = <span>周期购</span>;

  static info = {
    type: 'period_buy',
    icon: 'https://img.yzcdn.cn/public_files/2019/03/19/e2e52e5b13d3657cb9710eac01d08e84.png',
    name: '周期购',
    description: '周期购',
    maxNum: 5,
    usedNum: 0,
    status: '',
  };

  static getInitialValue({ settings }) {
    return {
      // 自动获取/手动添加
      goods_source: '1',
      // 显示个数
      goods_num: 8,
      // 底部显示查看全部
      show_all: '1',
      // 排序规则
      order_rule: '0',
      // 商品
      goods: [],
      goods_ids: [],
      activity_ids: [],
      // 列表样式
      size: '0',
      // 显示购买按钮
      show_buy_btn: '1',
      // 购买按钮样式
      buy_btn_type: '0',
      // 显示标题
      show_title: '1',
      // 显示描述
      show_desc: '1',
      // 隐藏已售罄商品
      hide_goods_end: '1',
      // 图片填充方式
      image_fill_style: settings.fillStyle || '1',
      default_image_url: '',

      type: 'period_buy',
    };
  }

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { goods_source: goodsSource, goods, goods_num: goodsNum } = value;

      if (goodsSource === '1' && goods.length === 0) {
        errors.goods = '请选择商品';
      }

      if (goodsSource === '0' && (!/^[0-9]*$/.test(goodsNum) || goodsNum === '')) {
        errors.goods_num = '请填写数字';
      }
      if (goodsSource === '0') {
        if (!/^[0-9]*$/.test(goodsNum) || goodsNum === '') {
          errors.goods_num = '请填写数字';
        } else if (+goodsNum > MAX_GOODS_NUM) {
          errors.goods_num = `商品最多展示${MAX_GOODS_NUM}个`;
        } else if (+goodsNum === 0) {
          errors.goods_num = '请填写大于0的数字';
        }
      }

      resolve(errors);
    });
  }
}
