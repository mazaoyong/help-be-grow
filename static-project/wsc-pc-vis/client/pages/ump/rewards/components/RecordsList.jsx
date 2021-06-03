import VisList, { VisFilterTable } from 'components/vis-list';
import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';
import { isArray, map, omit, get } from 'lodash';
import { recordOptions, recordsColumns } from './recordlist-config';
import { Button as SamButton } from '@youzan/sam-components';
import { getRecordsList, getRewardsActivity, submitExportRewardRecordTask } from '../common/api';
import { findListAllCampus } from 'common/api/shop';
import { Notify, Tag } from 'zent';
import { ACIVITY_STATUS } from '../constants';
import { format } from 'date-fns';
import { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import compare from '@youzan/utils/date/compare';

// const DEFAULT_CAMPUS = { value: 0, text: '全部' };

class RecordsList extends PureComponent {
  DEFAULT_CAMPUS = { value: this.getCampusId(), text: '全部' };
  state = {
    campusList: [this.DEFAULT_CAMPUS],
    campusKdtId: this.DEFAULT_CAMPUS.value,
    activityDetail: {
      activityName: '',
      startAt: '',
      endAt: '',
      activityStatus: 1,
    }
  }

  defaultValue = {
    awardType: 0,
    studentName: '',
    orderNo: '',
    courseProductName: '',
    campusKdtId: this.DEFAULT_CAMPUS.value,
  };

  getCampusId() {
    const { query = {} } = hashHistory.getCurrentLocation();
    return query.campusKdtId;
  }

  getActivityId() {
    const { query = {} } = hashHistory.getCurrentLocation();
    return query.activityId;
  }

  getRewardNodeType() {
    const { query = {} } = hashHistory.getCurrentLocation();
    return query.rewardNodeType;
  }

  componentDidMount() {
    Promise.all([findListAllCampus(), getRewardsActivity({
      id: this.getActivityId(),
      campusKdtId: this.getCampusId(),
    })]).then(([listData, rewardDetail]) => {
      let campusList = [this.DEFAULT_CAMPUS];
      if (isArray(listData)) {
        campusList = campusList.concat(map(listData, campus => ({
          text: campus.shopName,
          value: campus.kdtId,
        })));
      } else {
        campusList = [{ value: -1, text: '暂无校区' }];
      }

      const { activityName, startAt, endAt, activityStatus } = rewardDetail;
      this.setState({
        campusList,
        activityDetail: {
          activityName,
          startAt,
          endAt,
          activityStatus,
        }
      });
    });
  }

  export(filter) {
    // console.log('filter', filter, filter.data());
    const query = filter.data() || {};
    const { pathname } = hashHistory.getCurrentLocation();
    const isProcessing = /processing/.test(pathname);
    const { createdAt, redeemAt, orderNo, campusKdtId, studentName } = query;
    const isCreateTimeValid = this.checkTimeValid(createdAt);
    const isRedeemTimeValid = this.checkTimeValid(redeemAt);
    if (isProcessing) {
      if (!isCreateTimeValid) {
        Notify.error(this.isHasTimeValue(createdAt) ? '导出数据发放时间不能超过3个月' : '请选择发放时间');
        return;
      }
    } else {
      if (!isCreateTimeValid && !isRedeemTimeValid) {
        Notify.error(!createdAt && !redeemAt ? '请选择发放时间或者领取时间' : '导出数据时间不能超过3个月');
        return;
      }
    }

    const exportQuery = {
      activityId: this.getActivityId()
    };
    if (isRedeemTimeValid) {
      exportQuery.redeemStart = redeemAt[0];
      exportQuery.redeemEnd = redeemAt[1];
    }
    if (isCreateTimeValid) {
      exportQuery.rewardStart = createdAt[0];
      exportQuery.rewardEnd = createdAt[1];
    }
    if (orderNo) {
      exportQuery.orderNo = orderNo;
    }
    if (campusKdtId) {
      exportQuery.campusKdtId = campusKdtId;
    }
    if (studentName) {
      exportQuery.studentName = studentName;
      exportQuery.phone = studentName;
    }

    submitExportRewardRecordTask({
      exportQuery,
    }).then((res) => {
      if (!res) {
        Notify.error('暂无数据，请重新选择导出数据条件');
        return;
      }
      this.redirectToExport();
    }).catch(err => Notify.error(err, 1000));
  }

  isHasTimeValue(dateRange) {
    return dateRange && dateRange[0] && dateRange[1];
  }

  checkTimeValid(dateRange) {
    if (!Array.isArray(dateRange)) {
      return false;
    } else if (get(dateRange, 'length') !== 2) {
      return false;
    } else {
      const endDate = new Date(dateRange[1]);
      const startDate = new Date(dateRange[0]);
      return compare([startDate, endDate], 3, 'month');
    }
  }

  redirectToExport() {
    window.open(getExportRecordUrl({ type: EXPORT_RECORD_TYPES.REWARD_EXPORT_TYPE }));
  }

  renderBottomAction = filter => {
    const { submit, reset } = filter;
    const rewardNodeType = this.getRewardNodeType();
    return (
      <>
        <SamButton type="primary" onClick={submit.bind(null, false)}>
          筛选
        </SamButton>
        { +rewardNodeType !== 1 &&
          <>
            <SamButton onClick={() => this.export(filter)}>
            导出
            </SamButton>
            <span className="filter__actions__reset" onClick={() => this.redirectToExport()}>
              查看已导出列表
            </span>
          </>}
        <span className="filter__actions__reset" onClick={() => {
          reset();
        }}>
          重置筛选条件
        </span>
      </>
    );
  };

  fetchData = ({ filterConditions, pageConditions }) => {
    this.setState({
      campusKdtId: +filterConditions.campusKdtId,
    });
    pageConditions['sort']['orders'] = [{
      direction: 'DESC',
      property: 'created_at',
    }];
    filterConditions = omit(filterConditions, 'rewardNodeType');
    if (!+filterConditions.campusKdtId) {
      filterConditions = omit(filterConditions, 'campusKdtId');
    }
    const transferParams = {
      activityId: this.getActivityId(),
    };
    const { redeemAt, createdAt } = filterConditions;
    if (Array.isArray(redeemAt)) {
      redeemAt[0] && (transferParams.redeemStart = redeemAt[0]);
      redeemAt[1] && (transferParams.redeemEnd = redeemAt[1]);
    }
    if (Array.isArray(createdAt)) {
      createdAt[0] && (transferParams.rewardStart = createdAt[0]);
      createdAt[1] && (transferParams.rewardEnd = createdAt[1]);
    }
    if (filterConditions.studentName) {
      filterConditions.phone = filterConditions.studentName;
    }
    const rewardRecordQuery = { awardType: 0, ...filterConditions, ...transferParams };
    return getRecordsList({ pageRequest: pageConditions, rewardRecordQuery }).then(data => {
      if (data && data.content) {
        return {
          datasets: data.content,
          total: data.total,
          current: data.pageable.pageNumber,
        };
      }
      return data;
    }).catch(error => {
      Notify.error(error || '获取奖励活动列表失败');
    });
  };

  render() {
    const { activityDetail = {} } = this.state;
    const rewardNodeType = this.getRewardNodeType();
    return (
      <>
        <div className="record-header__wrap">
          <span>
            <span className="record-header__title">{activityDetail.activityName || '查看记录'}</span>
            <Tag theme={activityDetail.activityStatus === 2 ? 'green' : 'grey'} className="record-header__tag" outline>{ACIVITY_STATUS[activityDetail.activityStatus - 1] || '未开始'} </Tag>
          </span>
          <div className="record-header__time">
            活动时间：{activityDetail.startAt ? `${format(activityDetail.startAt, 'YYYY-MM-DD HH:mm:ss')}至${format(activityDetail.endAt, 'YYYY-MM-DD HH:mm:ss')}` : ''}
          </div>
        </div>
        <span className="record-header__title">奖励发放明细</span>
        <VisList>
          <VisFilterTable
            filterProps={
              {
                defaultValue: this.defaultValue,
                options: recordOptions.call(this, rewardNodeType),
                bottomActions: this.renderBottomAction,
              }
            }
            tableProps={
              {
                initQueries: { sortBy: 'created_at' },
                columns: recordsColumns.call(this, rewardNodeType),
                fetchData: this.fetchData,
                rowKey: 'recordId',
                scroll: { x: 1200 },
                pageConfig: {
                  pageSize: 20,
                },
                emptyLabel: <span>暂无发放记录</span>
              }
            }
          >
          </VisFilterTable>
        </VisList>
      </>
    );
  }
}

export default RecordsList;
