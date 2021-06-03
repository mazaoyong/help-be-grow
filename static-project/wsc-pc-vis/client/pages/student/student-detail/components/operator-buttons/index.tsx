import { Pop } from '@zent/compat';
import React, { FC, useMemo, useCallback } from 'react';
import { Button, Notify } from 'zent';
import { isInStoreCondition } from 'fns/chain';
import VersionWrapper from 'fns/version';

import { openModifyStudent, ApplicableSceneEnums } from '@ability-center/student';
import { navigateToEnrollment, EnrollmentSource } from '@ability-center/assets';
import AppointmentDialog from '@ability-center/appointment/make-appointment';
import { openTransferClueDialog, IChangeSourceProps, ChangeSource } from '@ability-center/clue';

import { openCommentDialog } from '../comment';
import { deleteStudentById, saveAttribute } from '../../../api/student-detail';
import { IOperatorButtonsProps } from './types';
import { ActionEnums } from '../../types';

const { open: openAppointmentDialog } = AppointmentDialog;

const GIANT_EDU_KDT_ID_LIST = [
  19069163,
  45518309,
  45426560,
  44062047,
  44061870,
  44060137,
  44059646,
  44059137,
  // YZ教育测试店铺
  42095703,
  // YZ测试-教育连锁店铺-预发版本
  43196110,
  // yz测试店铺教育版,
  51055158,
  // kz测试教育连锁总部
  52306502,
];
const IS_GIANT_EDU = (): boolean => {
  const currentKdtId = _global.kdtId;
  return GIANT_EDU_KDT_ID_LIST.includes(currentKdtId);
};

const OperatorButtons: FC<IOperatorButtonsProps> = (props) => {
  const {
    className,
    style,
    clueId,
    studentId,
    studentNo,
    studentName,
    customerId,
    campusKdtId,
    campusName,
    sourceInfo,
    onActionCallback,
  } = props;

  const enrollmentURL = useMemo(
    () => navigateToEnrollment({ studentId, source: EnrollmentSource.offline }),
    [studentId],
  );

  const isSystemSource = useMemo<boolean>(
    () => !!sourceInfo && Number(sourceInfo.sourceType) !== 2,
    [sourceInfo],
  );

  const handleOpenModifyStudent = useCallback(() => {
    openModifyStudent({
      dialogId: 'modifyStudent',
      className: 'modify-student-dialog',
      data: {
        applicableScene: ApplicableSceneEnums.ALL_SCENES,
        studentNo,
      },
    })
      .afterClosed()
      .then((values) => {
        return saveAttribute({
          studentId,
          attributeItems: values as any,
          identityNo: studentNo as string,
        }).catch((err) => {
          Notify.error(err);
          return undefined;
        });
      })
      .then((data) => {
        if (data) {
          Notify.success('编辑成功');
          onActionCallback(ActionEnums.MODIFY);
        }
      })
      .catch(() => {
        // do nothing
      });
  }, [onActionCallback, studentId, studentNo]);

  const handleDeleteStudent = useCallback(() => {
    deleteStudentById({
      studentId,
      customerId,
      targetKdtId: campusKdtId || _global.kdtId,
    })
      .then(() => {
        Notify.success('删除成功');
        onActionCallback(ActionEnums.DELETE);
      })
      .catch(Notify.error);
  }, [campusKdtId, customerId, onActionCallback, studentId]);

  // 打开点评弹窗
  const handleOpenCommentDialog = useCallback(() => {
    openCommentDialog(
      {
        type: 0,
        queryData: {
          kdtId: campusKdtId || _global.kdtId,
          shopName: campusName || '',
          userId: studentId,
          // 有歧义，username结果用studentName
          userName: studentName,
        },
      },
      () => onActionCallback(ActionEnums.COMMENT),
    );
  }, [campusKdtId, campusName, onActionCallback, studentId, studentName]);

  // 修改线索来源
  const handleChangeSource = useCallback(() => {
    ChangeSource.open('修改来源', {
      clueId,
      identityNo: studentNo,
      close() {
        onActionCallback(ActionEnums.MODIFY_SOURCE);
      },
    } as IChangeSourceProps);
  }, [clueId, onActionCallback, studentNo]);

  // 转让线索
  const handleTransformClue = useCallback(() => {
    openTransferClueDialog(clueId as number, false, false, '转让学员')
      .afterClosed()
      .then(() => onActionCallback(ActionEnums.TRANSFORM))
      .catch(console.error);
  }, [clueId, onActionCallback]);

  return (
    <div className={className} style={style}>
      <Button type="primary" onClick={() => openAppointmentDialog({
        defaultData: {
          studentId,
          studentName,
          fromStudent: true,
        },
      })}>
        预约上课
      </Button>
      <VersionWrapper name="student-detail-operators">
        {isInStoreCondition({ supportEduBranchStore: true, supportEduSingleStore: true }) && (
          <Button href={enrollmentURL}>办理报名</Button>
        )}
        <Button onClick={handleOpenCommentDialog}>写点评</Button>
      </VersionWrapper>
      <Button onClick={handleOpenModifyStudent}>编辑</Button>
      {clueId ? (
        <>
          {(IS_GIANT_EDU() || isInStoreCondition({ supportEduSingleStore: true })) && (
            <Button onClick={handleTransformClue}>转让</Button>
          )}
          {!isSystemSource && <Button onClick={handleChangeSource}>修改来源</Button>}
        </>
      ) : null}
      <Pop
        trigger="click"
        content={<div style={{ display: 'inline-block', lineHeight: '24px' }}>确认删除学员？</div>}
        onConfirm={handleDeleteStudent}
        position="bottom-right"
      >
        <Button style={{ marginLeft: '.5rem' }}>删除</Button>
      </Pop>
    </div>
  );
};

export default OperatorButtons;
export { ActionEnums };
