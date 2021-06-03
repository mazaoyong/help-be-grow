import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import ReserveSearch from './components/reserve-search';
import ReserveStatusTabs from './components/reserve-status-tabs';
import ReserveList from './components/reserve-list';
import AppointmentDialog from '../../components/dialog-appointment';
import { hashHistory } from 'react-router';
import { PAGE_URL_MAP } from '../../constants';
import { getAppointmentList, exportAppointment } from '../../api';
import { deleteEmptyProperty } from '../../../appointment/utils';
import queryString from 'zan-utils/url/queryString';
import formatDate from 'zan-utils/date/formatDate';
import YZLocalStorage from 'zan-utils/browser/local_storage';

class ReserveListPage extends Component {
  param = {};

  state = {
    filter: {},
    loading: false,
    exportLoading: false,
    list: [],
    totalItem: 0,
    current: 1,
    pageSize: 20,
    sort: {
      sortBy: 'created_at',
      sortType: 'desc',
    },
    statusCount: {}, // 不同预约状态的数量对象
    status: '', // 预约状态 0 全部 1 待确认 2 待上课 3 已上课 4 已取消
  };

  getAppointmentList = () => {
    const param = this.getParam();
    this.setState({ loading: true });
    getAppointmentList(param)
      .then((data = {}) => {
        const {
          studentLessons = {},
          cancelNum = 0,
          completedNum = 0,
          performingNum = 0,
          toBeConfirmNum = 0,
        } = data;
        this.setState({
          list: studentLessons.content || [],
          totalItem: studentLessons.total,
          statusCount: { cancelNum, completedNum, performingNum, toBeConfirmNum },
        });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  changeStaus = status => {
    if (status === this.state.status) return;
    this.setState({ current: 1, status }, () => {
      this.getAppointmentList();
    });
  };

  getParam = () => {
    const { current, pageSize, status, filter, sort } = this.state;
    const pageRequest = {
      pageSize,
      pageNumber: current,
      sort: {
        orders: [
          {
            property: sort.sortBy,
            direction: sort.sortType.toUpperCase(),
          },
        ],
      },
    };

    const startTime = (function() {
      try {
        return formatDate(filter.startTime, 'YYYY-MM-DD HH:mm:ss');
      } catch (error) {
        return '';
      }
    })();

    const endTime = (function() {
      try {
        return formatDate(filter.endTime, 'YYYY-MM-DD HH:mm:ss');
      } catch (error) {
        return '';
      }
    })();

    return {
      pageRequest,
      filter: deleteEmptyProperty({
        ...filter,
        startTime: filter.startTime ? startTime : '',
        endTime: filter.endTime ? endTime : '',
        status,
      }),
    };
  };

  updateData = (page = {}) => {
    let { current } = page;
    if (!current && current !== 0) current = this.state.current; // page没有传的保持之前的
    if (current <= 0) current = 1; // zent 分页组件没有对0做过滤，对于负数或者大于总页数的有过滤
    this.setState({ current }, () => {
      this.getAppointmentList();
    });
  };

  onSearch = filter => {
    this.setState({ current: 1, filter: { ...filter } }, () => {
      this.getAppointmentList();
    });
  };

  exportData = param => {
    const userInfo = window._global.userInfo;
    Notify.success('正在申请导出...');
    this.setState({ exportLoading: true });
    exportAppointment(
      deleteEmptyProperty({
        ...param,
        operatorMobile: userInfo.mobile,
        operatorName: userInfo.nickName,
      }),
    )
      .then(data => {
        Notify.clear();
        Notify.success('导出请求成功!');
        window.open(PAGE_URL_MAP.exportDataPage);
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({ exportLoading: false });
      });
  };

  addAppointment = (data = {}) => {
    // AppointmentCancelDialog.open();
    AppointmentDialog.open({
      defaultData: data,
      callback: this.updateData,
    });
  };

  onChange = (key, value) => {
    let val = value;
    if (key === 'sort' && value && !value.sortType) {
      val = {
        sortBy: 'created_at',
        sortType: 'desc',
      };
    }
    this.setState({ [key]: val }, () => {
      if (key === 'sort') {
        this.getAppointmentList();
      }
    });
  };

  onTeacherChange = (e) => {
    this.setState({
      filter: { ...this.state.filter, teacherName: e.target.value },
    });
  }

  onCourseTypeChange = (value) => {
    this.setState({
      filter: { ...this.state.filter, courseType: value },
    });
  }

  onTimeChange = (value) => {
    this.setState({
      filter: { ...this.state.filter, startTime: value[0], endTime: value[1] },
    });
  }

  /**
   * 初始化表格筛选条件
   */
  initFilter = () => {
    const filter = {};
    const eduAppointmentTelephone = YZLocalStorage.getItem('eduAppointmentTelephone');
    const params = hashHistory.getCurrentLocation().query;
    if (params && params.teacherName) {
      filter.teacherName = params.teacherName;
    }
    if (params && params.courseType) {
      filter.courseType = params.courseType;
    }
    if (params && params.startTime) {
      filter.startTime = +params.startTime;
    }
    if (params && params.endTime) {
      filter.endTime = +params.endTime;
    }
    if (eduAppointmentTelephone) {
      filter.phoneNo = eduAppointmentTelephone;
      YZLocalStorage.removeItem('eduAppointmentTelephone');
    }
    return filter;
  }

  componentDidMount() {
    const parsedSearch = queryString.parse(this.props.location.search);
    // 参数判断
    if (+parsedSearch.add === 1 || +parsedSearch.new === 1) this.addAppointment();

    this.setState({
      status: +parsedSearch.status || 0,
      filter: this.initFilter(),
    }, () => {
      this.getAppointmentList();
    });
  }
  render() {
    const {
      loading,
      list,
      totalItem,
      current,
      pageSize,
      statusCount,
      status,
      exportLoading,
      sort,
    } = this.state;
    const pagination = { totalItem, current, pageSize };
    return (
      <div className="reserve-list-page">
        <div className="reserve-list-page__head-operate">
          <SamButton name="新建、修改、确认预约" type="primary" onClick={this.addAppointment}>
            新建预约
          </SamButton>
        </div>
        <ReserveSearch
          filter={this.state.filter}
          onTeacherChange={this.onTeacherChange.bind(this)}
          onCourseTypeChange={this.onCourseTypeChange.bind(this)}
          onTimeChange={this.onTimeChange.bind(this)}
          loading={loading}
          onSearch={this.onSearch}
          exportData={this.exportData}
          exportLoading={exportLoading}
        />
        <ReserveStatusTabs
          statusCount={statusCount}
          changeStaus={this.changeStaus}
          status={status}
        />
        <ReserveList
          loading={loading}
          list={list}
          sort={{ ...sort }}
          pagination={pagination}
          updatePagination={this.updateData}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default hot(module)(ReserveListPage);
