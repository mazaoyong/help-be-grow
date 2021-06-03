import React from 'react';
import cx from 'classnames';

import { ComponentTitle, Tabs } from '../common';
import { DesignEditor } from '../editor-base/design-editor';
import EduGoodsBaseEditor from './components/EduGoodsBaseEditor'; // 课程编辑器
import EduGoodsGroupEditor from './components/EduGoodsGroupEditor'; // 课程分组编辑器
import StyleEditor from './components/StyleEditor'; // 课程&课程分组公用样式编辑器
import { defaultState } from './state';

// import * as Enums from './enums';
import * as Types from './types';

const getDefaultState = () => {
  const payload = {
    [Types.EDU_GOODS]: {
      ...defaultState()[Types.EDU_GOODS],
    },
    [Types.EDU_GOODS_GROUP]: {
      ...defaultState().base,
      ...defaultState()[Types.EDU_GOODS_GROUP],
    },
  };

  payload[Types.EDU_GOODS].knowledgeGoodsData = {
    ...payload[Types.EDU_GOODS].knowledgeGoodsData,
    ...defaultState().base,
  };

  return payload;
};

/**
 * 课程编辑器
 */
export default class EduGoodsEditor extends DesignEditor {
  static designType = 'edu-goods';
  static designDescription = <span>课程</span>;
  static info = {
    type: [
      Types.EDU_GOODS, // 课程
      Types.EDU_GOODS_GROUP, // 课程分组
    ],
    icon: 'https://img.yzcdn.cn/public_files/2019/06/18/5c2fd869d4d59647e251936a8edf75c9.png',
    name: '课程',
    description: '课程',
    maxNum: 10,
    usedNum: 0,
    status: '',
  };
  static getInitialValue() {
    return getDefaultState()[Types.EDU_GOODS];
  }
  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { type } = value;
      if (type === 'knowledge-goods') {
        const { knowledgeGoodsData } = value;
        const { title, maxNewestGoods, goodsFromMode, sourceFrom, groupList } = knowledgeGoodsData;

        if (title.length > 20 || title.length < 1) {
          errors.title = '请重新输入标题名称，1～20个字，必填';
        }

        if (typeof maxNewestGoods !== 'number' && goodsFromMode === 0) {
          errors.title = '展示最新的商品个数输入有误，请重新输入1~20的数字';
        }

        if (sourceFrom === 1 && groupList.length === 0) {
          errors.title = '请至少选择1个分组';
        }
      }
      if (type === 'edu-goods-group') {
        const { groupList } = value;
        if (groupList.length === 0) {
          errors.title = '请至少选择1个分组';
        } else {
          groupList.forEach(item => {
            const { displayNumber, displayType, displayTitle } = item;
            if (typeof displayNumber !== 'number' && displayType === 0) {
              errors.title = '分组显示个数输入有误，请重新输入1~20的数字';
            }
            if (displayTitle.length < 1 || displayTitle.length > 20) {
              errors.title = '请输入1～20个字的名称';
            }
          });
        }
      }
      resolve(errors);
    });
  }
  render() {
    const { adapter } = this;
    const { value } = this.props;
    const { type } = value;

    const tabId = type === Types.EDU_GOODS ? '0' : '1';
    const isEduGoods = type === Types.EDU_GOODS;
    const isEduGoodsGroup = type === Types.EDU_GOODS_GROUP;

    return (
      <div className={cx('decorate-edu-goods-editor')}>
        <ComponentTitle
          name="课程"
          noticeMsg="课程支持小程序v2.37.5及以上版本，课程分组支持小程序v2.42及以上版本"
          url="https://help.youzan.com"
        />

        {/* 课程 or 课程分组 */}
        <Tabs activeId={tabId} onChange={this.changeCourseEditorTab}>
          <Tabs.TabPanel tab="课程" id="0" />
          <Tabs.TabPanel tab="课程分组" id="1" />
        </Tabs>

        {/* 课程的逻辑 */}
        {isEduGoods && (
          <EduGoodsBaseEditor
            value={adapter('value')}
            globalConfig={adapter('globalConfig')}
            // onChange={adapter('onChange')}
            onInputChange={adapter('onInputChange')}
            onInputBlur={adapter('onInputBlur')}
            onCustomInputChange={adapter('onCustomInputChange')}
            onChangeCustomMultiVal={this.onChangeCustomMultiVal}
          />
        )}

        {/* 课程分组的逻辑*/}
        {isEduGoodsGroup && (
          <EduGoodsGroupEditor
            value={adapter('value')}
            globalConfig={adapter('globalConfig')}
            // onChange={adapter('onChange')}
            onInputChange={adapter('onInputChange')}
            onInputBlur={adapter('onInputBlur')}
            onCustomInputChange={adapter('onCustomInputChange')}
          />
        )}

        {/* 公共布局逻辑 */}
        <StyleEditor
          value={adapter('value')}
          // onChange={adapter('onChange')}
          onInputChange={adapter('onInputChange')}
          onInputBlur={adapter('onInputBlur')}
          onCustomInputChange={adapter('onCustomInputChange')}
        />
      </div>
    );
  }

  /**
   * 课程编辑器tab切换
   */
  changeCourseEditorTab = tabId => {
    const { onChange } = this.props;
    // 课程（默认）
    let payload = getDefaultState()[Types.EDU_GOODS];

    // 课程分组
    if (tabId === '1') {
      payload = getDefaultState()[Types.EDU_GOODS_GROUP];
    }
    onChange(payload, true);
  };

  /**
   * 适配课程商品老数据
   */
  adapter = target => {
    const { value, globalConfig, onChange } = this.props;
    const { type } = value;
    let payload;

    switch (target) {
      case 'value':
        payload = value;
        break;
      case 'globalConfig':
        payload = globalConfig;
        break;
      case 'onChange':
        payload = onChange;
        break;
      case 'onInputChange':
        payload = this.onInputChange;
        break;
      case 'onInputBlur':
        payload = this.onInputBlur;
        break;
      case 'onCustomInputChange':
        payload = this.onCustomInputChange;
        break;
      default:
    }

    if (type === Types.EDU_GOODS) {
      const { knowledgeGoodsData } = value;
      switch (target) {
        case 'value':
          payload = knowledgeGoodsData;
          break;
        case 'globalConfig':
          payload = globalConfig;
          break;
        case 'onChange':
          payload = this.onChangeVal;
          break;
        case 'onInputChange':
          payload = this.onChangeVal;
          break;
        case 'onInputBlur':
          payload = this.onInputBlur;
          break;
        case 'onCustomInputChange':
          payload = this.onChangeCustomVal;
          break;
        default:
      }
    }

    return payload;
  };

  /**
   * 通用表单元素onChange回调
   */
  onChangeVal = e => {
    function isEventLikeObject(evt) {
      return evt && evt.target && evt.target.name;
    }

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

  /**
   * 自定义多值修改
   */
  onChangeCustomMultiVal = obj => {
    const { onChange } = this.props;
    onChange({
      knowledgeGoodsData: {
        ...this.props.value.knowledgeGoodsData,
        ...obj,
      },
    });
  };
}
