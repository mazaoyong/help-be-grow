import React, { Component } from 'react';
import { Notify } from 'zent';
import { VisList, VisTable } from '../../../../../../components/vis-list';
import { getColumns } from './config';
import { getRecordList, getClassDetail } from '../../../api';
import { deleteEmptyProperty } from '../../../utils';
import './index.scss';

export default class Record extends Component {
  eduClassInfo = {};
  genTablePlaceholder = () => {
    return <div className="class-table-placeholder">暂无数据</div>;
  };

  getRecordList = ({ filterConditions = {}, pageConditions = {} }) => {
    const { params = {} } = this.props;
    const {
      sort: { orders },
    } = pageConditions;

    orders[0].property = orders[0].property === 'created_time' ? '' : orders[0].property;
    if (!orders[0].property) {
      pageConditions.sort.orders = [];
    }
    const param = {
      query: {
        endTime: Date.now(),
        kdtId: params.kdtId,
      },
      pageRequest: deleteEmptyProperty(pageConditions),
    };
    if (this.eduClassInfo.eduClassNo) {
      param.query.classNo = this.eduClassInfo.eduClassNo;
      return getRecordList(param)
        .then(({ content, total, pageable }) => ({
          datasets: content,
          total,
          current: pageable.pageNumber,
        }))
        .catch(error => {
          Notify.error(error);
        });
    } else {
      return getClassDetail({
        id: params.eduClassId,
        kdtId: params.kdtId,
      })
        .then(data => {
          const eduClassInfo = (data || {}).eduClass || {};
          this.eduClassInfo = eduClassInfo;
          param.query.classNo = eduClassInfo.eduClassNo;
          if (!eduClassInfo.eduClassNo) return Notify.error('班级不存在');
          return getRecordList(param).then(({ content, total, pageable }) => ({
            datasets: content,
            total,
            current: pageable.pageNumber,
          }));
        })
        .catch(error => {
          Notify.error(error);
        });
    }
  };

  render() {
    return (
      <div className="detail-content detail-record-content">
        <VisList>
          <VisTable
            ref={table => (this.VisTable = table)}
            rowKey="id"
            columns={getColumns(this)}
            emptyLabel={this.genTablePlaceholder()}
            fetchData={this.getRecordList}
          />
        </VisList>
      </div>
    );
  }
}
