import React from 'react';
import s from './empty.m.scss';
import { BlankLink } from '@youzan/react-components';

export const Empty: React.FC<{}> = () => {
  return (
    <div className={s.emptyWrap}>
      <img
        className={s.emptyImg}
        alt="导出列表为空"
        src="//b.yzcdn.cn/v4/trade/export-list/empty.png"
      />
      <p className={s.emptyDesc}>暂无报表数据</p>
      <p className={s.emptyTips}>
        了解更多报表使用帮助可至论坛查看
        <BlankLink href={`${_global.url.bbs}/forum.php?mod=viewthread&tid=667697`}>
          {' '}
          报表使用说明
        </BlankLink>
      </p>
    </div>
  );
};
