import { Pop } from '@zent/compat';
/* eslint-disable indent */
import React, { Component, PureComponent } from 'react';
import DropdownSelector from '../dropdown-selector';
import InputStockFieldWrap from '../input-stock-field';
import DropdownList from '../input-dropdownlist';
import cx from 'classnames';
import { assign, get } from 'lodash';
import { TIME_LIST } from '../../constants';
import { isInStoreCondition, ShowWrapper } from 'fns/chain';
import VersionWrapper from 'fns/version';
import { Input } from 'zent';
import { EduClassNewDialog } from '@ability-center/assets/edit-class-new';
import { EventContext } from '../../common/context';

class ClassStockItem extends (PureComponent || Component) {
  static contextType = EventContext;

  getRequiredValidation = (errorMessage, type) => {
    const { courseType, courseSellType } = this.props;
    const validation = {};
    if (courseType !== 0 && courseSellType === type) {
      validation['required'] = (formValue, value) => {
        if (value === undefined || value === '') {
          return errorMessage;
        }
        return true;
      };
    }
    return validation;
  };

  getDropdownListValidation = () => {
    const { courseType, courseSellType } = this.props;
    const validation = {};
    if (courseType !== 0 && courseSellType === 2) {
      validation['required'] = (formValue, value) => {
        if (!value || !value.range) {
          return '请输入时段数量';
        }
        return true;
      };
      validation['max'] = (_, value) => {
        if (value.range && +value.range > 999) {
          return `最大值不能超过999`;
        }
        return true;
      };
      validation['min'] = (_, value) => {
        if (value.range && +value.range < 1) {
          return `最小值不能低于1`;
        }
        return true;
      };
    }
    return validation;
  };

  getNumberRangeValidation = (minValue, maxValue, type) => {
    const { courseType, courseSellType } = this.props;
    return courseType !== 0 && courseSellType === type
      ? {
          max(_, value) {
            if (+value > maxValue) {
              return `最大值不能超过${maxValue}`;
            }
            return true;
          },
          min(_, value) {
            if (+value < minValue) {
              return `最小值不能低于${minValue}`;
            }
            return true;
          },
        }
      : {};
  };

  formatClassTime = value => {
    if (this.props.courseSellType !== 1) {
      return '';
    }
    if (value) {
      return parseFloat(value.replace('课时', ''));
    }
    return value;
  };

  formatTime = value => {
    if (this.props.courseSellType !== 2) {
      return { range: '', unit: 1 };
    }
    if (value) {
      let range = value.slice(0, -1);
      if (/个月$/.test(value)) {
        range = value.slice(0, -2);
      }

      return { range, unit: TIME_LIST.indexOf(value.slice(-1)) + 1 };
    }
    return { range: value, unit: 1 };
  };

  getClassName = (classNames, type) => {
    const { courseSellType } = this.props;
    return cx(classNames, {
      hide: courseSellType !== type,
    });
  };

  getDate = time => {
    if (!time) {
      return '';
    }
    const dateString = new Date(time);
    return `${dateString.getFullYear()}-${dateString.getMonth() + 1}-${dateString.getDate()}`;
  };

  getClassTimeRange = () => {
    const { value } = this.props;
    if (value['classTime']) {
      return value['classTime'];
    } else if (value['eduClassDTO'] && value['eduClassDTO']['startTime']) {
      return `${this.getDate(value['eduClassDTO']['startTime'])}至${this.getDate(
        value['eduClassDTO']['endTime'],
      )}`;
    }
    return '';
  };

  getStockNum = () => {
    const { eduCourse, value } = this.props;
    const stockNum = get(eduCourse, ['classRelatedInfo', 'content']) ? value['stockNum'] : 0;
    return stockNum;
  };

  getDisableField = element => {
    // Number input 和 Dropdown 放到 Pop 里面有bug，所以我们只能用 Input 去模拟 Number Input 和 Dropdown的行为，
    // 如果新版的 zent 修改好了的话，这段代码再还原为 Pop 里面包原来的 element
    if (this.props.disabled && this.props.disabledMsg) {
      return this.renderCommonPop({ element, disabledMsg: this.props.disabledMsg });
    }
    if (
      isInStoreCondition({
        supportEduBranchStore: true,
      })
    ) {
      return React.cloneElement(element, { disabled: true });
    }
    return element;
  };

