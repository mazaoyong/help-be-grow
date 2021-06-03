import { Select } from '@zent/compat';
import React, { Component } from 'react';
import { Checkbox, Input, NumberInput, Radio } from 'zent';
import unionBy from 'lodash/unionBy';
import { ControlGroup } from '../../common';
import dialog from './dialog';
import { handleMaxNumGoods } from '../common';

import * as Types from '../types';

const RadioGroup = Radio.Group;
const Option = Select.Option;

/**
 * 课程分组
 */
export default class EduGoodsGroupEditor extends Component {
  render() {
    const {
      value,
      onInputChange,
      onCustomInputChange,
      showError,
      validation,
      isHotGroup,
      isNormalGroup,
    } = this.props;
    const {
      displayLabel,
      groupLabel,
      groupDesc,
      groupFirstRule,
      groupSecondRule,
      hotTagOrder,
      isDefault = 0,
    } = value;

    return (
      <div className="decorate-edu-goods-group-editor">
        <ControlGroup label="分组名称" value={displayLabel ? '显示' : '不显示'}>
          <Checkbox
            checked={displayLabel}
            onChange={({ target }) => onCustomInputChange('displayLabel')(target.checked)}
          />
        </ControlGroup>

        {displayLabel && (
          <ControlGroup
            className="decorate-edu-goods-group-editor__ipt-block"
            showLabel={false}
            bgColored
          >
            <ControlGroup label="分组名称" showError={showError} error={validation.groupLabel}>
              <Input
                name="groupLabel"
                value={groupLabel}
                placeholder="请输入分组名称"
                onChange={onInputChange}
                disabled={isDefault !== 0}
              />
            </ControlGroup>
            <ControlGroup label="分组简介" showError={showError} error={validation.groupDesc}>
              <Input
                name="groupDesc"
                value={groupDesc}
                placeholder="请输入分组简介"
                onChange={onInputChange}
              />
            </ControlGroup>
          </ControlGroup>
        )}

        {isHotGroup ? (
          <ControlGroup label="排序规则">
            <Radio.Group value={hotTagOrder} onChange={onInputChange}>
              <Radio name="hotTagOrder" value="pv_d30">
                按课程浏览量
              </Radio>
              <Radio name="hotTagOrder" value="sold_num_d30">
                按课程销量
              </Radio>
            </Radio.Group>
          </ControlGroup>
        ) : (
          isNormalGroup && (
            <>
              <ControlGroup label="排序规则（第一优先级）">
                <Select
                  className="zent-select--auto-width"
                  name="groupFirstRule"
                  autoWidth
                  value={groupFirstRule}
                  onChange={onInputChange}
                >
                  <Option value={0}>序号越大越靠前</Option>
                  <Option value={1}>最热的排在前面</Option>
                </Select>
              </ControlGroup>
              <ControlGroup label="排序规则（第二优先级）">
                <Select
                  className="zent-select--auto-width"
                  name="groupSecondRule"
                  autoWidth
                  value={groupSecondRule}
                  onChange={onInputChange}
                >
                  <Option value={0}>创建时间越晚越靠前</Option>
                  <Option value={1}>创建时间越早越靠前</Option>
                  <Option value={2}>最热的排在前面</Option>
                </Select>
              </ControlGroup>
            </>
          )
        )}
      </div>
    );
  }

  renderSubentryItem = item => {
    // const { onCustomInputChange } = this.props;
    const { alias, title, shortenUrl, displayTitle, displayType, displayNumber } = item;
    return (
      <div key={alias} className="subentry-item">
        <div className="subentry-item__field subentry-item__source">
          <span className="subentry-item__title">课程来源：</span>
          <span className="subentry-item__content">
            <a href={shortenUrl} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          </span>
        </div>
        <div className="subentry-item__field subentry-item__name">
          <span className="subentry-item__title">菜单名称：</span>
          <span className="subentry-item__content">
            <Input
              name="title"
              value={displayTitle}
              placeholder="课程分组"
              onChange={e => this.onChangeListItem(item.id, 'displayTitle', e)}
              onBlur={e => this.onChangeListItem(item.id, 'displayTitle', e)}
            />
          </span>
        </div>
        <div className="subentry-item__field subentry-item__number">
          <span className="subentry-item__title">显示个数：</span>
          <span className="subentry-item__content">
            <RadioGroup
              className="goods-from-mode"
              value={displayType}
              onChange={e => this.onChangeListItem(item.id, 'displayType', e)}
            >
              <Radio name="goodsFromMode" value={0}>
                <NumberInput
                  min={1}
                  max={Types.maxVisibleGoods}
                  value={displayNumber}
                  onChange={v =>
                    this.onChangeListItem(item.id, 'displayNumber', { target: { value: v } })
                  }
                />
              </Radio>
              <Radio name="goodsFromMode" value={1}>
                全部
              </Radio>
            </RadioGroup>
          </span>
        </div>
      </div>
    );
  };

  /**
   * 从弹窗中添加商品
   */
  onChooseGoods = e => {
    const { value, globalConfig, onCustomInputChange } = this.props;
    const options = {
      config: globalConfig,
      multiple: true,
      onChoose: list => {
        let { groupList } = value;
        groupList = this.normalizeGroupList(handleMaxNumGoods(unionBy(groupList, list, 'alias')));
        onCustomInputChange('groupList')(groupList);
      },
    };
    dialog(options)();
  };

  normalizeGroupList = list => {
    return list.map(item => ({
      ...item,
      displayType: 0, // 显示类型
      displayNumber: 6, // 显示个数
      displayTitle: '课程分组', // 分组菜单的显示名称
    }));
  };

  /**
   * 修改list里的值并覆盖
   */
  onChangeListItem = (targetId, key, e) => {
    const { value, onCustomInputChange } = this.props;
    const { groupList } = value;
    const { target = {} } = e;
    const { value: targetValue } = target;

    const _list = groupList.map(item => {
      const _item = item;
      if (item.id === targetId) {
        _item[key] = targetValue;
      }
      return _item;
    });

    onCustomInputChange('groupList')(_list);
  };
}
