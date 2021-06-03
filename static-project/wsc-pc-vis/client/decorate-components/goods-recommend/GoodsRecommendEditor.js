import { Pop } from '@zent/compat';
/**
 * 商品推荐编辑区
 * @author: yugang <yugang@youzan.com>
 */
import React from 'react';
import { Icon, Input, Radio, ColorPicker, Checkbox, Notify } from 'zent';
import ajax from 'zan-pc-ajax';
import { DesignEditor } from '../editor-base/design-editor';
import ControlGroup from '../common/control-group';
import RadioButton from '../common/radio-button';
import { WEAPP_NOT_SUPPORTED_MSG } from '../common/utils/weapp-not-supported-link';
import * as Utils from '../common/utils';
import { isWscShop } from '../common/utils/shop-type';
import ComponentTitle from '../common/component-title';
import Divider from '../common/divider';
import { COM_STATUS } from '../common/constants';
import GoodsStyleEditor from '../common-goods-layout';
const RadioGroup = Radio.Group;

import {
  TITLE_MAX_NUM,
  TITLE_MAX_NOTICE,
  ALIGN_TEXT,
  TITLE,
  GOODS,
  SOURCE_LIST,
  SOURCE_MAP,
} from './default-component';
const _global = window._global;
const baseUrl = `//${window.location.host}`;

// 微商城新链接
const linkUrl = isWscShop()
  ? 'https://www.youzan.com/v4/assets/serve/subscribe/choose'
  : `${_global.url.www}/member#/`;

const ajaxUrl = `${baseUrl}/v4/ump/recommend/ability.json`;

const getRecommendAbility = () =>
  new Promise(reslove => {
    ajax({
      url: ajaxUrl,
    })
      .then(hasAbility => {
        if (hasAbility) {
          reslove(true);
        } else {
          reslove(false);
        }
      })
      .catch(msg => {
        Notify.error(msg);
      });
  });

export default class TextEditor extends DesignEditor {
  // 组件的类型
  static designType = 'goods_recommend';

  // 组件的描述
  static designDescription = (
    <span className="weapp-design-components-new-label">个性化推荐</span>
  );

  static info = {
    icon: 'https://img.yzcdn.cn/public_files/2019/03/19/4e6faa805576c493d994bf7502f45f19.png',
    type: 'goods_recommend',
    sign: 'NEW',
    name: '个性化推荐',
    maxNum: 1,
    usedNum: 0,
    status: COM_STATUS.NORMAL,
    couldCreateCb: getRecommendAbility,
    disableText: '该组件需购买使用，请点击前往购买',
    disableLink: (
      <a href={linkUrl} className="disable-link" target="_blank" rel="noopener noreferrer">
        点击购买
      </a>
    ),
  };

  // 初始数据
  static getInitialValue({ settings = {} }) {
    return {
      type: 'goods_recommend',
      titleComponents: TITLE,
      goodsComponents: {
        ...GOODS,
        image_fill_style: settings.fillStyle || '1',
      },
    };
  }

  /**
   * 数据校验
   * @param {Object} value: 提交的数据对象，数据结构同初始化数据
   */
  static validate(value) {
    return new Promise(resolve => {
      const error = {};
      const { titleComponents, goodsComponents } = value;
      const { title } = titleComponents;
      const { countType, goods_number_v2: goodsNumberV2 } = goodsComponents;

      // 标题校验，不能为空，不能超过8个汉字
      if (!title) {
        error.title = '文本不能为空。';
      } else if (title.length > TITLE_MAX_NUM) {
        error.title = TITLE_MAX_NOTICE;
      }

      // 商品展示个数校验，不能为空，不能超过30
      if (countType === '0' && (!/^[0-9]*$/.test(goodsNumberV2) || goodsNumberV2 === '')) {
        error.goods_number_v2 = '请填写显示个数';
      } else if (goodsNumberV2 > 30) {
        error.goods_number_v2 = '每日对每个用户最多推荐30个商品';
      }

      resolve(error);
    });
  }

