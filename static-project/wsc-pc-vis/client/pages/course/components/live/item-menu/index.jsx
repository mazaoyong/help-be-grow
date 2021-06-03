import { Pop, Popover } from '@zent/compat';
import React, { useState, useEffect, useCallback } from 'react';
import { Notify } from 'zent';
import { get } from 'lodash';
import showTeacherQrcode from '../teacher-dialog';
import PolyvDeleteDialog from '../polyv-delete-dialog';
import showPolyvShareDialog from '../polyv-share-dialog';
import Promotion from 'components/promotion';
import { LockWrap } from '@youzan/ebiz-components';
import { isInStoreCondition } from 'fns/chain';
import { checkVideoAuth } from '../utils/check-video-auth';
import { openVideoShareDialog } from '../dialog/video-share-dialog';
import { openVideoPlaybackDialog, PlaybackStatus } from '../dialog/video-playback-dialog';
import { openVideoDeleteDialog } from '../dialog/video-delete-dialog';
import { openVideoFinishDialog } from '../dialog/video-finish-dialog';
import { deleteLive, getLiveEnterInfo, getPolyvBackLink } from './api';
import { LIVE_STATUS, LIVE_TYPE } from '../../../common/constants';
import './style.scss';

const centerArrow = true;
const isEduChain = isInStoreCondition({ supportEduChainStore: true });
// 店铺是否打烊
const isClose = get(window._global, 'lifecycle.lifecycleStatus') === 'close';

export const SHOW_IN_STORE = {
  all: '全部',
  0: '隐藏',
  1: '显示',
};

