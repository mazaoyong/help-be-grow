
import { Form } from '@zent/compat';
import React, { useCallback, useMemo } from 'react';
import { Dialog, Button } from 'zent';

import { openShopRechargeDialog } from 'components/refund-dialog';

import { refund, getStaff } from '../../../../../../recruit/refund/api';

import './styles.scss';

const { openDialog, closeDialog } = Dialog;
const { createForm, FormCheckboxField, FormInputField } = Form;

const dialogId = 'refund';

function closeConfirmDialog() {
  closeDialog(dialogId);
}

function RefundDialog({ handleSubmit, course, courseType, userAsset, orderNo, studentId, targetKdtId, ...restProps }) {
  const staffRes = useMemo(() => getStaff({ adminId: window._global.userId }), []);
  const onSubmit = useCallback(({
    remark,
    removeStudent,
  }) => {
    staffRes.then(data => {
      refund({
        refundCommand: {
          refundItemList: [
            {
              courseSellType: course && course.courseSellType,
              courseType,
              assetNo: userAsset.assetNo,
              orderNo,
              studentId,
              removeStudent: Boolean(removeStudent),
            },
          ],
          operatorId: window._global.userId,
          operatorName: data.name,
          remark,
          targetKdtId,
        },
      }).then((res) => {
        const { refundNo } = res.data || {};
        window.location.href = '/v4/vis/edu/page/refund-record#/print/' + refundNo + '?kdtId=' + data.kdtId;
      }).catch(err => {
        // 先关闭之前的弹窗
        closeConfirmDialog();
        openShopRechargeDialog(err);
      });
    });
  }, [course, courseType, orderNo, staffRes, studentId, targetKdtId, userAsset]);

  return (
    <Form className="edu-student-refund" horizontal onSubmit={handleSubmit(onSubmit)}>
      <FormCheckboxField
        name="removeStudent"
        label="移除学员："
        helpDesc="学员的课程将失效，无法继续查看课程安排、预约课程等"
      >
        将学员从课程中移除
      </FormCheckboxField>
      <FormInputField
        name="remark"
        label="备注："
        type="textarea"
        width="275px"
        maxLength={200}
        showCount
      />
      <div className="edu-student-refund-footer">
        <Button onClick={closeConfirmDialog}>取消</Button>
        <Button type="primary" htmlType="submit">确定</Button>
      </div>
    </Form>
  );
}

export default function openRefundDialog(props) {
  const FormRefundDialog = createForm({})(React.forwardRef(RefundDialog));
  openDialog({
    dialogId,
    title: '退课信息',
    children: <FormRefundDialog {...props} />,
    ...props,
  });
};
