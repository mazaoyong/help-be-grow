// 删除课程弹窗
import React, { FC, useState, useCallback } from 'react';
import { Dialog, Button, Radio, Sweetalert, Notify, IRadioProps } from 'zent';
import { IViewCellData } from '../../types';
import { StateType, DispatchType } from '../../store';
import { deleteLessonAPI } from '../../../../api';
import { getScheduleData } from '../../format';
import './style.scss';

const DeleteLessonDialogID = 'DeleteLessonDialogID';

const { openDialog, closeDialog } = Dialog;
const RadioGroup = Radio.Group;

export interface IDeleteConfirmProps {
  data: IViewCellData;
  store: StateType;
  dispatch: DispatchType;
}

const DeleteLessonDialog: FC<IDeleteConfirmProps> = ({ data, store, dispatch }) => {
  const [operateType, setOperateType] = useState<2 | 3>(2);

  const onRadioChange: IRadioProps<number>['onChange'] = useCallback((evt) => {
    setOperateType(parseInt(evt.target.value) as 2 | 3);
  }, []);

  return (
    <section className="schedule__lesson__dialog">
      <p className="schedule__lesson__dialog__title">当前选中日程：“{data.lessonName || data.eduCourseName}”</p>
      <RadioGroup onChange={onRadioChange} value={operateType}>
        <Radio value={2}>删除此日程</Radio>
        <Radio value={3}>删除此日程和后续日程</Radio>
      </RadioGroup>
      <footer className="schedule__lesson__dialog__actions">
        <Button
          type="primary"
          outline
          onClick={() => deleteConfirmAgain({ data, store, dispatch, operateType })}
        >
          确定
        </Button>
        <Button
          type="primary"
          onClick={() => closeDialog(DeleteLessonDialogID, { triggerOnClose: false })}
        >
          我再想想
        </Button>
      </footer>
    </section>
  );
};

const deleteConfirmAgain = ({
  data,
  store,
  dispatch,
  operateType,
}: IDeleteConfirmProps & { operateType: 2 | 3 }) => {
  Sweetalert.confirm({
    type: 'info',
    title: '删除日程',
    content: <p>确定删除“{data.lessonName || data.eduCourseName}”？</p>,
    cancelText: '我再想想',
    confirmText: '确定',
    confirmType: 'default',
    onConfirm: () => {
      closeDialog(DeleteLessonDialogID, { triggerOnClose: false });
      dispatch({ type: 'loading' });

      return deleteLessonAPI({
        lessonNo: data.lessonNo,
        operateType,
        scheduleId: data.scheduleId,
        kdtId: data.kdtId,
      })
        .then(() => {
          getScheduleData({}, store, dispatch, store.activeId);
          Notify.success('删除成功！');
        })
        .catch(msg => {
          Notify.error(msg);
        })
        .finally(() => {
          closeDialog(DeleteLessonDialogID, { triggerOnClose: false });
          dispatch({ type: 'loading', value: false });
        });
    },
  });
};

// dialog 内获取不到 context，只能传进来
export const openDeleteLessonDialog = (
  data: IViewCellData,
  store: StateType,
  dispatch: DispatchType,
) => {
  if (data.repeatType !== 1) {
    openDialog({
      dialogId: DeleteLessonDialogID,
      title: '删除日程',
      children: <DeleteLessonDialog data={data} store={store} dispatch={dispatch} />,
      style: {
        width: '450px',
      },
    });
  } else {
    deleteConfirmAgain({ data, store, dispatch, operateType: 2 });
  }
};

export default DeleteLessonDialog;
