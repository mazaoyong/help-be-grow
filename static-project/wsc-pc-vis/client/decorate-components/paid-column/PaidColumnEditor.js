import React from 'react';
import { Input, Radio, Checkbox } from 'zent';
import { ComponentTitle, ControlGroup, EditorCard } from '../common';
import { DesignEditor } from '../editor-base/design-editor';
import unionBy from 'lodash/unionBy';
import slice from 'lodash/slice';
import { filterOmitKeys } from '../utils/edu-utils';

import choosePaidColumn from '@youzan/react-components/es/components/choose-dialog/dialogs/paid-columns';
import '@youzan/react-components/es/components/choose-dialog/style';

const RadioGroup = Radio.Group;

export default class PaidColumnEditor extends DesignEditor {
  onChange = list => {
    list = filterOmitKeys(list);
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

  choosePaidColumn = () => {
    const { globalConfig } = this.props;
    const self = this;

    choosePaidColumn({
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

  // 是否显示查看全部专栏入口
  handleShowTitleAllChange = evt => {
    const { target } = evt;
    const value = target.checked;
    const showTitleAll = value ? '1' : '0';
    this.onCustomInputChange('show_title_all')(showTitleAll);
  };

  // 专栏来源
  handleColumnFromChange = evt => {
    const { onChange } = this.props;
    const { sub_entry_bak: subEntryBak = [] } = this.props.value;
    const { target } = evt;
    const { value } = target;
    const newSubEntry = value === 'newest' ? [] : subEntryBak;

    onChange({
      sub_entry: newSubEntry,
      column_from: value,
    });
    this.setMetaProperty('sub_entry', 'dirty');
    this.setMetaProperty('column_from', 'dirty');
  };

  render() {
    const { value, showError, validation } = this.props;
    const {
      title,
      show_title: showTitle,
      show_title_all: showTitleAll,
      column_from: columnFrom,
      sub_entry: subEntry,
    } = value;

    return (
      <div className="rc-design-component-paidcolumn-editor">
        <ComponentTitle name="知识专栏" />

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
            className="rc-design-component-paidcolumn-editor__title"
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
              placeholder="最新专栏"
              onChange={this.onInputChange}
              onBlur={this.onInputBlur}
            />

            <ControlGroup
              className="rc-design-component-paidcolumn-editor__show-all"
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
          label="专栏来源:"
          labelAlign="top"
          className="title-name"
          focusOnLabelClick={false}
          helpDesc="最多添加10篇专栏，拖动选中的专栏可对其排序"
        >
          <RadioGroup value={columnFrom} onChange={this.handleColumnFromChange}>
            <Radio name="column_from" value="newest">
              展示最新的3篇专栏
            </Radio>
            <Radio name="column_from" value="custom">
              自定义
            </Radio>
          </RadioGroup>
        </ControlGroup>

        {columnFrom === 'custom' && (
          <ControlGroup
            className="rc-design-component-paidcolumn-editor__list"
            showLabel={false}
            bgColored
          >
            <EditorCard
              addText="添加专栏"
              onChange={this.onChange}
              list={subEntry}
              canAdd={subEntry.length < 10}
              onAdd={this.choosePaidColumn}
            >
              {subEntry.map((item, index) => {
                return (
                  <div key={index} className="rc-design-component-paidcolumn-editor__subentry-item">
                    <i className="rc-design-component-paidcolumn-editor__icon-drag" />
                    专栏:{' '}
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                    <i
                      className="rc-design-component-paidcolumn-editor__icon-delete"
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
    type: 'paid_column',
    name: '知识专栏',
    description: '知识专栏',
    icon: 'https://img.yzcdn.cn/public_files/2019/04/26/3c0b5f0789d14f54560055d7778dc1e7.png',
    maxNum: 20,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      type: 'paid_column',
      show_title: '1',
      show_title_all: '1',
      title: '最新专栏',
      column_from: 'newest',
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
