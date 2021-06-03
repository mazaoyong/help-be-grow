import { Select } from '@zent/compat';
import React from 'react';
import { Radio } from 'zent';
import { DesignEditor } from '../editor-base/design-editor';
import map from 'lodash/map';
import some from 'lodash/some';
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';
import assign from 'lodash/assign';

import * as SubEntryItemValidate from '../common/subentry-item/validate';
import * as Helper from './helper';
import {
  UploadImage,
  EditorCard,
  SubEntryItem,
  ComponentTitle,
  ControlGroup,
  RadioButton,
  Divider,
  HelpDesc,
  ColorPicker,
} from '../common';
import {
  NAV_MAXNUM,
  crossMode,
  tempTypeMap,
  imageNavOptions,
  defaultImageTextNavData,
  imageNav,
  imageHelpText,
  textHelpText,
} from './constants';
import { DEFAULT_IMAGE_SPACING } from '../constants/image-spacing';
import { COM_STATUS } from '../common/constants';

const RadioGroup = Radio.Group;

const resetColor = '#000';
const resetBackgroundColor = '#fff';

const Option = Select.Option;
export default class ImageTextNavEditor extends DesignEditor {
  constructor(props) {
    super(props);
    const { value } = props;
    const { show_method: showMethod } = value;
    const selectTempIndex = showMethod === imageNav ? 0 : 1;
    this.state = assign({}, this.state, {
      selectTempIndex,
    });
  }

  updateSubEntry(data, itemIndex, subEntryData) {
    if (subEntryData.length > 0) {
      return map(subEntryData, (item, index) => {
        return index === itemIndex ? data : item;
      });
    }
    return subEntryData;
  }

  // 更新某个图文
  handleItemChange = (subEntryItemData, index) => {
    const { value } = this.props;
    const { sub_entry: subEntry } = value;
    const subEntryData = this.updateSubEntry(subEntryItemData, index, subEntry);
    this.onCustomInputChange('sub_entry')(subEntryData);
  };

  handleTempChange = ({ target: { value = '0' } }) => {
    const index = +value;
    const item = tempTypeMap[index];

    this.handleSelectTemp(item, index);
  };

  // 更换模板（图片导航、文字导航）
  handleSelectTemp = (item, index) => {
    if (this.state.selectTempIndex === index) return;

    this.props.onChange({
      show_method: item.value,
    });

    // 编辑模块生效
    this.setState({
      selectTempIndex: index,
    });
  };

  onColorChange = color => {
    this.onCustomInputChange('color')(color);
  };

  onColorReset = () => {
    this.onCustomInputChange('color')(resetColor);
  };

  onBackgroundColorChange = color => {
    this.onCustomInputChange('background_color')(color);
  };

  onBackgroundColorReset = () => {
    this.onCustomInputChange('background_color')(resetBackgroundColor);
  };

  handleSelectCount = (e, data) => {
    this.props.onChange({
      count: data.value,
    });
  };

  // 添加图片导航
  addImageTextNav = () => {
    const { globalConfig, uploadConfig } = this.props;
    const options = {
      uploadConfig,
      callback: this.handleUploadImage,
      imgcdn: globalConfig.url && (globalConfig.url.imgqn || globalConfig.url.imgcdn),
    };
    UploadImage.initialize(options);
  };

  // 添加文本导航
  addTextNav = () => {
    const {
      value: { sub_entry: subEntry },
    } = this.props;
    subEntry.push(assign({}, defaultImageTextNavData));
    this.onCustomInputChange('sub_entry')(subEntry);
  };

  handleUploadImage = data => {
    const subEntryData = Helper.transferSubEntry(data);
    this.uploadImageCallback(subEntryData);
  };

  // 选择完图片回调
  uploadImageCallback = subEntryData => {
    const { value } = this.props;
    let { sub_entry: subEntry } = value;
    forEach(subEntryData, item => {
      subEntry.push(item);
    });
    subEntry = Helper.validSubEntry(subEntry, this.getMaxImageNum());
    this.handleChange(subEntry);
  };

  handleChange = subEntry => {
    this.props.onChange({
      sub_entry: subEntry,
    });
    this.setMetaProperty('sub_entry', 'dirty');
  };

  // 横向滑动一屏可以显示的图片数量
  getImageNavOptions = () => {
    return imageNavOptions.map((item, index) => {
      return <Option value={item} key={index}>{`${item} 个导航`}</Option>;
    });
  };

  // 获取可添加导航数量最大值
  getMaxImageNum = () => {
    return NAV_MAXNUM;
  };

  renderTempTxt = (selectTempIndex = 0) => {
    return tempTypeMap[selectTempIndex].title;
  };

