// 搜索组件优化
import React from 'react';

import get from 'lodash/get';

import { Input, Dialog, Button, Checkbox, Slider } from 'zent';
import { ControlGroup, Control, EditorCard, ComponentTitle, ColorPicker, Divider } from '../common';

import { DesignEditor } from '../editor-base/design-editor';

import { booleanToString, numberToBoolean } from '../common/utils';
import { searchDemoDialogId, MAX_LENGTH, COLOR } from './constants';

import './style.scss';

const { openDialog, closeDialog } = Dialog;

// 当前模板是否为顶部导航模板
let IS_TOP_NAV_TEMPLATE = false;

export default class SearchEditor extends DesignEditor {
  // hook
  componentDidMount() {
    // 刷新数据结构
    const {
      value: { hot_search_keys: _hotSearchKeys = [] },
    } = this.props;

    if (
      _hotSearchKeys.length > 0 &&
      _hotSearchKeys[0].text &&
      _hotSearchKeys[0].text.trim() !== ''
    ) {
      const hotSearchKeys = this.convertData(_hotSearchKeys);
      this.onCustomInputChange('hot_search_keys_new')(hotSearchKeys);
    }
  }

  /**
   * 显示示例弹窗
   */
  showDemoDialog = () => {
    openDialog({
      dialogId: searchDemoDialogId,
      title: '查看示例',
      children: (
        <div style={{ textAlign: 'center' }}>
          <img
            src="https://img.yzcdn.cn/public_files/2018/04/09/c082850a5eb10919363b83751e044a8a.png"
            alt=""
            width="280px"
          />
        </div>
      ),
      footer: (
        <Button type="primary" onClick={() => closeDialog(searchDemoDialogId)}>
          我知道了
        </Button>
      ),
    });
  };

  /**
   * 搜索输入框值改变
   * @param {Object} e: 接收事件对象
   * @param {Number} index: 序号
   */
  handleInputChange = (e, index) => {
    const {
      value: { hot_search_keys_new: _hotSearchKeys = [] },
    } = this.props;
    const hotSearchKeys = this.convertData(_hotSearchKeys);

    const text = e.target.value || '';
    hotSearchKeys[index].text = text;

    this.onCustomInputChange('hot_search_keys_new')(hotSearchKeys);
    this.supportOldConstructorData(hotSearchKeys);
  };

  /**
   * 点击添加热词，新增一个展示区
   */
  handleAddItem = () => {
    const {
      value: { hot_search_keys_new: _hotSearchKeys = [] },
    } = this.props;
    const hotSearchKeys = this.convertData(_hotSearchKeys);

    hotSearchKeys.push({
      text: '',
    });

    this.onCustomInputChange('hot_search_keys_new')(hotSearchKeys);
  };

  /**
   * 编辑区值改变
   */
  handleChange = list => {
    // this.supportOldConstructorData(list);
    const result = list.map(item => {
      if (typeof item !== 'string') {
        return item.text || '';
      }

      return item;
    });

    this.props.onChange({
      hot_search_keys_new: list,
      hot_search_keys: result,
    });
    this.setMetaProperty('hot_search_keys_new', 'dirty');
  };

  /**
   * 转成老的数据结构透传
   * @param {Array} data: 需要转换的数据[{text: 1}, ...]
   */
  supportOldConstructorData = (data = []) => {
    if (data.length > 0) {
      const result = data.map(item => {
        if (typeof item !== 'string') {
          return item.text || '';
        }

        return item;
      });

      this.props.onChange({
        hot_search_keys: result,
      });
      this.setMetaProperty('hot_search_keys', 'dirty');
    }
  };

  /**
   * 数据格式转化，数组string元素转成object
   * @param {Array} data: 需要转换的对象
   */
  convertData = (data = []) => {
    if (data.length > 0) {
      return data.map(item => {
        if (typeof item === 'string') {
          return {
            text: item,
          };
        }

        return item;
      });
    }

    return data;
  };

  /**
   * 选择是否隐藏搜索组件
   * @param {Object} e: 接收事件对象
   */
  handleCheckboxChange = e => {
    const { name, checked } = e.target;

    this.props.onChange({
      [name]: booleanToString(!checked),
    });
    this.setMetaProperty(name, 'dirty');
  };

