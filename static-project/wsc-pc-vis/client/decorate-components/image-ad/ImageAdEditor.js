import React from 'react';
import { DesignEditor } from '../editor-base/design-editor';
import assign from 'lodash/assign';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import isNil from 'lodash/isNil';
import includes from 'lodash/includes';
import { Radio, Slider } from 'zent';

import RadioButton from '../common/radio-button';
import SubEntryItem from '../common/subentry-item';
import EditorCard from '../common/editor-card';
import ImageAdHotAreaEditor from './ImageAdHotAreaEditor';
import Image from '../common/upload-image';
import ComponentTitle from '../common/component-title';
import ControlGroup from '../common/control-group';
import Divider from '../common/divider';
import { WEAPP_VERSION_MAP, IS_WEAPP_SETTING } from '../common/config';
import * as Constants from './constants';
import * as Helper from './helper';
import { DEFAULT_IMAGE_SPACING } from '../constants/image-spacing';
import { PAGE_MARGIN } from '../constants/page-margin';
import { COM_STATUS } from '../common/constants';

const RadioGroup = Radio.Group;

export default class ImageAdEditor extends DesignEditor {
  constructor(props) {
    super(props);
    this.state = assign({}, this.state, {
      selectTempIndex: Constants.DEFAUTL_INDEX,
    });
  }

  componentWillMount() {
    const { value } = this.props;
    this.handleTransformShowMethod(value);
  }

  hasHotAreaData = () => {
    return find(this.props.value.sub_entry, item => item.link_type === 'hotarea');
  };

  getTempIndex = (method, size) => {
    const noSize = isNil(size);

    return findIndex(
      Constants.tempTypeMap,
      item => item.value === method && (noSize || item.size === size)
    );
  };

  handleInputChange = ({ target }) => {
    this.props.onChange({
      [target.name]: target.value,
    });
  };

  handleTransformShowMethod = value => {
    const { show_method: showMethod, size } = value;

    switch (+showMethod) {
      case 0:
      case 5:
        this.onCustomInputChange('show_method')('5');
        this.setState({ selectTempIndex: Constants.CAROUSEL_INDEX });
        break;
      case 1:
        // 兼容老数据
        this.onCustomInputChange('show_method')('6');
        if (+size === 0) {
          this.setState({ selectTempIndex: Constants.BIG_SCORLL_INDEX });
        } else {
          this.setState({ selectTempIndex: Constants.SMALL_SCORLL_INDEX });
        }
        break;
      case 6:
        this.onCustomInputChange('show_method')('6');
        this.setState({
          selectTempIndex: this.getTempIndex(showMethod, size),
        });
        break;
      case 7:
        if (this.hasHotAreaData()) {
          this.setState({ selectTempIndex: Constants.HOT_AREA_INDEX });
        } else {
          this.setState({ selectTempIndex: Constants.TOP_DOWN_INDEX });
        }
        break;
      default:
        this.setState({ selectTempIndex: Constants.DEFAUTL_INDEX });
    }
  };

  handleTempChange = ({ target: { value = '0' } }) => {
    const index = +value;
    const item = Constants.tempTypeMap[index];

    this.changeSelectTpl(item, index);
  };

  changeSelectTpl = (item, index) => {
    if (this.state.selectTempIndex === index) return;

    const size = (Constants.tempTypeMap[index] || {}).size;

    // 之前选的是其他的，现在选热区
    if (index === Constants.HOT_AREA_INDEX) {
      this.props.onChange({
        show_method: item.value,
        sub_entry: Helper.transferOtherToHotAreaSubEntry(this.props.value.sub_entry),
        size,
      });

      // 之前选了热区，现在点其他的
    } else if (this.state.selectTempIndex === Constants.HOT_AREA_INDEX) {
      this.props.onChange({
        show_method: item.value,
        sub_entry: Helper.transferHotAreaToOtherSubEntry(this.props.value.sub_entry),
        size,
      });
    } else {
      this.props.onChange({
        show_method: item.value,
        size,
      });
    }

    // 编辑模块生效
    this.setState({
      selectTempIndex: index,
      tempTxt: this.renderTempTxt(index),
    });
  };

