import React from 'react';
import cx from 'classnames';

import { ComponentTitle } from '../common';
import { DesignEditor } from '../editor-base/design-editor';
import EduGoodsGroupEditor from './components/EduGoodsGroupEditor'; // 课程分组编辑器
import StyleEditor from './components/StyleEditor'; // 课程&课程分组公用样式编辑器
import { defaultState } from './state';

// import * as Enums from './enums';
import * as Types from './types';

// 是否是教育店铺
const isYZEdu = (window._global && window._global.isYZEdu) || false;

const getDefaultState = () => {
  const payload = {
    [Types.EDU_GROUP]: {
      ...defaultState().base,
      ...defaultState()[Types.EDU_GROUP],
    },
  };

  return payload;
};

const getGroupTypeMap = type => {
  let text = '';
  type = +type;

  switch (type) {
    case 0:
      text = '课程分组';
      break;
    case 1:
      text = '其它分组';
      break;
    case 2:
      text = '最新上架';
      break;
    case 3:
      text = '人气课程';
      break;
    default:
      text = '课程分组';
  }
  return text;
};

/**
 * 课程编辑器
 */
export default class EduGoodsEditor extends DesignEditor {
  static designType = 'edu-group';
  static designDescription = <span>课程分组</span>;
  static info = {
    type: [
      Types.EDU_GOODS, // 课程
      Types.EDU_GROUP, // 课程分组
    ],
    icon: 'https://img.yzcdn.cn/public_files/2019/06/18/5c2fd869d4d59647e251936a8edf75c9.png',
    name: '课程分组',
    description: '课程分组',
    maxNum: 1,
    usedNum: 0,
    status: '',
    // sticky: false,
    deletable: false,
  };
  static getInitialValue() {
    return getDefaultState()[Types.EDU_GROUP];
  }
  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { groupLabel, groupDesc, displayLabel } = value;
      if (displayLabel && (groupLabel.length > 20 || groupLabel.length < 1)) {
        errors.groupLabel = '请重新输入分组名称，1～20个字，必填';
      }

      if (groupDesc.length > 200) {
        errors.groupDesc = '分组简介最多输入200个字符';
      }
      resolve(errors);
    });
  }
  render() {
    const { adapter } = this;
    const { showError, validation, value } = this.props;

    // 0普通，1默认(未分组)，2最新，3热门,4隐藏
    const { isDefault } = value;
    const isHotGroup = isDefault === 3; // 人气课程
    const isNormalGroup = !isDefault; // 普通分组

    return (
      <div className={cx('decorate-edu-goods-editor')}>
        <ComponentTitle
          name={getGroupTypeMap(isDefault)}
          noticeMsg={isHotGroup ? '自定义人气课程的排序规则和展示样式' : '自定义单个分组的展示样式'}
          url={
            isYZEdu
              ? 'https://help.youzan.com/displaylist/detail_13_13-2-34229'
              : 'https://help.youzan.com/displaylist/detail_4_4-2-34233'
          }
        />

        <EduGoodsGroupEditor
          value={adapter('value')}
          globalConfig={adapter('globalConfig')}
          // onChange={adapter('onChange')}
          onInputChange={adapter('onInputChange')}
          onInputBlur={adapter('onInputBlur')}
          onCustomInputChange={adapter('onCustomInputChange')}
          showError={showError}
          validation={validation}
          isHotGroup={isHotGroup}
          isNormalGroup={isNormalGroup}
        />

        {/* 公共布局逻辑 */}
        <StyleEditor
          value={adapter('value')}
          // onChange={adapter('onChange')}
          onInputChange={adapter('onInputChange')}
          onInputBlur={adapter('onInputBlur')}
          onCustomInputChange={adapter('onCustomInputChange')}
          showError={showError}
          validation={validation}
        />
      </div>
    );
  }

  adapter = target => {
    const { value, globalConfig, onChange } = this.props;
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

    return payload;
  };
}
