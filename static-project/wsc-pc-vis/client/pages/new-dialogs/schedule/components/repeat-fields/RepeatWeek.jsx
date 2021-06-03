
import { Select, Form } from '@zent/compat';
import { uniqueId } from 'lodash';
import React, { useState } from 'react';
import { Icon, Button } from 'zent';
import { formatToTimeGap } from '../../utils/format-value';
import openDateRangePickerDialog from '@ability-center/schedule/date-range-picker';

const { getControlGroup, Field } = Form;
const options = [
  { value: 1, text: '周一' },
  { value: 2, text: '周二' },
  { value: 3, text: '周三' },
  { value: 4, text: '周四' },
  { value: 5, text: '周五' },
  { value: 6, text: '周六' },
  { value: 7, text: '周日' },
];

const renderHeader = () => {
  const titles = ['星期', '上课时间段', ''];
  return (
    <div className="weekRepeat-line header">
      {titles.map(title => (
        <div key={title} className="item">
          {title}
        </div>
      ))}
    </div>
  );
};

const RepeatWeek = props => {
  const { value, onChange, refetchOptions } = props || {};
  const [rules, setRules] = useState(value || [{}]);

  // 添加规则条目
  const addRule = () => {
    if (props.disabled) return void 0;
    // 最多20条
    if (rules.length < 20) {
      const addedRules = rules.concat({});
      setRules(addedRules);
      if (onChange) {
        onChange(addedRules);
      }
    }
  };

  // 处理规则的时间的时候触发,用于格式化时间
  const handleEditRuleTime = (index, evt) => {
    const { value } = evt.target;
    const [startTime, endTime] = value.split('-');
    editRule({
      startTime: `${startTime}:00`,
      endTime: `${endTime}:00`,
    }, index);
  };

  // 编辑规则条目
  const editRule = (ruleDetail, index) => {
    // 拷贝数组
    const copyRules = rules.concat();
    let target = copyRules[index];
    if (target) {
      target = {
        ...target,
        ...ruleDetail,
      };
    }
    copyRules[index] = target;
    setRules(copyRules);
    // 触发onChange
    if (onChange) {
      onChange(copyRules);
    }
  };

  // 删除规则条目
  const removeRule = index => {
    if (props.disabled) return void 0;
    if (rules.length > 1) {
      const copyRules = rules.concat();
      copyRules.splice(index, 1);
      setRules(copyRules);
      // 触发onChange
      if (props.onChange) {
        props.onChange(copyRules);
      }
    }
  };

  // 判断这一行规则是否不合法
  const isInValidLine = index => {
    const { inValidRules = [] } = props;
    return inValidRules.findIndex(invalidRule => invalidRule === index) > -1;
  };

  // 打开时间选择弹窗
  const handleOpenDateRangePicker = () => {
    openDateRangePickerDialog(1, 'dateRangePicker').finally(() => {
      if (refetchOptions) {
        refetchOptions();
      }
    });
  };

  // 渲染时间选项
  const getOptions = (currentTime) => {
    const timeRange = props.dateRangeConfig;
    if (props.operateType > 1) {
      const exsistOpt = timeRange.filter(opt => opt.value === currentTime).length > 0;
      if (!exsistOpt) {
        return [{
          text: currentTime,
          value: currentTime,
        }].concat(timeRange);
      }
    }
    return timeRange;
  };

  // 渲染规则条目
  const renderBody = disabled => {
    return (
      rules.map((rule, index) => {
        // 格式化时间为对应格式的字符串
        const timeStr = rule.startTime
          ? [formatToTimeGap(rule.startTime), formatToTimeGap(rule.endTime)].join('-')
          : '';
        return (
          <section
            key={uniqueId('rule')}
            className={`weekRepeat-line ${isInValidLine(index) ? 'has-error' : ''}`}
          >
            <div className="item">
              <Select
                width="120px"
                data={options}
                disabled={disabled}
                value={rule.weekDay}
                onChange={(_, selected) => editRule({ weekDay: selected.value }, index)}
              />
            </div>
            <div className="item">
              <Select
                required
                width="150px"
                value={timeStr}
                label="上课时间："
                name="schoolTime"
                data={getOptions(timeStr)}
                className="inline-ele"
                placeholder="请选择时间"
                onChange={handleEditRuleTime.bind(null, index)}
              />
              <a className="inline-ele operator" onClick={handleOpenDateRangePicker}>
                设置时间段
              </a>
            </div>
            <Button
              outline
              type="primary"
              bordered={false}
              onClick={removeRule.bind(this, index)}
              // 当禁用以及是第一个删除的时候禁用改按钮
              className={`item ${disabled || index === 0 ? 'disabled' : ''}`}
            >
              删除
            </Button>
          </section>
        );
      })
    );
  };

  return (
    <div className="repeatContainer">
      {renderHeader()}
      {renderBody(props.disabled)}
      <div className="weekRepeat-line">
        <span
          className={`center ${props.disabled || rules.length >= 20 ? 'disabled' : ''}`}
          onClick={addRule}
        >
          <Icon type="plus" className="blue" />
          <a className="cursor-link">添加</a>
        </span>
      </div>
    </div>
  );
};

const RepeatWeekField = props => {
  const RepeatWeekControl = getControlGroup(RepeatWeek);
  return <Field name="repeatWeek" {...props} component={RepeatWeekControl} />;
};

export default RepeatWeekField;
