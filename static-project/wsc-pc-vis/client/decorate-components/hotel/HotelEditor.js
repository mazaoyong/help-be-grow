import React from 'react';
import { Slider, Checkbox, Radio, RadioGroup, Input } from 'zent';
import { DesignEditor } from '../editor-base/design-editor';
import { ComponentTitle, ControlGroup, RadioButton, Control, Divider, EditorCard } from '../common';
import openHotelListDialog from '../common/dialog/hotel-list-dialog';

const isInHotelStatus = window._global.in_hotel_status;
const markTypes = [
  {
    name: '新品',
    value: '0',
  },
  {
    name: '热卖',
    value: '1',
  },
  {
    name: 'NEW',
    value: '2',
  },
  {
    name: 'HOT',
    value: '3',
  },
  {
    name: '自定义',
    value: '4',
  },
];

class HotelEditor extends DesignEditor {
  handleSubEntryDeleted = index => {
    const { sub_entry: subEntry = [] } = this.props.value || {};
    const next = subEntry.filter((_one, i) => i !== index);
    this.onChange('sub_entry', next);
  };
  onChange = (name, val) => {
    const { value, onChange } = this.props;
    onChange({
      ...value,
      [name]: val,
    });
  };
  onTargetChange = (name, e) => {
    this.onChange(name, e.target.value);
  };
  onMarkChange = e => {
    const { value: prevValue, onChange } = this.props;
    const value = e.target.value;
    const [markType = {}] = markTypes.filter(one => one.value === value);
    const { name = '' } = markType;
    onChange({
      ...prevValue,
      mark_type: value,
      // 切到自定义的时候，mark_name为空
      mark_name: value === '4' ? '' : name,
    });
  };
  onEntryChange = val => {
    this.onChange('sub_entry', val);
  };
  onCheckboxChange = (name, e) => {
    this.onChange(name, e.target.checked ? '1' : '0');
  };
  onAddClick = () => {
    if (!isInHotelStatus) return;
    const {
      value: { sub_entry: entry },
    } = this.props;
    const selectedIds = entry.map(one => one.id);
    openHotelListDialog({
      title: '选择酒店',
      width: 800,
      selectedIds,
    }).then(res => {
      const entry = res.map(one => ({
        id: one.id,
        name: one.name,
      }));
      this.onChange('sub_entry', entry);
    });
  };
  render() {
    const { value, validation } = this.props;
    const {
      show_title: showTitle,
      show_title_all: showTitleAll,
      title,
      size,
      size_type: sizeType,
      border_radius_type: borderRadiusType,
      text_style_type: textStyleType,
      page_margin: pageMargin,
      card_margin: cardMargin,
      show_mark: showMark,
      mark_type: markType,
      mark_name: markName,
      sub_entry: subEntry,
    } = value;
    return (
      <div className="rc-design-component-hotel-editor">
        <ComponentTitle name="酒店" />

        <ControlGroup
          className="rc-design-component-hotel-editor__title-bar"
          label="标题栏"
          value={+showTitle ? '显示' : '不显示'}
        >
          <Checkbox
            checked={+showTitle}
            onChange={this.onCheckboxChange.bind(this, 'show_title')}
          />
        </ControlGroup>

        {+showTitle ? (
          <ControlGroup
            className="rc-design-component-hotel-editor__title"
            label="标题名称"
            labelAlign="top"
            showError={Boolean(validation.title)}
            error={validation.title}
            block
            bgColored
          >
            <Input
              name="title"
              value={title}
              placeholder="标题名称"
              onChange={this.onTargetChange.bind(this, 'title')}
            />

            <ControlGroup
              className="rc-design-component-hotel-editor__show-all"
              label="查看全部按钮"
              value={+showTitleAll ? '显示' : '不显示'}
            >
              <Checkbox
                name="hide_unshared_coupon"
                checked={+showTitleAll}
                onChange={this.onCheckboxChange.bind(this, 'show_title_all')}
              />
            </ControlGroup>
          </ControlGroup>
        ) : null}

        <Divider />

        <ControlGroup
          className="rc-design-component-hotel-editor__list-label"
          label="选择酒店"
          helpDesc="最多添加50个酒店，拖动选中的酒店可对其排序"
        />

        <ControlGroup
          className="rc-design-component-hotel-editor__list"
          showError={Boolean(validation.sub_entry)}
          error={validation.sub_entry}
          showLabel={false}
          bgColored
        >
          <EditorCard
            addText="添加酒店"
            onChange={this.onEntryChange}
            list={subEntry}
            canAdd={subEntry.length < 50}
            onAdd={this.onAddClick}
            disable={!isInHotelStatus}
            disableText="该组件需启用酒店预订Pro插件后才能使用，请先启用插件。"
          >
            {subEntry.map((item, index) => {
              return (
                <div key={index} className="rc-design-component-hotel-editor__subentry-item">
                  <i className="rc-design-component-hotel-editor__icon-drag" />
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.name}
                  </a>
                  <i
                    className="rc-design-component-hotel-editor__icon-delete"
                    onClick={() => this.handleSubEntryDeleted(index)}
                  />
                </div>
              );
            })}
          </EditorCard>
        </ControlGroup>

        <Divider />

        <Control
          label="列表样式"
          block
          valueMap={{
            0: '大图模式',
            3: '详细列表',
          }}
          name="size"
          options={[
            { value: '0', icon: 'big' },
            { value: '3', icon: 'list' },
          ]}
          value={size}
          componentProps={{ block: true }}
          onChange={this.onTargetChange.bind(this, 'size')}
        />

        <Divider />

        <ControlGroup
          className="rc-design-component-common-goods-layout-editor__size-type"
          label="酒店样式"
          block
        >
          <RadioButton.Group
            value={sizeType}
            onChange={this.onTargetChange.bind(this, 'size_type')}
            perLine={4}
          >
            <RadioButton name="size_type" value="0">
              无边白底
            </RadioButton>
            <RadioButton name="size_type" value="7">
              卡片投影
            </RadioButton>
            <RadioButton name="size_type" value="5">
              描边白底
            </RadioButton>
            <RadioButton name="size_type" value="2">
              无边透明底
            </RadioButton>
          </RadioButton.Group>
        </ControlGroup>

        <Control
          label="卡片倒角"
          valueMap={{
            1: '直角',
            2: '圆角',
          }}
          name="border_radius_type"
          options={[
            { value: '1', icon: 'corner-straight' },
            { value: '2', icon: 'corner-round' },
          ]}
          value={borderRadiusType}
          onChange={this.onTargetChange.bind(this, 'border_radius_type')}
        />

        <Control
          label="文本样式"
          valueMap={{
            1: '常规体',
            2: '加粗体',
          }}
          name="text_style_type"
          options={[
            { value: '1', icon: 'font-regular' },
            { value: '2', icon: 'font-bold' },
          ]}
          value={textStyleType}
          onChange={this.onTargetChange.bind(this, 'text_style_type')}
        />

        <ControlGroup label="页面边距" normalAlign>
          <Slider
            min={0}
            max={30}
            value={Number(pageMargin)}
            onChange={this.onChange.bind(this, 'page_margin')}
          />
        </ControlGroup>

        <ControlGroup label="卡片间距" normalAlign>
          <Slider
            min={0}
            max={30}
            value={Number(cardMargin)}
            onChange={this.onChange.bind(this, 'card_margin')}
          />
        </ControlGroup>

        <Divider />

        <ControlGroup label="推荐标签" value={+showMark ? '显示' : '不显示'}>
          <Checkbox checked={+showMark} onChange={this.onCheckboxChange.bind(this, 'show_mark')} />
        </ControlGroup>

        {+showMark === 1 && (
          <>
            <ControlGroup showLabel={false} bgColored>
              <RadioGroup value={markType} onChange={this.onMarkChange}>
                {markTypes.map(one => (
                  <Radio key={one.value} name="mark_type" value={one.value}>
                    {one.name}
                  </Radio>
                ))}
              </RadioGroup>
            </ControlGroup>
            {markType === '4' && (
              <div className="common-goods-layout__corner-mark">
                <ControlGroup
                  showError={Boolean(validation.mark_name)}
                  error={validation.mark_name}
                  block
                  bgColored
                >
                  <Input
                    placeholder="自定义标签"
                    width={116}
                    value={markName}
                    onChange={this.onTargetChange.bind(this, 'mark_name')}
                  />
                </ControlGroup>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  static info = {
    icon: 'https://img.yzcdn.cn/upload_files/2020/01/21/FiQAQnGiPpo8OWlbsG5DN6MKuZuw.png',
    type: 'hotel',
    name: '酒店',
    description: '酒店',
    maxNum: 5,
    usedNum: 0,
    status: '',
  };

  // 保存验证
  static validate(value) {
    const errors = {};
    const { title, sub_entry: subEntry, mark_name: markName } = value;
    if (title.length > 20) {
      errors.title = '标题名称不能超过20个字';
    }
    if (subEntry.length === 0) {
      errors.sub_entry = '请选择酒店';
    }
    if (markName > 4) {
      errors.mark_name = '标签名称不能超过4个字';
    }
    return Promise.resolve(errors);
  }

  static getInitialValue() {
    return {
      type: 'hotel',
      // 是否显示标题
      show_title: '1',
      // 是否显示全部
      show_title_all: '1',
      // 标题名称
      title: '酒店',
      // 酒店列表
      sub_entry: [],
      // 酒店列表bak
      sub_entry_bak: [],
      // 列表样式（0: 大图, 1: 小图, 2: 一大两小, 3: 详细列表)
      size: '0',
      // 酒店样式（0: 无边白底, 7: 卡片投影, 5: 描边白底, 2: 无边透明底）
      size_type: '0',
      // 酒店倒脚（1: 直角, 2: 圆角）
      border_radius_type: '1',
      // 文本样式（1: 常规体, 2: 加粗体)
      text_style_type: '1',
      // 页面边距
      page_margin: 16,
      // 卡片边距
      card_margin: 12,
      // 推荐标签
      show_mark: '0',
      // 推荐标签样式
      mark_type: '1',
      // 自定义标签名称
      mark_name: '热卖',
    };
  }
}

export default HotelEditor;
