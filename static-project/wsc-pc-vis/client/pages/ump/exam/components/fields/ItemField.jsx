import React, { Component } from 'react';
import { Input, Radio, Checkbox } from 'zent';
import cx from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import Cover from 'components/field/cover/CoverField.jsx';
import { canShowFactoryHOC } from '../../utils';
import './item-field.scss';

const RadioGroup = Radio.Group;

const RadioGroupCanShow = canShowFactoryHOC(RadioGroup);
const CheckboxCanShow = canShowFactoryHOC(Checkbox);
const InputCanShow = canShowFactoryHOC(Input);
const CoverCanShow = canShowFactoryHOC(Cover);

// 选项 field
class ItemField extends Component {
  handleChangeRadio = ev => {
    const valueCopy = cloneDeep(this.props.value);
    this.props.onChange(Object.assign(valueCopy, { score: ev.target.value }));
  };

  handleChangeCheckbox = ev => {
    const valueCopy = cloneDeep(this.props.value);
    this.props.onChange(Object.assign(valueCopy, { score: ev.target.checked ? 1 : -1 }));
  };

  handleDetail = ev => {
    let detail = ev.target.value || '';
    if (detail.length >= 100) {
      detail = ev.target.value.slice(0, 100);
    }
    const valueCopy = cloneDeep(this.props.value);
    this.props.onChange(Object.assign(valueCopy, { detail }));
  };

  handleImg = ev => {
    this.props.onChange(
      Object.assign(cloneDeep(this.props.value), {
        itemPic: ev,
      })
    );
  };

  handleDelete = () => {
    this.props.onDelete();
  };

  renderDragIcon = () => {
    return (
      <div className="item-card-float-wrap">
        <div className="item-card-wrap__drag-icon-wrap j_cardDragIcon">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div className="item-card-wrap__drag-icon" key={index} />
          ))}
        </div>
      </div>
    );
  };

  render() {
    const props = this.props;
    const { value, displayError, formData, label, required, className, index, unchangable } = props;
    const showError =
      displayError === undefined ? props.isDirty && props.error !== null : displayError;
    const helpDesc = props.helpDesc;
    const mobileClassName = cx({
      'zent-form__control-group': true,
      'drag-zent-form__control-group': true,
      'has-error': showError,
      [className]: true,
    });
    return (
      <div data-index={index} className={mobileClassName}>
        {/* 拖动的占位线 */}
        <div className="item-card-wrap__drag-line" />

        <label className="zent-form__control-label drag-zent-form__control-label">
          {this.renderDragIcon()}
          {required ? <em className="zent-form__required">*</em> : null}
          {label}
        </label>

        <div className="zent-form__controls">
          <div className="exam-item-field">
            <InputCanShow
              canShow={+formData.itemStyle === 1}
              value={value.detail}
              className="exam-item-field__input"
              width={265}
              placeholder="选项内容为100个字以内"
              onChange={this.handleDetail}
            />

            <CoverCanShow
              uploadCls="exam-item-field__coverupload"
              canShow={+formData.itemStyle === 2}
              maxSize={100 * 1024}
              showRemove
              detail={true}
              value={value.itemPic}
              onChange={this.handleImg}
            />

            <RadioGroupCanShow
              canShow={+formData.questionType === 1}
              className="exam-item-field__radio"
              onChange={this.handleChangeRadio}
              value={value.score}
              disabled={unchangable}
            >
              <Radio value={1}>正确选项</Radio>
            </RadioGroupCanShow>

            <CheckboxCanShow
              canShow={+formData.questionType === 2}
              style={{ marginRight: 0 }}
              checked={+value.score === 1}
              onChange={this.handleChangeCheckbox}
              disabled={unchangable}
            >
              正确选项
            </CheckboxCanShow>

            <a
              className={cx('exam-item-field__delete', { 'disabled': unchangable })}
              href="javascrit:;"
              onClick={!unchangable && this.handleDelete}
            >
              删除
            </a>
          </div>
          {showError && <p className="zent-form__error-desc">{props.error}</p>}
          {helpDesc && <p className="zent-form__help-desc">{helpDesc}</p>}
        </div>
      </div>
    );
  }
}

export default ItemField;
