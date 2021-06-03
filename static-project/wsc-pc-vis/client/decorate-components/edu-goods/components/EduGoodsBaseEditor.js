import React, { Component } from 'react';
import { Checkbox, Input, Radio, NumberInput, Notify } from 'zent';
import unionBy from 'lodash/unionBy';
// import omit from 'lodash/omit';
// import slice from 'lodash/slice';
import { ControlGroup, EditorCard, Divider, Control, HelpDesc, LinkTag } from '../../common';
import { handleMaxNumGoods } from '../common';
import * as Types from '../types';
import * as Enums from '../enums';

import dialog from './dialog';
import { isEduChainStore } from '@youzan/utils-shop';
// import EduGoodsItem from './EduGoodsItem';
import { filterOmitKeys } from '../../utils/edu-utils';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const goodsFromMap = {
  course: {
    label: '课程',
  },
  content: {
    label: '内容',
  },
  column: {
    label: '专栏',
  },
  live: {
    label: '直播',
  },
};

const eduShopFilter = list => {
  const { isYZEdu } = window._global;

  return isYZEdu
    ? isEduChainStore
      ? list.filter(item => item.value !== Types.live)
      : list
    : list.filter(item => item.value !== Types.course);
};

/**
 * 课程商品
 */
export default class EduGoodsBaseEditor extends Component {
  constructor(props) {
    super(props);
  }

  handleCourseTypeChange = courseTypes => {
    if (Array.isArray(courseTypes) && courseTypes.length !== 0) {
      this.props.onChangeCustomMultiVal({
        courseType: courseTypes.length === 2 ? Enums.courseType.allCourse.value : courseTypes[0],
      });
    } else {
      Notify.error('请至少选择一个线下课类型');
    }
  };

