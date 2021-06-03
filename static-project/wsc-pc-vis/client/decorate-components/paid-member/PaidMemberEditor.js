import React from 'react';
import { Input, Radio, Checkbox } from 'zent';
import { ComponentTitle, ControlGroup, EditorCard } from '../common';
import { DesignEditor } from '../editor-base/design-editor';
import unionBy from 'lodash/unionBy';
import slice from 'lodash/slice';
import { isEduChainStore } from '@youzan/utils-shop';
import choosePaidMember from './dialog';

const RadioGroup = Radio.Group;

export default class PaidMemberEditor extends DesignEditor {
  onChange = list => {
    const { onChange } = this.props;
    this.sub_entry_bak = list;
    onChange({
      sub_entry: list,
    });
    this.setMetaProperty('sub_entry', 'dirty');
    this.setMetaProperty('sub_entry_bak', 'dirty');
  };

  handleSubEntryDeleted = index => {
    const { sub_entry: subEntry = [] } = this.props.value || {};
    subEntry.splice(index, 1);
    this.onChange(subEntry);
  };

  choosePaidMember = () => {
    const { globalConfig } = this.props;
    const self = this;

    choosePaidMember({
      config: globalConfig,
      multiple: true,
      onChoose: list => {
        list = list.map(one => {
          if (!one.buy_status) {
            one.buy_status = {};
          }

          return {
            ...one,
            title: one.name,
            price: one.buy_status.price || 0,
            is_free: one.buy_status.isFree,
            isBought: one.buy_status.isBought === 1,
            contentCount: one.content_count,
            subscriptions_count: one.card_user_count,
          };
        });
        let { sub_entry: subEntry = [] } = this.props.value || {};
        subEntry = slice(unionBy(subEntry, list, 'alias'), 0, 10);
        self.onChange(subEntry);
      },
    });
  };

  handleShowTitleChange = evt => {
    const { target } = evt;
    const value = target.checked;
    const showTitle = value ? '1' : '0';
    this.onCustomInputChange('show_title')(showTitle);
  };

  // 是否显示查看全部会员权益入口
  handleShowTitleAllChange = evt => {
    const { target } = evt;
    const value = target.checked;
    const showTitleAll = value ? '1' : '0';
    this.onCustomInputChange('show_title_all')(showTitleAll);
  };

  // 会员权益来源
  handleMemberFromChange = evt => {
    const { onChange } = this.props;
    const { sub_entry_bak: subEntryBak = [] } = this;
    const { target } = evt;
    const { value } = target;
    const newSubEntry = value === 'newest' ? [] : subEntryBak;

    onChange({
      sub_entry: newSubEntry,
      member_from: value,
    });
    this.setMetaProperty('sub_entry', 'dirty');
    this.setMetaProperty('member_from', 'dirty');
  };

  handleUploadSuccess = defaultImageUrl => {
    this.onCustomInputChange('default_image_url')(defaultImageUrl);
  };

  render() {
    const { value, showError, validation } = this.props;
    const {
      title,
      show_title: showTitle,
      show_title_all: showTitleAll,
      member_from: memberFrom,
      sub_entry: subEntry,
    } = value;

    return (
      <div className="rc-design-component-paidmember-editor">
        <ComponentTitle name="知识付费会员" />

        <ControlGroup
          className="rc-design-component-paidmember-editor__title-bar"
          label="标题栏"
          value={+showTitle ? '显示' : '不显示'}
        >
          <Checkbox
            name="hide_unshared_coupon"
            checked={+showTitle}
            onChange={this.handleShowTitleChange}
          />
        </ControlGroup>

        {+showTitle ? (
          <ControlGroup
            className="rc-design-component-paidmember-editor__title"
            label="标题名称"
            labelAlign="top"
            showError={showError || this.getMetaProperty('title', 'touched')}
            error={validation.title}
            block
            bgColored
          >
            <Input
              name="title"
              value={title}
              placeholder="知识付费会员"
              onChange={this.onInputChange}
              onBlur={this.onInputBlur}
            />

            <ControlGroup
              className="rc-design-component-paidmember-editor__show-all"
              label="查看全部按钮"
              value={+showTitleAll ? '显示' : '不显示'}
            >
              <Checkbox
                name="hide_unshared_coupon"
                checked={+showTitleAll}
                onChange={this.handleShowTitleAllChange}
              />
            </ControlGroup>
          </ControlGroup>
        ) : (
          ''
        )}

        <ControlGroup
          label="会员权益来源:"
          labelAlign="top"
          className="title-name"
          focusOnLabelClick={false}
          helpDesc={isEduChainStore ? '' : '最多添加10个会员权益，拖动选中的会员权益可对其排序'}
        >
          <RadioGroup value={memberFrom} onChange={this.handleMemberFromChange}>
            <Radio name="member_from" value="newest">
              展示最新的3个会员权益
            </Radio>
            {!isEduChainStore && (
              <Radio name="member_from" value="custom">
                自定义
              </Radio>
            )}
          </RadioGroup>
        </ControlGroup>

        {memberFrom === 'custom' && (
          <ControlGroup
            className="rc-design-component-paidmember-editor__list"
            showLabel={false}
            bgColored
          >
            <EditorCard
              addText="添加会员权益"
              onChange={this.onChange}
              list={subEntry}
              canAdd={subEntry.length < 10}
              onAdd={this.choosePaidMember}
            >
              {subEntry.map((item, index) => {
                return (
                  <div key={index} className="rc-design-component-paidmember-editor__subentry-item">
                    <i className="rc-design-component-paidmember-editor__icon-drag" />
                    会员权益:{' '}
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </a>
                    <i
                      className="rc-design-component-paidmember-editor__icon-delete"
                      onClick={() => this.handleSubEntryDeleted(index)}
                    />
                  </div>
                );
              })}
            </EditorCard>
          </ControlGroup>
        )}
      </div>
    );
  }

  static info = {
    type: 'paid_member',
    name: '知识付费会员',
    description: '知识付费会员',
    icon: 'https://img.yzcdn.cn/public_files/2019/04/26/b91b813c7339fd8528c8aec2de815fbf.png',
    maxNum: 20,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      type: 'paid_member',
      show_title: '1',
      show_title_all: '1',
      title: '知识付费会员',
      member_from: 'newest',
      sub_entry: [],
      default_image_url: '',
    };
  }

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { title, show_title: showTitle } = value;
      if (+showTitle && (!title || !title.trim())) {
        errors.title = '标题名称不能为空';
      }

      resolve(errors);
    });
  }
}
