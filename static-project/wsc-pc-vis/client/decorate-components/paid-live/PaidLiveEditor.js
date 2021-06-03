import React from 'react';
import { Input, Radio, Checkbox } from 'zent';
import { ComponentTitle, ControlGroup, EditorCard } from '../common';
import { DesignEditor } from '../editor-base/design-editor';
import unionBy from 'lodash/unionBy';
import slice from 'lodash/slice';
import choosePaidLive from './dialog';
import { filterOmitKeys } from '../utils/edu-utils';

const RadioGroup = Radio.Group;

export default class PaidLiveEditor extends DesignEditor {
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

  choosePaidLive = () => {
    const { globalConfig } = this.props;
    const self = this;

    choosePaidLive({
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

  // 是否显示查看全部内容
  handleShowTitleAllChange = evt => {
    const { target } = evt;
    const value = target.checked;
    const showTitleAll = value ? '1' : '0';
    this.onCustomInputChange('show_title_all')(showTitleAll);
  };

  // 知识内容来源
  handleContentFromChange = evt => {
    const { onChange } = this.props;
    const { sub_entry_bak: subEntryBak = [] } = this.props.value || {};
    const { target } = evt;
    const { value } = target;
    const newSubEntry = value === 'newest' ? [] : subEntryBak;

    onChange({
      sub_entry: newSubEntry,
      content_from: value,
    });
    this.setMetaProperty('sub_entry', 'dirty');
    this.setMetaProperty('content_from', 'dirty');
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
      content_from: contentFrom,
      sub_entry: subEntry,
    } = value;

    return (
      <div className="rc-design-component-paidlive-editor">
        <ComponentTitle name="知识直播" />

        <ControlGroup
          className="rc-design-component-paidlive-editor__title-bar"
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
            className="rc-design-component-paidlive-editor__title"
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
              placeholder="最新直播"
              onChange={this.onInputChange}
              onBlur={this.onInputBlur}
            />

            <ControlGroup
              className="rc-design-component-paidlive-editor__show-all"
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
          label="直播来源:"
          labelAlign="top"
          className="live-name"
          focusOnLabelClick={false}
          helpDesc="最多添加10个直播，拖动选中的专栏可对其排序"
        >
          <RadioGroup value={contentFrom} onChange={this.handleContentFromChange}>
            <Radio name="content_from" value="newest">
              展示最新的6个直播
            </Radio>
            <Radio name="content_from" value="custom">
              自定义
            </Radio>
          </RadioGroup>
        </ControlGroup>

        {contentFrom === 'custom' && (
          <ControlGroup
            className="rc-design-component-paidlive-editor__list"
            showLabel={false}
            bgColored
          >
            <EditorCard
              addText="添加直播"
              onChange={this.onChange}
              list={subEntry}
              canAdd={subEntry.length < 10}
              onAdd={this.choosePaidLive}
            >
              {subEntry.map((item, index) => {
                return (
                  <div key={index} className="rc-design-component-paidlive-editor__subentry-item">
                    <i className="rc-design-component-paidlive-editor__icon-drag" />
                    直播:{' '}
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                    <i
                      className="rc-design-component-paidlive-editor__icon-delete"
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
    type: 'paid_live',
    name: '知识直播',
    description: '知识直播',
    icon: 'https://img.yzcdn.cn/public_files/2019/04/26/512ba81ad2f1a0114b7c554025c5a5a2.png',
    maxNum: 20,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      type: 'paid_live',
      show_title: '1',
      show_title_all: '1',
      title: '最新直播',
      content_from: 'newest',
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
