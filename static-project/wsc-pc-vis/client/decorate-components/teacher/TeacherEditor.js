/* eslint-disable */
import React from 'react';
import {
  Radio,
  Checkbox,
  Slider,
  Notify,
} from 'zent';
import unionBy from 'lodash/unionBy';
import { DesignEditor } from '../editor-base/design-editor';
import { ComponentTitle, ControlGroup, EditorCard, Control, Divider, RadioButton } from '../common';

import { transEnum2List, isEventLikeObject }from '../common/utils';

import dialog from './components/dialog';
import TeacherItem from './components/teacher-item';
import * as Helper from './helper';

import * as Enums from './enums';
import * as Types from './types';
import './style/index.scss';

const RadioGroup = Radio.Group;

/**
 * @name pc端老师组件编辑器
 * @description 对老师组件进行标题、规则和展示样式的配置
 * @author 蒙多<yanglifeng>
 * @extends DesignEditor 微页面编辑组件实现参考<https://youzan.github.io/zent/zh/component/design>
 */
export default class TeacherEditor extends DesignEditor {

  static info = {
    type: 'teacher',
    name: '老师',
    description: '老师',
    icon: 'https://img.yzcdn.cn/public_files/2019/07/02/5050f39510f6d82a2bdef1cf3e4ae82a.png',
    maxNum: 50,
    usedNum: 0,
    status: '',
  };

  /**
   * 添加组件时默认调用，用来获取新组件的初始值
   * 把整个组件封装为一个对象，方便操作
   * （一次性操作两次props.onChange会不生效，shuai框架的坑？）
   * @param {*} settings
   * @param {*} globalConfig
   */
  static getInitialValue(settings, globalConfig) {
    return {
      type: 'teacher',
      teacherData: {
        pickTeacher: 0, // 选择老师
        listMode: 0, // 列表样式
        pageMargin: 15, // 页面边距
        goodsPadding: 10, // 人物间距
        avatarPos: 0, // 头像位置
        avatarShape: 1, // 头像形状
        goodsRadius: 0, // 商品倒角
        cardStyle: 0, // 商品样式
        imgSize: 0, // 图片填充
        textStyle: 1, // 文本样式
        textAlign: 0, // 文本对齐
        displayContent: [0, 1, 2], // 显示内容
        teacherList: [], // 老师列表
      }
    };
  }

  /**
   * 组件校验
   * @param {*} value
   */
  static validate(value) {
    return new Promise(resolve => resolve());
  }

