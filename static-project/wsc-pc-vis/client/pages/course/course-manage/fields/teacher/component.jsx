
import { Pop, Form } from '@zent/compat';
import React, { Component } from 'react';
import { Dialog, Grid, ClampLines } from 'zent';
import findIndex from 'lodash/findIndex';
import cx from 'classnames';
import TeacherSelector from './TeacherSelector';
import openDemoImg from '../../../components/demo-image';
import { DEMO_IMG, DEMO_TEXT } from '../../constants';
import './index.scss';

const PAGINATION_SIZE = 5;

const { getControlGroup } = Form;
const { openDialog } = Dialog;

class TeacherComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      currentPage: 1,
    };
  }

  static defaultProps = {
    maxTeacherNum: 10,
  }

  filterSelectedTeachers = allTeachers => {
    const value = [...this.state.value];
    value.forEach((selectedTeacher, index) => {
      if (
        findIndex(allTeachers, teacher => {
          return teacher.value === selectedTeacher.id;
        }) === -1
      ) {
        value.splice(index, 1);
        this.setState({ value });
      }
    });
  };

  columns = [
    {
      title: this.props.queryStaff ? '员工' : '老师',
      width: 150,
      bodyRender({ staffName, name }) {
        return (
          <ClampLines
            lines={2}
            popWidth={150}
            text={staffName || name || '-'}
          />
        );
      },
    },
    {
      title: '昵称',
      width: 150,
      bodyRender({ staffName, teacherName }) {
        return (
          <ClampLines
            lines={2}
            popWidth={150}
            text={teacherName || staffName || '-'}
          />
        );
      },
      visible: !this.props.queryStaff,
    },
    {
      title: '手机号',
      width: 150,
      bodyRender({ mobile }) {
        return mobile ?? '-';
      },
      visible: this.props.queryStaff,
    },
    {
      title: '操作',
      width: 50,
      bodyRender: data => (
        <span
          className={cx('operation', { disabled: this.props.disabled })}
          onClick={this.props.disabled ? () => {} : () => this.deleteTeacher(data)}
        >
          删除
        </span>
      ),
    },
  ];

  deleteTeacher = teacher => {
    const { value } = this.props;
    this.props.onChange(value.filter(item => item.id !== teacher.id));
  };

  onGridChange = ({ current }) => {
    this.setState({
      currentPage: current,
    });
  };

  render() {
    const { currentPage } = this.state;
    const { value, applyCourse, courseType, desc, queryStaff, showOnlyScheduledFilter, disabled } = this.props;
    const onOpen = () => {
      openDialog({
        dialogId: 'choose-teacher',
        className: 'teacher-selector-dialog',
        title: queryStaff ? '选择员工' : '选择上课老师',
        children: <TeacherSelector
          value={value}
          onChange={this.props.onChange}
          filterSelectedTeachers={this.filterSelectedTeachers}
          applyCourse={applyCourse}
          courseType={courseType}
          queryStaff={queryStaff}
          showOnlyScheduledFilter={showOnlyScheduledFilter}
          maxTeacherNum={this.props.maxTeacherNum}
        />,
        onClose: () => {
          this.setState({ currentPage: 1 });
        },
      });
    };

    const getTeacherPageList = pageNo => {
      const teacherIndex = pageNo * PAGINATION_SIZE - 5;
      return value.slice(teacherIndex, teacherIndex + PAGINATION_SIZE);
    };

    return (
      <>
        <span className={cx('teacher-selector-label', { disabled })} onClick={disabled ? () => {} : onOpen}>选择老师</span>
        {(value && !!value.length)
          ? <Grid
            className="teacher-selector-grid"
            rowKey="value"
            columns={this.columns.filter(item => item.visible !== false)}
            datasets={getTeacherPageList(currentPage)}
            onChange={this.onGridChange}
            paginationType="lite"
            pageInfo={(value && (value.length > PAGINATION_SIZE))
              ? {
                current: currentPage,
                pageSize: PAGINATION_SIZE,
                total: value.length || 0,
              }
              : null
            }
            ellipsis
          />
          : null
        }
        <div className="help-tip">
          {desc || (
            <>
              最多选择{this.props.maxTeacherNum}个老师；课程关联老师后，会显示在课程详情页。
              <Pop
                trigger="click"
                content={openDemoImg(DEMO_IMG.TEACHER, DEMO_TEXT.TEACHER)}
                position="right-top"
                className='course-example-pop'
              >
                <a href="javascript:;">查看示例</a>
              </Pop>
            </>
          )}
        </div>
      </>
    );
  }
}

export default getControlGroup(TeacherComponent);
