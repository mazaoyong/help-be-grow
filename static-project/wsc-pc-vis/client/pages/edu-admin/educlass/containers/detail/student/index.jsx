import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Notify, Sweetalert } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import { getModel } from '@youzan/arthur-scheduler-react';
import { VisSearch, VisList, VisTable } from '../../../../../../components/vis-list';
import { EduClassChangeDialog } from '@ability-center/assets';
import addStudentDialog from '../components/student-add-dialog';
import './index.scss';
import YZLocalStorage from 'zan-utils/local_storage';
import NoticeDialog from '@ability-center/schedule/student-reminder-dialog';
import { navigateToAdjustCourse } from '@ability-center/assets/adjustcourse';
import { getColumns } from './config';
import { getStudentList, getClassDetail, removeClassStu, getRemoteConf } from '../../../api';
import { deleteEmptyProperty, getEduClassStatus } from '../../../utils';
import { get } from 'lodash';

class Student extends Component {
  filteredData = [];

  state = {
    studentName: '', // location 中获取
    pageNumber: 1,
    eduClassInfo: {},
    isEduClassEnd: true,
    isFull: true,
    selectedRows: [],
    adjustCourseSettings: {},
    showAdjustCourse: true
  };

  componentDidMount() {
    this.getEduClassDetail();
    this.getAdjustRemoteConfig();
    const abilitys = getModel('adjustCourseAssert', 'courseAssert');
    this.setState({
      showAdjustCourse: abilitys.available
    });
  }

  reloadPage = () => {
    location.reload();
  };

  addStudent = () => {
    const { eduClassInfo } = this.state;
    addStudentDialog({ ...eduClassInfo }, this.refreshList);
  };

  getEduClassDetail = () => {
    const { params = {} } = this.props;
    getClassDetail({
      id: params.eduClassId,
      kdtId: params.kdtId,
    })
      .then(data => {
        const eduClass = (data && data.eduClass) || {};
        const classStat = (data && data.classStat) || {};
        this.setState({
          eduClassInfo: data || {},
          isFull: classStat.currentStuNum >= eduClass.maxStuNum,
          isEduClassEnd: getEduClassStatus(eduClass.startTime, eduClass.endTime) === 'DONE',
        });
      })
      .catch(error => {
        Notify.error(error);
      });
  };

  getAdjustRemoteConfig = () => {
    getRemoteConf({
      namespace: 'wsc-pc-vis.adjustcourse'
    }).then(res => {
      this.setState({
        adjustCourseSettings: res
      });
    });
  }

  onSearch = value => {
    // todo 搜索
    this.setState(value, () => {
      this.refreshList();
    });
  };

  changeEduClass = (student = {}) => {
    const courseSellType = get(student, 'userAssert.courseSellType');
    const remaining = get(student, 'courseTime.remaining');
    const studentName = get(student, 'student.name');
    const eduClassId = get(student, 'eduClass.id');

    // 资产是按课时，课时<=0
    if (courseSellType === 1 && remaining <= 0) {
      Notify.error(`学员“${studentName}”课时已耗完，不能调班`);
      return;
    }

    // 资产是按课时、时段、自定义，课程到期日<当天
    if (
      [0, 1, 2].includes(courseSellType) &&
      student.eduCourseValidDescription !== '永久有效' &&
      new Date(student.eduCourseValidDescription).getTime() < Date.now()
    ) {
      Notify.error(`学员“${studentName}”课程到期了，不能调班`);
      return;
    }

    EduClassChangeDialog.open({ defaultData: {
      kdtId: student.kdtId,
      assetNo: student.userAssert.assetNo,
      studentId: student.student.id,
      eduClassId: eduClassId,
    },
    callback: this.reloadPage });
  };

  // 移除班级下学员
  removeClassStu = (student = {}) => {
    const courseSellType = get(student, 'userAssert.courseSellType');
    const studentName = get(student, 'student.name');

    if (courseSellType === 3) {
      Notify.error(`学员“${studentName}”通过按期报名加入班级，只能通过订单退款才能移除出本班`);
      return;
    }

    Sweetalert.confirm({
      className: 'educlass__remove_stu',
      title: '移除退出班级',
      content: `确定移除“${studentName}”并删除其在该班级内的所有未签到课节`,
      confirmType: 'default',
      confirmText: '移除',
      cancelText: '我再想想',
      onConfirm: () => {
        this.VisTable.refetchData.loading();
        removeClassStu({
          stuId: get(student, 'student.id'),
          classId: get(student, 'eduClass.id'),
          kdtId: get(student, 'eduClass.kdtId'),
        })
          .then(() => {
            Notify.success('移除学员成功');
            this.refreshList();
          })
          .catch(msg => {
            Notify.error(msg || '网络错误');
            this.VisTable.refetchData.cancelLoading();
          });
      },
    });
  };