  render() {
    const {
      value,
      showError,
      validation,
      globalConfig,
      settings,
      uploadConfig,
      linkMenuItems,
    } = this.props;
    const { selectTempIndex } = this.state;
    const {
      sub_entry: subEntry,
      show_method: showMethod,
      color,
      background_color: backgroundColor,
      slide_setting: slideSetting,
      count,
    } = value;

    const tempType = selectTempIndex + '';
    const TempTxt = this.renderTempTxt(selectTempIndex);

    return (
      <div className="decorate-image-text-nav-editor">
        <ComponentTitle name="图文导航" noticeMsg="小程序 v2.3.1 及以上版本支持" />

        <HelpDesc style={{ margin: '24px 16px 10px 16px' }}>
          最多添加 {this.getMaxImageNum()} 个导航，拖动选中的导航可对其排序
        </HelpDesc>

        <ControlGroup
          showLabel={false}
          showError={showError || this.getMetaProperty('sub_entry', 'touched')}
          error={validation.sub_entry}
          focusOnLabelClick={false}
          bgColored
        >
          <EditorCard
            addText="添加图文导航"
            onChange={this.handleChange}
            list={subEntry}
            canDelete
            canAdd={subEntry.length < this.getMaxImageNum()}
            onAdd={selectTempIndex === 0 ? this.addImageTextNav : this.addTextNav}
          >
            {subEntry.map((item, index) => (
              <SubEntryItem
                showImage={showMethod === imageNav}
                linkMenuItems={linkMenuItems}
                uploadConfig={uploadConfig}
                settings={settings}
                globalConfig={globalConfig}
                key={index}
                index={index}
                data={item}
                onChange={this.handleItemChange}
                showError={showError || this.getMetaProperty('sub_entry_item', 'touched')}
                error={
                  isArray(validation.sub_entry_item) ? validation.sub_entry_item[index] : undefined
                }
                helpText={selectTempIndex === 0 ? imageHelpText : textHelpText}
              />
            ))}
          </EditorCard>
        </ControlGroup>

        <Divider />

        <ControlGroup label="选择模板" value={TempTxt}>
          <RadioGroup value={tempType} onChange={this.handleTempChange}>
            <Radio name="count" value="0">
              图片导航
            </Radio>
            <Radio name="count" value="1">
              文字导航
            </Radio>
          </RadioGroup>
        </ControlGroup>

        <ControlGroup label="图片样式" value={slideSetting === '0' ? '固定' : '横向滑动'}>
          <RadioButton.Group value={slideSetting} onChange={this.onInputChange}>
            <RadioButton name="slide_setting" value="0" icon="fixed" tip="固定" />
            <RadioButton name="slide_setting" value="1" icon="scroll" tip="横向滑动" />
          </RadioButton.Group>
        </ControlGroup>

        {slideSetting === crossMode && (
          <ControlGroup label="一屏显示" focusOnLabelClick={false}>
            <Select value={count} onChange={this.handleSelectCount}>
              {this.getImageNavOptions()}
            </Select>
          </ControlGroup>
        )}

        <ControlGroup focusOnLabelClick={false} label="背景颜色">
          <ColorPicker
            defaultColor={resetBackgroundColor}
            color={backgroundColor}
            onChange={this.onBackgroundColorChange}
          />
        </ControlGroup>

        <ControlGroup focusOnLabelClick={false} label="文字颜色">
          <ColorPicker defaultColor={resetColor} color={color} onChange={this.onColorChange} />
        </ControlGroup>
      </div>
    );
  }

  static designType = 'image_text_nav';
  static designDescription = (
    <span>
      图文
      <br />
      导航
    </span>
  );

  static getInitialValue() {
    return {
      type: 'image_text_nav',
      sub_entry: [
        {
          type: 'image_ad_selection',
          title: '导航一',
          image_width: 188,
          image_height: 88,
          image_url: '',
        },
        {
          type: 'image_ad_selection',
          title: '导航二',
          image_url: '',
        },
        {
          type: 'image_ad_selection',
          title: '导航三',
          image_url: '',
        },
        {
          type: 'image_ad_selection',
          title: '导航四',
          image_url: '',
        },
      ],
      show_method: '8', // 8 图片导航，9 文字导航
      background_color: '#fff',
      color: '#000',
      slide_setting: '0', // 滑动设置 0 固定  1 横向滑动
      count: 4, // 横向滑动一屏显示的数量
      image_fill_style: '1', // 图片填充方式
      border_width: DEFAULT_IMAGE_SPACING, // 图片间隙
    };
  }

  static info = {
    icon: 'https://img.yzcdn.cn/public_files/2019/02/12/135fd18ac2eb5cf1f6d9e53637ed50fa.png',
    type: 'image_text_nav',
    name: '图文导航',
    maxNum: 10,
    usedNum: 0,
    status: COM_STATUS.NORMAL,
  };

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { sub_entry: subEntry, show_method: showMethod } = value;
      if (subEntry.length === 0) {
        errors.sub_entry = '请添加图文导航';
      }

      // 图片导航才需要验证图片是否选择
      if (showMethod === imageNav) {
        const isInvalid = some(subEntry, item => {
          return SubEntryItemValidate.validateImage(item.image_id || '');
        });

        if (isInvalid) {
          errors.sub_entry_item = map(subEntry, item => {
            return {
              image: SubEntryItemValidate.validateImage(item.image_id || ''),
            };
          });
        }
      } else {
        const isInvalid = some(subEntry, item => {
          return SubEntryItemValidate.validateTitle(item.title || '');
        });

        if (isInvalid) {
          errors.sub_entry_item = map(subEntry, item => {
            return {
              title: SubEntryItemValidate.validateTitle(item.title || ''),
            };
          });
        }
      }

      resolve(errors);
    });
  }
}
