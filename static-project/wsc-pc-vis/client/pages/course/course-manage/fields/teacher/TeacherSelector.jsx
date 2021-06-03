import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import { Grid, Button, Checkbox, Input, Icon, Notify, Dialog } from 'zent';
import { getTeacherListApi } from '../../../api/course-manage';
import { isEduChainStore, isInStoreCondition } from 'fns/chain';
import { findIndex } from 'lodash';
import cx from 'classnames';
import get from 'lodash/get';
import VersionWrapper from 'fns/version';

import StaffService from 'domain/staff-domain/services';
import { columns, staffColumns } from './constants';

const { closeDialog } = Dialog;

const PAGINATION_SIZE = 5;

const { fetchSingleShopStaffList, fetchChainStaffList } = StaffService;

const HelpEle = ({ text }) => (
  <Pop trigger="hover" position="top-center" content={text}>
    <Icon type="help-circle" className="teacher-selector-helpele" />
  </Pop>
);

class TeacherSelector extends Component {
  constructor(props) {
    super(props);
    const value = [];
    props.value.map(item => {
      value.push(item.id);
    });
    this.state = {
      teacherList: [],
      selectedTeachers: props.value.map(item => {
        return {
          id: item.id,
          value: item.id,
          teacherName: item.teacherName,
          staffName: item.staffName,
          description: item.description,
        };
      }),
      value,
      onlyScheduledTeacher: false,
      currentPage: 1,
      keyword: null,
      total: 0,
      loading: false,
    };
  }

  static defaultProps = {
    maxTeacherNum: 10,
  }

  componentDidMount() {
    const { queryStaff } = this.props;
    if (queryStaff) {
      this.fetchStaffList({ pageNo: 1 });
    } else {
      this.fetchTeacherList({ currentPage: 1 });
    }
  }

  // 获取店铺员工列表
  fetchStaffList = ({
    pageNo = 1,
    keyword = '',
  }) => {
    const fetch = isEduChainStore
      ? fetchChainStaffList
      : fetchSingleShopStaffList;

    const query = {
      pageNo,
      pageSize: PAGINATION_SIZE,
      keyword,
    };
    if (isEduChainStore) {
      query['targetKdtId'] = _global.kdtId;
    }

    this.setState({ loading: true });
    fetch(query)
      .then(data => {
        const { items = [], paginator = {} } = data || {};
        const teacherList = items.map(staff => ({
          id: staff.adminId,
          value: staff.adminId,
          staffName: staff.name,
          mobile: staff.linkPhone,
        })) || [];

        this.setState({
          total: paginator.totalCount || 0,
          teacherList,
        });
      })
      .catch(e => {
        Notify.error(e || '获取老师列表失败');
      }).finally(() => {
        this.setState({ loading: false });
      });
  };

  // 获取老师列表
  fetchTeacherList = ({
    refresh,
    currentPage = 1,
    onlyScheduledTeacher = this.state.onlyScheduledTeacher,
    keyword = this.state.keyword,
  }) => {
    const kdtId = _global.kdtId;
    const { applyCourse, courseType } = this.props;
    this.setState({ loading: true });
    getTeacherListApi({
      query: {
        keyword,
        kdtId,
        hasLesson: onlyScheduledTeacher ? 1 : 0,
        eduCourseIds: (!!courseType && get(applyCourse, 'eduCourse.id')) ? [ get(applyCourse, 'eduCourse.id') ] : null, // 现在只有1个课程id，以后要兼容多个
      },
      pageRequest: { pageNumber: currentPage, pageSize: PAGINATION_SIZE },
    }).then(data => {
      const teacherList = (data.content && data.content.map(item => {
        return {
          id: item.id,
          value: item.id,
          teacherName: item.teacherName,
          staffName: item.staffName,
          description: item.description,
        };
      })) || [];
      this.setState({
        total: data.total || 0,
        teacherList,
      });
    }).catch(() => {
      Notify.error('获取教师列表失败');
    }).finally(() => {
      this.setState({ loading: false });
    });
  };

  toggleScheduledTeacher = e => {
    const { onlyScheduledTeacher } = this.state;
    this.fetchTeacherList({
      refresh: true,
      currentPage: 1,
      onlyScheduledTeacher: !onlyScheduledTeacher,
    });
    // 埋点（商家是否点击过仅显示有排课的老师）
    window.Logger && window.Logger.log({
      et: 'custom', // 事件类型
      ei: 'only_occupied_teacher', // 事件标识
      en: '仅显示有排课的老师', // 事件名称
      params: {
        onlyScheduledTeacher: onlyScheduledTeacher ? 0 : 1,
      }, // 事件参数
    });
    this.setState({
      onlyScheduledTeacher: !onlyScheduledTeacher,
      currentPage: 1,
    });
  };

  onGridChange = ({ current }) => {
    const { onlyScheduledTeacher, keyword } = this.state;

    if (this.props.queryStaff) {
      this.fetchStaffList({ pageNo: current, keyword });
    } else {
      this.fetchTeacherList({ currentPage: current, onlyScheduledTeacher: onlyScheduledTeacher });
    };

    this.setState({
      currentPage: current,
    });
  };

  onSubmitTeacherList = () => {
    const { value, selectedTeachers } = this.state;
    const { queryStaff } = this.props;

    if (value && value.length > this.props.maxTeacherNum) {
      Notify.error(`仅能选择${this.props.maxTeacherNum}名${queryStaff ? '员工' : '老师'}，请重新选择后保存`);
      return;
    }
    this.props.onChange(selectedTeachers);
    closeDialog('choose-teacher');
  }

