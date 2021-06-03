import React, { Component } from 'react';
import { VisLink } from 'fns/router';

export default class NoCourseTip extends Component {
  render() {
    return (
      <div className="no-course-tip">
        暂无可上课的课程，
        <VisLink>新建日程</VisLink>
      </div>
    );
  }
}