  /**
   * 渲染模板
   */
  render() {
    const { teacherData } = this.props.value;
    const {
      pickTeacher,
      listMode,
      pageMargin,
      goodsPadding,
      avatarPos,
      avatarShape,
      goodsRadius,
      cardStyle,
      imgSize,
      textStyle,
      textAlign,
      displayContent,
      teacherList,
    } = teacherData;

    /**
     * 渲染radio选项
     * @param {String} name
     * @param {Array} list
     */
    const renderRadioList = (name, list) => list.map(({ label, value }) => {
      return (
        <Radio
          name={name}
          key={label}
          value={value}>
          {label}
        </Radio>
      );
    });

    /**
     * 渲染老师来源配置
     */
    const renderPickTeacherBlock = () => {

      return (
        <ControlGroup
          className={`rc-design-component-${Types.key}-editor__list`}
          showLabel={false}
          bgColored
        >
          <EditorCard
            canDelete
            addText="添加老师"
            list={teacherList}
            canAdd={teacherList.length < Types.maxCanAddGoods}
            onChange={this.onChangeGoods}
            onAdd={this.onChooseGoods}>
            {teacherList.map((item, index )=> {
              return <TeacherItem key={item.id} onDelete={_ =>this.onDeleteTeacherItem(index)} {...item}/>;
            })}
          </EditorCard>
        </ControlGroup>
      );
    };

    /**
     * 渲染布局配置
     */
    const renderLayoutBlock = () => {
      return (
        <Control
          label="列表样式"
          block
          valueMap={{
            0: '一行两个',
            1: '一行三个',
            2: '详细列表',
            3: '横向滑动',
          }}
          name="size"
          options={[
            { value: 0, icon: 'small' },
            { value: 1, icon: 'three' },
            { value: 2, icon: 'list' },
            { value: 3, icon: 'swipe' },
          ]}
          value={listMode}
          componentProps={{ block: true }}
          onChange={this.onChangeListMode}
        />
      )
    }


    return (
      <div className={`rc-design-component-${Types.key}-editor`}>
        <ComponentTitle
          name={Types.label}
          noticeMsg={Types.tipsMsg}
          url={Types.titleUrl}
        />

        <ControlGroup
          label="选择老师："
          labelAlign={Types.labelAlign}
          helpDesc={pickTeacher === 0
            ? `最多添加${Types.maxCanAddGoods}个老师，拖动选中的老师可对其排序`
            : ''
          }>
          <RadioGroup value={pickTeacher} onChange={this.onChangePickTeacher}>
            {renderRadioList('pickTeacher', transEnum2List(Enums.pickTeacher))}
          </RadioGroup>
        </ControlGroup>

        {pickTeacher === 0 && renderPickTeacherBlock()}
        <div className="first-group"></div>
        <Divider />
        {renderLayoutBlock()}
        <Divider />
        <ControlGroup
          className={`rc-design-component-${Types.key}-editor__size-type`}
          label="人物样式"
          block
        >
          <RadioButton.Group value={cardStyle} onChange={e=>this.onChangeCustomVal('cardStyle')(e.target.value)} perLine={4}>
            <RadioButton name="size_type" value="0">
              无边白底
            </RadioButton>
            <RadioButton name="size_type" value="1">
              卡片投影
            </RadioButton>
            <RadioButton name="size_type" value="2">
              描边白底
            </RadioButton>
            <RadioButton name="size_type" value="3">
              无边透明
            </RadioButton>
          </RadioButton.Group>
        </ControlGroup>
        <Control
          label="头像形状"
          valueMap={{
            0: '圆形',
            1: '正方形',
          }}
          name="avatarShape"
          options={[{ value: 1, icon: 'avatar-shape1' }, { value: 0, icon: 'avatar-shape2' }]}
          value={avatarShape}
          onChange={this.onChangeVal}
        />
        <Control
          label="商品倒角"
          valueMap={{
            0: '直角',
            1: '圆角',
          }}
          name="goodsRadius"
          options={[{ value: 0, icon: 'corner-straight' }, { value: 1, icon: 'corner-round' }]}
          value={goodsRadius}
          onChange={this.onChangeVal}
        />
        <Control
          label="图片填充"
          valueMap={{
            0: '填充',
            1: '周边留白',
          }}
          name="imgSize"
          options={[{ value: 0, icon: 'img-cover' }, { value: 1, icon: 'img-contain' }]}
          value={imgSize}
          onChange={this.onChangeVal}
        />
        <Control
          label="文本样式"
          valueMap={{
            1: '常规体',
            0: '加粗体',
          }}
          name="textStyle"
          options={[ { value: 1, icon: 'font-regular' }, { value: 0, icon: 'font-bold' } ]}
          value={textStyle}
          onChange={this.onChangeVal}
        />
        <Control
          label="文本对齐"
          valueMap={{
            0: '左对齐',
            1: '居中对齐',
          }}
          name="textAlign"
          options={[
            { value: 0, icon: 'align-left' },
            { value: 1, icon: 'align-center'},
          ]}
          value={textAlign}
          onChange={this.onChangeVal}
        />
        <ControlGroup label="页面边距" normalAlign>
          <Slider
            min={0}
            max={30}
            value={Number(pageMargin)}
            onChange={this.onChangeCustomVal('pageMargin')}
          />
        </ControlGroup>
        <ControlGroup label="人物间距" normalAlign>
          <Slider
            min={0}
            max={30}
            value={Number(goodsPadding)}
            onChange={this.onChangeCustomVal('goodsPadding')}
          />
        </ControlGroup>

        <Divider />

        <ControlGroup label="老师名称" value={Helper.getCheckBoxValue(displayContent, 0)}>
          <Checkbox
            checked={Helper.getCheckBoxState(displayContent, 0)}
            onChange={this.onChangeDisplay(displayContent, 0)}
          />
        </ControlGroup>
        <ControlGroup label="职位描述" value={Helper.getCheckBoxValue(displayContent, 1)}>
          <Checkbox
            checked={Helper.getCheckBoxState(displayContent, 1)}
            onChange={this.onChangeDisplay(displayContent, 1)}
          />
        </ControlGroup>
        <ControlGroup label="老师简介" value={Helper.getCheckBoxValue(displayContent, 2)}>
          <Checkbox
            checked={Helper.getCheckBoxState(displayContent, 2)}
            onChange={this.onChangeDisplay(displayContent, 2)}
          />
        </ControlGroup>
      </div>
    );
  }

