import { Select } from '@zent/compat';
import React from 'react';
import { DesignEditor } from '../editor-base/design-editor';
import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import max from 'lodash/max';
import pick from 'lodash/pick';
import { Slider } from 'zent';
import SubEntryItem from '../common/subentry-item';
import RadioButton from '../common/radio-button';
import ControlGroup from '../common/control-group';
import Cube from './Cube';
import * as Constants from './constants';
import ComponentTitle from '../common/component-title';
import { WEAPP_VERSION_MAP, IS_WEAPP_SETTING } from '../common/config';
import { DEFAULT_IMAGE_SPACING } from '../constants/image-spacing';
import { COM_STATUS } from '../common/constants';

const Option = Select.Option;

export default class CubeEditor extends DesignEditor {
  constructor(props) {
    super(props);
    this.state = assign({}, this.state, {
      subEntryIndex: 0, // 当前上传的图片对应的魔方块
    });
  }

  handleChangeSubEntryIndex = index => {
    this.setState({ subEntryIndex: index });
  };

  handleSelectLayout = (e, data) => {
    const value = data.value;
    this.props.onChange({
      layout_width: value,
      layout_height: value,
      width: value,
      height: value,
      sub_entry: [],
    });
  };

  handleTempChange = ({ target: { value = '0' } }) => {
    const index = +value;
    // const item = Constants.tempTypeMap[index];

    this.handleSelectTemp(null, index);
  };

  handleSelectTemp = (value, index) => {
    const onChange = this.props.onChange;
    let data;
    switch (index) {
      case 0:
        data = {
          layout_width: 2,
          layout_height: 1,
          width: 2,
          height: 1,
        };
        break;
      case 1:
        data = {
          layout_width: 3,
          layout_height: 1,
          width: 3,
          height: 1,
        };
        break;
      case 2:
        data = {
          layout_width: 4,
          layout_height: 1,
          width: 4,
          height: 1,
        };
        break;
      default:
        data = {
          layout_width: 4,
          layout_height: 4,
          width: 4,
          height: 4,
        };
        break;
    }
    const subEntry = this.props.value.sub_entry;
    let newSubEntry = [];
    if (index !== Constants.tempTypeMap.length - 1) {
      newSubEntry = Constants.tempSubEntrySizeMap[index].map((item, i) => {
        return assign(
          {},
          item,
          {
            type: 'cube_selection',
            title: '',
            image_id: '',
            image_url: '',
            image_thumb_url: '',
            image_width: '',
            image_height: '',
            link_id: '',
            link_type: '',
            link_title: '',
            link_url: '',
            alias: '',
          },
          pick(subEntry[i], [
            'type',
            'title',
            'image_id',
            'image_url',
            'image_thumb_url',
            'image_width',
            'image_height',
            'link_id',
            'link_type',
            'link_title',
            'link_url',
            'alias',
            'extra_data',
          ])
        );
      });
    }

    this.setState({ subEntryIndex: 0 });
    onChange(
      assign({}, data, {
        show_method: index,
        sub_entry: newSubEntry,
      })
    );
  };

  handleChangeCube = subEntryData => {
    this.setState({ subEntryIndex: subEntryData.length - 1 });

    // 当选择行不满魔方行密度时,传给小程序的layout_height为当前已选的行数
    const maxY = max(subEntryData.map(item => item.y + item.height));

    this.props.onChange({
      sub_entry: subEntryData,
      layout_height: maxY,
    });
  };

  handleItemChange = subEntryItemData => {
    const subEntry = cloneDeep(this.props.value.sub_entry);
    subEntry[this.state.subEntryIndex] = subEntryItemData;
    this.props.onChange({
      sub_entry: subEntry,
    });
  };

