import React, { Component } from 'react';

export default class Timeline extends Component {
  render() {
    const { quarters, nowQuarter, isToday } = this.props;
    return (
      <div className="reserve-timeline">
        {quarters.map((quarter, index) => {
          if (nowQuarter === quarter && isToday) {
            return (
              <div key={index} className="reserve-timeline__cell reserve-timeline__active">
                <div className="reserve-timeline__cell-text">{quarter}</div>
                <div className="reserve-timeline__cell-arrow" />
              </div>
            );
          } else {
            return (
              <div key={index} className="reserve-timeline__cell">
                <div className="reserve-timeline__cell-text">{quarter}</div>
              </div>
            );
          }
        })}
      </div>
    );
  }
}
