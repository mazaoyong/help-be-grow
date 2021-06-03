import React, { PureComponent } from 'react';
import { Radio, Select, NumberInput, TimePicker } from 'zent';
import { Form } from '@zent/compat';
import cloneDeep from 'lodash/cloneDeep';
import { padLeft } from '../../../../utils';
import { IResversation } from 'definitions/self-fetch';
import { IAppointmentOrderValue } from 'definitions/local-delivery';

const RadioGroup = Radio.Group;

const prefix = 'custom-reservation-time';
const MAX_HOUR = 48;
const MAX_DAY = 31;
const MIN_MINUTE = 1;

export interface IProps {
  value: IResversation;
  onChange: (v: IResversation) => void;
}

interface IState {
  cutOffTime: string;
  err1: boolean;
  err2: boolean;
}

class Resversation extends PureComponent<ZENT_FIELD_COMP<IProps>, IState> {
  constructor(props: ZENT_FIELD_COMP<IProps>) {
    super(props);
    const { cutOffRuleModel = {} } = this.props.value;
    const { hour, minute } = cutOffRuleModel;
    this.state = {
      cutOffTime: hour && minute ? `${hour}:${minute}` : '',
      err1: false,
      err2: false,
    };
  }

  getAheadMinValues(type) {
    switch (type) {
      case 'hour':
        return new Array(MAX_HOUR).fill(0).map((_, i) => ({
          value: i + 1,
          text: padLeft(i + 1),
        }));
      case 'day':
      case 'none':
      default:
        return new Array(MAX_DAY).fill(0).map((_, i) => ({
          value: i + 1,
          text: padLeft(i + 1),
        }));
    }
  }

  getAheadMinTypes() {
    return [
      {
        text: '分钟',
        value: 'minute',
      },
      {
        text: '小时',
        value: 'hour',
      },
      {
        text: '天',
        value: 'day',
      },
    ];
  }

  cloneValue() {
    return cloneDeep(this.props.value);
  }

  /**
   * 切换预约提前类型 0（默认值，普通类型）1（截单时间类型）2（库存时间类型）
   * @param evt
   */
  handleTypeChange = evt => {
    const value = cloneDeep(this.props.value);

    value.ruleType = evt.target.value as IAppointmentOrderValue['ruleType'];
    this.props.onChange(value);
  };

  /**
   * 修改值<单层数据>
   * @param value
   * @param field
   */
  handleFieldValueChange(value, field) {
    const data = this.cloneValue();

    data[field] = +value;
    this.props.onChange(data);
  }

  /**
   * 修改值<双层数据>
   * @param value
   * @param valueFields
   */
  handleFieldsValueChange(value, valueFields) {
    const data = this.cloneValue();
    const [v1, v2] = valueFields.split('.');

    data[v1][v2] = value;
    this.props.onChange(data);
    this.validate(data);
  }

  /**
   * 修改类型<单层数据>
   * @param value
   * @param typeFiled
   * @param valueField
   */
  handleFieldTypeChange(value, typeFiled, valueField) {
    const data = this.cloneValue();

    if (value === 'hour' && data[valueField] > MAX_HOUR) {
      data[valueField] = MAX_HOUR;
    }
    if (value === 'day' && data[valueField] > MAX_DAY) {
      data[valueField] = MAX_DAY;
    }
    if (value === 'minute' && data[valueField] === 0) {
      data[valueField] = MIN_MINUTE;
    }

    data[typeFiled] = value;
    this.props.onChange(data);
  }

  /**
   * 修改类型<双层数据>
   * @param type
   * @param typeFields
   * @param valueFields
   */
  handleFieldsTypeChange(type, typeFields, valueFields) {
    const data = this.cloneValue();
    const [t1, t2] = typeFields.split('.');
    const [v1, v2] = valueFields.split('.');

    if (type === 'hour' && data[v1][v2] > MAX_HOUR) {
      data[v1][v2] = MAX_HOUR;
    }
    if (type === 'day' && data[v1][v2] > MAX_DAY) {
      data[v1][v2] = MAX_DAY;
    }
    if (type === 'minute' && data[v1][v2] === 0) {
      data[v1][v2] = MIN_MINUTE;
    }

    data[t1][t2] = type;
    this.props.onChange(data);
    this.validate(data);
  }

  onTimeChange = time => {
    const data = this.cloneValue();
    const [hour, minute] = time.split(':');

    this.setState({
      cutOffTime: time,
    });

    data.cutOffRuleModel.hour = +hour;
    data.cutOffRuleModel.minute = +minute;
    this.props.onChange(data);
  };

  /**
   * 验证预约时间是否相同
   * @param data
   */
  validate(data) {
    const {
      cutOffRuleModel: { beforeAheadMin, beforeAheadMinType, afterAheadMin, afterAheadMinType },
      inventoryRuleModel: {
        materialAheadMin,
        materialAheadMinType,
        planAheadMin,
        planAheadMinType,
      },
    } = data;

    // 根据下单时间配置的提前时间不能相同
    if (beforeAheadMin && afterAheadMin) {
      this.setState({
        err1: beforeAheadMin === afterAheadMin && beforeAheadMinType === afterAheadMinType,
      });
    }

    // 根据库存类型配置的提前时间不能相同
    if (materialAheadMin && planAheadMin) {
      this.setState({
        err2: materialAheadMin === planAheadMin && materialAheadMinType === planAheadMinType,
      });
    }
  }

