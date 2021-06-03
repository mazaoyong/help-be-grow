import React, { Component } from 'react';
import { Dialog } from '@youzan/ebiz-components';
import DateRangePickerCell from './Cell';
import { IData, IDateRangePickerState } from './type';
import { createDateRange, findDateRange, updateDateRange, deleteDateRange } from './api';
import './style.scss';
import { Notify, BlockLoading, Button, Sweetalert, Dialog as ZentDialog } from 'zent';
import { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog';

const { openDialog: ZentOpenDialog, closeDialog: ZentCloseDialog } = ZentDialog;
const { openDialog, DialogFooter } = Dialog;

export default class DateRangePicker extends Component<
IDialogChildrenProps<null, { configType: number }>,
IDateRangePickerState
> {
  readonly state: IDateRangePickerState = {
    loading: true,
    editing: '',
    creating: false,
    list: []
  };

  startTime: string = '';
  endTime: string = '';
  timeInitData: IData = {
    startTime: '09:00',
    endTime: '09:00',
    configType: 1
  };

  componentDidMount() {
    this.findDateRange();
  }

  // 设置编辑
  setEdit = (data?: IData) => {
    ZentOpenDialog({
      dialogId: 'update-timespan',
      title: '编辑时间段',
      children: <DateRangePickerCell
        className='timepicker-wide'
        getTime={this.getTime}
        isEdit={true}
        setEdit={this.setEdit}
        hasSave={false}
        data={data}
      />,
      footer: <>
        <Button
          onClick={() => {
            if (!this.startTime || !this.endTime) {
              Notify.error('选择数据有误，请重新选择');
            } else if (this.startTime >= this.endTime) {
              Notify.error('结束时间需大于起始时间');
            } else {
              this.setState({ loading: true });
              updateDateRange(Object.assign(data, {
                configType: this.props.data.configType,
                startTime: this.startTime,
                endTime: this.endTime
              }))
                .then(() => {
                  Notify.success('时间段已保存');
                  this.findDateRange();
                })
                .catch(msg => {
                  Notify.error(msg || '网络错误');
                })
                .finally(() => {
                  this.setState({ loading: false });
                  ZentCloseDialog('update-timespan');
                });
            }
          }}
          type="primary"
        >
          保存
        </Button>
        <Button onClick={() => ZentCloseDialog('update-timespan')}>关闭</Button>
      </>
    });
  };

  // 查询时间段列表
  findDateRange = () => {
    this.setState({ loading: true });
    const { configType } = this.props.data;
    findDateRange(configType)
      .then((data: IData[]) => {
        this.setState({
          list: data
        });
      })
      .catch(msg => {
        Notify.error(msg || '网络错误');
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  getTime = (data?: IData) => {
    this.startTime = data ? data.startTime : '';
    this.endTime = data ? data.endTime : '';
  }

  // 创建时间段
  create = () => {
    ZentOpenDialog({
      dialogId: 'create-timespan',
      title: '添加时间段',
      children: <DateRangePickerCell
        className='timepicker-wide'
        getTime={this.getTime}
        isEdit={true}
        setEdit={this.setEdit}
        hasSave={false}
        data={this.timeInitData}
      />,
      footer: <>
        <Button onClick={() => ZentCloseDialog('create-timespan')}>取消</Button>
        <Button
          onClick={() => {
            if (!this.startTime || !this.endTime) {
              Notify.error('选择数据有误，请重新选择');
            } else if (this.startTime >= this.endTime) {
              Notify.error('结束时间需大于起始时间');
            } else {
              const data = { startTime: this.startTime, endTime: this.endTime };
              this.setState({ loading: true });
              createDateRange(Object.assign(data, { configType: this.props.data.configType }))
                .then(() => {
                  Notify.success('时间段已保存');
                  this.findDateRange();
                })
                .catch(msg => {
                  Notify.error(msg || '网络错误');
                })
                .finally(() => {
                  this.setState({ loading: false });
                  ZentCloseDialog('create-timespan');
                });
            }
          }}
          type="primary"
        >
          确定
        </Button>
      </>
    });
  };

  delete = (data: IData) => {
    Sweetalert.confirm({
      type: 'info',
      title: '删除时间段',
      content: (
        <span>
          确定删除 “{data.startTime}-{data.endTime}”
        </span>
      ),
      cancelText: '确定',
      confirmText: '我再想想',
      onCancel: () => {
        this.setState({ loading: true });
        return deleteDateRange(data.id!)
          .then(() => {
            Notify.success('时间段已删除');
            this.findDateRange();
          })
          .catch(msg => {
            Notify.error(msg || '网络错误');
            this.setState({ loading: false });
          });
      }
    });
  };

  render() {
    const { list, loading } = this.state;

    return (
      <BlockLoading loading={loading}>
        <Button type="primary" onClick={() => { this.create(); }}>
          添加时间段
        </Button>
        <div className="date-range-picker__header">
          <span>时间段</span>
          <span>操作</span>
        </div>
        <ul className="date-range-picker__body">
          {list.map(v => {
            return (
              <DateRangePickerCell
                key={(v.id + v.startTime + v.endTime).toString()}
                data={v}
                isEdit={false}
                setEdit={this.setEdit}
                onDelete={this.delete}
              />
            );
          })}
        </ul>
        <DialogFooter>
          <Button type="default" onClick={() => this.props.dialogref.close()}>
            完成
          </Button>
        </DialogFooter>
      </BlockLoading>
    );
  }
}

export function openDateRangePickerDialog(configType: number = 1, dialogId?: string) {
  const dialogRef = openDialog(DateRangePicker, {
    dialogId,
    title: '设置时间段',
    data: { configType },
    maskClosable: false,
    className: 'time-range-picker-dialog'
  });

  return dialogRef.afterClosed();
}
