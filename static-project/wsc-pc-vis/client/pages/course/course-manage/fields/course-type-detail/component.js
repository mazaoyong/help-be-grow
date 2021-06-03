import { Form } from '@zent/compat';
/* eslint-disable react/no-unsafe */
import React, { Component } from 'react';
import { Notify, Icon, Dialog, Button } from 'zent';
import ClassStockItem from './ClassStockItem';
import { createCustomStocks } from './init-stock-data';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import {
  COURSE_SELL_BY_CLASSTIME,
  COURSE_SELL_BY_TIME,
  COURSE_SELL_BY_TERM,
  TIME_LIST,
} from '../../constants';
import { isInStoreCondition } from 'fns/chain';
import VersionWrapper from 'fns/version';
import { assign } from 'lodash';

const { getControlGroup } = Form;
const { openDialog, closeDialog } = Dialog;

// eslint-disable-next-line react/no-unsafe
class CourseStockTable extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      (!this.props.isEdit || (this.props.isEdit && this.props.isFromCustomer)) &&
      this.props.courseSellType !== nextProps.courseSellType
    ) {
      this.props.zentForm.setFormDirty(false);
      this.props.onChange(createCustomStocks(nextProps.courseSellType));
    } else if (
      this.props.courseSellType === nextProps.courseSellType &&
      get(this.props, 'applyCourse.eduCourse.classRelatedInfo.content') &&
      !get(nextProps, 'applyCourse.eduCourse.classRelatedInfo')
    ) {
      this.props.onChange(createCustomStocks(nextProps.courseSellType));
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.courseSellType !== nextProps.courseSellType) {
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.currentClassSet = [];
  }

  branchShopWrapArray = (index, list) => {
    if (
      index === 3 &&
      isInStoreCondition({
        supportEduHqStore: true,
      })
    ) {
      list[index] = '';
    }

    return list;
  };

  getTableColumns = () => {
    const { courseSellType } = this.props;
    switch (courseSellType) {
      case 1:
        return this.branchShopWrapArray(3, COURSE_SELL_BY_CLASSTIME);
      case 2:
        return this.branchShopWrapArray(3, COURSE_SELL_BY_TIME);
      case 3:
        return this.branchShopWrapArray(4, COURSE_SELL_BY_TERM);
    }
    return this.branchShopWrapArray(3, COURSE_SELL_BY_CLASSTIME);
  };

  onCourseAdd = () => {
    const { value, onChange } = this.props;
    if (value && value.length >= 20) {
      Notify.error('不能超过20条');
      return;
    }
    const items = [].concat(value).concat(createCustomStocks());
    onChange(items);
  };

  onClassChange = (itemIndex, classInfo) => {
    const { value, onChange } = this.props;
    const { eduClassName, maxStuNum, endTime, stockNum, description, eduCourseId, id } = classInfo;
    const curItem = { ...value[itemIndex] };
    const { eduClassDTO } = curItem;
    const nextEduClassDTO = {
      ...eduClassDTO,
      eduClassName,
      maxStuNum,
      endTime,
      description,
      eduCourseId,
    };
    const nextItems = [].concat(cloneDeep(value));
    nextItems[itemIndex] = assign({}, nextItems[itemIndex], {
      eduClassDTO: nextEduClassDTO,
      stockNum,
      classTime: description,
      updateOptionId: `${id}-${+new Date()}`,
    });
    // change value;
    onChange(nextItems);
  };

  onCourseRemove = itemIndex => {
    const { value, onChange } = this.props;
    if (value && value.length <= 1) {
      return;
    }
    if (
      isInStoreCondition({ supportEduHqStore: true }) &&
      this.props.courseSellType === 3 &&
      this.props.isEdit
    ) {
      openDialog({
        title: '移除关联班级',
        dialogId: 'class-dialog-remove',
        children: (
          <div>
            <p>确认移除关联班级吗？</p>
            <p>移除后，班级所属的校区将无法查看该课程规格。</p>
          </div>
        ),
        footer: (
          <>
            <Button onClick={() => closeDialog('class-dialog-remove')}>取消</Button>
            <Button
              onClick={() => {
                const items = [].concat(value);
                items.splice(itemIndex, 1);
                onChange(items);
                closeDialog('class-dialog-remove');
              }}
              type="primary"
            >
              确认
            </Button>
          </>
        ),
      });
    } else {
      const items = [].concat(value);
      items.splice(itemIndex, 1);
      onChange(items);
    }
  };

  onItemChange = (data, col, rowNum) => {
    const { value, onChange, courseSellType, applyCourse } = this.props;
    const content = get(applyCourse, 'eduCourse.classRelatedInfo.content');
    const eduClassDTO = (content && content.find(item => item.id === data)) || {};
    const items = [].concat(cloneDeep(value));
    if (col === 'courseProp' && data) {
      if (courseSellType === 1) {
        data = `${data}课时`;
        items[rowNum][col] = data;
      } else if (courseSellType === 2) {
        let unit = TIME_LIST[data.unit - 1];

        if (unit === '月') {
          unit = '个月';
        }

        data = `${data.range}${unit}`;
        items[rowNum][col] = data;
      } else if (courseSellType === 3) {
        if (content) {
          const item = content.find(item => item.id === data);
          items[rowNum]['eduClassDTO'] = { ...eduClassDTO, id: data };
          items[rowNum]['classTime'] = item.description;
          items[rowNum]['stockNum'] = item.stuEnableNumber;
          items[rowNum][col] = String(item.id || '');
          item.type = 0;
          items[rowNum]['v1'] = items[rowNum]['v1'] ? items[rowNum]['v1'] : (eduClassDTO.eduClassName || '');
        }
      }
    } else {
      items[rowNum][col] = data;
    }
    onChange(items);
  };

  getEduCourseDetail = () => {
    const { courseSellType, courseType, applyCourse, value } = this.props;
    const eduCourseDetail = cloneDeep(applyCourse.eduCourse) || {};
    if (courseSellType === 3 && courseType === 1 && get(eduCourseDetail, 'classRelatedInfo')) {
      let classInfo = [].concat(eduCourseDetail.classRelatedInfo.content);
      classInfo = classInfo.map(item => {
        if (
          value.length &&
          value.find(valueItem => {
            return valueItem.eduClassDTO && valueItem.eduClassDTO.id === item.id;
          })
        ) {
          item.type = item.id; // 已关联线下课
        }
        return item;
      });
      eduCourseDetail.classRelatedInfo.content = classInfo;
    }
    return eduCourseDetail;
  };

  render() {
    const {
      courseType,
      courseSellType,
      value,
      isStockIndependent,
      isEdit,
      disabled,
      disabledMsg,
    } = this.props;
    const educourse = this.getEduCourseDetail();
    return (
      <div className="course-table-wrap">
        <table className="course-sku-table">
          <thead>
            <tr className="course-table-header">
              {this.getTableColumns().map((columnName, columnIndex) => {
                return (
                  <th key={columnIndex} value={columnIndex}>
                    <span>
                      {columnName.startsWith('*') ? <em className="zent-form__required">*</em> : ''}
                      {columnName.replace('*', '')}
                    </span>
                  </th>
                );
              })}
              <th />
            </tr>
          </thead>
          <tbody>
            {value.map((item, itemIndex) => {
              return (
                <ClassStockItem
                  key={itemIndex}
                  rowNumber={itemIndex}
                  length={value.length}
                  isEdit={isEdit}
                  disabled={disabled}
                  disabledMsg={disabledMsg}
                  onItemChange={(value, colNum, rowNum) => {
                    this.onItemChange(value, colNum, rowNum);
                  }}
                  onRemove={() => this.onCourseRemove(itemIndex)}
                  onClassChange={this.onClassChange}
                  courseSellType={courseSellType}
                  value={item}
                  eduCourse={educourse}
                  courseType={courseType}
                  isStockIndependent={isStockIndependent}
                />
              );
            })}
          </tbody>
        </table>
        <div className="course-table-foot">
          <VersionWrapper
            name="course-manage-skuadd"
            downgrade={{
              from: courseSellType === 3 && isEdit && get(educourse, 'id'),
            }}
          >
            <span
              className={
                isInStoreCondition({
                  supportEduBranchStore: true,
                })
                  ? 'course-sku-add disable-pointer-input'
                  : 'course-sku-add'
              }
              onClick={() => this.onCourseAdd()}
              style={{ padding: '0 10px' }}
            >
              <Icon type="plus" className="blue-plus" />
              添加{courseSellType === 2 ? '时段' : courseSellType === 1 ? '课时' : ''}
            </span>
          </VersionWrapper>
        </div>
      </div>
    );
  }
}

export default getControlGroup(CourseStockTable);