  handleDeleteSubEntry = e => {
    e.stopPropagation();
    const subEntry = cloneDeep(this.props.value.sub_entry);
    const subEntryIndex = this.state.subEntryIndex;
    subEntry.splice(subEntryIndex, 1);

    // 当选择行不满魔方行密度时,传给小程序的layout_height为当前已选的行数
    const maxY = max(subEntry.map(item => item.y + item.height));

    this.props.onChange({
      sub_entry: subEntry,
      layout_height: maxY,
    });

    this.setState({
      subEntryIndex: subEntryIndex >= 1 ? subEntryIndex - 1 : 0,
    });
  };

  handleImageSpacingChange = this.onCustomInputChange('border_width');
  handlePageMarginChange = this.onCustomInputChange('page_margin');

  renderShowMethodTxt = (showMethod = 0) => {
    return Constants.tempTypeMap[+showMethod].title;
  };

  render() {
    const {
      value,
      globalConfig,
      settings,
      uploadConfig,
      showError,
      validation,
      linkMenuItems,
    } = this.props;
    const {
      show_method: showMethod,
      width,
      sub_entry: subEntry,
      border_width: imageSpacing,
      page_margin: pageMargin,
    } = value;
    const subEntryIndex = this.state.subEntryIndex;
    const isCustom = showMethod === Constants.tempTypeMap.length - 1;
    const noticeMsg =
      globalConfig.is_weapp_setting === IS_WEAPP_SETTING
        ? `（小程序路径需要小程序 v${WEAPP_VERSION_MAP.cube} 版本及以上）`
        : '';
    const showMethodValue = showMethod + '';
    const showMethodTxt = this.renderShowMethodTxt(showMethod);

    return (
      <div className="decorate-cube-editor">
        <ComponentTitle
          name="魔方"
          noticeMsg={noticeMsg}
          url="https://help.youzan.com/qa?cat_sys=K#/menu/2211/detail/536?_k=3pkr2l"
          withMargin
        />

        {isCustom && (
          <ControlGroup label="魔方密度:" focusOnLabelClick={false}>
            <Select value={width} onChange={this.handleSelectLayout}>
              {Constants.cubeLayoutArray.map((item, index) => {
                return <Option value={item} key={index}>{`${item}X${item}`}</Option>;
              })}
            </Select>
          </ControlGroup>
        )}

        <ControlGroup
          label="魔方布局"
          labelAlign="top"
          focusOnLabelClick={false}
          showError={showError}
          error={
            validation.sub_entry_empty ||
            validation.sub_entry_empty_image ||
            validation.sub_entry_empty_col
          }
          helpDesc={
            isCustom
              ? '移动鼠标选定布局区域大小'
              : `选定布局区域，在下方添加图片${showMethod < 3 ? '，建议添加比例一致的图片' : ''}`
          }
          block
        >
          <Cube
            {...value}
            /* eslint-disable */
            ref="cube"
            /* eslint-disable */
            handleChangeCube={this.handleChangeCube}
            subEntryIndex={subEntryIndex}
            handleChangeSubEntryIndex={this.handleChangeSubEntryIndex}
            handleDeleteSubEntry={this.handleDeleteSubEntry}
          />
        </ControlGroup>

        {subEntry.length > 0 && (
          <div className="decorate-cube-editor__entry-wrap">
            <SubEntryItem
              globalConfig={globalConfig}
              settings={settings}
              uploadConfig={uploadConfig}
              linkMenuItems={linkMenuItems}
              index={subEntryIndex}
              data={subEntry[subEntryIndex]}
              onChange={this.handleItemChange}
              showTitle={false}
              showError={false}
            />
          </div>
        )}

        <ControlGroup label="选择模板" block value={showMethodTxt}>
          <RadioButton.Group perLine={6} value={showMethodValue} onChange={this.handleTempChange}>
            <RadioButton name="showMethod" value="0" icon="cuberow"  tip={this.renderShowMethodTxt(0)} />
            <RadioButton name="showMethod" value="1" icon="cuberow2"  tip={this.renderShowMethodTxt(1)} />
            <RadioButton name="showMethod" value="2" icon="cuberow1"  tip={this.renderShowMethodTxt(2)} />
            <RadioButton name="showMethod" value="3" icon="cube"  tip={this.renderShowMethodTxt(3)} />
            <RadioButton name="showMethod" value="4" icon="cubeto"  tip={this.renderShowMethodTxt(4)} />
            <RadioButton name="showMethod" value="5" icon="cube-upto" tip={this.renderShowMethodTxt(5)}  />
            <RadioButton name="showMethod" value="6" icon="cubeto1"  tip={this.renderShowMethodTxt(6)} />
            <RadioButton name="showMethod" value="7" icon="cube-custom" tip={this.renderShowMethodTxt(7)}  />
          </RadioButton.Group>
        </ControlGroup>

        <ControlGroup label="图片间隙" focusOnLabelClick={false} normalAlign>
          <Slider min={0} max={30} value={imageSpacing} onChange={this.handleImageSpacingChange} />
        </ControlGroup>

        <ControlGroup label="页面间距" focusOnLabelClick={false} normalAlign>
          <Slider min={0} max={30} value={pageMargin} onChange={this.handlePageMarginChange} />
        </ControlGroup>

        {/* {showMethod >= 3 && (
          <div className="help-desc">
            <div>新魔方图片比例与要求的不一致会被裁剪, </div>
            <div>习惯使用老魔方的用户可以使用图片广告热区功能</div>
          </div>
        )} */}
      </div>
    );
  }

