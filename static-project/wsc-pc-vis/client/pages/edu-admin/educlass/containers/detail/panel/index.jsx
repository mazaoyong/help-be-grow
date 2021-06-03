import React, { Component } from 'react';
import { Notify, BlockLoading } from 'zent';
import { getClassDetail } from '../../../api';
import SchedulePanel from '../../../../schedule/containers/panel';
import './index.scss';

export default class Panel extends Component {
  state = {
    eduClass: {},
    loading: true,
  };

  getEduClassDetail = () => {
    const { params = {} } = this.props;
    getClassDetail({
      id: params.eduClassId,
      kdtId: params.kdtId,
    })
      .then(data => {
        const eduClass = (data && data.eduClass) || {};
        if (!eduClass.eduClassNo) return Notify.error('班级不存在');
        this.setState({ eduClass });
      })
      .catch(error => {
        this.setState({ loading: false });
        Notify.error(error);
      });
  };

  componentDidMount() {
    this.getEduClassDetail();
  }

  render() {
    const { params = {} } = this.props;
    const { eduClass } = this.state;
    if (!eduClass.eduClassNo) {
      return (
        <BlockLoading loading={true} />
      );
    }
    return (
      <div className="detail-content detail-student-panel">
        <SchedulePanel project="educlass" state={{
          classNo: eduClass.eduClassNo,
          kdtId: params.kdtId,
        }}>
          {this.props.children}
        </SchedulePanel>
      </div>
    );
  }
}
