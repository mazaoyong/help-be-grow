import React, { Component } from 'react';
import { Slider, Checkbox, Collapse } from 'zent';
import includes from 'lodash/includes';
// import get from 'lodash/get';
import { ControlGroup, RadioButton, Control, Divider } from '../../common';
import { isEduChainStore } from '@youzan/utils-shop';

import * as Enums from '../enums';
import * as Types from '../types';

const CheckboxGroup = Checkbox.Group;

const eduGoodsFilter = list => {
  const { isYZEdu } = _global;

  return isYZEdu
    ? isEduChainStore
      ? list.filter(([contentKey]) => contentKey !== 'live')
      : list
    : list.filter(([contentKey]) => contentKey !== 'course');
};

/**
 * 课程&课程分组公用商品样式编辑器
 */

export default class StyleEditor extends Component {
  state = {
    activeKey: ['course', 'content', 'column', 'live'],
  };
  render() {
    const { value, onInputChange, onCustomInputChange } = this.props;
    const { activeKey } = this.state;
    const {
      listMode = 0,
      goodsStyle = 0,
      goodsRadius = 0,
      goodsFrom,
      imgSize = 0,
      textStyle = 1,
      textAlign = 0,
      pageMargin = 15,
      goodsPadding = 10,
      type = Types.EDU_GOODS,
    } = value;

    const isRenderEduGoodsDisplayContent = type === Types.EDU_GOODS && goodsFrom !== 'group';
    return (
      <div className="decorate-edu-goods-style-editor">
        <Divider />

        <Control
          label="列表样式"
          block
          valueMap={{
            0: '大图模式',
            1: '一行两个',
            2: '一行三个',
            3: '详细列表',
            4: '一大两小',
            5: '横向滑动',
          }}
          name="size"
          options={[
            { value: 0, icon: 'big' },
            { value: 1, icon: 'small' },
            { value: 2, icon: 'three' },
            { value: 3, icon: 'list' },
            { value: 4, icon: 'hybrid' },
            {
              value: 5,
              icon: 'swipe',
              disabled: type === Types.EDU_GOODS_GROUP || goodsFrom === 'group',
            },
          ]}
          value={listMode}
          componentProps={{ block: true }}
          onChange={({ target }) => onCustomInputChange('listMode')(target.value)}
        />

        <Divider />

        <ControlGroup
          className="decorate-edu-goods-style-editor__goods-style"
          label="商品样式"
          block
        >
          <RadioButton.Group value={goodsStyle} onChange={onInputChange} perLine={4}>
            <RadioButton name="goodsStyle" value={0}>
              无边白底
            </RadioButton>
            <RadioButton name="goodsStyle" value={1}>
              卡片投影
            </RadioButton>
            <RadioButton name="goodsStyle" value={2}>
              描边白底
            </RadioButton>
            <RadioButton name="goodsStyle" value={3}>
              无边透明底
            </RadioButton>
          </RadioButton.Group>
        </ControlGroup>

        <Control
          label="商品倒角"
          valueMap={{
            0: '直角',
            1: '圆角',
          }}
          name="goodsRadius"
          options={[{ value: 0, icon: 'corner-straight' }, { value: 1, icon: 'corner-round' }]}
          value={goodsRadius}
          onChange={onInputChange}
        />

        <Control
          label="图片填充"
          valueMap={{
            0: '填充',
            1: '周边留白',
          }}
          name="imgSize"
          options={[{ value: 0, icon: 'img-cover' }, { value: 1, icon: 'img-contain' }]}
          value={imgSize}
          onChange={onInputChange}
        />

        <Control
          label="文本样式"
          valueMap={{
            0: '加粗体',
            1: '常规体',
          }}
          name="textStyle"
          options={[
            { value: 1, key: 'font-regular', icon: 'font-regular' },
            { value: 0, key: 'font-bold', icon: 'font-bold' },
          ]}
          value={textStyle}
          onChange={onInputChange}
        />

        <Control
          label="文本对齐"
          valueMap={{
            0: '左对齐',
            1: '居中对齐',
          }}
          name="textAlign"
          options={[{ value: 0, icon: 'align-left' }, { value: 1, icon: 'align-center' }]}
          value={textAlign}
          onChange={onInputChange}
        />

        <ControlGroup label="页面边距" normalAlign>
          <Slider
            min={0}
            max={30}
            value={Number(pageMargin)}
            onChange={val => onCustomInputChange('pageMargin')(val)}
          />
        </ControlGroup>

        <ControlGroup label="商品间距" normalAlign>
          <Slider
            min={0}
            max={30}
            value={Number(goodsPadding)}
            onChange={val => onCustomInputChange('goodsPadding')(val)}
          />
        </ControlGroup>

        <Divider />

        {isRenderEduGoodsDisplayContent ? (
          this.renderEduGoodsDisplayContent()
        ) : (
          <Collapse
            bordered={false}
            activeKey={activeKey}
            onChange={activeKey => this.setState({ activeKey })}
          >
            {eduGoodsFilter(Object.entries(Enums.styleControl.displayContent.items)).map(
              ([contentKey, list]) => (
                <Collapse.Panel title={Enums.goodsFrom[contentKey].label} key={contentKey}>
                  <CheckboxGroup
                    value={value.displayContent[contentKey]}
                    onChange={val => {
                      onCustomInputChange('displayContent')({
                        ...value.displayContent,
                        [contentKey]: val,
                      });
                    }}
                  >
                    {list.map(listItem => {
                      return (
                        <ControlGroup
                          label={listItem.label}
                          key={listItem.label}
                          value={
                            includes(value.displayContent[contentKey], listItem.value)
                              ? '显示'
                              : '不显示'
                          }
                        >
                          <Checkbox name={contentKey} value={listItem.value} />
                        </ControlGroup>
                      );
                    })}
                  </CheckboxGroup>
                </Collapse.Panel>
              )
            )}
          </Collapse>
        )}
      </div>
    );
  }

  renderEduGoodsDisplayContent = () => {
    const { value, onCustomInputChange } = this.props;
    const { goodsFrom } = value;
    const formItem = Enums.styleControl.displayContent;
    const key = 'displayContent';
    const items = formItem.items[goodsFrom];
    const renderCheckboxList = (name, list) =>
      list.map(({ label, value: itemValue }) => {
        return (
          <ControlGroup
            label={label}
            key={label}
            value={includes(value[name], itemValue) ? '显示' : '不显示'}
          >
            <Checkbox name={name} value={itemValue} />
          </ControlGroup>
        );
      });
    const vDom = (
      <CheckboxGroup
        value={value[key]}
        onChange={val => {
          onCustomInputChange(key)(val);
        }}
      >
        {renderCheckboxList(key, items)}
      </CheckboxGroup>
    );
    return vDom;
  };
}
