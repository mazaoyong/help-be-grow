
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Notify } from 'zent';
import cx from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

import ItemField from './ItemField';
import Sortable from '../sortable';

import { MAX_TITLE_ITEMS, TITLE_FORM_ITEM_DATA, MIN_TITLE_ITEMS } from '../../constants';

const { Field } = Form;

class SelecterItems extends Component {
  state = {
    dragHoverIndex: -1,
    disappearIndex: -1, // 拖拽时需要小时的 dom index
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.titleIndex !== this.props.titleIndex) {
      this.props.fields.replaceAll(nextProps.value);
    }
  }

  handleItemChange = (ev, index) => {
    const cloneValue = cloneDeep(this.props.value);
    cloneValue[index] = ev;
    this.props.onFieldArrayChange(cloneValue, index);
  };

  handleDelete = (index, data) => {
    const { fields, value } = this.props;

    if (value.length <= MIN_TITLE_ITEMS) {
      return Notify.error(`最少${MIN_TITLE_ITEMS}个选项`);
    }
    const cloneValue = cloneDeep(value);
    cloneValue.splice(index, 1);
    // fields.remove(index);
    fields.replaceAll(cloneValue);
    this.props.onFieldArrayChange(cloneValue, -1);
    this.props.onDeleteItem(index, data);
  };

  handleAdd = () => {
    const { formData, value } = this.props;
    // 选项格式
    if (value.length >= MAX_TITLE_ITEMS) {
      return Notify.error(`最多添加${MAX_TITLE_ITEMS}个选项`);
    }
    const itemStyle = formData.itemStyle;
    const newItem = Object.assign(TITLE_FORM_ITEM_DATA, {
      style: itemStyle,
    });
    const items = [...value, newItem];
    this.props.onFieldArrayChange(items, -1);
    this.props.fields.replaceAll(items);
  };

  // 拖动某项
  handleDragMove = ev => {
    // 拖拽的目标元素
    const relatedEl = ev.related;
    const dragHoverIndex = relatedEl.getAttribute('data-index');
    this.setState({
      dragHoverIndex: +dragHoverIndex,
    });
  };

  // 除 move 事件外的通用事件
  handleDrag = (type, ev) => {
    if (type === 'onEnd') {
      this.setState({
        dragHoverIndex: -1,
        disappearIndex: -1,
      });
    }
    if (type === 'onClone') {
      const relatedEl = ev.item;
      const disappearIndex = relatedEl.getAttribute('data-index');
      this.setState({
        disappearIndex,
      });
    }
  };

  // 拖拽完成事件
  handleChange = list => {
    this.props.fields.replaceAll(list);
    this.props.onFieldArrayChange(list, -1);
  };

  renderItemsRequiredCheck = () => {
    const { formData: values } = this.props;
    const itemStyleIsImage = +values.itemStyle === 2;
    const choosedLength = values.itemList.filter(item => item.score === 1).length;
    const filledLength = values.itemList.filter(item =>
      itemStyleIsImage ? get(item, 'itemPic.cover') : item.detail,
    ).length;

    let passed;
    // 只在内容填充完毕才判断是否选择了答案
    if (filledLength === values.itemList.length && choosedLength === 0) {
      passed = false;
    } else {
      passed = true;
    }

    return !passed ? <p className="exam-item-field__item-required-tip">请选择正确答案</p> : null;
  };

  render() {
    const { fields, formData, value, unchangable = false } = this.props;
    const { dragHoverIndex, disappearIndex } = this.state;
    const itemStyleIsImage = +formData.itemStyle === 2;
    return (
      <div>
        <Sortable
          className="drag-item-select__drag-wrap"
          items={value}
          handle=".j_cardDragIcon"
          onChange={this.handleChange}
          onMove={this.handleDragMove}
          onEnd={ev => {
            this.handleDrag('onEnd', ev);
          }}
          onClone={ev => {
            this.handleDrag('onClone', ev);
          }}
          sort={!unchangable}
        >
          {fields.map((member, index, key) => {
            const classNames = cx({
              'drag-zent-form__control-group--drag-disappear': +index === +disappearIndex,
              'drag-zent-form__control-group--drag-hover': +index === +dragHoverIndex,
            });
            return (
              <Field
                className={classNames}
                index={index}
                name={member}
                key={key}
                label={`选项${index + 1}：`}
                component={ItemField}
                helpDesc={itemStyleIsImage ? '小于100KB，支持jpg、png格式' : ''}
                formData={formData}
                value={value[index]}
                required
                validations={{
                  maxSize(values, value) {
                    if (itemStyleIsImage) {
                      if (get(value, 'itemPic.picture.attachment_size', 0) >= 100 * 1024) {
                        return false;
                      }
                    }
                    return true;
                  },
                  required(values, value) {
                    if (itemStyleIsImage) {
                      if (!get(value, 'itemPic.cover')) {
                        return false;
                      }
                    } else {
                      if (!value.detail) {
                        return false;
                      }
                    }
                    return true;
                  },
                  maxDetailSize(values, value) {
                    return (value.detail || '').length <= 100;
                  },
                }}
                validationErrors={{
                  required: itemStyleIsImage ? '请上传选项图片' : '请填写选项内容',
                  maxSize: '图片大小请小于100KB',
                  maxDetailSize: '文字不超过100个字',
                }}
                onChange={ev => {
                  this.handleItemChange(ev, index);
                }}
                onDelete={() => {
                  this.handleDelete(index, value[index]);
                }}
                unchangable={unchangable}
              />
            );
          })}
        </Sortable>
        {this.renderItemsRequiredCheck()}
        <div className="zent-form__control-group">
          <a
            href="javascript:;"
            className={cx('exam-item-field__add', { 'disabled': unchangable })}
            onClick={!unchangable && this.handleAdd}
          >
            +添加选项
          </a>
        </div>
      </div>
    );
  }
}

export default SelecterItems;
