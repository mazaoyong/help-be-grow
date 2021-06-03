
import { Form } from '@zent/compat';
import React from 'react';

import FakeField from '../../components/fake-field';
import RefundInfo from '../../components/refund-info';
import { calcMaxRefundFee } from '../../util';

import './styles.scss';

const { FormCheckboxField, FormInputField } = Form;

export default function OtherInfo({
  userAsset,
  refundFeeTypeList,
  refundItemDTO,
  formList,
  courseType,
  courseSellType,
  showRemoveStudent,
}) {
  if (!userAsset) {
    return null;
  }
  const maxRefundFee = Number(calcMaxRefundFee({ refundItemDTO }, formList[0]));

  return (
    <div className="edu-refund-other-info">
      {maxRefundFee ? (
        <FakeField
          wrapClassName="edu-refund-other-info-way"
          label="退款方式："
          formList={formList}
          refundFeeTypeList={refundFeeTypeList}
          component={RefundInfo}
        />
      ) : null}
      {showRemoveStudent ? (
        <FormCheckboxField
          name="removeStudent"
          label="移除学员："
          helpDesc={courseSellType === 2 ? '学员将从班级中移除，无法查看班级课表' : '学员的课程将失效，无法继续查看课程安排、预约课程等'}
        >
          将学员从课程中移除
        </FormCheckboxField>
      ) : null}
      <FormInputField
        name="remark"
        label="退课备注："
        type="textarea"
        width="275px"
        maxLength={200}
        showCount
      />
    </div>
  );
}
