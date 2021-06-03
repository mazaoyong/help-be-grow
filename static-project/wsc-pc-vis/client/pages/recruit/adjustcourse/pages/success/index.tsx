import React, { useCallback } from 'react';
import { Icon, Button } from 'zent';

import './index.scss';

const prefixcls = 'adjust-success';

interface IProps {
  params: {
    eduClassId: string;
    eduCourseId: string;
    kdtId: string;
  }
}

const AdjustSuccess: React.FC<IProps> = ({ params }) => {
  const linkToClass = useCallback(() => {
    window.location.href = `${window._global.url.v4}/vis/edu/page/educlass#/detail/${params.eduClassId}/${params.eduCourseId}/${params.kdtId}/student`;
  }, []);
  return (
    <div className={prefixcls}>
      <div className={`${prefixcls}-icon`}>
        <Icon type="check" />
      </div>
      <div className={`${prefixcls}-tip`}>
        批量转课成功
      </div>
      <div className={`${prefixcls}-btn`}>
        <Button type="primary" onClick={linkToClass}>
          返回班级详情
        </Button>
      </div>
      <div className={`${prefixcls}-link`}>
        <a className={`${prefixcls}-link-item border`} href={`${window._global.url.v4}/trade/order/index`}>
          查看订单列表
        </a>
        <a className={`${prefixcls}-link-item`} href={`${window._global.url.v4}/vis/edu/page/student#/list`}>
          查看学员列表
        </a>
      </div>
    </div>
  );
};

export default AdjustSuccess;