  // hook
  render() {
    const { value, showError, validation } = this.props;
    const {
      color,
      hot_search_keys_new: _hotSearchKeys = [],
      position_type: positionType = '0',
      position_show_method: positionShowMethod = '0',
      border_style_method: borderStyleMethod = '0',
      border_style_color: borderStyleColor = COLOR.border,
      border_style_height: borderStyleHeight = 40,
      text_color: textColor = COLOR.text,
      text_align_method: textAlignMethod = '0',
      show_search_component: _showSearchComponent = IS_TOP_NAV_TEMPLATE ? '0' : '1',
    } = value;

    // 当前模板是否为顶部导航模板
    IS_TOP_NAV_TEMPLATE = get(_global, 'is_top_nav_template', false);
    const hotSearchKeys = this.convertData(_hotSearchKeys);
    const showSearchComponent = !numberToBoolean(_showSearchComponent);

    return (
      <div className="rc-design-component-search-editor">
        <ComponentTitle name="商品搜索" />

        {/* 搜索热词 */}
        <ControlGroup label="搜索热词" labelColored block>
          <p className="search-component-editor-card-tip">
            鼠标拖拽调整热词顺序，搜索框默认展示第一个热词，其他搜索词将以标签形式显示在搜索页中
            <a
              href="javascript:void(0)"
              onClick={this.showDemoDialog}
              className="search-component-editor-card-tip-link"
            >
              &nbsp;查看示例
            </a>
          </p>
        </ControlGroup>
        <ControlGroup showLabel={false} block bgColored>
          <EditorCard
            list={hotSearchKeys}
            canDelete
            canAdd={hotSearchKeys.length < MAX_LENGTH}
            addText="添加热词"
            onChange={this.handleChange}
            onAdd={this.handleAddItem}
          >
            {hotSearchKeys.map((item, index) => {
              const error = validation.hot_search_keys_new && validation.hot_search_keys_new[index];
              // const _showError = !!error;
              return (
                <ControlGroup
                  showError={showError}
                  key={index}
                  showLabel={false}
                  error={error}
                  block
                >
                  <Input
                    name="title"
                    value={item.text}
                    placeholder="最多15个字"
                    maxLength={15}
                    onChange={e => this.handleInputChange(e, index)}
                  />
                </ControlGroup>
              );
            })}
          </EditorCard>
        </ControlGroup>

        <Divider />

        {/* 搜索位置 */}
        <Control
          label="显示位置"
          valueMap={{
            0: '正常模式',
            1: '滚动至顶部固定',
          }}
          name="position_type"
          options={[
            { value: '0', icon: 'search-normal' },
            { value: '1', icon: 'search-sticky' },
          ]}
          value={positionType}
          onChange={this.onInputChange}
        />
        {/* 展示模式 */}
        {positionType === '1' && (
          <Control
            label="展示模式"
            valueMap={{
              0: '常驻模式',
              1: '上滑消失下滑出现',
            }}
            name="position_show_method"
            options={[
              { value: '0', icon: 'search-fixed' },
              { value: '1', icon: 'search-scroll' },
            ]}
            value={positionShowMethod}
            onChange={this.onInputChange}
          />
        )}
        {/* 框体样式 */}
        <Control
          label="框体样式"
          valueMap={{
            0: '方形',
            1: '圆形',
          }}
          name="border_style_method"
          options={[{ value: '0', icon: 'search-square' }, { value: '1', icon: 'search-round' }]}
          value={borderStyleMethod}
          onChange={this.onInputChange}
        />

        {/* 文本位置 */}
        <Control
          label="文本位置"
          valueMap={{
            0: '居左',
            1: '居中',
          }}
          name="text_align_method"
          options={[{ value: '0', icon: 'align-left' }, { value: '1', icon: 'align-center' }]}
          value={textAlignMethod}
          onChange={this.onInputChange}
        />

        <ControlGroup label="框体高度" normalAlign>
          <Slider
            min={28}
            max={40}
            value={Number(borderStyleHeight)}
            onChange={this.onCustomInputChange('border_style_height')}
          />
        </ControlGroup>
        {/* 背景颜色 */}
        <ControlGroup label="背景颜色" showError={showError} error={validation.color}>
          <ColorPicker
            defaultColor={COLOR.background}
            color={color}
            onChange={this.onCustomInputChange('color')}
          />
        </ControlGroup>

        {/* 框体颜色 */}
        <ControlGroup label="框体颜色" showError={showError} error={validation.border_style_color}>
          <ColorPicker
            defaultColor={COLOR.border}
            color={borderStyleColor}
            onChange={this.onCustomInputChange('border_style_color')}
          />
        </ControlGroup>

        {/* 文本颜色 */}
        <ControlGroup label="文本颜色" showError={showError} error={validation.text_color}>
          <ColorPicker
            defaultColor={COLOR.text}
            color={textColor}
            onChange={this.onCustomInputChange('text_color')}
          />
        </ControlGroup>

        {IS_TOP_NAV_TEMPLATE && (
          <div>
            <ControlGroup label="更多设置" />
            <ControlGroup label="隐藏搜索组件">
              <Checkbox
                checked={showSearchComponent}
                name="show_search_component"
                onChange={this.handleCheckboxChange}
              />
            </ControlGroup>
            <ControlGroup>
              <p className="search-component-editor-card-tip">勾选后手机端将不显示搜索组件</p>
            </ControlGroup>
          </div>
        )}
      </div>
    );
  }

  // 类型
  static type = 'search';

  // 初始数据
  static getInitialValue() {
    return {
      color: COLOR.background, // 背景颜色，兼容之前的代码
      hot_search_keys: [], // 热门搜索词
      hot_search_keys_new: [],
      // 新加字段
      position_type: '0', // 搜索位置，0:正常模式 1:滚动至顶部固定
      position_show_method: '0', // 展示模式，0:常驻模式 1:上滑消失下滑出现
      border_style_method: '0', // 框体样式，0:方形 1:圆形
      border_style_color: COLOR.border, // 框体颜色
      text_color: COLOR.text, // 文本颜色
      text_align_method: '0', // 文本位置，0:居左 1:居中
      show_search_component: '1', // 展示搜索组件，0:隐藏 1:展示
      border_style_height: 40, // 框体高度 默认40
      type: 'search',
    };
  }

  // 校验
  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { hot_search_keys_new: hotSearchKeys = [] } = value;

      const errorsObj = {};
      let errorNum = 0;
      for (let i = 0; i < hotSearchKeys.length; i++) {
        const str = hotSearchKeys[i].text;
        if (!str || str.trim() === '') {
          errorsObj[i] = '请输入搜索热词';
          errorNum += 1;
        }
      }

      if (errorNum > 0) errors.hot_search_keys_new = errorsObj;
      resolve(errors);
    });
  }

  static info = {
    icon: ' https://img.yzcdn.cn/public_files/2019/02/12/a41dd5cfb7dd0cf236ebc3ffefe90585.png',
    type: 'search',
    name: '商品搜索',
    description: '商品搜索',
    maxNum: 2,
    usedNum: 0,
    status: '',
  };
}
