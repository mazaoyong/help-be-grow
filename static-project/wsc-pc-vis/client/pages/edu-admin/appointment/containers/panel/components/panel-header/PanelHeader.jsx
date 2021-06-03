import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import { Button, Icon } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import DialogAppointment from '../../../../components/dialog-appointment';
import DateQuickPicker from '../../../../components/date-quick-picker';
import SelectWeek from '../../../../../schedule/containers/panel/components/select-week';
import { APPOINTMENT_SCHEDULE_TYPE, SCHEDULE_INTERVAL } from '../../../../constants';
// import { chainSupportHq, chainSupportSingle } from '../../../../chain';
// import { arrayColumnWrapper } from 'fns/chain';
import PanelFooter from '../panel-footer';
import ReserveSearch from '../../../list/components/reserve-search';

// 1 customerName 2 phoneNum 3 courseName 4 teacherName
// const selectData = arrayColumnWrapper([
//   {
//     value: 'customerName',
//     text: '客户姓名',
//   },
//   {
//     value: 'phoneNo',
//     text: '手机号码',
//   },
//   {
//     value: 'teacherName',
//     text: '老师姓名',
//   },
//   {
//     value: 'address',
//     text: '上课地点',
//     chainState: chainSupportSingle,
//   },
//   {
//     value: 'kdtId',
//     text: '所属校区',
//     chainState: chainSupportHq,
//   },
//   {
//     value: 'contractName',
//     text: '课节内容',
//   },
// ]);

const TypeTabs = [
  { text: '日', value: APPOINTMENT_SCHEDULE_TYPE.DAY },
  { text: '周', value: APPOINTMENT_SCHEDULE_TYPE.WEEK },
];

const IntervalTabs = [
  { text: '15分', value: SCHEDULE_INTERVAL.QUARTER },
  { text: '30分', value: SCHEDULE_INTERVAL.HALF },
  { text: '1小时', value: SCHEDULE_INTERVAL.HOUR },
];

export default class PanelHeader extends Component {
  state = {
    showMoreFilter: false,
  };

  onChange = (key, value) => {
    this.props.onChange(key, value);
  };

  addAppointment = () => {
    const { updateKanbanData } = this.props;
    DialogAppointment.open({
      callback: updateKanbanData,
    });
  };

  onSearch = (data) => {
    const { onSearch } = this.props;
    onSearch('filter', data);
  }

  render() {
    const {
      // selectValue,
      dateValue,
      weekStart,
      // courseType,
      scheduleType,
      interval,
      onChange,
      onSearch,
      reserveStatus,
      filterStatus,
      filter,
      onTeacherChange,
      onCourseTypeChange,
    } = this.props;
    const { showMoreFilter } = this.state;

    return (
      <div className="reserve-panel-header">
        <div className="reserve-panel-header__line">
          <SamButton name="新建、修改、确认预约" type="primary" onClick={this.addAppointment}>
            新建预约
          </SamButton>
          <a
            className="reserve-panel-header__trigger"
            onClick={() =>
              this.setState({ showMoreFilter: !showMoreFilter })
            }
          >
            {showMoreFilter ? '收起' : '展开'}筛选项
            <span className={`reserve-panel-header__trigger--${showMoreFilter ? 'up' : 'down'}`}>
              <Icon type="right" />
            </span>
          </a>
          {/* <div className="reserve-panel-header__search">
            <Select
              data={COURSE_TYPE_OPTION}
              value={courseType}
              onChange={e => onSearch('courseType', e.target.value)}
              placeholder="课程类型"
            />
            <Select
              data={selectData}
              value={selectValue}
              onChange={e => onSearch('selectValue', e.target.value)}
              placeholder="请选择搜索类型"
            />
            <Input
              onPressEnter={e => onSearch('inputValue', e.target.value)}
              onChange={e => onChange('inputValue', e.target.value)}
              placeholder="请输入"
            />
          </div> */}
        </div>
        { showMoreFilter && <ReserveSearch
          filter={filter}
          disableReserveTime
          disableExport
          onTeacherChange={onTeacherChange}
          onCourseTypeChange={onCourseTypeChange}
          // loading={loading}
          onSearch={this.onSearch}
          exportData={this.exportData}
          // exportLoading={exportLoading}
        /> }
        <div className="reserve-panel-header__line-other">
          <div className="reserve-panel-header__left-right">
            <div className="reserve-panel-header__tab">
              <Button.Group>
                {
                  TypeTabs.map(({ text, value }, i) => {
                    return (
                      <Button
                        className="tab-button__type"
                        key={i}
                        onClick={() => onSearch('scheduleType', value)}
                        type={value === scheduleType ? 'primary' : 'default'}
                      >
                        {text}
                      </Button>
                    );
                  })
                }
              </Button.Group>

              <Pop
                trigger="hover"
                position="top-center"
                content={<p>看板时间间隔</p>}
              >
                <span>
                  <Button.Group>
                    {
                      IntervalTabs.map(({ text, value }, i) => {
                        return (
                          <Button
                            className="tab-button__interval"
                            key={i}
                            onClick={() => onChange('interval', value)}
                            type={value === interval ? 'primary' : 'default'}
                          >
                            {text}
                          </Button>
                        );
                      })
                    }
                  </Button.Group>
                </span>
              </Pop>
            </div>
            <div className="reserve-panel-header__center">
              {APPOINTMENT_SCHEDULE_TYPE.DAY === scheduleType ? (
                <DateQuickPicker value={dateValue} onChange={onSearch} />
              ) : (
                <SelectWeek project="educlass" date={weekStart} onChange={value => onSearch('weekStart', value)} />
              )}
            </div>
            <PanelFooter reserveStatus={reserveStatus} filterStatus={filterStatus} />
            {/* <div className="reserve-panel-header__count">
              共 {appointmentNum || 0} 个预约
              <Pop
                trigger="hover"
                position="bottom-right"
                centerArrow
                content={
                  <p>
                    仅显示已确认预约时间的日程
                  </p>
                }
              >
                <Icon className="reserve-panel-header__icon-help" type="help-circle-o" />
              </Pop>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}
