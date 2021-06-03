import React, { Component } from 'react';
import { Grid, Pagination } from 'zent';
import AppointmentDialog from '../../../../components/dialog-appointment';
import cancelAppointmentDialog from '../../../../components/dialog-appointment-cancel';
import { openSignInDialog } from '@ability-center/appointment/signin-util';
// import 'components/signin-dialog/styles.scss';

import { getColumns } from './config';

export default class ReserveList extends Component {
  confirmAppointment = appointment => {
    const { updatePagination } = this.props;
    AppointmentDialog.open({ defaultData: appointment, callback: updatePagination, type: 'confirm-appointment' });
  };

  editAppointment = appointment => {
    const { updatePagination } = this.props;
    AppointmentDialog.open({ defaultData: appointment, callback: updatePagination, type: 'edit-appointment' });
  }

  cancelAppointment = appointment => {
    const { updatePagination } = this.props;
    cancelAppointmentDialog.open({ defaultData: appointment, callback: updatePagination });
  };

  signin = appointment => {
    const { consumeAssetNum, studentLessonNo, studentName, startTime, kdtId } = appointment;
    const { updatePagination } = this.props;
    openSignInDialog({
      signInType: 0, // 类型 0 签到 1 请假 2 旷课
      consumeNum: consumeAssetNum,
      studentName: studentName,
      studentLessonNos: [studentLessonNo],
      afterSignIn: updatePagination,
      startTime: startTime,
      kdtId,
    });
  };

  onGridChange = value => {
    this.props.onChange('sort', { ...value });
  };

  render() {
    const { list = [], loading, pagination, updatePagination, sort = {} } = this.props;

    return (
      <div className="reserve-list">
        <Grid
          rowKey="studentLessonNo"
          columns={getColumns(this)}
          datasets={list}
          scroll={{ x: 2000 }}
          loading={loading}
          onChange={this.onGridChange}
          sortBy={sort.sortBy}
          sortType={sort.sortType}
        />
        {!!pagination.totalItem && (
          <Pagination
            className="reserve-list__pagination"
            {...pagination}
            onChange={updatePagination}
          />
        )}
      </div>
    );
  }
}
