import { Select } from '@zent/compat';
import React, { PureComponent } from 'react';
import { DateRangeQuickPicker } from 'zent';
import { get } from 'lodash';
import './styles.scss';

export default class OtherFilter extends PureComponent {
  state = {
    clientWidth: 900,
  };

  types = [
    { value: 'recordDateRange', text: '更新动态时间' },
    { value: 'createAtDateRange', text: '创建时间' },
    { value: 'revisitDateRange', text: '回访时间' },
  ];

  datePreset = [
    { text: '今', value: 0 },
    { text: '昨', value: 1 },
    { text: '近7天', value: 7 },
    { text: '近30天', value: 30 },
  ];

  componentDidMount() {
    this.resetClientWidth();
    window.addEventListener('resize', this.resetClientWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resetClientWidth);
  }

  resetClientWidth = () => {
    const refs = document.getElementsByClassName('edu-clue-pool');
    const clientWidth = refs && refs[0] && refs[0].clientWidth;
    if (clientWidth) {
      this.setState({ clientWidth });
    }
  }

  render() {
    const value = this.props.value || {};
    const dateRange = value.dateRange && value.dateRange.map(date => Number(date));
    const chooseDays = Number(value.chooseDays);
    return (
      <div className="clue-pool-other-filter">
        <Select
          width={200}
          data={this.types}
          value={value.type}
          onChange={this.handleTypeChange}
          className={this.state.clientWidth < 1020 ? 'clue-pool-other-filter-select' : ''}
        />
        <DateRangeQuickPicker
          onChange={this.handleDateChange}
          value={dateRange}
          chooseDays={chooseDays}
          preset={this.datePreset}
        />
      </div>
    );
  }
  handleTypeChange = (e, item) => {
    this.handleChange({ type: item.value });
  };

  handleDateChange = (dateRange, chooseDays) => {
    this.handleChange({ dateRange, chooseDays });
  }

  handleChange = item => {
    const value = Object.assign({}, this.props.value, item);
    // TODO: CP白名单
    const passiveValues = get(_global, 'white.useNewClueList', false) ? value : { value };
    this.props.onChange(passiveValues);
  };
}