  // 组件的类型
  static designType = 'cube_v3';

  // 组件的描述
  static designDescription = '魔方';

  // 添加组件时调用，用来获取新组件的初始值
  static getInitialValue() {
    return {
      sub_entry: [
        {
          x: 0,
          y: 0,
          width: 1,
          height: 1,
          type: 'cube_selection',
          title: '',
          image_id: '',
          image_url: '',
          image_thumb_url: '',
          image_width: 0,
          image_height: 0,
          link_id: '',
          link_type: '',
          link_title: '',
          link_url: '',
          alias: '',
        },
        {
          x: 1,
          y: 0,
          width: 1,
          height: 1,
          type: 'cube_selection',
          title: '',
          image_id: '',
          image_url: '',
          image_thumb_url: '',
          image_width: 0,
          image_height: 0,
          link_id: '',
          link_type: '',
          link_title: '',
          link_url: '',
          alias: '',
        },
      ],
      layout_width: 2,
      layout_height: 1,
      width: 2,
      height: 1,
      show_method: 0,
      page_margin: 0, // 页面间距
      border_width: DEFAULT_IMAGE_SPACING,
      type: 'cube_v3',
    };
  }

  static info = {
    icon: 'https://img.yzcdn.cn/public_files/2019/02/12/6c2cc2100fa2db454aaf649c19e0ffc9.png',
    type: 'cube_v3',
    name: '魔方',
    maxNum: 20,
    usedNum: 0,
    status: COM_STATUS.NORMAL,
  };

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const {
        sub_entry: subEntry,
        show_method: showMethod,
        width,
        layout_height: layoutHeight,
      } = value;

      if (subEntry.length === 0) {
        errors.sub_entry_empty = '请选定布局区域大小';
      }

      const hasEmptyImage = subEntry.some(item => item.image_id === '');

      if (hasEmptyImage) {
        errors.sub_entry_empty_image = '请添加图片';
      }

      const addMatrix = (colStart, colEnd, row) => {
        return (((colStart + colEnd) * (colEnd - colStart + 1)) / 2) * row;
      };
      const matrixSum = addMatrix(1, width, layoutHeight);

      if (showMethod === Constants.tempTypeMap.length - 1) {
        // 自定义时列必须选满
        const maxX = max(subEntry.map(item => item.x + item.width));
        let subEntrySum = 0;
        subEntry.forEach(item => {
          subEntrySum += addMatrix(item.x + 1, item.x + item.width, item.height);
        });

        if (maxX < width || subEntrySum < matrixSum) {
          errors.sub_entry_empty_col = '列必须添加满';
        }
      }
      resolve(errors);
    });
  }
}