  uploadNormalImageCallback = data => {
    const subEntryData = Helper.transferSubEntry(data);
    this.uploadImageCallback(subEntryData);
  };

  uploadHotAreaImageCallback = data => {
    const subEntryData = Helper.transferHotAreaSubEntry(data);
    this.uploadImageCallback(subEntryData);
  };

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

  addImageAds = fromHotArea => {
    const { globalConfig, uploadConfig } = this.props;
    const options = {
      uploadConfig,
      callback: fromHotArea ? this.uploadHotAreaImageCallback : this.uploadNormalImageCallback,
      imgcdn: globalConfig.url && (globalConfig.url.imgqn || globalConfig.url.imgcdn),
    };
    Image.initialize(options);
  };

  handleItemChange = (subEntryItemData, index) => {
    const { value } = this.props;
    const { sub_entry: subEntry } = value;
    const subEntryData = Helper.updateSubEntry(subEntryItemData, index, subEntry);
    this.onCustomInputChange('sub_entry')(subEntryData);
  };

  handleImageSpacingChange = this.onCustomInputChange('border_width');
  handlePageMarginChange = this.onCustomInputChange('page_margin');

  getMaxImageNum = () => {
    if (this.state.selectTempIndex === Constants.IMAGE_NAV_INDEX) {
      // 左右滑动（导航） 可以添加更多图片
      return Constants.MAXNUM + 5;
    }
    return Constants.MAXNUM;
  };

  renderSuitableWidthText = () => {
    const selectTempIndex = this.state.selectTempIndex;
    if (selectTempIndex === Constants.CAROUSEL_INDEX) {
      return '建议尺寸750x350像素';
    }

    if (selectTempIndex === Constants.HOT_AREA_INDEX) {
      return `建议宽度750像素, 高度1000像素以内, 单张图片大小200kb以内`;
    }

    return `建议宽度${
      selectTempIndex === Constants.IMAGE_NAV_INDEX
        ? Math.round(750 / (this.props.value.count - 0.8) - 2)
        : Constants.tempTypeMap[selectTempIndex].suitableWidth
    }像素`;
  };

  renderTempTxt = (selectTempIndex = 0) => {
    return Constants.tempTypeMap[selectTempIndex].title;
  };

  renderIndicatorTxt = (indicator = 0) => {
    return ['', '样式一', '样式二', '样式三', '样式四'][+indicator];
  };

