/*****************
 * 这里写一些page简介及必要信息
 */
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import BlockHeader from './blocks/header';
import BlockDetailTab from './blocks/detail-tab';

import { IRouteParams, IRouteQuery, IBlockShowStatus } from './types';

import './style.scss';

const AssetsDetail: React.FC<RouteComponentProps<IRouteParams, IRouteParams>> = (props) => {
  const { params, location } = props;

  const query = location.query as unknown as IRouteQuery;

  const [blockShowStatus, setBlockShowStatus] = React.useState<IBlockShowStatus>({
    hasAssetValue: false,
    hasAssetValidity: false,
    hasAssetClass: false,
  });

  return (
    <div className="student-course-assets-change">
      <BlockHeader
        studentId={params.studentId}
        assetNo={query.assetNo}
        kdtId={query.kdtId}
        handleBlockShowStatus={setBlockShowStatus}
      />

      <BlockDetailTab
        studentId={params.studentId}
        assetNo={query.assetNo}
        kdtId={query.kdtId}
        blockShowStatus={blockShowStatus}
      />
    </div>
  );
};

export default AssetsDetail;
