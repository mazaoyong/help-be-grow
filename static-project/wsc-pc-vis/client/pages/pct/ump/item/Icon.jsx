import { Pop } from '@zent/compat';
import React from 'react';

export default ({ data }) => {
  return (
    <div>
      {data.supportWeapp || data.minApptip ? (
        <Pop trigger="hover" position="top-left" content={data.minApptip || '小程序已支持'}>
          <span className="support-weapp" />
        </Pop>
      ) : null}

      {data.willSupportWeapp ? (
        <Pop trigger="hover" position="top-left" content={'小程序即将支持'}>
          <span className="will-support-weapp" />
        </Pop>
      ) : null}
    </div>
  );
};
