import React, { Component } from 'react';
import PanelCell from '../panel-cell';
import { Schedule } from '@youzan/ebiz-components';
import formatDate from 'zan-utils/date/formatDate';
import { parseHourPlusMinute2String, getHourPlusMinuteFromTime } from '../../time-util';
import { findDOMNode } from 'react-dom';
import BackRow from '../backrow';
import { APPOINTMENT_SCHEDULE_TYPE } from '../../../../constants';

// const dayMs = 24 * 60 * 60 * 1000;

export default class PanleDayDialogContent extends Component {
  constructor(props) {
    super(props);
    this.scheduleEl = null;
  }

  state = {
    scheduleType: APPOINTMENT_SCHEDULE_TYPE.DAY,
    loading: false,
    panelData: {},
    rawPanelData: {},
  }

  scorllToCurrent = () => {
    const { defaultData } = this.props;
    if (!defaultData || !defaultData.data) {
      return;
    }
    const sortData = [...defaultData.data];
    sortData.sort((time1, time2) => {
      return time1.startTime - time2.startTime;
    });

    // const startTime = new Date(sortData[0].startTime);
    if (sortData[0] && sortData[0].startTime) {
      // eslint-disable-next-line react/no-find-dom-node
      const node = findDOMNode(this.scheduleEl);
      const $day = node.getElementsByClassName('ebiz-schedule__day')[0];
      if ($day && 'scrollBehavior' in document.documentElement.style) {
        const panelStartTime = getHourPlusMinuteFromTime(sortData[0].startTime);

        $day.scrollTo({
          top: ((panelStartTime - defaultData.timeLineStart) / 15) * 60, // 每 15 分钟高度为 50 px
        });
      }
    }
  }

  componentDidMount() {
    this.scorllToCurrent();
  }

  render() {
    const { scheduleType } = this.state;
    const { defaultData = {}, closeDialog, callback, onCreateAppoint } = this.props;
    return (
      <div className="panel-day-dialog-content">
        <Schedule
          type={scheduleType}
          data={{ [formatDate(defaultData.time || Date.now(), 'YYYY-MM-DD')]: defaultData.data } || {}}
          max={2}
          ref={el => (this.scheduleEl = el)}
          current={new Date(defaultData.time)}
          timeLineStart={parseHourPlusMinute2String(defaultData.timeLineStart) || '00:00'}
          timelineEnd={parseHourPlusMinute2String(defaultData.timelineEnd) || '23:59'}
          renderField={data => {
            return (
              <PanelCell
                appointment={{ ...data, studentLessonNo: data.status }}
                updateData={() => {
                  if (closeDialog) {
                    closeDialog();
                  }
                  if (callback) {
                    callback();
                  }
                }}
              />
            );
          }}
          renderBackRow={time => {
            return <BackRow date={time} callback={() => {
              if (closeDialog) {
                closeDialog();
              }
              if (onCreateAppoint) {
                onCreateAppoint(time);
              }
            }} />;
          }}
        />
      </div>
    );
  }
}
