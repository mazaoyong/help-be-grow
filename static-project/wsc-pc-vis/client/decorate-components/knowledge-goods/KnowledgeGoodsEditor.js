import React from 'react';
import { Input, NumberInput, Radio, Checkbox, Slider, Notify } from 'zent';
import unionBy from 'lodash/unionBy';
import includes from 'lodash/includes';
// import omit from 'lodash/omit';
import { DesignEditor } from '../editor-base/design-editor';

import { ComponentTitle, ControlGroup, RadioButton, EditorCard, Divider, Control } from '../common';

import dialog from './components/dialog';
// import KnowledgeItem from './components/knowledge-item';
import { filterOmitKeys } from '../utils/edu-utils';

import * as Types from './types.js';
import * as Enums from './enums.js';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

function isEventLikeObject(evt) {
  return evt && evt.target && evt.target.name && evt.preventDefault && evt.stopPropagation;
}

function transEnum2List(obj) {
  return Object.entries(obj)
    .map(([key, value]) => ({
      ...value,
      key,
    }))
    .sort((x, y) => x.index - y.index);
}

/**
 * @name pc端知识商品组件编辑器
 * @description 对知识商品组件进行标题、规则和展示样式的配置
 * @author 蒙多<yanglifeng>
 * @extends DesignEditor 微页面编辑组件实现参考<https://youzan.github.io/zent/zh/component/design>
 */
export default class KnowledgeGoodsEditor extends DesignEditor {
  static designType = Types.key;
  static designDescription = <span>课程</span>;
  static info = {
    type: 'knowledge-goods',
    icon: 'https://img.yzcdn.cn/public_files/2019/06/18/5c2fd869d4d59647e251936a8edf75c9.png',
    name: '课程',
    description: '课程',
    maxNum: 10,
    usedNum: 0,
    status: '',
  };
  /**
   * 添加组件时默认调用，用来获取新组件的初始值
   * 把整个组件封装为一个对象，方便操作（一次性操作两次props.onChange会不生效，shuai框架的坑？）
   * @param {*} settings
   * @param {*} globalConfig
   */
  static getInitialValue(settings, globalConfig) {
    const { isYZEdu = false } = window._global;
    const goodsFrom = isYZEdu ? Types.course : Types.content;
    return {
      knowledgeGoodsData: {
        goodsFrom, // 商品来源
        title: '课程', // 标题
        showAllGoodsEntry: true, // 是否显示全部入口
        displayTitleBar: 1, // 是否显示标题栏
        goodsFromMode: 0, // 选择展示最新或自定义商品
        maxNewestGoods: 6, // 展示最新的N个最新商品
        listMode: 0, // 列表样式
        goodList: [], // 商品列表
        pageMargin: 15, // 页面边距
        goodsPadding: 10, // 商品间距
        goodsStyle: 0, // 商品样式
        goodsRadius: 0, // 商品倒角
        imgSize: 0, // 图片填充
        textStyle: 1, // 文本样式
        textAlign: 0, // 文本对齐
        displayContent: Enums.defaultChecked[goodsFrom], // 显示内容
      },
      type: 'knowledge-goods',
    };
  }

  /**
   * 组件校验
   * @param {*} value
   */
  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { title, maxNewestGoods, goodsFromMode } = value.knowledgeGoodsData;

      if (title.length > 20 || title.length < 1) {
        errors.title = '请重新输入标题名称，1～20个字，必填';
      }

      if (typeof maxNewestGoods !== 'number' && goodsFromMode === 0) {
        errors.title = '展示最新的商品个数输入有误，请重新输入1~20的数字';
      }

