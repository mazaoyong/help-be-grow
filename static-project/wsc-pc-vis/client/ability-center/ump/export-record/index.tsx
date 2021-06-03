import React from 'react';
import CommonLink, { IBaseCommonLinkProps } from 'components/common-link';

import { getExportRecordUrl } from '../../../pages/ump/record/utils';
import { EXPORT_RECORD_TYPES } from '../../../pages/ump/record/constants';

interface IExportRecordLinkProps extends IBaseCommonLinkProps {
  exportType: EXPORT_RECORD_TYPES;
}

// 封装的前往导出列表的组件
const ExportRecordLink: React.FC<IExportRecordLinkProps> = props => {
  const { exportType, ...passiveProps } = props;
  return (
    <CommonLink url={getExportRecordUrl({ type: exportType })} {...passiveProps}>
      {props.children}
    </CommonLink>
  );
};

export default ExportRecordLink;

export {
  EXPORT_RECORD_TYPES,
  getExportRecordUrl,
};
