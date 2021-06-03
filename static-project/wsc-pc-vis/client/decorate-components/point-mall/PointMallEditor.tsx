import { Pop, Select } from '@zent/compat';
/**
 * 积分商城编辑组件
 * @author: yugang <yugang@youzan.com>
 */
import React from 'react';
import { DesignEditor } from '../editor-base/design-editor';
import ControlGroup from '../common/control-group';
import { Radio, Icon, Checkbox, Input } from 'zent';

import ComponentTitle from '../common/component-title';
import * as Utils from '../common/utils';
import EditorCard from '../common/editor-card';
import GoodsImage from '../common/goods-image';
import Divider from '../common/divider';
import ChoseGoods from './components/ChoseGoods';
import RadioButton from '../common/radio-button';

import { COM_STATUS } from '../common/constants';
import { IPointMallEditorProps } from './type';
import { get } from 'lodash';

const RadioGroup = Radio.Group;
// 商品最大展示数量
const GOODS_MAX_NUM = 30;

const ORDER_RULE_SELECT = [
  { value: 0, text: '开始时间越晚越靠前' },
  { value: 1, text: '结束时间越早越靠前' },
];

const { state = false, appStatus = false } = get(_global, 'design_pointsstore_status', {});
const getDisabledText = () => {
  if (!appStatus) {
    return {
      hover: '该组件需购买使用，请点击前往购买',
      button: '点击购买',
    };
  }
  if (!state) {
    return {
      hover: '积分商城组件已停用，请点击前往开启',
      button: '点击启用',
    };
  }
};

export default class PointMallEditor extends DesignEditor<IPointMallEditorProps> {
  state = {
    visiblity: false,
    meta: {}, // setMetaProperty
  };

