import { Select } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Button as SamButton } from '@youzan/sam-components';
import { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import { getExcel } from '../api';

export default class Head extends PureComponent {
  selectedData = [];
  render() {
    const { selected, data = {}, onAdd, isTrial } = this.props;
    return (
      <div>
        <div className="schedule-detail_head">
          <div>
            {!isTrial && <SamButton name="编辑" type="primary" onClick={onAdd}>
              添加学员
            </SamButton>}
            <SamButton name="编辑" outline onClick={this.handleDetailExport}>
              导出签到表
            </SamButton>
          </div>
          <div>
            签到状态：
            <Select data={this.options} onChange={this.handleSelectChange} value={selected} />
          </div>
        </div>
        <span className="schedule-detail_head-alert">
          <span>学员数 {data.studentNum}</span>
          <span>试听 {data.trialNum}</span>
          <span>待签到 {data.noSignInNum}</span>
          <span>已签到 {data.attendNum}</span>
          <span>请假 {data.leaveNum}</span>
          <span>未到 {data.absentNum}</span>
        </span>
      </div>
    );
  }

  handleSelectChange = (event, selected) => {
    this.props.onSelected(selected.value);
  };

  handleDetailExport = () => {
    const { lessonNo, selected, kdtId } = this.props;
    const params = {
      signInStatus: selected,
      lessonNo,
      kdtId,
    };
    getExcel(params).then(() => {
      window.open(getExportRecordUrl({ type: EXPORT_RECORD_TYPES.SCHEDULE_SIGNED_LIST }));
    });
  };

  options = [
    { value: '', text: '全部' },
    { value: '2', text: '待签到' },
    { value: '4', text: '已签到' },
    { value: '6', text: '未到' },
    { value: '7', text: '请假' },
  ];
}
