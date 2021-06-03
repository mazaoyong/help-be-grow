import React, { FC, useState, useMemo } from 'react';
import { Steps } from 'zent';
import { withRouter, WithRouterProps } from 'react-router';
import get from 'lodash/get';

import FileUpload from '../../components/file-upload';
import UploadConfirm from '../../components/upload-confirm';
import ImportComplete from '../../components/import-complete';
import { IMPORT_TYPE } from '../../constants';
import './styles.scss';

const BatchImport: FC<WithRouterProps> = props => {
  const { s = 1 } = props.params;

  const [importType, setImportType] = useState<number>(
    Number(get(props.location, 'query.type')) || IMPORT_TYPE.byCourse,
  );

  const branchKdtId = Number(get(props.location, 'query.kdtId', _global.kdtId));

  const onImportTypeChange = (value: number) => {
    setImportType(value);
  };

  const pageMap = useMemo(
    () => ({
      1: (
        <FileUpload
          importType={importType}
          onImportTypeChange={onImportTypeChange}
          branchKdtId={branchKdtId}
        />
      ),
      2: <UploadConfirm importType={importType} />,
      3: <ImportComplete />,
    }),
    [branchKdtId, importType],
  );

  return (
    <div className="student-import">
      <Steps current={Number(s) || 1} type="breadcrumb">
        <Steps.Step title="上传导入文件" />
        <Steps.Step title="确认导入信息" />
        <Steps.Step title="导入成功" />
      </Steps>

      {pageMap[+s]}
    </div>
  );
};

export default withRouter(BatchImport);
