import React, { Component } from 'react';
import { Grid, Radio } from 'zent';
import { getCourseTableColumns } from './config';

const RadioGroup = Radio.Group;

export default class CourseTable extends Component {
  onRadioChange = event => {
    this.props.onLessonNoChange(event.target.value);
  };
  render() {
    const { datasets = [], loading, lessonNo } = this.props;
    return (
      <div className="course-table">
        <RadioGroup
          className="course-table-radio-group"
          value={lessonNo}
          onChange={this.onRadioChange}
        >
          <Grid
            rowKey="lessonNo"
            columns={getCourseTableColumns(this)}
            datasets={datasets}
            loading={loading}
            scroll={{ y: 120 }}
          />
        </RadioGroup>
      </div>
    );
  }
}