  isForbidAlterContains = rowNumber => () => {
    const { isStockIndependent, value } = this.props;
    const { eduCourse } = this.props;
    const classRelatedInfoContent = get(eduCourse, ['classRelatedInfo', 'content', rowNumber], {});
    const { endTime } = classRelatedInfoContent;
    if (new Date(endTime) - new Date() <= 0) {
      // 已结班
      return true;
    }
    if (!value.courseProp) {
      return true;
    }
    return isInStoreCondition({
      supportEduBranchStore: !isStockIndependent,
    });
  };

  wrapperDisableField = ({ disabledMsg, element, position } = {}) => {
    if (disabledMsg) {
      return this.renderCommonPop({ element, disabledMsg, position });
    }
    return element;
  };

  openClassDialog = rowNumber => () => {
    const { eduCourse } = this.props;
    const eduClassDTO = get(this.props, ['value', 'eduClassDTO'], {});
    const classRelatedInfoContent = get(eduCourse, ['classRelatedInfo', 'content', rowNumber], {});
    const { shopName } = classRelatedInfoContent;
    const { eduCourse: { id: eduCourseId, name: eduCourseName } = {} } = this.props;
    const { kdtId, maxStuNum = 0, stuEnableNumber = 0 } = eduClassDTO;
    const curStockNum = this.getStockNum();
    const realMaxStuNum = maxStuNum || stuEnableNumber;
    const currentStuNum = realMaxStuNum >= curStockNum ? realMaxStuNum - curStockNum : 0;
    const courseInfo = { eduCourseId, eduCourseName };
    const nextEduClass = { ...eduClassDTO, ...courseInfo, maxStuNum: realMaxStuNum };
    EduClassNewDialog.open('编辑班级', {
      defaultData: {
        eduClass: nextEduClass,
        classStat: {
          currentStuNum,
        },
        shopName,
        kdtId,
      },
      onClassCallback: nextClass => {
        const { maxStuNum: nextMaxStuNum } = nextClass;
        let nextStockNum = nextMaxStuNum;
        if (maxStuNum) {
          // 班级名额已消耗过，避免新增的时候重复计算
          nextStockNum = nextMaxStuNum - maxStuNum + curStockNum;
        }
        const nextClassInfo = {
          ...nextClass,
          stockNum: nextStockNum,
        };
        this.context.emit('$updateCourseClass', nextClassInfo);
        this.props.onClassChange(rowNumber, nextClassInfo);
      },
    });
  };

  renderCommonPop({ element, disabledMsg, position = 'top-left' }) {
    const { name, value, width, placeholder, dropdownData, data } = element.props || {};
    let formattedValue = value;
    if (data && data.classRelatedInfo && data.classRelatedInfo.content) {
      const eduClass = data.classRelatedInfo.content.find(item => item.id === value);
      formattedValue = eduClass && eduClass.eduClassName;
    } else if (dropdownData) {
      formattedValue = value.range + dropdownData[value.unit - 1];
    } else if (data && data.name) {
      formattedValue = data.name;
    }
    return (
      <Pop trigger="hover" position={position} content={disabledMsg}>
        <Input
          disabled
          name={name}
          value={formattedValue}
          width={width}
          placeholder={placeholder}
        />
      </Pop>
    );
  }