  render() {
    const {
      value,
      showError,
      validation,
      settings,
      globalConfig,
      uploadConfig,
      linkMenuItems,
    } = this.props;
    const { selectTempIndex } = this.state;
    const {
      sub_entry: subEntry,
      count = '6',
      image_fill_style: imageFillStyle = '1',
      border_width: imageSpacing,
      page_margin: pageMargin = PAGE_MARGIN,
      image_style: imageStyle = '1',
      corner_type: cornerType = '1',
      indicator = '1',
    } = value;

    const newCount = (+count > 6 ? 6 : count) + '';
    const tempType = selectTempIndex + '';
    const tempTxt = this.renderTempTxt(selectTempIndex);
    const indicatorTxt = this.renderIndicatorTxt(indicator);

    const noticeMsg =
      globalConfig.is_weapp_setting === IS_WEAPP_SETTING
        ? `（小程序路径需要小程序 v${WEAPP_VERSION_MAP.image_ad} 版本及以上）`
        : '';

    return (
      <div className="decorate-image-ad-editor">
        <ComponentTitle
          name="图片广告"
          noticeMsg={noticeMsg}
          url="https://help.youzan.com/displaylist/detail_4_4-2-22621"
          withMargin
        />

        <ControlGroup label="选择模板" block value={tempTxt}>
          <RadioButton.Group block value={tempType} onChange={this.handleTempChange}>
            <RadioButton
              name="selectTempIndex"
              value="0"
              icon="up2end"
              tip={this.renderTempTxt('0')}
            />
            <RadioButton
              name="selectTempIndex"
              value="1"
              icon="carousel"
              tip={this.renderTempTxt('1')}
            />
            <RadioButton
              name="selectTempIndex"
              value="2"
              icon="big-slide"
              tip={this.renderTempTxt('2')}
            />
            <RadioButton
              name="selectTempIndex"
              value="3"
              icon="small-slide"
              tip={this.renderTempTxt('3')}
            />
            <RadioButton
              name="selectTempIndex"
              value="4"
              icon="nav-slide"
              tip={this.renderTempTxt('4')}
            />
            <RadioButton
              name="selectTempIndex"
              value="5"
              icon="hotarea"
              tip={this.renderTempTxt('5')}
            />
          </RadioButton.Group>
        </ControlGroup>

        <Divider />

        <ControlGroup
          label="添加图片"
          helpDesc={`最多添加 ${this.getMaxImageNum()} 个广告，鼠标拖拽调整广告顺序，${this.renderSuitableWidthText()}`}
          labelColored
        />

        {selectTempIndex !== Constants.HOT_AREA_INDEX && (
          <ControlGroup
            showLabel={false}
            showError={showError}
            error={validation.sub_entry}
            focusOnLabelClick={false}
            className="decorate-image-ad-subentry-control-group"
            bgColored
          >
            <EditorCard
              className="decorate-image-ad-editor-card"
              list={subEntry}
              canDelete
              canAdd={subEntry.length < this.getMaxImageNum()}
              addText="添加背景图"
              onChange={this.handleChange}
              onAdd={() => this.addImageAds(false)}
            >
              {subEntry.map((item, index) => (
                <SubEntryItem
                  linkMenuItems={linkMenuItems}
                  globalConfig={globalConfig}
                  settings={settings}
                  uploadConfig={uploadConfig}
                  key={index}
                  index={index}
                  data={item}
                  onChange={this.handleItemChange}
                  helpText={Constants.helpText}
                  titleText="图片标题:"
                  titlePlaceholder="建议10个字以内，可不填"
                  linkText="跳转路径:"
                />
              ))}
            </EditorCard>
          </ControlGroup>
        )}

        {selectTempIndex === Constants.HOT_AREA_INDEX && (
          <ControlGroup
            showLabel={false}
            showError={showError}
            error={validation.sub_entry}
            focusOnLabelClick={false}
            className="decorate-image-ad-hotarea-subentry-control-group"
            bgColored
          >
            <EditorCard
              className="decorate-image-ad-editor-card"
              list={subEntry}
              canDelete
              canAdd={subEntry.length < this.getMaxImageNum()}
              addText="添加背景图"
              onChange={this.handleChange}
              onAdd={() => this.addImageAds(true)}
            >
              {subEntry.map((item, index) => (
                <div key={index} className="decorate-editor_subentry-item clearfix">
                  <ImageAdHotAreaEditor
                    data={item}
                    index={index}
                    linkMenuItems={linkMenuItems}
                    globalConfig={globalConfig}
                    settings={settings}
                    uploadConfig={uploadConfig}
                    subEntry={subEntry}
                    handleChange={this.handleChange}
                  />
                  {index === subEntry.length - 1 && (
                    <div className="decorate-image-ad-editor__add-ads-desc">
                      点击图片打开热区编辑器
                    </div>
                  )}
                </div>
              ))}
            </EditorCard>
          </ControlGroup>
        )}

        <Divider className="decorate-image-ad-editor__bottom-divider" />

        {selectTempIndex === Constants.IMAGE_NAV_INDEX && (
          <ControlGroup label="一屏显示:" focusOnLabelClick={false}>
            <RadioGroup value={newCount} onChange={this.onInputChange}>
              <Radio name="count" value="4">
                4张图片
              </Radio>
              <Radio name="count" value="5">
                5张图片
              </Radio>
              <Radio name="count" value="6">
                6张图片
              </Radio>
            </RadioGroup>
          </ControlGroup>
        )}

        <ControlGroup label="图片样式" value={imageStyle === '1' ? '常规' : '投影'}>
          <RadioButton.Group value={imageStyle} onChange={this.handleInputChange}>
            <RadioButton name="image_style" value="1" icon="image-ad-normal" tip="常规" />
            <RadioButton name="image_style" value="2" icon="shadow" tip="投影" />
          </RadioButton.Group>
        </ControlGroup>

        <ControlGroup label="图片倒角" value={cornerType === '1' ? '直角' : '圆角'}>
          <RadioButton.Group value={cornerType} onChange={this.handleInputChange}>
            <RadioButton name="corner_type" value="1" icon="corner-straight" tip="直角" />
            <RadioButton name="corner_type" value="2" icon="corner-round" tip="圆角" />
          </RadioButton.Group>
        </ControlGroup>

        {selectTempIndex === Constants.CAROUSEL_INDEX && (
          <ControlGroup label="填充方式" value={imageFillStyle === '1' ? '填充' : '周边留白'}>
            <RadioButton.Group value={imageFillStyle} onChange={this.handleInputChange}>
              <RadioButton name="image_fill_style" value="1" icon="img-cover" tip="填充" />
              <RadioButton name="image_fill_style" value="2" icon="img-contain" tip="周边留白" />
            </RadioButton.Group>
          </ControlGroup>
        )}

        {selectTempIndex === Constants.CAROUSEL_INDEX && (
          <ControlGroup className="control-indent" label="指示器" value={indicatorTxt}>
            <RadioButton.Group value={indicator} onChange={this.handleInputChange}>
              <RadioButton
                name="indicator"
                value="1"
                icon="indicator-1"
                tip={this.renderIndicatorTxt('1')}
              />
              <RadioButton
                name="indicator"
                value="2"
                icon="indicator-2"
                tip={this.renderIndicatorTxt('2')}
              />
              <RadioButton
                name="indicator"
                value="3"
                icon="indicator-3"
                tip={this.renderIndicatorTxt('3')}
              />
              <RadioButton
                name="indicator"
                value="4"
                icon="indicator-4"
                tip={this.renderIndicatorTxt('4')}
              />
            </RadioButton.Group>
          </ControlGroup>
        )}

        <ControlGroup label="页面边距" normalAlign>
          <Slider
            min={0}
            max={30}
            value={Number(pageMargin)}
            onChange={this.handlePageMarginChange}
          />
        </ControlGroup>

        {includes(Constants.IMAGE_SPACING_INDEX_BAG, selectTempIndex) && (
          <ControlGroup label="图片间距:" normalAlign focusOnLabelClick={false}>
            <Slider
              min={0}
              max={30}
              value={imageSpacing}
              onChange={this.handleImageSpacingChange}
            />
          </ControlGroup>
        )}
      </div>
    );
  }