export default function ItemMenu(props) {
  const {
    item,
    self,
    url,
    isColumn,
    alias,
    qrcode,
    hideBdapp,
  } = props;
  const isPolyv = item.live_type === LIVE_TYPE.POLYV;
  const isVideo = item.live_type === LIVE_TYPE.VIDEO;
  const [popoverOpen, toggleSetStatus] = useState(false);
  const [freeEle, setFreeEle] = useState(null);
  const isLock = item.is_lock;
  const info = {
    live_id: item.id,
    alias: item.alias,
    kdt_id: window._global.kdtId,
  };

  const [showPolyvDeleteDialog, setShowPolyvDeleteDialog] = useState(false);
  const hidePolyvDeleteDialog = useCallback(() => {
    setShowPolyvDeleteDialog(false);
  }, []);
  const deletePolyvLive = useCallback(deleteChannel => {
    self.VisTable.refetchData.loading();
    deleteLive({ alias, deleteChannel })
      .then(data => {
        if (data) {
          Notify.success('删除成功');
          setShowPolyvDeleteDialog(false);
          self.VisTable.refetchData.refresh();
        }
      })
      .catch(msg => {
        setShowPolyvDeleteDialog(false);
        Notify.error(msg || '网络错误');
      })
      .finally(() => {
        self.VisTable.refetchData.cancelLoading();
      });
  }, [alias, self.VisTable.refetchData]);
  const onPolyvDelete = useCallback(() => {
    setShowPolyvDeleteDialog(true);
  }, []);
  const goPolyManage = useCallback(() => {
    self.VisTable.refetchData.loading();
    getPolyvBackLink({ alias })
      .then(data => {
        if (data) {
          window.open(data, '_blank');
        } else {
          Notify.error('获取链接失败');
        }
      })
      .catch(msg => {
        Notify.error(msg || '网络错误');
      })
      .finally(() => {
        self.VisTable.refetchData.cancelLoading();
      });
  }, [alias, self.VisTable.refetchData]);
  const onPolyvShare = useCallback(() => {
    self.VisTable.refetchData.loading();
    getLiveEnterInfo({ alias })
      .then(data => {
        if (data) {
          showPolyvShareDialog(data.url, data.channelId, data.channelPassword);
        }
      })
      .catch(msg => {
        Notify.error(msg || '网络错误');
      })
      .finally(() => {
        self.VisTable.refetchData.cancelLoading();
      });
  }, [alias, self.VisTable.refetchData]);

  const onVideoShare = useCallback(() => {
    checkVideoAuth().then((auth) => {
      if (auth) {
        openVideoShareDialog({ alias });
      }
    });
  }, [alias]);

  const onSuccess = useCallback(() => {
    self.VisTable.refetchData.refresh();
  }, [self.VisTable.refetchData]);

  const onVideoDelete = useCallback(() => {
    openVideoDeleteDialog({ alias, onSuccess });
  }, [alias, onSuccess]);

  const onfinishVideoLive = useCallback(() => {
    openVideoFinishDialog({ alias, onSuccess });
  }, [alias, onSuccess]);

  const liveStatus = item.live_status;
  const onPlayback = useCallback(() => {
    openVideoPlaybackDialog({
      alias,
      status: liveStatus === LIVE_STATUS.END ? PlaybackStatus.open : PlaybackStatus.close,
      onSuccess,
    });
    onSuccess();
  }, [alias, liveStatus, onSuccess]);

  useEffect(() => {
    if (isColumn) {
      if (item.is_free === 1) {
        // 免费试读
        setFreeEle(
          <LockWrap
            lockType="PCT_GOODS"
            isLock={isLock}
            className="ui-link--split"
            onClick={() => self.freeLive(item.alias, item.is_free)}
          >
            <span className="ui-link--split">取消试看</span>
          </LockWrap>
        );
      } else {
        setFreeEle(
          <LockWrap
            lockType="PCT_GOODS"
            isLock={isLock}
            className="ui-link--split"
            onBeforeShow={() => Promise.resolve()}
            onConfirm={() => self.freeLive(item.alias, item.is_free)}
            triggerName="onBeforeShow"
          >
            <Pop
              content="免费后用户无须购买即可看到全部内容，确定免费吗？"
              trigger="click"
              centerArrow={centerArrow}
              position="left-center"
              className="popover--inline"
            >
              <div>
                <span className="ui-link--split">免费试看</span>
                <span />
              </div>
            </Pop>
          </LockWrap>
        );
      }
    }
  }, [isColumn, isLock, item.alias, item.is_free, self]);

  // 关闭开启Popover
  const triggerClosePopover = cb => {
    toggleSetStatus(!popoverOpen);
    if (cb && typeof cb === 'function') {
      cb();
    }
  };

  return (
    <div>
      {freeEle}
      {isVideo &&
        [LIVE_STATUS.UNSTART, LIVE_STATUS.LIVING].includes(item.live_status) &&
        (isClose ? (
          <span className="item-menu-item--disabled ui-link--split">前往直播</span>
        ) : (
          <LockWrap
            lockType="PCT_GOODS"
            isLock={isLock}
            className="ui-link--split"
            onClick={onVideoShare}
          >
            前往直播
          </LockWrap>
        ))}
      {isPolyv && (
        <LockWrap
          lockType="PCT_GOODS"
          isLock={isLock}
          className="ui-link--split"
          onClick={onPolyvShare}
        >
          前往直播
        </LockWrap>
      )}
      {!isVideo && !isPolyv && (
        <LockWrap
          lockType="PCT_GOODS"
          isLock={isLock}
          className="ui-link--split"
          onClick={() => showTeacherQrcode(info)}
        >
          讲师设置
        </LockWrap>
      )}
      {isVideo && [LIVE_STATUS.END, LIVE_STATUS.PLAYBACK].includes(item.live_status) && (
        <LockWrap
          lockType="PCT_GOODS"
          isLock={isLock}
          className="ui-link--split"
          onClick={onPlayback}
        >
          {item.live_status === 3 ? '开启回放' : '关闭回放'}
        </LockWrap>
      )}
      <Promotion
        data={{
          qrcode,
          url,
          alias,
          name: item.title,
          pagepath: `packages/edu/webview/index?targetUrl=${encodeURIComponent(
            `https://h5.youzan.com/wscvis/course/detail/${alias}?kdt_id=${_global.kdtId}`,
          )}`,
          webviewPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
            `https://h5.youzan.com/wscvis/course/detail/${alias}?kdt_id=${_global.kdtId}`,
          )}`,
          hideBdapp: hideBdapp || isPolyv || isVideo,
        }}
        hideWeapp={isPolyv || isVideo}
      >
        <LockWrap lockType="PCT_GOODS" isLock={isLock} className="ui-link--split">
          推广
        </LockWrap>
      </Promotion>
      <Popover
        position={Popover.Position.AutoBottomCenter}
        display="inline"
        cushion={5}
        visible={popoverOpen}
        onVisibleChange={(visible) => toggleSetStatus(visible)}
      >
        <Popover.Trigger.Click>
          <span onClick={triggerClosePopover} className="ui-link--split">
            更多
          </span>
        </Popover.Trigger.Click>
        <Popover.Content>
          <ul className="dropdown-menus">
            <li>
              <span
                onClick={() => {
                  // 保利威直播和图文直播显示不同弹窗
                  if (isVideo) {
                    onVideoDelete();
                  } else if (isPolyv) {
                    triggerClosePopover(onPolyvDelete);
                  } else {
                    triggerClosePopover(self.deleteLive.bind(null, item.alias));
                  }
                }}
              >
                删除
              </span>
            </li>
            <li>
              <span onClick={() => triggerClosePopover(self.linkToEdit.bind(null, item))}>
                编辑
              </span>
            </li>
            {!isPolyv && !isVideo && isEduChain && (
              <li>
                <span onClick={() => triggerClosePopover(self.hide.bind(null, item.alias))}>
                  {SHOW_IN_STORE[1 - item.show_in_store]}
                </span>
              </li>
            )}
            {!isPolyv && !isVideo && item.live_status !== LIVE_STATUS.END && (
              <li>
                <span onClick={() => triggerClosePopover(self.finish.bind(null, item.alias))}>
                  结束直播
                </span>
              </li>
            )}
            {isVideo && [LIVE_STATUS.UNSTART, LIVE_STATUS.LIVING].includes(item.live_status) && (
              <li>
                <span onClick={onfinishVideoLive}>结束直播</span>
              </li>
            )}
            <li>
              {isPolyv ? (
                <span onClick={goPolyManage}>管理直播频道</span>
              ) : !isVideo ? (
                <LockWrap
                  lockType="PCT_GOODS"
                  isLock={isLock}
                  onClick={() => triggerClosePopover(self.hideLive.bind(null, item.alias))}
                >
                  信息设置
                </LockWrap>
              ) : null}
            </li>
          </ul>
        </Popover.Content>
      </Popover>
      <PolyvDeleteDialog
        visible={showPolyvDeleteDialog}
        onClose={hidePolyvDeleteDialog}
        onDelete={deletePolyvLive}
      />
    </div>
  );
}
