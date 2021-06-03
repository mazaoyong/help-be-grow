import { Pop } from '@zent/compat';
/* eslint-disable camelcase */
// 操作按钮
import React, { FC, useCallback, useState, useContext } from 'react';
import { Dialog, Notify, Sweetalert } from 'zent';
import { get } from 'lodash';
import qs from 'qs';
// import { visPush } from 'fns/router';
import ListActionMenu from 'components/list-action-menu';
import { clickTracker } from 'components/logger';
import { CampusContext } from 'components/campus-filter/campus-provider';
import { createCampusMenuConfig } from './campus-menu-config';
import { LockWrap } from '@youzan/ebiz-components';
import { LockType } from '@youzan/ebiz-components/es/lock-wrap';
import { isUnifiedShop, isBranchStore } from '@youzan/utils-shop';
import { openDialog as openDeleteDialog } from '../../pct-delete-dialog';
import SetLiveItem from '../set-live-item';
import showPolyvShareDialog from '../polyv-share-dialog';
import PolyvDeleteDialog from '../polyv-delete-dialog';
import showTeacherQrcode from '../teacher-dialog';
import { openVideoShareDialog } from '../dialog/video-share-dialog';
import { openVideoDeleteDialog } from '../dialog/video-delete-dialog';
import { openVideoPlaybackDialog, PlaybackStatus } from '../dialog/video-playback-dialog';
import { openVideoFinishDialog } from '../dialog/video-finish-dialog';
import { checkPolyvAuth } from '../utils';
import { checkVideoAuth } from '../utils/check-video-auth';
import { LIVE_TYPE, LIVE_STATUS, POLYV_TYPE } from '../../../common/constants';
import {
  deleteLive,
  updateCloseLive,
  updateShowOrHideStatus,
  getPolyvBackLink,
  getLiveEnterInfo,
  updateFreeLive,
} from './api';
import openShortenUrlPromotionDlg from 'components/open-promotion-dialog';

const { openDialog, closeDialog } = Dialog;
const setLiveDialogId = 'set-live-dialog';

interface ILiveItem {
  live_type: number;
  live_detail_url: string;
  live_status: LIVE_STATUS;
  show_in_store: number;
  id: number;
  alias: string;
  title: string;
  is_lock: boolean;
  is_free: number;
  item_create_mode: 1 | 0;
}

interface IProps {
  item: ILiveItem;
  hideBdapp: boolean;
  isColumn?: boolean;
  reload: () => void;
  infoHiddenAvailable?: boolean;
  onContentMove?: (params: any) => void;
  maxDisplayItemNum?: number;
}

export const SHOW_IN_STORE = {
  all: '全部',
  0: '隐藏',
  1: '显示',
};

// 店铺是否打烊
const isClose = get(window._global, 'lifecycle.lifecycleStatus') === 'close';

const livePrefix = `/v4/vis/course/live`;