      resolve(errors);
    });
  }

  /**
   * 渲染模板
   */
  render() {
    const { props } = this;
    const { value = {} } = props;
    const { knowledgeGoodsData = {} } = value;
    const { isYZEdu = false } = window._global;
    const {
      goodsFrom,
      title,
      showAllGoodsEntry,
      displayTitleBar,
      goodsFromMode,
      maxNewestGoods,
      listMode,
      goodList,
    } = knowledgeGoodsData;

    /**
     * 渲染radio选项
     * @param {String} name
     * @param {Array} list
     */
    const renderRadioList = (name, list) =>
      list.map(({ label, value }) => {
        return (
          <RadioButton name={name} key={label} value={value}>
            {label}
          </RadioButton>
        );
      });

    /**
     * 渲染checkbox选项
     */
    const renderCheckboxList = (name, list) =>
      list.map(({ label, value }) => {
        return (
          <ControlGroup
            label={label}
            key={label}
            value={includes(knowledgeGoodsData[name], value) ? '显示' : '不显示'}
          >
            <Checkbox name={name} value={value} />
          </ControlGroup>
        );
      });

    /**
     * 渲染标题配置
     */
    const renderTitleBarBlock = () => {
      return (
        <div className="controls-card title-bar">
          <ControlGroup label="标题名称" block bgColored>
            <Input
              name="title"
              value={title}
              onChange={this.onChangeVal}
              onBlur={this.onChangeVal}
            />
          </ControlGroup>
          <ControlGroup
            label="查看全部按钮"
            value={showAllGoodsEntry ? '显示' : '不显示'}
            bgColored
          >
            <Checkbox
              name="showAllGoodsEntry"
              checked={showAllGoodsEntry}
              onChange={this.onChangeVal}
            />
          </ControlGroup>
        </div>
      );
    };

    /**
     * 渲染商品来源配置
     */
    const renderGoodsFromBlock = () => {
      const { knowledgeGoodsData } = this.props.value || {};
      const { goodsFrom } = knowledgeGoodsData;

      return (
        <div className={`controls-card goods-from-mode`}>
          <ControlGroup
            label="选择方式"
            helpDesc={
              goodsFromMode === 1
                ? `最多添加${Types.maxCanAddGoods}个商品，拖动选中的商品可对其排序`
                : ''
            }
          >
            <RadioGroup value={goodsFromMode} onChange={this.onChangeGoodsFromMode}>
              <Radio name="goodsFromMode" value={0}>
                展示最新的
                <NumberInput
                  name="maxNewestGoods"
                  min={1}
                  max={Types.maxVisibleGoods}
                  value={maxNewestGoods}
                  onChange={val => this.onNumberInputChangeVal('maxNewestGoods', val)}
                />
                个商品
              </Radio>
              <Radio name="goodsFromMode" value={1}>
                自定义
              </Radio>
            </RadioGroup>
          </ControlGroup>
          {goodsFromMode === 1 && (
            <ControlGroup showLabel={false} bgColored>
              <EditorCard
                canDelete
                addText="添加"
                list={goodList}
                canAdd={goodList.length < Types.maxCanAddGoods}
                onChange={this.onChangeGoods}
                onAdd={this.onChooseGoods}
              >
                {goodList.map(item => {
                  return (
                    <div key={item.alias} className="subentry-item">
                      <i className="icon-drag" />
                      {Enums.goodsFrom[goodsFrom].label}：
                      <a
                        href={item.url || item.shortenUrl || item.liveDetailUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.title}
                      </a>
                    </div>
                  );
                })}
              </EditorCard>
            </ControlGroup>
          )}
        </div>
      );
    };

    /**
     * 渲染列表样式配置
     */
    const renderListModeBlock = () => {
      return (
        <div className="controls-card__style">
          {transEnum2List(Enums.styleControl).map(item => {
            const { label, items, formType, key } = item;
            if (formType === Types.slider) {
              return (
                <ControlGroup label={label} key={key} normalAlign>
                  <Slider
                    min={0}
                    max={30}
                    value={knowledgeGoodsData[key]}
                    onChange={val => this.onChangeCustomVal(key)(val)}
                  />
                </ControlGroup>
              );
            }
            if (formType === Types.checkbox) {
              return (
                <div key={key}>
                  <Divider />
                  {renderFormItem(item)}
                </div>
              );
            }
            if (formType === Types.radio) {
              if (key === 'goodsStyle') {
                return (
                  <ControlGroup key={key} label={label} block>
                    {renderFormItem(item)}
                  </ControlGroup>
                );
              }

              const _valueMap = {};
              const _options = [];
              items.forEach(optionItem => {
                _valueMap[optionItem.value] = optionItem.label;
                _options.push({
                  value: optionItem.value,
                  icon: optionItem.icon,
                });
              });
              return (
                <Control
                  key={key}
                  label={label}
                  valueMap={_valueMap}
                  name="textAlign"
                  options={_options}
                  value={knowledgeGoodsData[key]}
                  onChange={e => {
                    this.onChangeCustomVal(key)(e.target.value);
                  }}
                />
              );
            }
          })}
        </div>
      );
    };

    /**
     * 渲染列表样式单个配置项
     */
    const renderFormItem = formItem => {
      let vDom = null;
      const { key, formType } = formItem;

      if (formType === Types.slider) {
        vDom = (
          <div className="slider-wrapper">
            <Slider
              key={key}
              min={0}
              max={30}
              withInput={false}
              value={knowledgeGoodsData[key]}
              onChange={val => {
                this.onChangeCustomVal(key)(val);
              }}
            />
            <span>{knowledgeGoodsData[key]} 像素</span>
          </div>
        );
      }

      if (formType === Types.radio) {
        vDom = (
          <RadioButton.Group
            value={knowledgeGoodsData[key]}
            onChange={e => {
              this.onChangeCustomVal(key)(e.target.value);
            }}
          >
            {renderRadioList(key, formItem.items)}
          </RadioButton.Group>
        );
      }

      if (formType === Types.checkbox) {
        const items = key === Types.displayContent ? formItem.items[goodsFrom] : formItem.items;
        vDom = (
          <CheckboxGroup
            value={knowledgeGoodsData[key]}
            onChange={val => {
              this.onChangeCustomVal(key)(val);
            }}
          >
            {renderCheckboxList(key, items)}
          </CheckboxGroup>
        );
      }

      return vDom;
    };

    return (
      <div className={`rc-design-component-${Types.key}-editor`}>
        <ComponentTitle
          name={Types.label}
          noticeMsg={isYZEdu ? Types.tipsMsg : Types.tipsMsgWithoutCourse}
          url={Types.titleUrl}
        />

        <ControlGroup
          className="title-bar"
          label="标题栏"
          value={displayTitleBar ? '显示' : '不显示'}
        >
          <Checkbox name="displayTitleBar" checked={displayTitleBar} onChange={this.onChangeVal} />
        </ControlGroup>

        {displayTitleBar === 1 && renderTitleBarBlock()}

        <Divider />

        <Control
          label="课程来源"
          valueMap={{
            course: '线下课',
            content: '内容',
            column: '专栏',
            live: '直播',
          }}
          name="goodsFrom"
          options={
            isYZEdu
              ? [
                  { value: 'course', key: 'xianxiake', icon: 'xianxiake' },
                  { value: 'column', key: 'zhuanlan', icon: 'zhuanlan' },
                  { value: 'content', key: 'neirong', icon: 'neirong' },
                  { value: 'live', key: 'zhibo', icon: 'zhibo' },
                ]
              : [
                  { value: 'column', key: 'zhuanlan', icon: 'zhuanlan' },
                  { value: 'content', key: 'neirong', icon: 'neirong' },
                  { value: 'live', key: 'zhibo', icon: 'zhibo' },
                ]
          }
          value={goodsFrom}
          onChange={this.onChangeGoodsFrom}
        />

        {renderGoodsFromBlock()}

        <Divider />

        {/* <ControlGroup label="列表样式">
          <RadioGroup value={listMode} onChange={this.onChangeListMode}>
            {renderRadioList('listMode', transEnum2List(Enums.listMode))}
          </RadioGroup>
        </ControlGroup> */}

        <Control
          label="列表样式"
          block
          valueMap={{
            0: '大图模式',
            1: '一行两个',
            2: '一行三个',
            3: '详细列表',
            4: '一大两小',
            5: '横向滑动',
          }}
          name="listMode"
          options={[
            { value: 0, icon: 'big' },
            { value: 1, icon: 'small' },
            { value: 2, icon: 'three' },
            { value: 3, icon: 'list' },
            { value: 4, icon: 'hybrid' },
            { value: 5, icon: 'swipe' },
          ]}
          value={listMode}
          componentProps={{ block: true }}
          onChange={this.onChangeListMode}
        />

        <Divider />

        {renderListModeBlock()}
      </div>
    );
  }

  /**
   * 更新商品来源，同时清空选择商品的列表
   */
  onChangeGoodsFrom = e => {
    const { onChange } = this.props;
    const goodsFrom = e.target.value;
    onChange({
      knowledgeGoodsData: {
        ...this.props.value.knowledgeGoodsData,
        goodsFrom,
        goodList: [],
        displayContent: Enums.defaultChecked[goodsFrom],
      },
    });
  };

  /**
   * 修改选择方式，同时清空选择商品的列表
   */
  onChangeGoodsFromMode = e => {
    const { onChange } = this.props;
    onChange({
      knowledgeGoodsData: {
        ...this.props.value.knowledgeGoodsData,
        goodsFromMode: e.target.value,
        goodList: [],
      },
    });
  };

  /**
   * 修改列表样式
   */
  onChangeListMode = e => {
    this.onChangeCustomVal('listMode')(e.target.value);
  };

  /**
   * 从弹窗中添加商品
   */
  onChooseGoods = e => {
    const { globalConfig, value } = this.props;
    const { knowledgeGoodsData } = value;
    const { goodsFrom } = knowledgeGoodsData;
    const self = this;
    const options = {
      config: globalConfig,
      multiple: true,
      onChoose: list => {
        let { goodList } = knowledgeGoodsData;
        goodList = this.handleMaxNumGoods(unionBy(goodList, list, 'alias'));
        goodList = filterOmitKeys(goodList);
        self.onChangeCustomVal('goodList')(goodList);
      },
    };

    dialog(options)(goodsFrom);
  };

  /**
   * 最大商品数量限制
   */
  handleMaxNumGoods = list => {
    let remainList = list;
    const { length } = list;
    const { maxCanAddGoods } = Types;
    if (length > maxCanAddGoods) {
      remainList = list.slice(0, maxCanAddGoods);
      Notify.error(`最多添加${maxCanAddGoods}个商品，其余${length - maxCanAddGoods}个商品添加失败`);
    }
    return remainList;
  };

  /**
   * 修改选择商品
   */
  onChangeGoods = list => {
    this.onChangeCustomVal('goodList')(list);
  };

  /**
   * 通用表单元素onChange回调
   */
  onChangeVal = e => {
    if (!isEventLikeObject(e)) {
      throw new Error(Types.notEventMsg);
    }

    const { onChange } = this.props;
    const { target } = e;
    const { name, type } = target;
    let { value } = target;

    if (type === 'checkbox') {
      value = target.checked ? 1 : 0;
    }

    if (name === 'showAllGoodsEntry') {
      value = target.checked;
    }

    onChange({
      knowledgeGoodsData: {
        ...this.props.value.knowledgeGoodsData,
        [name]: value,
      },
    });
  };

  onNumberInputChangeVal = (name, value) => {
    const { onChange } = this.props;
    onChange({
      knowledgeGoodsData: {
        ...this.props.value.knowledgeGoodsData,
        [name]: value,
      },
    });
  };

  /**
   * 自定义单值修改
   */
  onChangeCustomVal = name => value => {
    const { onChange } = this.props;
    onChange({
      knowledgeGoodsData: {
        ...this.props.value.knowledgeGoodsData,
        [name]: value,
      },
    });
  };
}