  // 字符和数值作一个转换，否则全等为false
  isValueEqual = (a, b) => {
    return +a === +b;
  };

  /**
   * 标题组件数据改变
   * @param {Object} e: 接收事件对象
   */
  onTitleCpDataChange = e => {
    const { name, value: val, checked } = e.target;
    const { onChange, value } = this.props;
    const { titleComponents } = value;
    titleComponents[name] = val;

    if (name === 'showTitleComponent') {
      titleComponents[name] = Utils.booleanToString(checked);
    }

    onChange({ titleComponents });
  };

  /* 重置背景颜色 */
  resetColor = () => {
    const { onChange, value } = this.props;
    const { titleComponents } = value;
    const defaults = TextEditor.getInitialValue({});
    titleComponents.backgroundColor = defaults.titleComponents.backgroundColor;

    onChange({ titleComponents });
  };

  onGoodsCustomInputChange = name => val => {
    const { onChange, value } = this.props;
    const { goodsComponents } = value;
    goodsComponents[name] = val;

    onChange({ goodsComponents });
  };
  /**
   * 商品组件数据改变（输入、单选）
   * @param {Object} e: 接收事件对象
   */
  onGoodsCpDataChange = e => {
    const { name, value: val } = e.target;
    const { onChange, value } = this.props;
    const { goodsComponents } = value;
    goodsComponents[name] = val;

    if (name === 'goods_number_v2' && val) {
      // 输入商品展示个数默认选择手动输入
      goodsComponents.countType = '0';
    }

    onChange({ goodsComponents });
  };

  /**
   * 商品组件数据改变（输入、单选）
   * @param {Object} e: 接收事件对象
   */
  onGoodsSourceChange = e => {
    const { name, value: val } = e.target;
    const { onChange, value } = this.props;
    const { titleComponents } = value;
    titleComponents[name] = val;
    titleComponents.title = SOURCE_MAP[val];

    onChange({ titleComponents });
  };

  /**
   * 商品组件数据改变（复选）
   * @param {Object} e: 接收事件对象
   */
  handleGoodsStyleChange = e => {
    const { name, checked } = e.target;
    const { onChange, value } = this.props;
    const { goodsComponents } = value;
    goodsComponents[name] = Utils.booleanToString(checked);

    onChange({ goodsComponents });
  };

  /**
   * 商品组件数据改变（数据）
   * @param {Object} data: 改变的数据对象
   */
  onGoodsDirectChange = data => {
    const { onChange, value } = this.props;
    const { goodsComponents } = value;

    onChange({
      goodsComponents: {
        ...goodsComponents,
        ...data,
      },
    });
  };