  refreshList = () => {
    this.VisTable.refetchData.refresh();
    this.props.refreshDetail();
  };

  isFirstNotice = () => {
    const isFirstVisitStudent = YZLocalStorage.getItem(`student_first-visit_${_global.kdtId}`);
    if (isFirstVisitStudent !== 'false') {
      return true;
    }
    return false;
  }

  getStudentList = ({ filterConditions = {}, pageConditions = {} }) => {
    const { params = {} } = this.props;
    const {
      sort: { orders },
    } = pageConditions;

    orders[0].property = orders[0].property === 'created_time' ? 'created_at' : orders[0].property;
    if (!orders[0].property) {
      pageConditions.sort.orders = [];
    }

    const param = {
      // filter: { eduClassId: params.id },
      filter: {
        eduCourseId: params.eduCourseId,
        eduClassId: params.eduClassId,
        kdtId: params.kdtId || _global.kdtId,
      },
      pageRequest: deleteEmptyProperty(pageConditions),
    };

    if (get(filterConditions, 'studentName') !== '') {
      param.filter.studentName = get(filterConditions, 'studentName');
    }

    return getStudentList(param).then(({ content, total, pageable }) => ({
      datasets: content.map(item => { item.id = item.student.id; return item; }),
      total,
      current: pageable.pageNumber,
    }));
  };

  // 批量转课
  batchAdjustCourse = () => {
    const { selectedRows, adjustCourseSettings } = this.state;
    const maxAdjustCount = adjustCourseSettings.maxAdjustCount || 20;
    const { params = {} } = this.props;
    if (selectedRows.length <= 0) {
      Notify.error('请至少选择一位学员');
      return;
    } else if (selectedRows.length > maxAdjustCount) {
      Notify.error(`最多选择${maxAdjustCount}位学员`);
      return;
    }
    let studentIds = selectedRows.map(item => item.student.id).join(',');
    let assetNos = selectedRows.map(item => item.userAssert.assetNo).join(',');
    let kdtId = selectedRows[0].kdtId;
    let url = navigateToAdjustCourse({
      studentIds,
      kdtId,
      assetNos,
      eduClassId: params.eduClassId,
      eduCourseId: params.eduCourseId
    });
    window.open(url);
  }

  genTablePlaceholder = () => {
    return (
      <div className="class-table-placeholder">
        还没有数据，你可以
        <span className="class-table-placeholder__add-btn" onClick={this.addStudent}>
          添加学员
        </span>
      </div>
    );
  };

  render() {
    const { studentName, isEduClassEnd, isFull, showAdjustCourse } = this.state;

    return (
      <div className="detail-content detail-student-content">
        <div className="detail-student-content__actions">
          {!isEduClassEnd && !isFull ? (
            <SamButton name="编辑" bordered={false} type="primary" onClick={this.addStudent}>
              添加学员
            </SamButton>
          ) : (
            <div />
          )}
          <VisList>
            <VisSearch
              value={studentName}
              name="studentName"
              onSubmit={this.onSearch}
              placeholder="学员姓名"
            />
          </VisList>
        </div>
        <VisList>
          <VisTable
            ref={table => (this.VisTable = table)}
            rowKey="id"
            columns={getColumns(this, showAdjustCourse)}
            emptyLabel={isEduClassEnd || isFull ? '暂无数据' : this.genTablePlaceholder()}
            fetchData={this.getStudentList}
            onSelect={(selectedRows) => {
              this.setState({
                selectedRows
              });
            }}
            selectable={true}
            getCheckboxProps={(record) => {
              return {
                disabled: !record.transferCourse
              };
            }}
            stickyBatch={true}
            batchComponents={[
              <span key="all-selelect-word" className='detail-student-content__checkall'>当页全选</span>,
              showAdjustCourse && (
                <SamButton key="adjustcourse" name="转课" hide={true} onClick={this.batchAdjustCourse}>
                  转课
                </SamButton>
              )
            ]}
          />
        </VisList>
        <NoticeDialog
          isFirstVisit={this.isFirstNotice()}
        />
      </div>
    );
  }
}

export default withRouter(Student);