  render() {
    const {
      value = {},
      onInputChange,
      onInputBlur,
      onCustomInputChange,
      onChangeCustomMultiVal,
    } = this.props;
    const {
      displayTitleBar,
      showAllGoodsEntry,
      title,
      sourceFrom = 0,
      goodsFrom,
      goodsFromMode,
      maxNewestGoods,
      goodList = [],
      groupList = [],
      courseType = Enums.courseType.allCourse.value,
    } = value;
    const isDisplayTitleBar = displayTitleBar === 1; // 是否展示标题栏
    // 课程类型多选，当 courseType === 2 时，表现为体验课和正式课都选中
    const courseTypes =
      courseType === Enums.courseType.allCourse.value
        ? [Enums.courseType.unofficialCourse.value, Enums.courseType.officalCourse.value]
        : [courseType];
    return (
      <div className="decorate-edu-goods-base-editor">
        <ControlGroup
          className="decorate-edu-goods-base-editor__title-bar"
          label="标题栏"
          value={isDisplayTitleBar ? '显示' : '不显示'}
        >
          <Checkbox
            checked={isDisplayTitleBar}
            onChange={({ target }) =>
              onCustomInputChange('displayTitleBar')(target.checked ? 1 : 0)
            }
          />
        </ControlGroup>

        {isDisplayTitleBar && (
          <ControlGroup
            className="decorate-edu-goods-base-editor__title"
            label="标题名称"
            labelAlign="top"
            // showError={isDisplayTitleBar || this.getMetaProperty('title', 'touched')}
            // error={validation.title}
            block
            bgColored
          >
            <Input
              name="title"
              value={title}
              placeholder="课程"
              onChange={onInputChange}
              onBlur={onInputBlur}
            />

            <ControlGroup
              className="decorate-edu-goods-base-editor__show-all"
              label="查看全部按钮"
              value={showAllGoodsEntry ? '显示' : '不显示'}
            >
              <Checkbox
                checked={showAllGoodsEntry}
                onChange={({ target }) => onCustomInputChange('showAllGoodsEntry')(target.checked)}
              />
            </ControlGroup>
          </ControlGroup>
        )}

        <Divider />

        <ControlGroup label="课程来源" labelAlign="top" focusOnLabelClick={false}>
          <RadioGroup
            value={sourceFrom}
            onChange={({ target }) => {
              const { value } = target;
              const defaultChecked = {
                course: [0, 1, 4],
                content: [0, 2, 3, 4],
                column: [0, 2, 3],
                live: [0, 2, 3],
              };
              const commonVal = {
                goodList: [],
                groupList: [],
                maxNewestGoods: 6,
                listMode: 0,
              };
              if (value === 0) {
                onChangeCustomMultiVal({
                  goodsFrom: _global.isYZEdu ? 'course' : 'column',
                  displayContent: defaultChecked.course,
                  ...commonVal,
                  sourceFrom: 0,
                });
              }
              if (value === 1) {
                onChangeCustomMultiVal({
                  goodsFrom: 'group',
                  goodsFromMode: 0,
                  displayContent: defaultChecked,
                  ...commonVal,
                  sourceFrom: 1,
                });
              }
            }}
          >
            <Radio name="sourceFrom" value={0}>
              课程
            </Radio>
            <Radio name="sourceFrom" value={1}>
              选择分组
            </Radio>
          </RadioGroup>
        </ControlGroup>

        {sourceFrom === 0 && (
          <>
            <Control
              label="课程类型"
              valueMap={{
                course: '线下课',
                content: '内容',
                column: '专栏',
                live: '直播',
              }}
              name="goodsFrom"
              options={eduShopFilter([
                { value: Types.course, key: 'xianxiake', icon: 'xianxiake' },
                { value: Types.column, key: 'zhuanlan', icon: 'zhuanlan' },
                { value: Types.content, key: 'neirong', icon: 'neirong' },
                { value: Types.live, key: 'zhibo', icon: 'zhibo' },
              ])}
              value={goodsFrom}
              onChange={({ target }) => {
                onChangeCustomMultiVal({
                  goodList: [],
                  goodsFrom: target.value,
                });
              }}
            />

            <ControlGroup
              label="选择方式"
              helpDesc={
                goodsFromMode === 1
                  ? `最多添加${Types.maxCanAddGoods}个课程，拖动选中的课程可对其排序`
                  : ''
              }
            >
              <RadioGroup
                className="goods-from-mode"
                value={goodsFromMode}
                onChange={({ target }) => onCustomInputChange('goodsFromMode')(target.value)}
              >
                <Radio name="goodsFromMode" value={0}>
                  展示最新的
                  <NumberInput
                    name="maxNewestGoods"
                    min={1}
                    max={Types.maxVisibleGoods}
                    value={maxNewestGoods}
                    onChange={val =>
                      onInputChange({ target: { value: parseInt(val), name: 'maxNewestGoods' } })
                    }
                  />
                  个课程
                </Radio>
                <Radio name="goodsFromMode" value={1}>
                  自定义
                </Radio>
              </RadioGroup>
            </ControlGroup>
          </>
        )}

        {/* 课程类型为线下课，选择方式是最新的x个课程 */}
        {goodsFrom === Types.course && goodsFromMode === 0 && (
          <ControlGroup
            label="线下课类型"
            helpDesc="如果同时勾选正式课和体验课，则展示时不区分类型，只按线下课创建时间从近到远展示"
          >
            <CheckboxGroup value={courseTypes} onChange={this.handleCourseTypeChange}>
              <Checkbox value={Enums.courseType.officalCourse.value}>
                {Enums.courseType.officalCourse.label}
              </Checkbox>
              <Checkbox value={Enums.courseType.unofficialCourse.value}>
                {Enums.courseType.unofficialCourse.label}
              </Checkbox>
            </CheckboxGroup>
          </ControlGroup>
        )}

        {sourceFrom === 1 && (
          <>
            <ControlGroup
              className="decorate-edu-goods-base-editor-control-group goods-group"
              showLabel={false}
              bgColored
            >
              <EditorCard
                addText={`选择分组`}
                onChange={val => onCustomInputChange('groupList')(val)}
                list={groupList}
                canAdd={groupList.length < 1}
                onAdd={this.onChooseGoods}
              >
                {groupList.map((item, index) => {
                  return (
                    <LinkTag
                      key={item.alias}
                      colored
                      url={item.url}
                      onEdit={this.onChooseGoods}
                      onClose={item.alias ? this.delGroup : false}
                    >
                      {item.title}
                    </LinkTag>
                  );
                })}
              </EditorCard>
            </ControlGroup>

            {groupList.length > 0 && (
              <ControlGroup label="显示个数" labelColored bgColored>
                <HelpDesc inline style={{ marginRight: '16px' }}>
                  最多显示50个分组中的商品
                </HelpDesc>
                <NumberInput
                  name="maxNewestGoods"
                  min={1}
                  max={50}
                  value={maxNewestGoods}
                  onChange={val =>
                    onInputChange({ target: { value: parseInt(val), name: 'maxNewestGoods' } })
                  }
                />
              </ControlGroup>
            )}
          </>
        )}

        {goodsFromMode === 1 && sourceFrom === 0 && (
          <ControlGroup
            className="decorate-edu-goods-base-editor-control-group"
            showLabel={false}
            bgColored
            canDelete
            style={{
              'margin-bottom': '10px',
            }}
          >
            <EditorCard
              addText={`添加${goodsFromMap[goodsFrom].label}`}
              onChange={val => onCustomInputChange('goodList')(val)}
              list={goodList}
              canAdd={goodList.length < Types.maxCanAddGoods}
              onAdd={this.onChooseGoods}
            >
              {goodList.map((item, index) => {
                return (
                  <div key={index} className="decorate-edu-goods-base-editor__subentry-item">
                    <i className="decorate-edu-goods-base-editor__icon-drag" />
                    {goodsFromMap[goodsFrom].label}
                    :&nbsp;
                    <a
                      href={item.url || item.liveDetailUrl || item.shortenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.title}
                    </a>
                    <i
                      className="decorate-edu-goods-base-editor__icon-delete"
                      onClick={() => {
                        goodList.splice(index, 1);
                        onCustomInputChange('goodList')(goodList);
                      }}
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

  /**
   * 从弹窗中添加商品
   * TODO 需要精简goodList的冗余字段
   */
  onChooseGoods = e => {
    const { globalConfig, value, onCustomInputChange } = this.props;
    const { goodsFrom = 'course', sourceFrom = 0 } = value;
    const isEduGoodsGroup = sourceFrom === 1;
    let { goodList, groupList } = value;
    const options = {
      config: globalConfig,
      multiple: !isEduGoodsGroup,
      onChoose: list => {
        if (isEduGoodsGroup) {
          groupList = list;
          groupList = groupList.map(item => {
            item.id = item.groupId;
            delete item.groupId;
            return item;
          });
          onCustomInputChange('groupList')(groupList);
        } else {
          goodList = handleMaxNumGoods(unionBy(goodList, list, 'alias'), Types.maxCanAddGoods);
          goodList = filterOmitKeys(goodList);
          onCustomInputChange('goodList')(goodList);
        }
      },
    };
    dialog(options, goodList)(goodsFrom);
  };

  handleSubEntryDeleted = index => {
    const { value, onCustomInputChange } = this.props;
    const { groupList } = value;
    groupList.splice(index, 1);
    onCustomInputChange('groupList', groupList);
  };

  // 删除分组
  delGroup = e => {
    e.preventDefault();
    const { onCustomInputChange } = this.props;
    onCustomInputChange('groupList')([]);
  };
}
