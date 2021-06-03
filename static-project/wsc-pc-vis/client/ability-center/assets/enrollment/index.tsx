import React, { FC, useMemo } from 'react';
import CommonLink, { IBaseCommonLinkProps } from 'components/common-link';
import qs from 'qs';

import BlockHeader from 'pages/recruit/enrollment/components/block-header';
import openPaymentSelect from 'pages/recruit/enrollment/containers/payment-select';
import { NumberInputField } from 'pages/recruit/enrollment/components/number-input';

// 订单来源信息
export enum EnrollmentSource {
  // 线上订单
  online = 100_000_000,
  // 线下订单-PC端录入 （PC端目前基本用这个）
  offline = 200_000_000,
  // 订单导入
  offlineImport = 200_000_002,
  // app订单
  offlineApp = 200_000_003,
}

interface INavigateToEnrollmentBaseOption {
  // 订单号
  orderNo?: string;
  // 订单来源
  source?: EnrollmentSource;
}

interface IClueIdEnrollmentOption extends INavigateToEnrollmentBaseOption {
  clueId: number | string;
}

interface IStudentIdEnrollmentOption extends INavigateToEnrollmentBaseOption {
  studentId: number | string;
}

export type INavigateToEnrollmentOption =
  | IClueIdEnrollmentOption
  | IStudentIdEnrollmentOption
  | INavigateToEnrollmentBaseOption;

function navigateToEnrollment(option: INavigateToEnrollmentOption) {
  // 使用qs来格式化query string
  const queryString = qs.stringify(option, { addQueryPrefix: true });
  const prefix = `${window._global.url.v4}/vis/edu/page/enrollment`;
  if (queryString.length > 0) {
    return prefix + queryString;
  }
  return prefix;
}

const EnrollmentLink: FC<INavigateToEnrollmentOption & IBaseCommonLinkProps> = props => {
  const { orderNo, source, ...passiveProps } = props;
  const studentId = (props as IStudentIdEnrollmentOption).studentId;
  const clueId = (props as IClueIdEnrollmentOption).clueId;

  const url = useMemo(
    () =>
      navigateToEnrollment({
        clueId,
        studentId,
        orderNo,
        source,
      }),
    [clueId, orderNo, source, studentId],
  );

  return (
    <CommonLink {...passiveProps} url={url}>
      {props.children}
    </CommonLink>
  );
};

export {
  openPaymentSelect,
  BlockHeader,
  EnrollmentLink,
  navigateToEnrollment,
  NumberInputField
};
