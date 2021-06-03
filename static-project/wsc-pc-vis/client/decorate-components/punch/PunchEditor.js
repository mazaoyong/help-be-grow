import React from 'react';
import { Input, Radio, Checkbox } from 'zent';
import { ComponentTitle, ControlGroup, EditorCard } from '../common';
import { DesignEditor } from '../editor-base/design-editor';
import unionBy from 'lodash/unionBy';
import slice from 'lodash/slice';
import { isEduChainStore } from '@youzan/utils-shop';
import choosePunch from './dialog';

const RadioGroup = Radio.Group;

export default class PunchEditor extends DesignEditor {
  onChange = list => {
    const { onChange } = this.props;
    onChange({
      sub_entry: list,
      sub_entry_bak: list,
    });
    this.setMetaProperty('sub_entry', 'dirty');
    this.setMetaProperty('sub_entry_bak', 'dirty');
  };

  handleSubEntryDeleted = index => {
    const { sub_entry: subEntry = [] } = this.props.value || {};
    subEntry.splice(index, 1);
    this.onChange(subEntry);
  };

  choosePunch = () => {
    const { globalConfig } = this.props;
    const self = this;

    choosePunch({
      config: globalConfig,
      multiple: true,
      onChoose: list => {
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

  // 是否显示查看全部群打卡入口
  handleShowTitleAllChange = evt => {
    const { target } = evt;
    const value = target.checked;
    const showTitleAll = value ? '1' : '0';
    this.onCustomInputChange('show_title_all')(showTitleAll);
  };

  // 群打卡来源
  handlePunchFromChange = evt => {
    const { onChange } = this.props;
    const { sub_entry_bak: subEntryBak = [] } = this.props.value;
    const { target } = evt;
    const { value } = target;
    const newSubEntry = value === 'newest' ? [] : subEntryBak;

    onChange({
      sub_entry: newSubEntry,
      punch_from: value,
    });
    this.setMetaProperty('sub_entry', 'dirty');
    this.setMetaProperty('punch_from', 'dirty');
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
      punch_from: punchFrom,
      sub_entry: subEntry,
    } = value;

    return (
      <div className="rc-design-component-punch-editor">
        <ComponentTitle name="群打卡" noticeMsg="仅支持在小程序中显示" />

        <ControlGroup
          className="rc-design-component-paidcolumn-editor__title-bar"
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
            className="rc-design-component-punch-editor__title"
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
              placeholder="最新打卡"
              onChange={this.onInputChange}
              onBlur={this.onInputBlur}
            />

            <ControlGroup
              className="rc-design-component-punch-editor__show-all"
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
          label="群打卡来源:"
          labelAlign="top"
          className="title-name"
          focusOnLabelClick={false}
          helpDesc={isEduChainStore ? '' : '最多添加10个群打卡，拖动选中的群打卡可对其排序'}
        >
          <RadioGroup value={punchFrom} onChange={this.handlePunchFromChange}>
            <Radio name="punch_from" value="newest">
              展示最新的3个群打卡
            </Radio>
            {!isEduChainStore && (
              <Radio name="punch_from" value="custom">
                自定义
              </Radio>
            )}
          </RadioGroup>
        </ControlGroup>

        {punchFrom === 'custom' && (
          <ControlGroup
            className="rc-design-component-punch-editor__list"
            showLabel={false}
            bgColored
          >
            <EditorCard
              addText="添加群打卡"
              onChange={this.onChange}
              list={subEntry}
              canAdd={subEntry.length < 10}
              onAdd={this.choosePunch}
            >
              {subEntry.map((item, index) => {
                return (
                  <div key={index} className="rc-design-component-punch-editor__subentry-item">
                    <i className="rc-design-component-punch-editor__icon-drag" />
                    群打卡:{' '}
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </a>
                    <i
                      className="rc-design-component-punch-editor__icon-delete"
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
    type: 'punch',
    name: '群打卡',
    description: '群打卡',
    icon: 'https://img.yzcdn.cn/public_files/2019/04/26/12ee311a24105bebdd4e4a609d92aacc.png',
    maxNum: 10,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      type: 'punch',
      show_title: '1',
      show_title_all: '1',
      title: '最新打卡',
      punch_from: 'newest',
      sub_entry: [],
      sub_entry_bak: [],
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