  onSearch = e => {
    const newKeyword = e.target.value;
    this.setState(
      { keyword: newKeyword },
      () => {
        if (this.props.queryStaff) {
          this.fetchStaffList({ pageNo: 1, keyword: newKeyword });
        } else {
          this.fetchTeacherList({ refresh: true, currentPage: 1, keyword: newKeyword });
        };
      }
    );
  };

  onRefresh = () => {
    const { keyword } = this.state;
    if (this.props.queryStaff) {
      this.fetchStaffList({ pageNo: 1, keyword });
    } else {
      this.fetchTeacherList({ refresh: true, currentPage: 1, keyword });
    };

    this.setState({ currentPage: 1 });
  };

  render() {
    const { teacherList, currentPage, onlyScheduledTeacher,
      total, loading, value, selectedTeachers } = this.state;

    const {
      showOnlyScheduledFilter, // 是否展示“仅显示有排课的老师”复选框
      queryStaff = false, // 是否查询员工，（false则查询教务课程的所有老师，true则查询店铺员工）
    } = this.props;
    return (
      <>
        <div className="teacher-grid-header">
          <div className="teacher-grid-header-widget">
            <Button // todo 权限问题
              target='_blank'
              type="primary"
              href={isInStoreCondition({ supportEduBranchStore: true })
                ? `https://www.youzan.com/v4/setting/chainstaff#/staff/add${queryStaff ? '' : '?roleId=21'}`
                : `${window._global.url.www}/staff/index/index#/create${queryStaff ? '' : '?roleId=21|1'}`
              }
            >
              新建{queryStaff ? '员工' : '老师'}
            </Button>
            <Button type="default" className="teacher-grid-header-refresh" onClick={() => this.onRefresh()}>刷新</Button>
          </div>
          <div className="teacher-grid-header-options">
            {showOnlyScheduledFilter && <VersionWrapper name='teacher-select-filterSchedule'>
              <>
                <Checkbox
                  checked={onlyScheduledTeacher}
                  onClick={e => { this.toggleScheduledTeacher(e); } }
                >
                  仅显示有排课的老师
                </Checkbox>
                <HelpEle text={<><p>勾选后，系统自动从课程里读取排课日程所安排的老师</p><p>（暂仅支持拉取当前时间后90天内的排课日程）</p></>} />
              </>
            </VersionWrapper>}
            <Input className="teacher-grid-header-search" icon="search" placeholder={`搜索${queryStaff ? '员工' : '老师'}姓名`} onPressEnter={this.onSearch} onBlur={e => this.setState({ keyword: e.target.value })} />
          </div>
        </div>
        <Grid
          rowKey="value"
          className="teacher-grid-body"
          columns={queryStaff ? staffColumns : columns}
          datasets={teacherList}
          loading={loading}
          onChange={this.onGridChange}
          selection={{
            selectedRowKeys: value,
            needCrossPage: true,
            onSelect: (selectedRowKeys, selectedRows, currentRow) => {
              this.setState({
                value: selectedRowKeys,
              });
              const selected = [ ...selectedTeachers ];
              if (!Array.isArray(currentRow) && findIndex(selected, ['id', currentRow.id]) === -1) { // 单选
                // 选中某老师
                const newTeacher = {
                  id: currentRow.id,
                  value: currentRow.id,
                  teacherName: currentRow.teacherName,
                  staffName: currentRow.staffName,
                  description: currentRow.description,
                  mobile: currentRow.mobile,
                };
                selected.push(newTeacher);
                this.setState({ selectedTeachers: selected });
              } else if (!Array.isArray(currentRow) && findIndex(selected, ['id', currentRow.id]) !== -1) {
                // 取消选择
                selected.splice(findIndex(selected, ['id', currentRow.id]), 1);
                this.setState({ selectedTeachers: selected });
              } else if (Array.isArray(currentRow) && currentRow.length > 0) { // 全选
                selectedRows.forEach(teacher => {
                  if (findIndex(selected, ['id', teacher.id]) === -1) { // 如果不存在该老师
                    const newTeacher = {
                      id: teacher.id,
                      value: teacher.id,
                      teacherName: teacher.teacherName,
                      staffName: teacher.staffName,
                      description: teacher.description,
                      mobile: teacher.mobile,
                    };
                    selected.push(newTeacher);
                  }
                });
                this.setState({ selectedTeachers: selected });
              } else if (Array.isArray(currentRow) && currentRow.length === 0) { // 全部取消，现阶段zentGrid分页取消全选会把其他页选中项一起取消
                selected.length = 0;
                this.setState({ selectedTeachers: [], value: [] });
              }
            },
            getCheckboxProps: data => ((this.state.value.length &&
              (this.state.value.length >= this.props.maxTeacherNum))
              ? {
                disabled: !this.state.value.includes(data.value),
              }
              : {
                disabled: false,
              }),
          }}
          pageInfo={{
            current: currentPage,
            pageSize: PAGINATION_SIZE,
            total: total,
          }}
          ellipsis
        />
        <div className="teacher-selector-footer">
          {teacherList.length
            ? <span>已选（<span className={cx({ 'red': this.state.value.length > this.props.maxTeacherNum })}>{this.state.value.length || 0}</span>），可选（{this.props.maxTeacherNum}）</span>
            : null}
          <Button onClick={() => closeDialog('choose-teacher')}>取消</Button>
          <Button type="primary" onClick={this.onSubmitTeacherList} disabled={!this.state.value.length}>确定</Button>
        </div>
      </>
    );
  }
}

export default TeacherSelector;