const ActionMenu: FC<IProps> = (props: IProps) => {
  const { item, hideBdapp, reload, isColumn, onContentMove, maxDisplayItemNum = 4 } = props;
  const { is_lock: isLock, live_status: liveStatus, alias, title, is_free: isFree } = item;
  const isPolyv = item.live_type === LIVE_TYPE.POLYV;
  const isVideo = item.live_type === LIVE_TYPE.VIDEO;
  const [showPolyvDeleteDialog, setShowPolyvDeleteDialog] = useState(false);
  const info = {
    live_id: item.id,
    alias: item.alias,
    kdt_id: window._global.kdtId,
  };
  const { targetKdtId } = useContext(CampusContext);

  // 跳到编辑
  const linkToEdit = useCallback(() => {
    if (isPolyv) {
      checkPolyvAuth()
        .then(() => {
          window.open(`${livePrefix}/edit/${alias}`);
        })
        .catch((failCode) => {
          let nextUrl = `${livePrefix}/edit/${alias}`;
          // 未授权
          if (failCode === 1) {
            nextUrl = `${livePrefix}/polyv?type=${POLYV_TYPE.INIT}`;
          } else if (failCode === 2) {
            // 授权过期
            nextUrl = `${livePrefix}/polyv?type=${POLYV_TYPE.UPDATE}`;
          }
          window.open(nextUrl);
        });
    } else {
      window.open(`${livePrefix}/edit/${alias}`);
    }
  }, [alias, isPolyv]);

  // 关闭直播信息设置弹窗
  const closeSetLiveDialog = () => {
    closeDialog(setLiveDialogId);
  };

  // 打开直播信息设置弹窗
  const setLive = useCallback(() => {
    if (!props.infoHiddenAvailable) {
      window.open(`${_global.url.v4}/subscribe/appmarket/appdesc/board?id=40833`, '__blank');
      return;
    }
    openDialog({
      dialogId: setLiveDialogId,
      title: '直播信息设置',
      children: <SetLiveItem alias={alias} close={closeSetLiveDialog} />,
    });
  }, [alias, props.infoHiddenAvailable]);

  const _deleteLive = useCallback(() => {
    deleteLive({ alias })
      .then((data) => {
        if (data) {
          Notify.success('删除成功');
          reload();
        }
      })
      .catch((msg) => {
        Notify.error(msg);
      });
  }, [alias, reload]);

  // 删除
  const onLiveDelete = useCallback(() => {
    openDeleteDialog({
      type: 'live',
      alias,
      onDelete: _deleteLive,
    });
  }, [alias, _deleteLive]);

  // 结束播放
  const finishLive = useCallback(() => {
    Sweetalert.confirm({
      content: '确定结束直播？ 直播结束后，买家还可以订购/回看。',
      title: '结束直播',
      confirmText: '我再想想',
      cancelText: '结束直播',
      className: 'dialog-450',
      onCancel: () => {
        // 结束直播埋点
        const trackParams = {
          liveName: item.title,
          liveAlias: alias,
        };
        clickTracker({
          eventName: '关闭直播',
          eventSign: 'closeLive',
          pageType: 'liveList',
          otherParams: trackParams,
        });
        updateCloseLive({ alias })
          .then((data) => {
            if (data) {
              Notify.success('直播已结束');
              reload();
            }
          })
          .catch((msg) => {
            Notify.error(msg);
          });
      },
    });
  }, [alias, item.title, reload]);

  const finishVideoLive = useCallback(() => {
    openVideoFinishDialog({ alias, onSuccess: reload });
  }, [alias, reload]);

  // 隐藏直播
  const hideLive = useCallback(() => {
    updateShowOrHideStatus({ alias })
      .then((data) => {
        if (data) {
          Notify.success('操作成功');
          reload();
        }
      })
      .catch((msg) => {
        Notify.error(msg);
      });
  }, [alias, reload]);

  const hidePolyvDeleteDialog = useCallback(() => {
    setShowPolyvDeleteDialog(false);
  }, []);

  const deletePolyvLive = useCallback(
    (deleteChannel) => {
      deleteLive({ alias, deleteChannel })
        .then((data) => {
          if (data) {
            Notify.success('删除成功');
            setShowPolyvDeleteDialog(false);
            reload();
          }
        })
        .catch((msg) => {
          setShowPolyvDeleteDialog(false);
          Notify.error(msg);
        });
    },
    [alias, reload],
  );

  // 删除保利威视频
  const onPolyvDelete = useCallback(() => {
    setShowPolyvDeleteDialog(true);
  }, []);

  const onVideoDelete = useCallback(() => {
    openVideoDeleteDialog({ alias, onSuccess: reload });
  }, [alias, reload]);

  // 删除直播
  const triggerDeleteLive = useCallback(() => {
    if (isVideo) {
      onVideoDelete();
    } else if (isPolyv) {
      onPolyvDelete();
    } else {
      onLiveDelete();
    }
  }, [isPolyv, isVideo, onLiveDelete, onPolyvDelete, onVideoDelete]);

  const goPolyManage = useCallback(() => {
    getPolyvBackLink({ alias })
      .then((data) => {
        if (data) {
          window.open(data, '_blank');
        } else {
          Notify.error('获取链接失败');
        }
      })
      .catch((msg) => {
        Notify.error(msg);
      });
  }, [alias]);

  const onPolyvShare = useCallback(() => {
    getLiveEnterInfo({ alias })
      .then((data) => {
        if (data) {
          showPolyvShareDialog(data.url, data.channelId, data.channelPassword);
        }
      })
      .catch((msg) => {
        Notify.error(msg || '网络错误');
      });
  }, [alias]);

  const onFreeLive = useCallback(() => {
    updateFreeLive({ alias })
      .then(() => {
        reload();
      })
      .catch((msg) => {
        Notify.error(msg || '设置免费失败');
      });
  }, [alias, reload]);

  const onVideoShare = useCallback(() => {
    checkVideoAuth().then((auth) => {
      if (auth) {
        openVideoShareDialog({ alias });
      }
    });
  }, [alias]);

  const onPlayback = useCallback(() => {
    openVideoPlaybackDialog({
      alias,
      status: liveStatus === LIVE_STATUS.END ? PlaybackStatus.open : PlaybackStatus.close,
      onSuccess: reload,
    });
  }, [alias, liveStatus, reload]);

  const isItemCreateMode = item.item_create_mode === 1;

  const campusMenuConfig = createCampusMenuConfig({
    isItemCreateMode,
    targetKdtId,
  });

  const webViewPath = `packages/edu/webview/index?targetUrl=${encodeURIComponent(
    `https://h5.youzan.com/wscvis/course/detail/${item.alias}?kdt_id=${_global.kdtId}`,
  )}`;
  return (
    <>
      <ListActionMenu
        maxDisplayItemNum={maxDisplayItemNum}
        config={[
          {
            title: isFree ? (
              '取消试看'
            ) : isItemCreateMode ? (
              <Pop
                content="免费后用户无须购买即可看到全部内容，确定免费吗？"
                trigger="click"
                onConfirm={onFreeLive}
                centerArrow
                position="left-center"
                className="popover--inline"
              >
                免费试看
              </Pop>
            ) : (
              '免费试看'
            ),
            onClick: isFree ? onFreeLive : undefined,
            showLock: true,
            isLock,
            show: !!isColumn,
            disabled: !isItemCreateMode,
          },
          {
            title: (
              // <Promotion
              //   data={{
              //     url: item.live_detail_url,
              //     alias: item.alias,
              //     name: item.title,
              //     pagepath: `packages/edu/webview/index?targetUrl=${encodeURIComponent(
              //       `https://h5.youzan.com/wscvis/course/detail/${item.alias}?kdt_id=${_global.kdtId}`,
              //     )}`,
              //     // webviewPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
              //     //   `http://h5.youzan.com/v2/ump/paidcontent?alias=${alias}&page=livedetail&sg=live&kdt_id=${
              //     //     window._global.kdtId || 0
              //     //   }`,
              //     // )}`,
              //     hideBdapp: hideBdapp || isPolyv || isVideo,
              //   }}
              //   // 小程序不再支持直播
              //   hideWeapp={true}
              // >
              <LockWrap lockType={LockType.PCT_GOODS} isLock={isLock} onClick={() => openShortenUrlPromotionDlg({
                h5Url: item.live_detail_url,
                mode: 'qrcode',
                title: item.title,
                supportBaiduApp: !(hideBdapp || isPolyv || isVideo),
                supportWeapp: false,
                baiduAppUrl: `/${webViewPath}`,
                baiduAppProps: {
                  path: webViewPath,
                  alias: item.alias,
                }
              })}>
                推广
              </LockWrap>
              // </Promotion>
            ),
          },
          campusMenuConfig({
            title: '移动',
            onClick: onContentMove,
            showLock: true,
            isLock,
            show: Boolean(isColumn && !isBranchStore),
          }),
          campusMenuConfig({
            title: '前往直播',
            onClick: onPolyvShare,
            showLock: true,
            isLock,
            show: isPolyv,
          }),
          campusMenuConfig({
            title: '前往直播',
            onClick: onVideoShare,
            showLock: true,
            isLock,
            disabled: isClose,
            show: isVideo && [LIVE_STATUS.UNSTART, LIVE_STATUS.LIVING].includes(liveStatus),
          }),
          campusMenuConfig({
            title: liveStatus === LIVE_STATUS.END ? '开启回放' : '关闭回放',
            onClick: onPlayback,
            isLock,
            show: isVideo && [LIVE_STATUS.END, LIVE_STATUS.PLAYBACK].includes(liveStatus),
          }),
          campusMenuConfig({
            title: '讲师设置',
            onClick: () => showTeacherQrcode(info),
            showLock: true,
            isLock,
            show: !isPolyv && !isVideo,
          }),
          campusMenuConfig({
            title: '直播间管理',
            onClick() {
              const liveManageURL =
                'https:' +
                _global.url.v4 +
                '/vis/course/live/live-manage' +
                qs.stringify({ alias, title }, { addQueryPrefix: true });
              window.open(liveManageURL, '_blank');
            },
            show: isVideo,
          }),
          campusMenuConfig({
            title: '编辑',
            onClick: linkToEdit,
          }),
          campusMenuConfig({
            title: '删除',
            onClick: triggerDeleteLive,
          }),
          campusMenuConfig({
            title: SHOW_IN_STORE[1 - item.show_in_store],
            onClick: hideLive,
            show: !isColumn && isUnifiedShop,
          }),
          campusMenuConfig({
            title: '结束直播',
            onClick: finishLive,
            show: !isPolyv && !isVideo && item.live_status !== 3,
          }),
          campusMenuConfig({
            title: '结束直播',
            onClick: finishVideoLive,
            show: isVideo && [LIVE_STATUS.UNSTART, LIVE_STATUS.LIVING].includes(liveStatus),
          }),
          campusMenuConfig({
            title: '管理直播频道',
            onClick: goPolyManage,
            show: isPolyv,
          }),
          campusMenuConfig({
            title: '信息设置',
            onClick: setLive,
            show: !isPolyv && !isVideo,
            showLock: true,
            isLock,
          }),
        ]}
      />
      <PolyvDeleteDialog
        visible={showPolyvDeleteDialog}
        onClose={hidePolyvDeleteDialog}
        onDelete={deletePolyvLive}
      />
    </>
  );
};

export default ActionMenu;
