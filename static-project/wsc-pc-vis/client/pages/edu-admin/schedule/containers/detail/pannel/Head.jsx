import React, { PureComponent } from 'react';
import { Alert, Icon, ClampLines } from 'zent';
import { ScheduleNewDialog } from '../../../../../new-dialogs';
import TrialTag from '../../../components/trial-tag';

export default class Head extends PureComponent {
  conflictPath =
    window._global.url.v4 +
    '/vis/edu/page/schedule#/panel/view?scheduleType=day&showMoreFilter=true';

  _conflictPath = this.conflictPath;

  render() {
    const { data, statistics, kdtId, lessonNo, getData } = this.props;
    const { className, lessonName, eduCourseName, conflictResources, isTrial } = data || {};
    const formattedData = this.formatData(conflictResources || '0');
    const canEdit = !statistics.studentNum || statistics.noSignInNum > 0;
    return (
      <div className="schedule-detail_pannel-head">
        <div className="title">
          <div className='titlewrapper'>
            <h1>{className || eduCourseName}</h1>
            {!!isTrial && <TrialTag/>}
          </div>
          <span>
            {
              canEdit ? (
                <a
                  className="schedule-detail_pannel-edit"
                  onClick={
                    () => {
                      ScheduleNewDialog.open(
                        '编辑日程',
                        {
                          lessonNo,
                          kdtId,
                          operateType: 2,
                          isTry: isTrial,
                        },
                        getData,
                      );
                    }
                  }
                  style={{ color: '#155bd4' }}
                >
                  <Icon type="edit-o" />
                  编辑
                </a>
              ) : null
            }
          </span>
        </div>
        {lessonName && (
          <ClampLines
            className="lesson-name"
            popWidth={350}
            lines={2}
            text={lessonName}
          />
        )}
        {formattedData && (
          <a href={this._conflictPath} target="_blank" rel="noopener noreferrer">
            <Alert type="error">
              {formattedData}
              <Icon type="right" />
            </Alert>
          </a>
        )}
      </div>
    );
  }
  formatData = data => {
    const { classNo, classroomNo, teacherNo, startTime } = this.props.data;
    this._conflictPath = this.conflictPath + '&startTime=' + startTime;
    return data
      .split(',')
      .map(item => {
        switch (item) {
          case '1':
            this._conflictPath += '&teacherNo=' + teacherNo;
            return '老师冲突';
          case '2':
            this._conflictPath += '&classNo=' + classNo;
            return '班级冲突';
          case '3':
            this._conflictPath += '&classroomNo=' + classroomNo;
            return '教室冲突';
          default:
            return '';
        }
      })
      .join('、');
  };
}