  static designType = 'image_ad';

  static designDescription = (
    <span>
      图片
      <br />
      广告
    </span>
  );

  static info = {
    icon: 'https://img.yzcdn.cn/public_files/2019/02/12/3eca94ec0230266e1b9824b8379a5e3d.png',
    type: 'image_ad',
    name: '图片广告',
    maxNum: 50,
    usedNum: 0,
    status: COM_STATUS.NORMAL,
  };

  static getInitialValue() {
    return {
      sub_entry: [], // 图片数组
      show_method: '7', // 展示方法 5. 轮播 6. 横向滑动 7. 一行一个、绘制热区
      size: '0', // // 展示方法-老数据 0：大图；1：小图；2. 导航横向滑动；
      count: '6', // 横向滑动一屏展示数量
      image_fill_style: '1', // 图片填充类型
      border_width: DEFAULT_IMAGE_SPACING, // 图片间距
      image_style: '1', // 图片样式： 1. 常规 2. 阴影
      corner_type: '1', // 图片角类型： 1. 直角 2. 圆角
      indicator: '1', // 指示器类型，1-4
      page_margin: 0, // 页面边距
      type: 'image_ad',
    };
  }

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { sub_entry: subEntry } = value;
      if (subEntry.length === 0) {
        errors.sub_entry = '请添加广告图片';
      }
      resolve(errors);
    });
  }
}
