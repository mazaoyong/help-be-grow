import React, { Component } from 'react';
import { Button } from 'zent';
import TimePickerPanelCell from './TimePanelCell';

import { ITimePickerPanelProps, ITimePickerValue } from './types';
import { generateArray } from './utils';
import has from 'lodash/has';

class TimePickerPanel extends Component<
  ITimePickerPanelProps,
  Required<ITimePickerValue>
> {
  constructor(props: ITimePickerPanelProps) {
    super(props);
    const { hour, minute, second } = props.value;

    this.state = {
      hour: hour || 0,
      minute: minute || 0,
      second: second || 0
    };
  }

  disabledAllTime = (val: ITimePickerValue) => {
    const { disabledTime, type } = this.props;

    if (disabledTime && disabledTime.disabledAll) {
      const disabledAll = disabledTime.disabledAll;

      let hour = has(val, 'hour') ? val.hour! : this.state.hour;
      let minute = has(val, 'minute') ? val.minute! : this.state.minute;
      let second = has(val, 'second') ? val.second! : this.state.second;

      if (Array.isArray(disabledAll)) {
        return disabledAll.some(val => {
          let typeCount = 0;
          let equalCount = 0;
          if (type.hour) {
            typeCount++;
            hour === val.hour && equalCount++;
          }
          if (type.minute) {
            typeCount++;
            minute === val.minute && equalCount++;
          }
          if (type.second) {
            typeCount++;
            second === val.second && equalCount++;
          }

          return typeCount === equalCount;
        });
      } else {
        return disabledAll({
          hour: hour,
          minute: minute,
          second: second
        });
      }
    }
    return false;
  };

  hideAllTime = (val: ITimePickerValue) => {
    const { hideTime, type } = this.props;

    if (hideTime && hideTime.disabledAll) {
      const disabledAll = hideTime.disabledAll;

      let hour = has(val, 'hour') ? val.hour! : this.state.hour;
      let minute = has(val, 'minute') ? val.minute! : this.state.minute;
      let second = has(val, 'second') ? val.second! : this.state.second;

      if (Array.isArray(disabledAll)) {
        return disabledAll.some(val => {
          let typeCount = 0;
          let equalCount = 0;
          if (type.hour) {
            typeCount++;
            hour === val.hour && equalCount++;
          }
          if (type.minute) {
            typeCount++;
            minute === val.minute && equalCount++;
          }
          if (type.second) {
            typeCount++;
            second === val.second && equalCount++;
          }

          return typeCount === equalCount;
        });
      } else {
        return disabledAll({
          hour: hour,
          minute: minute,
          second: second
        });
      }
    }
    return false;
  };

  render() {
    const { type, disabledTime, hideTime } = this.props;
    const { hour, minute, second } = this.state;

    return (
      <article className="ebiz-time-picker__panel">
        <section className="ebiz-time-picker__panel__select">
          {type.hour && (
            <TimePickerPanelCell
              options={generateArray(24)}
              value={hour!}
              onChange={val => {
                this.setState({ hour: val });
              }}
              disabledTime={disabledTime && disabledTime.disabledHours}
              hideTime={hideTime && hideTime.disabledHours}
              disabledAllTime={val => this.disabledAllTime({ hour: val })}
              hideAllTime={val => this.hideAllTime({ hour: val })}
            />
          )}
          {type.minute && (
            <TimePickerPanelCell
              options={generateArray(60)}
              value={minute!}
              onChange={val => {
                this.setState({ minute: val });
              }}
              disabledTime={disabledTime && disabledTime.disabledMinutes}
              hideTime={hideTime && hideTime.disabledMinutes}
              disabledAllTime={val => this.disabledAllTime({ minute: val })}
              hideAllTime={val => this.hideAllTime({ minute: val })}
            />
          )}
          {type.second && (
            <TimePickerPanelCell
              options={generateArray(60)}
              value={second!}
              onChange={val => {
                this.setState({ second: val });
              }}
              disabledTime={disabledTime && disabledTime.disabledSeconds}
              hideTime={hideTime && hideTime.disabledSeconds}
              disabledAllTime={val => this.disabledAllTime({ second: val })}
              hideAllTime={val => this.hideAllTime({ second: val })}
            />
          )}
        </section>

        <footer className="ebiz-time-picker__panel__actions">
          <Button
            type="primary"
            onClick={() => {
              this.props.onSubmit(this.state);
            }}
          >
            确定
          </Button>
        </footer>
      </article>
    );
  }
}

export default TimePickerPanel;