  render() {
    const {
      value,
      onRemove,
      rowNumber,
      onItemChange,
      eduCourse,
      courseSellType,
      isStockIndependent,
      isEdit,
    } = this.props;
    const updateOptionId = value.updateOptionId;
    return (
      <tr className="course-table-row">
        {courseSellType === 1 && (
          <React.Fragment>
            <td className={this.getClassName('class-description-input', 1)}>
              {this.getDisableField(
                <InputStockFieldWrap
                  onChange={e => {
                    return onItemChange(e.target.value, 'v1', rowNumber);
                  }}
                  name={`stockField${rowNumber}1`}
                  width="130px"
                  placeholder="如10课时、10节课"
                  maxLength={20}
                  type={1}
                  value={value.v1}
                />,
              )}
            </td>
            <td className={this.getClassName('class-time-input', 1)}>
              {this.getDisableField(
                <InputStockFieldWrap
                  onChange={e => onItemChange(e.toString(), 'courseProp', rowNumber)}
                  value={this.formatClassTime(value.courseProp)}
                  name={`stockField${rowNumber}0`}
                  decimal={2}
                  required
                  width="100px"
                  validations={assign(
                    this.getRequiredValidation('请输入课时数量', 1),
                    this.getNumberRangeValidation(0.01, 999999, 1),
                  )}
                />,
              )}
            </td>
            <td className={this.getClassName('class-price-input', 1)}>
              {this.getDisableField(
                <InputStockFieldWrap
                  onChange={e => {
                    return onItemChange(e, 'price', rowNumber);
                  }}
                  value={value['price']}
                  addonBefore="¥"
                  required
                  name={`stockField${rowNumber}2`}
                  decimal={2}
                  width="100px"
                  validations={assign(
                    this.getRequiredValidation('请输入价格', 1),
                    this.getNumberRangeValidation(0, 99999999, 1),
                  )}
                />,
              )}
            </td>
            <td className={this.getClassName('class-contains-input', 1)}>
              {ShowWrapper({
                children: (
                  <InputStockFieldWrap
                    onChange={e => {
                      return onItemChange(e, 'stockNum', rowNumber);
                    }}
                    value={value['stockNum']}
                    name={`stockField${rowNumber}3`}
                    required
                    disabled={isInStoreCondition({
                      supportEduBranchStore: !isStockIndependent,
                    })}
                    width="100px"
                    validations={assign(
                      this.getRequiredValidation('请输入名额', 1),
                      this.getNumberRangeValidation(0, 10000000, 1),
                    )}
                  />
                ),
                isInStoreCondition: isInStoreCondition({
                  supportEduSingleStore: true,
                  supportEduBranchStore: true,
                }),
              })}
            </td>
          </React.Fragment>
        )}
        {courseSellType === 2 && (
          <React.Fragment>
            <td className={this.getClassName('class-description-input', 2)}>
              {this.getDisableField(
                <InputStockFieldWrap
                  onChange={e => {
                    return onItemChange(e.target.value, 'v1', rowNumber);
                  }}
                  name={`dropdown${rowNumber}1`}
                  placeholder="如10课时、10节课"
                  width="130px"
                  maxLength={20}
                  type={1}
                  value={value.v1}
                />,
              )}
            </td>
            <td className={this.getClassName('class-time-input', 2)}>
              {this.getDisableField(
                <DropdownList
                  onChange={e => {
                    return onItemChange(e, 'courseProp', rowNumber);
                  }}
                  dropdownData={TIME_LIST}
                  value={this.formatTime(value.courseProp)}
                  className="sku-dropdown"
                  name={`dropdown${rowNumber}0`}
                  required
                  validations={this.getDropdownListValidation()}
                  courseSellType={courseSellType}
                />,
              )}
            </td>
            <td className={this.getClassName('class-price-input', 2)}>
              {this.getDisableField(
                <InputStockFieldWrap
                  onChange={e => {
                    return onItemChange(e, 'price', rowNumber);
                  }}
                  value={value['price']}
                  addonBefore="¥"
                  name={`dropdown${rowNumber}2`}
                  required
                  decimal={2}
                  width="100px"
                  validations={assign(
                    this.getRequiredValidation('请输入价格', 2),
                    this.getNumberRangeValidation(0, 99999999, 2),
                  )}
                />,
              )}
            </td>
            <td className={this.getClassName('class-contains-input', 2)}>
              {ShowWrapper({
                children: (
                  <InputStockFieldWrap
                    onChange={e => {
                      return onItemChange(e, 'stockNum', rowNumber);
                    }}
                    value={value['stockNum']}
                    required
                    width="100px"
                    disabled={isInStoreCondition({
                      supportEduBranchStore: !isStockIndependent,
                    })}
                    name={`dropdown${rowNumber}3`}
                    validations={assign(
                      this.getRequiredValidation('请输入名额', 2),
                      this.getNumberRangeValidation(0, 10000000, 2),
                    )}
                  />
                ),
                isInStoreCondition: isInStoreCondition({
                  supportEduSingleStore: true,
                  supportEduBranchStore: true,
                }),
              })}
            </td>
          </React.Fragment>
        )}
        {courseSellType === 3 && (
          <React.Fragment>
            <td className={this.getClassName('class-description-input', 3)}>
              <VersionWrapper
                name="course-manage-class1"
                downgrade={{
                  from: isEdit && get(eduCourse, 'id'),
                }}
              >
                {this.getDisableField(
                  <InputStockFieldWrap
                    type={1}
                    name={`classField${rowNumber}1`}
                    onChange={e => onItemChange(e.target.value, 'v1', rowNumber)}
                    width="130px"
                    maxLength={20}
                    value={value.v1}
                  />,
                )}
              </VersionWrapper>
            </td>
            <td className={this.getClassName('class-time-input', 3)}>
              <VersionWrapper
                name="course-manage-class2"
                downgrade={{
                  from: isEdit && get(eduCourse, 'id'),
                }}
              >
                {this.getDisableField(
                  <DropdownSelector
                    updateOptionId={updateOptionId}
                    onChange={value => onItemChange(value, 'courseProp', rowNumber)}
                    description={
                      get(eduCourse, 'classRelatedInfo.content') && value.courseProp
                        ? `开班时间：${this.getClassTimeRange()}，剩余${value['stockNum']}个名额`
                        : ''
                    }
                    value={
                      get(eduCourse, 'classRelatedInfo.content') && value.courseProp
                        ? value.eduClassDTO.id
                        : ''
                    }
                    data={eduCourse}
                    name={`classField${rowNumber}0`}
                    className="sku-dropdown"
                    required
                    validations={this.getRequiredValidation('请选择班级', 3)}
                  />,
                )}
              </VersionWrapper>
            </td>
            {/* <td className={this.getClassName('class-description-input', 3)}>
              {this.getDisableField(<InputStockFieldWrap
                type={1}
                onChange={e => onItemChange(e, 'classTime', rowNumber)}
                value={
                  eduCourse.classRelatedInfo && eduCourse.classRelatedInfo.content
                    ? this.getClassTimeRange()
                    : ''
                }
                name={`classField${rowNumber}2`}
                disabled={true}
              />)}
            </td> */}
            <td className={this.getClassName('class-price-input', 3)}>
              <VersionWrapper
                name="course-manage-class3"
                downgrade={{
                  from: courseSellType === 3 && isEdit && get(eduCourse, 'id'),
                }}
              >
                {this.getDisableField(
                  <InputStockFieldWrap
                    onChange={e => onItemChange(e, 'price', rowNumber)}
                    value={get(eduCourse, 'classRelatedInfo.content') ? value['price'] : null}
                    addonBefore="¥"
                    required
                    width="80px"
                    name={`classField${rowNumber}3`}
                    decimal={2}
                    validations={assign(
                      this.getRequiredValidation('请输入价格', 3),
                      this.getNumberRangeValidation(0, 99999999, 3),
                    )}
                  />,
                )}
              </VersionWrapper>
            </td>
            <td className={this.getClassName('class-contains-input', 3)}>
              {this.wrapperDisableField({
                disabledMsg: (
                  <>
                    <span>按期销售的线下课需修改班级名额</span>
                    <a
                      style={assign(
                        { marginLeft: 15 },
                        this.isForbidAlterContains(rowNumber)()
                          ? { color: 'grey', cursor: 'not-allowed' }
                          : null,
                      )}
                      href={`javascript:;`}
                      onClick={
                        this.isForbidAlterContains(rowNumber)()
                          ? null
                          : this.openClassDialog(rowNumber)
                      }
                    >
                      去修改
                    </a>
                  </>
                ),
                position: 'bottom-right',
                element: (
                  <InputStockFieldWrap
                    onChange={e => onItemChange(e, 'stockNum', rowNumber)}
                    value={this.getStockNum()}
                    disabled={true}
                    width="80px"
                    required
                    name={`classField${rowNumber}4`}
                  />
                ),
              })}
            </td>
          </React.Fragment>
        )}
        <td
          className="course-delete-btn"
          style={{ textAlign: courseSellType === 3 ? 'center' : null }}
        >
          <VersionWrapper
            name="course-manage-skudelete"
            downgrade={{
              from: isEdit && get(eduCourse, 'id'),
            }}
          >
            <a
              href={`javascript:;`}
              onClick={
                isInStoreCondition({
                  supportEduBranchStore: true,
                })
                  ? null
                  : () => onRemove()
              }
              style={
                this.props.length <= 1 ||
                isInStoreCondition({
                  supportEduBranchStore: true,
                })
                  ? { color: 'grey', cursor: 'not-allowed' }
                  : null
              }
            >
              删除
            </a>
          </VersionWrapper>
        </td>
      </tr>
    );
  }
}

export default ClassStockItem;
