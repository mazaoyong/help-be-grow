import React, { useMemo } from 'react';
import { Alert } from 'zent';
import Big from 'big.js';

export default function Warning({ courses }) {
  const warningStr = useMemo(() => {
    if (courses.length === 0) {
      return '';
    }

    const courseType = courses[0].courseType || 0;

    const courseSellType = (courses[0].userAsset && courses[0].userAsset.courseSellType) || 0;

    const hasPaymentRecord = courses.reduce(
      (paymentListLength, course) => paymentListLength + course.phasePaymentList.length, 0
    ) !== 0;
    const hasPayment = courses.reduce(
      (total, course) => (course.refundItemDTO && course.refundItemDTO.realPay) || 0 + total,
      0,
    ) > 0;

    const isNotEffective = Boolean(courses.find(course => course.assetStatus === 0 || course.assetStatus === 1));

    const ctype = Big(courseType).times(1000)
      .plus(Big(courseSellType).times(100))
      .plus(Big((hasPaymentRecord || hasPayment) ? 1 : 0).times(10))
      .plus(isNotEffective ? 1 : 0)
      .toFixed();

    // ctype: [0-1]是否正式课[0-5]售卖类型[0-1]实付金额[0-1]尚未生效，收款信息
    // 10 can be padStart and get 0010

    switch (ctype) {
      case '10':
        return '全额退款，系统会自动移除学员；移除后学员未上课的体验课预约将会被取消。';

      case '1000':
        return '退回所有可退天数或全额退款，系统会自动移除学员；移除后学员不能继续约课和查看课程安排。';

      case '1010':
        return '全额退款，系统会自动移除学员；移除后学员不能继续约课和查看课程安排。';

      case '1011':
        return '全额退款，系统会自动移除学员；移除后学员不能继续约课和查看课程安排。';

      case '1100':
        return '退回所有可用课时，系统会自动移除学员；移除后学员不能继续约课和查看课程安排。';

      case '1110':
        return '退回所有可用课时或全额退款，系统会自动移除学员；移除后学员不能继续约课和查看课程安排。';

      case '1200':
        return '退回所有可退天数，系统会自动移除学员；移除后学员不能继续约课和查看课程安排。';

      case '1210':
        return '退回所有可退天数或全额退款，系统会自动移除学员；移除后学员不能继续约课和查看课程安排。';

      case '1211':
        return '全额退款，系统会自动移除学员；移除后学员不能继续约课和查看课程安排。';

      case '1310':
        return '全额退款，系统会自动移除学员；移除后学员将从班级中移除，无法查看班级课表。';

      default:
        return '';
    }
  }, [courses]);

  if (!warningStr) {
    return null;
  }
  return (
    <Alert type="warning" className="edu-refund-warning">
      {warningStr}
    </Alert>
  );
}
