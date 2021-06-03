import React, { Component } from 'react';
import { Button, Radio, IRadioProps } from 'zent';
import { Dialog } from '@youzan/ebiz-components';
import { IViewCellData } from '../../types';
import { ScheduleNewDialog } from '../../../../../../new-dialogs';
import GotoPage from '../schedule/gotopage';
import { getScheduleData } from '../../format';
import { StateType, DispatchType } from '../../store';
import './style.scss';
import { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog';

const { openDialog } = Dialog;
const RadioGroup = Radio.Group;

const initialState = {
  type: 2,
};

type State = typeof initialState;

class DialogContent extends Component<IDialogChildrenProps<number, IViewCellData>, State> {
  readonly state = initialState;

  onRadioChange: IRadioProps<string>['onChange'] = evt => {
    this.setState({
      type: parseInt(evt.target.value as string),
    });
  };

  render() {
    const { data, dialogref } = this.props;
    const { type } = this.state;

    return (
      <section className="schedule__lesson__dialog">
        <p className="schedule__lesson__dialog__title">当前选中日程：“{data.eduCourseName}”</p>
        <RadioGroup<string> onChange={this.onRadioChange} value={type as any}>
          <Radio value={2}>编辑此日程</Radio>
          <Radio value={3}>编辑此日程和后续日程</Radio>
        </RadioGroup>
        <footer className="schedule__lesson__dialog__actions">
          <Button type="primary" onClick={() => dialogref.submit(type)}>
            确定
          </Button>
          <Button type="primary" outline onClick={() => dialogref.close()}>
            取消
          </Button>
        </footer>
      </section>
    );
  }
}

export default function openEditDialog(
  data: IViewCellData,
  dialogId: string,
  store: StateType,
  dispatch: DispatchType,
) {
  const dialogRef = openDialog<number, IViewCellData>(DialogContent, {
    data,
    title: '编辑日程',
    dialogId,
    className: 'schedule__lesson__edit',
  });
  const { pageInfo, activeId, type: viewType } = store;
  dialogRef
    .afterClosed()
    .then(type => {
      ScheduleNewDialog.open('编辑日程', {
        lessonNo: data.lessonNo,
        kdtId: data.kdtId,
        isTry: data.isTrial,
        operateType: type,
        afterSaveSucceed: (submitData: any, scheduleId: string) => {
          if (viewType === 'view') {
            if (!activeId) {
              GotoPage(submitData, store, dispatch, scheduleId);
            } else {
              getScheduleData({ pageNumber: pageInfo.current }, store, dispatch, activeId);
            }
          }
        },
      });
    })
    .catch(() => {});
}
