import React from 'react';
import { Alert } from 'zent';
import CommonLink from 'components/common-link';
import { useCheckInfoCollect } from '@ability-center/course';

const CheckBuy: React.FC<{}> = () => {
  const { infoCollectAvailable } = useCheckInfoCollect();

  if (!infoCollectAvailable) {
    return (
      <Alert>
        <span>
          你还未订购 信息采集
          功能，以下信息仅展示为线上课的订阅记录；订购“信息采集”后，还会展示采集到的其他客户信息。
        </span>
        <CommonLink
          target="__blank"
          href={`${_global.url.v4}/subscribe/appmarket/appdesc/board?id=40832`}
        >
          了解信息采集功能
        </CommonLink>
      </Alert>
    );
  }

  return null;
};

export default CheckBuy;