  /**
   * 渲染时间选择模块
   * @param value
   * @param type
   * @param handleValueChange
   * @param handleTypeChange
   * @param error
   */
  _renderTimeSelect(
    value: number | '',
    type: string,
    handleValueChange: Function,
    handleTypeChange: Function,
    error?: boolean,
  ) {
    const valueOptions = this.getAheadMinValues(type);
    const typeOptions = this.getAheadMinTypes();
    return (
      <>
        {type === 'minute' ? (
          <NumberInput
            value={value}
            onChange={val => handleValueChange(val)}
            inline
            showStepper
            min={1}
            max={1440}
            width={88}
            className={`${error ? 'show-error' : ''} mr10`}
            disabled={type !== 'minute'}
          />
        ) : (
          <Select
            data={valueOptions}
            className={`${error ? 'show-error' : ''} mr10`}
            optionValue="value"
            optionText="text"
            value={value}
            width={88}
            autoWidth
            onChange={evt => {
              handleValueChange(evt.target.value);
            }}
          />
        )}
        <Select
          className={`${error ? 'show-error' : ''} ml0`}
          data={typeOptions}
          optionValue="value"
          optionText="text"
          value={type}
          width={88}
          autoWidth
          onChange={evt => {
            handleTypeChange(evt.target.value);
          }}
        />
      </>
    );
  }

  /**
   * 渲染截单可选时间
   * @param isDisabled
   */
  _renderTimePicker(isDisabled = false) {
    const { cutOffTime } = this.state;
    return (
      <TimePicker
        className="zent-picker-demo ml0"
        value={cutOffTime}
        onChange={this.onTimeChange}
        canClear={false}
        disabled={isDisabled}
        minuteStep={5}
      />
    );
  }

  render() {
    const { value } = this.props;
    // eslint-disable-next-line
    const { err1, err2 } = this.state;
    const {
      ruleType,
      aheadMinType,
      aheadMin,
      cutOffRuleModel: { beforeAheadMinType, beforeAheadMin, afterAheadMin, afterAheadMinType },
      inventoryRuleModel: {
        materialAheadMinType,
        materialAheadMin,
        planAheadMinType,
        planAheadMin,
      },
    } = value;

    return (
      <div className={prefix}>
        <RadioGroup className={`${prefix}__type`} value={ruleType} onChange={this.handleTypeChange}>
          <Radio value="none">无需提前</Radio>
          <Radio value={0}>
            <span className="mr10">提前</span>
            {this._renderTimeSelect(
              aheadMin,
              aheadMinType,
              value => this.handleFieldValueChange(value, 'aheadMin'),
              value => this.handleFieldTypeChange(value, 'aheadMinType', 'aheadMin'),
            )}
            <div className="help">“天”选项为自然天，如：提前1天，买家只能预约第二天自提。</div>
          </Radio>

          {/* 根据下单时间配置 */}
          <Radio value={1}>
            <span className="mr10">根据下单时间，配置可预约时间</span>
            {ruleType === 1 ? (
              <>
                <div className="row">
                  {this._renderTimePicker(false)}
                  <span className="mr10">前下单，最早可提前</span>
                  {this._renderTimeSelect(
                    beforeAheadMin,
                    beforeAheadMinType,
                    value => this.handleFieldsValueChange(value, 'cutOffRuleModel.beforeAheadMin'),
                    type =>
                      this.handleFieldsTypeChange(
                        type,
                        'cutOffRuleModel.beforeAheadMinType',
                        'cutOffRuleModel.beforeAheadMin',
                      ),
                    err1,
                  )}
                </div>
                <div className="row">
                  {this._renderTimePicker(true)}
                  <span className="mr10">后下单，最早可提前</span>
                  {this._renderTimeSelect(
                    afterAheadMin,
                    afterAheadMinType,
                    value => this.handleFieldsValueChange(value, 'cutOffRuleModel.afterAheadMin'),
                    type =>
                      this.handleFieldsTypeChange(
                        type,
                        'cutOffRuleModel.afterAheadMinType',
                        'cutOffRuleModel.afterAheadMin',
                      ),
                    err1,
                  )}
                </div>
                {err1 && <div className="error-info">两种类型预约时间不可以完全相同</div>}
              </>
            ) : null}
            <div className="help">
              根据下单时间，设置最早可以预约的时间，如：设置11:00前下单，最早可提前1小时；11:00后下单，最早可提前1天
              则买家在11点前下单时，最早可选择当前下单时间往后一小时的时间，11点后下单，最早只能选择第二天。
            </div>
          </Radio>

          {/* 根据仓库类型配置 */}
          <Radio value={2}>
            根据不同库存类型（如实物库存、计划库存），配置可预约时间
            {ruleType === 2 ? (
              <>
                <div className="row">
                  <span className="mr10">有实物库存：提前</span>
                  {this._renderTimeSelect(
                    materialAheadMin,
                    materialAheadMinType,
                    value =>
                      this.handleFieldsValueChange(value, 'inventoryRuleModel.materialAheadMin'),
                    type =>
                      this.handleFieldsTypeChange(
                        type,
                        'inventoryRuleModel.materialAheadMinType',
                        'inventoryRuleModel.materialAheadMin',
                      ),
                    err2,
                  )}
                </div>
                <div className="row">
                  <span className="mr10">无实物库存，有计划库存：提前</span>
                  {this._renderTimeSelect(
                    planAheadMin,
                    planAheadMinType,
                    value => this.handleFieldsValueChange(value, 'inventoryRuleModel.planAheadMin'),
                    type =>
                      this.handleFieldsTypeChange(
                        type,
                        'inventoryRuleModel.planAheadMinType',
                        'inventoryRuleModel.planAheadMin',
                      ),
                    err2,
                  )}
                </div>
                {err2 && <div className="error-info">两种类型预约时间不可以完全相同</div>}
              </>
            ) : null}
            <div className="help">
              适用于已开启多种库存类型，可根据库存的类型分别设置可预约时间。
            </div>
          </Radio>
        </RadioGroup>
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(Resversation);
