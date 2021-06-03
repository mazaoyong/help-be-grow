import React, { Component } from 'react';
import { Checkbox, Input, NumberInput, Radio } from 'zent';
import unionBy from 'lodash/unionBy';
import { ControlGroup, EditorCard, Divider, Control } from '../../common';
import dialog from './dialog';
import { handleMaxNumGoods } from '../common';

// import * as Types from '../types';

const RadioGroup = Radio.Group;

/**
 * 课程分组
 */
export default class EduGoodsGroupEditor extends Component {
  render() {
    const { value, onInputChange, onCustomInputChange } = this.props;
    const { displayAllGroup, templateType, menuType, menuPosition, menuWrap, groupList } = value;
    return (
      <div className="decorate-edu-goods-group-editor">
        <p className="edu-goods-group__text edu-goods-group__text--main">添加课程分组</p>
        <p className="edu-goods-group__text edu-goods-group__text--desc">最多添加15个课程分组</p>

        <ControlGroup showLabel={false} bgColored>
          <EditorCard
            addText="添加课程分组"
            onChange={val => onCustomInputChange('groupList')(val)}
            list={groupList}
            canAdd={groupList.length < 15}
            onAdd={this.onChooseGoods}
            canDelete
          >
            {groupList.map((item, index) => {
              return this.renderSubentryItem(item);
            })}
          </EditorCard>
        </ControlGroup>

        <Divider />

        <ControlGroup label="全部分组" value={displayAllGroup ? '显示' : '不显示'}>
          <Checkbox
            checked={displayAllGroup}
            onChange={({ target }) => onCustomInputChange('displayAllGroup')(target.checked)}
          />
        </ControlGroup>

        <Control
          label="展示模板"
          valueMap={{
            0: '顶部菜单',
            1: '左侧菜单',
          }}
          name="templateType"
          options={[{ value: 0, icon: 'menu-top' }, { value: 1, icon: 'menu-left' }]}
          value={templateType}
          onChange={onInputChange}
        />

        {templateType === 0 && (
          <Control
            label="菜单样式"
            valueMap={{
              0: '样式1',
              1: '样式2',
              2: '样式3',
            }}
            options={[
              { value: 0, icon: 'tabs-1' },
              { value: 1, icon: 'tabs-2' },
              { value: 2, icon: 'tabs-3' },
            ]}
            name="menuType"
            value={menuType}
            onChange={onInputChange}
          />
        )}

        {templateType === 0 && (
          <Control
            label="菜单位置"
            name="menuPosition"
            valueMap={{
              0: '正常模式',
              1: '顶部固定',
            }}
            options={[{ value: 0, icon: 'menu-normal' }, { value: 1, icon: 'menu-fixed' }]}
            value={menuPosition}
            onChange={onInputChange}
          />
        )}

        {templateType === 0 && (
          <Control
            label="菜单格式"
            name="menuWrap"
            valueMap={{
              0: '换行',
              1: '不换行',
            }}
            options={[{ value: 0, icon: 'huanhang' }, { value: 1, icon: 'huadong' }]}
            value={menuWrap}
            onChange={onInputChange}
          />
        )}
      </div>
    );
  }

  renderSubentryItem = item => {
    // const { onCustomInputChange } = this.props;
    const { alias, title, displayTitle, displayType, displayNumber } = item;
    return (
      <div key={alias} className="subentry-item">
        <div className="subentry-item__field subentry-item__source">
          <span className="subentry-item__title">课程来源：</span>
          <span className="subentry-item__content">
            <a
              href={`https://h5.youzan.com/wscshop/edu/group/${alias}?kdtId=${_global.kdtId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
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
              maxlength={20}
              placeholder="课程分组"
              onChange={e => this.onChangeListItem(item.alias, 'displayTitle', e)}
              onBlur={e => this.onChangeListItem(item.alias, 'displayTitle', e)}
            />
          </span>
        </div>
        <div className="subentry-item__field subentry-item__number">
          <span className="subentry-item__title">显示个数：</span>
          <span className="subentry-item__content">
            <RadioGroup
              className="goods-from-mode"
              value={displayType}
              onChange={e => this.onChangeListItem(item.alias, 'displayType', e)}
            >
              <Radio name="goodsFromMode" value={0}>
                <NumberInput
                  min={1}
                  max={50}
                  value={displayNumber}
                  onChange={v =>
                    this.onChangeListItem(item.alias, 'displayNumber', {
                      target: { value: parseInt(v) },
                    })
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
        groupList = this.normalizeGroupList(
          handleMaxNumGoods(unionBy(groupList, list, 'alias'), 15)
        );
        groupList = groupList.map(item => {
          item.id = item.groupId;
          delete item.groupId;
          return item;
        });
        onCustomInputChange('groupList')(groupList);
      },
    };
    dialog(options)('group');
  };

  normalizeGroupList = list => {
    return list.map(item => ({
      ...item,
      displayType: 0, // 显示类型
      displayNumber: 6, // 显示个数
      displayTitle: item.title, // 分组菜单的显示名称
    }));
  };

  /**
   * 修改list里的值并覆盖
   */
  onChangeListItem = (targetAlias, key, e) => {
    const { value, onCustomInputChange } = this.props;
    const { groupList } = value;
    const { target = {} } = e;
    const { value: targetValue } = target;

    /* if (key === 'displayNumber' && typeof targetValue !== 'number') {
      targetValue = 6;
    } */

    const _list = groupList.map(item => {
      const _item = item;
      if (item.alias === targetAlias) {
        _item[key] = targetValue;
      }
      return _item;
    });

    onCustomInputChange('groupList')(_list);
  };
}
