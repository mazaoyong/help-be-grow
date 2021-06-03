import { Pop } from '@zent/compat';
// 看板详情弹窗，日周月通用
import React, { FC, useState } from 'react';
import AutoRightTop from './auto-right-top';
import DetailContent, { IDetailContentProps } from './Content';
import './style.scss';

const DetailPop: FC<IDetailContentProps> =
(props) => {
  const { children, ...restProps } = props;
  const [ showPop, setShowPop ] = useState<boolean>(false);

  return (
    <Pop
      wrapperClassName="panel__schedule__detail"
      className="panel__schedule__detail-pop__wrap"
      position={AutoRightTop}
      visible={showPop}
      onVisibleChange={(visible) => setShowPop(visible)}
      trigger="hover"
      content={<DetailContent {...restProps} />}
    >
      {children}
    </Pop>
  );
};

export default DetailPop;