  // hook
  render() {
    const { value, validation, globalConfig, uploadConfig } = this.props;
    const { titleComponents, goodsComponents } = value;
    const {
      title,
      source = 0,
      showMethod,
      subTitle,
      backgroundColor,
      showTitleComponent = 1,
    } = titleComponents;
    const { title: titleErrorMsg, goods_number_v2: goodsNumberErrorMsg } = validation;

    const _showTitleComponent = Utils.numberToBoolean(showTitleComponent);

    const { countType, goods_number_v2: goodsNumber } = goodsComponents;
    return (
      <div className="rc-design-component-goods-recommend-editor">
        <ComponentTitle
          name="个性化推荐"
          noticeMsg={globalConfig.showDesignWeappNotice && WEAPP_NOT_SUPPORTED_MSG}
          withMargin
        />

        <ControlGroup label="标题名称" value={+showTitleComponent === 1 ? '显示' : '不显示'}>
          <Checkbox
            checked={_showTitleComponent}
            name="showTitleComponent"
            onChange={this.onTitleCpDataChange}
          />
        </ControlGroup>

        {/* 推荐位名字 */}
        {+showTitleComponent === 1 && (
          <ControlGroup
            label="推荐位标题"
            showError={!!titleErrorMsg}
            error={titleErrorMsg}
            bgColored
            block
          >
            <Input
              name="title"
              placeholder={TITLE_MAX_NOTICE}
              onChange={this.onTitleCpDataChange}
              value={title}
              onBlur={this.onTitleCpDataChange}
            />
          </ControlGroup>
        )}

        {/* 副标题 */}
        {+showTitleComponent === 1 && (
          <ControlGroup label="副标题" block bgColored>
            <Input
              name="subTitle"
              onChange={this.onTitleCpDataChange}
              value={subTitle}
              onBlur={this.onTitleCpDataChange}
            />
          </ControlGroup>
        )}

        <ControlGroup
          label={
            <p>
              <span className="goods-recommend__source-sign">推荐规则</span>
              <span className="goods-recommend__source-icon">
                <span className="goods-recommend__source-icon--scale">NEW</span>
              </span>
            </p>
          }
          block
          bgColored
          focusOnLabelClick={false}
        >
          <RadioGroup value={source} onChange={this.onGoodsSourceChange}>
            {SOURCE_LIST.map(item => {
              return (
                <Radio
                  className="goods-recommend__source-radio"
                  name="source"
                  key={item.value}
                  value={item.value}
                >
                  {item.title}
                  <Pop trigger="hover" position={item.position} content={item.tip}>
                    <Icon type="help-circle-o" />
                  </Pop>
                </Radio>
              );
            })}
          </RadioGroup>
        </ControlGroup>

        {+showTitleComponent === 1 && (
          <div className="rc-design-component-goods-recommend-editor__config-wrap">
            {/* 显示位置 */}
            <ControlGroup label="显示位置" value={ALIGN_TEXT[+showMethod]} bgColored>
              <RadioButton.Group value={showMethod} onChange={this.onTitleCpDataChange}>
                <RadioButton name="showMethod" value="0" icon="align-left" tip="左对齐" />
                <RadioButton name="showMethod" value="1" icon="align-center" tip="居中" />
                <RadioButton name="showMethod" value="2" icon="align-right" tip="右对齐" />
              </RadioButton.Group>
            </ControlGroup>

            {/* 背景颜色 */}
            <ControlGroup
              label="背景颜色"
              focusOnLabelClick={false}
              value={backgroundColor}
              bgColored
            >
              <span className="goods-recommend__link-style" onClick={() => this.resetColor()}>
                重置
              </span>
              <ColorPicker
                color={backgroundColor}
                onChange={val =>
                  this.onTitleCpDataChange({ target: { name: 'backgroundColor', value: val } })
                }
              />
            </ControlGroup>
          </div>
        )}
        {/* 以上是标题组件的配置 */}
        <Divider />
        {/* 以下是商品组件的配置 */}
        {/* 显示个数 */}
        <ControlGroup
          className="goods-recommend-show-count-wrapper"
          label="显示个数"
          focusOnLabelClick={false}
          showError={!!goodsNumberErrorMsg}
          error={goodsNumberErrorMsg}
        >
          <RadioGroup value={countType} onChange={this.onGoodsCpDataChange}>
            <Radio className="goods-recommend-count-radio-text" name="countType" value="1">
              全部
              <Pop trigger="hover" content="每日对每个用户最多推荐30个商品">
                <Icon type="help-circle-o" />
              </Pop>
            </Radio>

            <Radio className="goods-recommend-count-input-wrapper" name="countType" value="0">
              <Input
                name="goods_number_v2"
                value={goodsNumber}
                onChange={this.onGoodsCpDataChange}
                onBlur={this.onGoodsCpDataChange}
              />
            </Radio>
          </RadioGroup>
        </ControlGroup>

        <Divider />

        {/* 公共布局逻辑 */}
        <GoodsStyleEditor
          globalConfig={globalConfig}
          uploadConfig={uploadConfig}
          value={goodsComponents}
          onInputChange={this.onGoodsCpDataChange}
          onChange={this.onGoodsDirectChange}
        />
      </div>
    );
  }
}