  // hook
  render() {
    const { value, showError, validation, globalConfig } = this.props;
    const {
      goodsSource,
      goodsNum,
      showAllBtn,
      orderRule,
      goods,
      size,
      imageFillStyle,
      showStock,
      showExchangePoint,
      showBuyBtn,
    } = value;
    const { visiblity } = this.state;
    // 全部按钮，类型转换
    const isShowAllBtn = Utils.numberToBoolean(showAllBtn);
    // 购买按钮，类型转换
    const isShowBuyBtn = Utils.numberToBoolean(showBuyBtn);
    // 兑换积分，类型转换
    const isShowExchangePoint = Utils.numberToBoolean(showExchangePoint);
    // 剩余库存，类型转换
    const isShowStock = Utils.numberToBoolean(showStock);

    return (
      <div className="decorate-pointmall-editor">
        <ComponentTitle name="积分商城" noticeMsg="小程序 v2.15 及以上版本支持" />

        {/* 添加方式，分“手动添加”以及“自动获取”两种方式 */}
        <ControlGroup label="添加方式" required>
          <RadioGroup onChange={this.onValueChange('goodsSource')} value={goodsSource}>
            <Radio value="1">手动添加</Radio>
            <Radio value="0">
              自动获取
              <Pop
                trigger="hover"
                position="bottom-right"
                content="系统自动获取店铺积分商品, 建议选择"
                centerArrow
              >
                <Icon type="help-circle" className="point-mall-help-icon" />
              </Pop>
            </Radio>
          </RadioGroup>
        </ControlGroup>

        {/* 自动获取可配置的选项 */}
        {+goodsSource === 0 && (
          <section className="controls-card">
            <ControlGroup
              label="显示个数"
              labelAlign="top"
              focusOnLabelClick={false}
              className="decorate-pointmall-editor__goods-num no-mb"
              bgColored
            >
              {/* 显示个数 */}
              <ControlGroup
                showLabel={false}
                focusOnLabelClick={false}
                showError={showError}
                error={validation.goodsNum}
                block
                bgColored
              >
                <span className="inline-help-desc">最多显示 30 个</span>
                <Input
                  value={goodsNum}
                  onChange={this.onValueChange('goodsNum')}
                  onBlur={this.onValueChange('goodsNum')}
                  className="point-mall-input-wrapper"
                />
              </ControlGroup>
            </ControlGroup>

            <ControlGroup bgColored label="查看全部按钮" value={isShowAllBtn ? '显示' : '不显示'}>
              <Checkbox checked={isShowAllBtn} onChange={this.handleCheckboxChange('showAllBtn')} />
            </ControlGroup>

            {/* 排序规则 */}
            <ControlGroup bgColored label="排序规则:" focusOnLabelClick={false} className="no-mb">
              <Select
                data={ORDER_RULE_SELECT}
                value={orderRule}
                onChange={this.onValueChange('orderRule')}
              />
            </ControlGroup>
          </section>
        )}

        {/* 手动添加可配置的选项 */}
        {+goodsSource === 1 && (
          <section className="controls-card">
            <ControlGroup
              className="no-mb point-mall__add-goods"
              label=""
              labelAlign="top"
              focusOnLabelClick={false}
              showError={showError}
              error={validation.goods}
              block
              bgColored
              helpDesc={`最多添加 ${GOODS_MAX_NUM} 个商品${
                goods.length > 1 ? '，拖动调整商品顺序' : ''
              }`}
            >
              <EditorCard
                list={goods}
                canDelete
                canAdd={goods.length < GOODS_MAX_NUM}
                isInline
                onChange={this.handleGoodsChange}
                onAdd={this.handleAddGoods}
              >
                {goods.map((item, index) => (
                  <GoodsImage globalConfig={globalConfig} key={index} data={item} />
                ))}
              </EditorCard>
            </ControlGroup>
          </section>
        )}

        <Divider />

        {/* 选择商品弹窗 */}
        <ChoseGoods
          visiblity={visiblity}
          onClose={this.closeGoodsDialog}
          onConfirm={this.onAddGoodsChange}
        />

        {/* 列表样式 */}
        <ControlGroup label="列表样式" focusOnLabelClick={false}>
          <RadioButton.Group value={size} onChange={this.onValueChange('size')}>
            <RadioButton value="0" icon="big" tip="大图" />
            <RadioButton value="1" icon="small" tip="小图" />
            <RadioButton value="2" icon="list" tip="详细列表" />
          </RadioButton.Group>
        </ControlGroup>

        <Divider />

        <section className="controls-card">
          <ControlGroup label="图片填充" value={imageFillStyle === '1' ? '填充' : '周边留白'}>
            <RadioButton.Group
              value={imageFillStyle}
              onChange={this.onValueChange('imageFillStyle')}
            >
              <RadioButton value="1" icon="img-cover" tip="填充" />
              <RadioButton value="2" icon="img-contain" tip="周边留白" />
            </RadioButton.Group>
          </ControlGroup>

          <Divider />

          <ControlGroup label="兑换积分" value={isShowExchangePoint ? '显示' : '不显示'}>
            <Checkbox
              checked={isShowExchangePoint}
              onChange={this.handleCheckboxChange('showExchangePoint')}
            />
          </ControlGroup>

          {/* 购买按钮 */}
          <ControlGroup label="购买按钮" value={isShowBuyBtn ? '显示' : '不显示'}>
            <Checkbox checked={isShowBuyBtn} onChange={this.handleCheckboxChange('showBuyBtn')} />
          </ControlGroup>

          <ControlGroup label="剩余库存" value={isShowStock ? '显示' : '不显示'}>
            <Checkbox checked={isShowStock} onChange={this.handleCheckboxChange('showStock')} />
          </ControlGroup>
        </section>
      </div>
    );
  }

  /**
   * value类型的选项值(e.target.value)改变
   * @param {Object} e: 接收事件对象
   */
  onValueChange = name => e => {
    const { onChange } = this.props;
    const { value } = e.target;
    onChange({
      [name]: value,
    });
  };

