import { Select } from '@zent/compat';
/* eslint-disable no-script-url */

import React from 'react';
import { Input, Button, ColorPicker, Notify, Radio } from 'zent';
import ajax from 'zan-pc-ajax';
import map from 'lodash/map';
import remove from 'lodash/remove';
import cloneDeep from 'lodash/cloneDeep';
import {
  DesignEditor,
  ControlGroup
} from '@zent/design/es/editor/DesignEditor';
import getUrl from '../utils/url';
import { IS_WEAPP_SETTING } from '../common/config';

import '@zent/design/css/index.css';
const DEFAULT_BACKGROUND = '#f9f9f9';
const RadioGroup = Radio.Group;

export default class ConfigEditor extends DesignEditor {
  render() {
    const { value, showError, validation, globalConfig } = this.props;
    const { tags } = this.state;
    const { is_global_setting: isGlobalSetting } = value;
    const isWeapp = globalConfig.is_weapp_setting === IS_WEAPP_SETTING;
    const isShowCategory = globalConfig.is_show_category === undefined ? true : globalConfig.is_show_category;

    return (
      <div className="rc-design-component-config-editor">
        {!isWeapp && (
          <ControlGroup
            showError={showError || this.getMetaProperty('title', 'touched')}
            error={validation.title}
            required
            label="页面名称:"
          >
            <Input
              value={value.title}
              onChange={this.onInputChange}
              onBlur={this.onInputBlur}
              name="title"
            />
          </ControlGroup>
        )}

        {!isWeapp && (
          <ControlGroup
            showError={
              showError || this.getMetaProperty('description', 'touched')
            }
            error={validation.description}
            label="页面描述:"
          >
            <Input
              value={value.description}
              onChange={this.onInputChange}
              onBlur={this.onInputBlur}
              name="description"
              placeholder="用户通过微信分享给朋友时，会自动显示页面描述"
            />
          </ControlGroup>
        )}

        {!isWeapp && isShowCategory && (
          <ControlGroup
            showError={showError || this.getMetaProperty('category', 'touched')}
            error={validation.category}
            label="分类:"
            className="rc-design-component-config-editor__tag"
          >
            <Select
              data={tags || []}
              value={value.category}
              tags
              filter={this.filterTag}
              onChange={this.onTagChange}
              onDelete={this.onDelete}
            />
            <a
              className="rc-design-component-config-editor__tag-refresh"
              href="javascript:void(0);"
              onClick={this.fetchTags}
            >
              刷新
            </a>
            <a
              className="rc-design-component-config-editor__tag-create"
              href={getUrl(
                '/showcase/category#create',
                'www',
                globalConfig.url
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              新建
            </a>
          </ControlGroup>
        )}

        <ControlGroup label="背景颜色:" focusOnLabelClick={false}>
          <RadioGroup
            value={isGlobalSetting}
            onChange={this.handleChangeBgColor}
          >
            <Radio name="is_global_setting" value="1">
              默认背景色
            </Radio>
            <Radio name="is_global_setting" value="0">
              自定义背景色
            </Radio>
          </RadioGroup>
        </ControlGroup>

        {isGlobalSetting === '0' && (
          <ControlGroup
            className="rc-design-component-config-editor__background"
            focusOnLabelClick={false}
          >
            <div className="rc-design-component-config-editor__background-control">
              <ColorPicker
                color={getBackground(value)}
                onChange={this.onBackgroundChange}
              />
              <Button onClick={this.resetBackground}>重置</Button>
            </div>
          </ControlGroup>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.fetchTags();
  }

  fetchTags = () => {
    const { globalConfig } = this.props;

    ajax({
      url: getUrl('/showcase/category/option', 'www', globalConfig.url),
      dataType: 'text'
    })
      .then(options => {
        const tags = parseOptionsHTML(options);
        this.setState({ tags });
      })
      .catch(err => Notify.error(err));
  };

  onCategoryChange = this.onCustomInputChange('category');

  onTagChange = (evt, item) => {
    const { value } = this.props;
    const newTags = (value.category || []).concat(item.value);
    this.onCategoryChange(newTags);
  };

  onDelete = deleteItem => {
    const { value } = this.props;
    const categoryBak = cloneDeep(value.category || []);
    remove(categoryBak, item => {
      return item === deleteItem.value;
    });
    this.onCategoryChange(categoryBak);
  };

  // 颜色的单选框
  handleChangeBgColor = e => {
    const { onChange, settings } = this.props;
    const isGlobalSetting = e.target.value;

    // '0' 是自定义颜色
    const color =
      isGlobalSetting === '0'
        ? DEFAULT_BACKGROUND
        : settings.backgroundColor || DEFAULT_BACKGROUND;

    onChange({
      is_global_setting: isGlobalSetting,
      color
    });
    this.syncColorToPreview(color);
  };

  onColorChange = this.onCustomInputChange('color');

  onBackgroundChange = color => {
    this.onColorChange(color);
    this.syncColorToPreview(color);
  };

  resetBackground = () => {
    this.onBackgroundChange(DEFAULT_BACKGROUND);
  };

  syncColorToPreview(color) {
    // 将背景色同步到 preview 背景色
    const { settings, onSettingsChange } = this.props;
    onSettingsChange({
      ...settings,
      previewBackground: color
    });
  }

  filterTag = (item, keyword) => item.text.indexOf(keyword) > -1;

  static designType = 'config';
  static designDescription = '页面配置';

  static getInitialValue() {
    return {
      // 标题
      title: '',

      //  背景颜色
      color: DEFAULT_BACKGROUND,

      // 1默认背景色、0自定义背景色
      is_global_setting: '1',

      // 分类
      category: [],

      // 页面描述
      description: '',

      // 没用到
      background: '',
      width: '',
      height: ''
    };
  }

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { title } = value;
      if (!title || !title.trim()) {
        errors.title = '请填写页面名称';
      } else if (title.length > 50) {
        errors.title = '页面名称长度不能多于 50 个字';
      }

      resolve(errors);
    });
  }
}

function getBackground(value) {
  return (value && value.color) || DEFAULT_BACKGROUND;
}

function parseOptionsHTML(html) {
  const selectNode = document.createElement('select');
  selectNode.innerHTML = html;
  return map(selectNode.querySelectorAll('option'), option => {
    return {
      value: option.value,
      text: option.textContent
    };
  });
}