  /**
   * 删除每个老师item
   */
  onDeleteTeacherItem = (index) => {
    const { teacherData } = this.props.value
    const { onChange } = this.props;
    onChange({
      teacherData: {
        ...teacherData,
        teacherList: teacherData.teacherList.splice(index, 1)
      }
    })
  }

  /**
   * 修改选择老师类型
   */
  onChangePickTeacher = e => {
    const { onChange } = this.props;
    onChange({
      teacherData: {
        ...this.props.value.teacherData,
        pickTeacher: e.target.value,
        teacherList: []
      }
    });
  }

  /**
   * 修改列表样式
   */
  onChangeListMode = e => {
    this.onChangeCustomVal('listMode')(e.target.value);
  }

  /**
   * 从弹窗中添加老师
   */
  onChooseGoods = e => {
    const { globalConfig, value } = this.props;
    const { teacherData }  = value;
    const self = this;
    const options = {
      config: globalConfig,
      multiple: true,
      onChoose: list => {
        let { teacherList } = teacherData;
        teacherList = this.handleMaxNumGoods(unionBy(teacherList, list, 'id'));
        self.onChangeCustomVal('teacherList')(teacherList);
      }
    };

    dialog(options)();
  }

  /**
   * 最大老师数量限制
   */
  handleMaxNumGoods = list => {
    let remainList = list;
    const { length } = list;
    const { maxCanAddGoods } = Types;
    if (length > maxCanAddGoods) {
      remainList = list.slice(0, maxCanAddGoods);
      Notify.error(`最多添加${maxCanAddGoods}个老师，其余${length - maxCanAddGoods}个老师添加失败`);
    }
    return remainList;
  }

  /**
   * 修改选择老师
   */
  onChangeGoods = list => {
    this.onChangeCustomVal('teacherList')(list);
  }

  /**
   * 通用表单元素onChange回调
   */
  onChangeVal = e => {
    if (!(e && e.target)) {
      throw new Error(Types.notEventMsg);
    }

    const { onChange } = this.props;
    const { target } = e;
    const { name, type } = target;
    let { value } = target;

    if (type === 'checkbox') {
      value = target.checked;
    }

    onChange({
      teacherData: {
        ...this.props.value.teacherData,
        [name]: value
      }
    });
  }

  /**
   * 自定义单值修改
   */
  onChangeCustomVal = name => value => {
    const { onChange } = this.props;
    onChange({
      teacherData: {
        ...this.props.value.teacherData,
        [name]: value
      }
    });
  }

  /**
   * 显示修改
   */
  onChangeDisplay = (displayContent, key) => e => {
    const { onChange } = this.props;
    const value = e.target.checked;
    let valueSet = new Set(displayContent);
    if(value){
      valueSet.add(key)
    }else{
      valueSet.delete(key)
    }
    onChange({
      teacherData: {
        ...this.props.value.teacherData,
        'displayContent': [...valueSet]
      }
    });
  }
}
