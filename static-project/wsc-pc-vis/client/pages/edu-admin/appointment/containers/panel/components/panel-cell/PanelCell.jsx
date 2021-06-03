import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import ReservePop from './ReservePop';
import classNames from 'classnames';
import { APPOINTMENT_STATUS_TYPE } from '../../../../constants';
import AutoRightTop from '../../../../../schedule/containers/panel/components/detail-pop/auto-right-top';

export default class PanleCell extends Component {
  state = {
    singleLine: false,
  }

  isClassed = status => {
    return (
      +status === APPOINTMENT_STATUS_TYPE.COMPLETED ||
      +status === APPOINTMENT_STATUS_TYPE.ABSENCE ||
      +status === APPOINTMENT_STATUS_TYPE.ASK_FOR_LEAVED
    );
  };

  setSingleLine = () => {
    if (this.elRef.offsetHeight < 35 && !this.state.singleLine) {
      this.setState({
        singleLine: true,
      });
    }
  }

  componentDidMount() {
    this.setSingleLine();
  }

  componentDidUpdate() {
    this.setSingleLine();
  }

  render() {
    const { appointment, updateData } = this.props;
    const panelCell = classNames({
      'panel-cell': true,
      'panel-cell__not-confirmed':
        +appointment.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED,
      'panel-cell__not-class':
        +appointment.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_PERFORMED,
      'panel-cell__classed': this.isClassed(appointment.studentLessonStatus),
    });

    return (
      <div className="panel-cell-wrap">
        <Pop
          className="panel-cell__pop"
          trigger="hover"
          mouseEnterDelay={400}
          mouseLeaveDelay={50}
          position={AutoRightTop}
          content={
            <ReservePop appointment={appointment} updateData={updateData} />
          }
        >
          <div ref={(ref) => (this.elRef = ref)} className={panelCell}>
            <div className="panel-cell__left" />
            <div className="panel-cell__right">
              <div className="panel-cell__name ellipsis">{appointment.studentName}</div>
              {!this.state.singleLine && <div className="panel-cell__title ellipsis">{appointment.courseName}</div>}
            </div>
          </div>
        </Pop>
      </div>
    );
  }
}
