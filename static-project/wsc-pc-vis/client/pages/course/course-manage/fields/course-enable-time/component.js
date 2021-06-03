import React, { Component, PureComponent } from 'react';
import { NumberInput } from 'zent';
import getControlGroup from '../ControlGroup';

class CourseEffectiveDelayDays extends (PureComponent || Component) {
  onDelayDaysChange = data => {
    this.props.onChange(data);
  };

  render() {
    const { value } = this.props;
    return (
      <span className='course-enable-input-wrap'>
        <span>付款完成</span>
        <NumberInput
          value={value}
          onChange={this.onDelayDaysChange}
          className="course-enable-time-input"
        />
        <span>天后生效</span>
      </span>
    );
  }
}

export default getControlGroup(CourseEffectiveDelayDays);
