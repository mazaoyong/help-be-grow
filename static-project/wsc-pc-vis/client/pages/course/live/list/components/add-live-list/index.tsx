import React, { useMemo } from 'react';
import { Button } from 'zent';
import fullfillImage from '@youzan/utils/fullfillImage';
import { isSingleStore, isPartnerStore } from '@youzan/utils-shop';
import { isInStoreCondition } from 'fns/chain';
import { LockWrap } from '@youzan/ebiz-components';
import { LockType } from '@youzan/ebiz-components/es/lock-wrap';
import AddCardGrid, { IProps as IAddCardGridProps } from '../../../../components/add-card-grid';
import { checkPolyvAuth } from '../../../../components/live/utils';
import { checkVideoAuth } from '../../../../components/live/utils/check-video-auth';
import { LIVE_TYPE, POLYV_TYPE } from '../../../../common/constants';

import style from './style.m.scss';

interface IProps {
  isLock?: boolean;
}

const isShowPolvy = _global.showPolvy;
const livePrefix = `/v4/vis/course/live`;

// 创建图文语音直播
const handleTextClick = () => {
  window.location.href = `${livePrefix}/add?type=${LIVE_TYPE.IMAGE_TEXT}`;
};

// 创建视频直播
const handleVideoClick = () => {
  checkVideoAuth().then((auth) => {
    if (auth) {
      window.location.href = `${livePrefix}/add?type=${LIVE_TYPE.VIDEO}`;
    }
  });
};

// 创建保利威直播
const handlePolyvClick = () => {
  checkPolyvAuth()
    .then(() => {
      window.location.href = `${livePrefix}/add?type=${LIVE_TYPE.POLYV}`;
    })
    .catch((errorCode) => {
      let nextUrl = `${livePrefix}/add?type=${LIVE_TYPE.POLYV}`;
      // 未授权
      if (errorCode === 1) {
        nextUrl = `${livePrefix}/polyv?type=${POLYV_TYPE.INIT}`;
      } else if (errorCode === 2) {
        // 授权过期
        nextUrl = `${livePrefix}/polyv?type=${POLYV_TYPE.UPDATE}`;
      }
      window.location.href = nextUrl;
    });
};

const getConfig = (props: IProps) => {
  const { isLock = false } = props;
  const config: IAddCardGridProps['list'] = [
    {
      title: '图文语音直播',
      tips: (
        <img
          className={style['preview-img']}
          src={fullfillImage(
            'https://img.yzcdn.cn/upload_files/2020/02/27/FgTSoyHgWnAaXxoeJkwKv26GshuP.jpg',
            'middle',
          )}
        />
      ),
      content: ['可在直播间通过图文语音和学员互动。', '直播方式：移动端H5'],
      footer: (
        <LockWrap lockType={LockType.PCT_SHOP} isLock={isLock} onClick={handleTextClick}>
          <Button type="primary">立即新建</Button>
        </LockWrap>
      ),
    },
    {
      title: '视频直播',
      tips: (
        <img
          className={style['preview-img']}
          src={fullfillImage(
            'https://img.yzcdn.cn/upload_files/2020/02/27/FlywsoU5Yw8frhBWEgOf_ws8c1Ir.png',
            'middle',
          )}
        />
      ),
      content: ['支持普通直播和三分屏直播，匹配授课需求', '直播方式：网页直播/PC客户端'],
      footer: (
        <LockWrap lockType={LockType.PCT_SHOP} isLock={isLock} onClick={handleVideoClick}>
          <Button type="primary">立即新建</Button>
        </LockWrap>
      ),
    },
  ];

  if (isShowPolvy && isSingleStore) {
    config.push({
      title: '第三方直播',
      content: [
        <div key="pplyv">
          <span>保利威视频直播&nbsp;</span>
          <LockWrap lockType={LockType.PCT_SHOP} isLock={isLock} onClick={handlePolyvClick}>
            <a href="javascript:void(0)">立即创建</a>
          </LockWrap>
        </div>,
      ],
      footer: <span className={style['next-text']}>更多直播，敬请期待</span>,
    });
  }

  return config;
};

const showAddList = isInStoreCondition({
  supportBranchStore: true,
  supportRetailSingleShop: true,
  supportSingleStore: true,
}) && !isPartnerStore;

const AddLiveList: React.FC<IProps> = (props) => {
  const { isLock } = props;
  const config = useMemo(
    () =>
      getConfig({
        isLock,
      }),
    [isLock],
  );
  return showAddList ? <AddCardGrid list={config} /> : null;
};

export default AddLiveList;
