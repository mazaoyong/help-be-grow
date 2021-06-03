import { Select } from '@zent/compat';
import React from 'react';
import { Input, Notify, Radio } from 'zent';
import ajax from 'zan-pc-ajax';
import map from 'lodash/map';
import remove from 'lodash/remove';
import cloneDeep from 'lodash/cloneDeep';
import { DesignEditor } from '../editor-base/design-editor';
import { ComponentTitle, ControlGroup, ColorPicker } from '../common';
import getUrl from '../utils/url';

const DEFAULT_BACKGROUND = '#f9f9f9';
const RadioGroup = Radio.Group;
const prefix = 'decorate-component-config-editor';

export default class ConfigEditor extends DesignEditor {
  render() {
    const {
      value,
      showError,
      validation,
      globalConfig,
      showDesc = true,
      showCategory = true,
      showBg = true,
    } = this.props;
    const { tags } = this.state;
    const { is_global_setting: isGlobalSetting } = value;

    return (
      <div className={prefix}>
        <ComponentTitle name="页面设置" />
        <ControlGroup
          showError={showError || this.getMetaProperty('title', 'touched')}
          error={validation.title}
          required
          label="页面名称"
          labelColored
          block
          focusOnLabelClick
        >
          <Input
            value={value.title}
            onChange={this.onInputChange}
            onBlur={this.onInputBlur}
            name="title"
            placeholder="微页面标题"
          />
        </ControlGroup>

        {showDesc && (
          <ControlGroup
            showError={showError || this.getMetaProperty('description', 'touched')}
            error={validation.description}
            label="页面描述"
            labelColored
            block
            focusOnLabelClick
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

        {showCategory && (
          <ControlGroup
            showError={showError || this.getMetaProperty('category', 'touched')}
            error={validation.category}
            label="分类"
            labelColored
            className={`${prefix}__tag`}
            block
            extra={
              <div>
                <a
                  className={`${prefix}__tag-refresh`}
                  href="javascript:void(0);"
                  onClick={this.fetchTags}
                >
                  刷新
                </a>
                <span className={`${prefix}__tag-split`}>|</span>
                <a
                  className={`${prefix}__tag-create`}
                  href={getUrl('/showcase/category#create', 'www', globalConfig.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  新建
                </a>
              </div>
            }
          >
            <Select
              data={tags || []}
              value={value.category}
              placeholder="请选择微页面分类"
              tags
              filter={this.filterTag}
              autoWidth
              onChange={this.onTagChange}
              onDelete={this.onDelete}
            />
          </ControlGroup>
        )}

        {showBg && (
          <>
            <ControlGroup label="背景颜色">
              <RadioGroup value={isGlobalSetting} onChange={this.handleChangeBgColor}>
                <Radio name="is_global_setting" value="1">
                  默认背景色
                </Radio>
                <Radio name="is_global_setting" value="0">
                  自定义背景色
                </Radio>
              </RadioGroup>
            </ControlGroup>
            {isGlobalSetting === '0' && (
              <ControlGroup className={`${prefix}__background`}>
                <ColorPicker
                  defaultColor={DEFAULT_BACKGROUND}
                  color={value.color}
                  onChange={this.onCustomInputChange('color')}
                />
              </ControlGroup>
            )}
          </>
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
      dataType: 'text',
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
    const { onChange, settings = {} } = this.props;
    const isGlobalSetting = e.target.value;

    // '0' 是自定义颜色
    const color =
      isGlobalSetting === '0' ? DEFAULT_BACKGROUND : settings.backgroundColor || DEFAULT_BACKGROUND;

    onChange({
      is_global_setting: isGlobalSetting,
      color,
    });
  };

  onColorChange = this.onCustomInputChange('color');

  onBackgroundChange = color => {
    this.onColorChange(color);
  };

  resetBackground = () => {
    this.onBackgroundChange(DEFAULT_BACKGROUND);
  };

  filterTag = (item, keyword) => item.text.indexOf(keyword) > -1;

  // 组件信息
  static info = {
    type: 'config',
    name: '页面配置',
    description: '页面配置',
    icon: 'https://img.yzcdn.cn/public_files/2019/01/09/2c795eec2253aad06ab14e8f931cd754.png',
    maxNum: 20,
    usedNum: 0,
    status: '',
  };

  // 组件初始化数据
  static getInitialValue = () => {
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
      height: '',
    };
  };

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

function parseOptionsHTML(html) {
  const selectNode = document.createElement('select');
  selectNode.innerHTML = html;
  return map(selectNode.querySelectorAll('option'), option => {
    return {
      value: option.value,
      text: option.textContent,
    };
  });
}