  /**
   * checked类型的选项值(e.target.checked)改变
   * @param {Object} e: 接收事件对象
   */
  handleCheckboxChange = (name, reverse?: boolean) => e => {
    const { onChange } = this.props;
    const { checked } = e.target;
    const value = Utils.booleanToString(reverse ? !checked : checked);
    onChange({
      [name]: value,
    });
  };

  /**
   * 商品数据改变
   * @param {Array} list: 改变后的商品数据
   */
  handleGoodsChange = list => {
    const goodsIds = list.map(goods => {
      return goods.id;
    });
    this.props.onChange({
      goods: list,
      goodsIds,
    });
  };

  /**
   * 添加商品，显示商品选择弹窗
   */
  handleAddGoods = () => {
    this.setState({
      visiblity: true,
    });
  };

  /**
   * 关闭弹窗
   */
  closeGoodsDialog = () => {
    this.setState({
      visiblity: false,
    });
  };

  /**
   * 添加商品
   */
  onAddGoodsChange = data => {
    const { goods, goodsIds } = this.props.value;

    const idArr = [...goodsIds];
    const list = [...goods];

    data.forEach(item => {
      if (idArr.indexOf(item.id) === -1) {
        idArr.push(item.id);
        list.push(item);
      }
    });

    this.props.onChange({
      goods: list,
      goodsIds: idArr,
    });
  };

  // 组件类型
  static designType = 'points_goods';
  // 组件描述
  static designDescription = '积分商城';

  static info = {
    icon: 'https://img.yzcdn.cn/public_files/2019/03/19/fab6dd729684029ce5199bd40b2719fd.png',
    type: 'points_goods',
    name: '积分商城',
    maxNum: 10,
    usedNum: 0,
    status: COM_STATUS.NORMAL,
    couldCreateCb: () =>
      new Promise(resolve => {
        resolve(state && appStatus);
      }),
    disableText: getDisabledText()?.hover,
    disableLink: (
      <a
        href="/v4/ump/pointsmall"
        className="disable-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {getDisabledText()?.button}
      </a>
    ),
  };

  // 默认数据
  static getInitialValue() {
    return {
      type: 'points_goods',
      // 添加方式， 0:自动获取，1:手动添加
      goodsSource: '0',
      // 显示个数
      goodsNum: '20',
      // 查看全部按钮， 0:不显示，1:显示
      showAllBtn: '1',
      // 排序规则，0:开始时间，1:结束时间
      orderRule: '0',
      // 商品集合
      goods: [],
      // 商品id集合
      goodsIds: [],
      // 列表样式，0:大图，1:小图，2:详细列表
      size: '0',
      // 图片填充方式，1:填充，2:留白
      imageFillStyle: '1',
      // 显示购买按钮，0:不显示，1:显示
      showBuyBtn: '0',
      // 显示兑换积分，0:不显示，1:显示
      showExchangePoint: '0',
      // 显示剩余库存，0:不显示，1:显示
      showStock: '0',

      // 积分商品
      sizeType: 6,
    };
  }

  // 校验
  static validate(value) {
    return new Promise(resolve => {
      const error = {} as Record<string, string>;
      const { goodsSource, goodsNum, goods } = value;

      if (goodsSource === '0') {
        // 自动获取 展示商品个数校验
        if (!/^[0-9]*$/.test(goodsNum)) {
          error.goodsNum = '请填写数字';
        } else if (value.goodsNum <= 0 || value.goodsNum > GOODS_MAX_NUM) {
          error.goodsNum = `商品最多展示${GOODS_MAX_NUM}个`;
        }
        // 显示个数不能为0
        if (+value.goodsNum === 0) {
          error.goodsNum = '请填写大于0的数字';
        }
      }

      // 手动添加商品 校验
      if (goodsSource === '1') {
        if (goods.length === 0) {
          error.goods = '请选择商品';
        } else if (goods.length > 30) {
          error.goods = '最多添加30个商品';
        }
      }

      resolve(error);
    });
  }
}
