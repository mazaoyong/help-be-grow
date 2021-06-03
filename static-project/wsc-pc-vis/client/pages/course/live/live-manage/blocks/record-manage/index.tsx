import React from 'react';
import { Button, Notify, openDialog } from 'zent';
import { DragList } from '@youzan/ebiz-components';
import { IDragListProps } from '@youzan/ebiz-components/es/types/drag-list';
import { clickTracker } from 'components/logger';

import { getVideoListColumns, DisabledAnchor, IGetColumnsMethods } from './drag-list-config';
import openReplayDialog, { ReplayStatusEnums } from '../../components/replay-dialog';
import PreviewVideo from '../../components/preview-video';
import {
  getLiveVideoList,
  ILiveVideoResponse,
  modifyReplayOrders,
  postReplayState,
  deleteReplayVideo,
  getLiveFlowDetail,
  LiveStatusEnums,
} from '../../../api/live-manage';
import { ILiveManageRecordManage, FoundationAvailable } from '../../types';
import '../../styles.scss';
import './styles.scss';

const RecordManage: React.FC<ILiveManageRecordManage> = (props) => {
  const { alias, name } = props;
  const [replayState, setReplayState] = React.useState(ReplayStatusEnums.DISABLED);
  const [updateVideoList, setUpdateSignal] = React.useState<number | undefined>();
  const [hasReplayVideo, setReplayVideoListState] = React.useState(false);
  const [showReplaySetting, setReplaySettingState] = React.useState(false);
  // 埋点相关state
  const [replayVideoNumber, setReplayVideoNumber] = React.useState(0);
  const [liveScene, setLiveScene] = React.useState(2);
  const [hasPreparedVideo, setPreparedVideoState] = React.useState(true);

  // 初始化的时候获取一次replay状态
  React.useEffect(() => {
    getLiveFlowDetail({ alias })
      .then((data) => {
        if (data) {
          const { openBack, scene, status } = data;
          setReplaySettingState(status >= LiveStatusEnums.REPLAY_READY);
          setReplayState(openBack);
          setLiveScene(scene);
        }
      })
      .catch(Notify.error);
  }, [alias]);

  const fetchVideoList = React.useCallback<IDragListProps['fetchDatasets']>(() => {
    return getLiveVideoList({ alias })
      .then((res) => {
        const hasVideo = Array.isArray(res) && res.length > 0;
        setReplayVideoNumber(res.length || 0);
        // 如果有视频在准备中就禁用拖动
        if (res.length) {
          setPreparedVideoState(!res.some((res) => res.status === FoundationAvailable.DISABLED));
        }
        setReplayVideoListState((prevHasReplayVideo) => {
          if (hasVideo !== prevHasReplayVideo) return hasVideo;
          return prevHasReplayVideo;
        });
        if (hasVideo) return res;
        return [];
      })
      .catch((err) => {
        Notify.error(err);
        return [];
      });
  }, [alias]);

  const baseTrackParams = React.useMemo(
    () => ({
      liveName: name,
      liveAlias: alias,
      liveScene: liveScene,
    }),
    [alias, liveScene, name],
  );
  // 埋点切换回放状态方法
  const uploadTriggerReplayState = React.useCallback(
    (state: ReplayStatusEnums) => {
      const passiveParams = Object.assign({}, baseTrackParams, {
        replayNumber: replayVideoNumber,
        operateSource: 'liveManageList',
      });
      const eventSign =
        state === ReplayStatusEnums.AVAILABLE ? 'openReplayLive' : 'closeReplayLive';
      const eventName =
        state === ReplayStatusEnums.AVAILABLE ? '开启视频直播回放' : '关闭视频直播回放';
      uploadTrackerInfo({
        eventSign,
        eventName,
        otherParams: passiveParams,
      });
    },
    [baseTrackParams, replayVideoNumber],
  );

  const handleOpenReplaySetting = React.useCallback(() => {
    openReplayDialog({
      currentState: replayState,
    })
      .afterClosed()
      .then((state) => {
        return postReplayState({
          alias,
          openBack:
            state === ReplayStatusEnums.AVAILABLE
              ? FoundationAvailable.AVAILABLE
              : FoundationAvailable.DISABLED,
        }).then(({ success }) => {
          if (success) {
            // 如果设置为开启状态，需要添加埋点信息
            uploadTriggerReplayState(state);
            Notify.success('更新设置成功');
            return state;
          }
          return Promise.reject('更新设置失败');
        });
      })
      .then(setReplayState)
      .catch((err) => err && Notify.error(err));
  }, [alias, replayState, uploadTriggerReplayState]);

  const handleUpdateVideoList = React.useCallback(() => setUpdateSignal(new Date().getTime()), []);

  const handlePreviewVideo = React.useCallback<IGetColumnsMethods['preview']>((videoSource) => {
    openDialog({
      dialogId: 'preview-video',
      title: '视频预览',
      children: <PreviewVideo videoSource={videoSource} noWatermark />,
    });
  }, []);

  const handleDeletePlaybackVideo = React.useCallback<IGetColumnsMethods['deleteVideo']>(
    (vid, fileId) => {
      deleteReplayVideo({ alias, vid, fileId })
        .then((success) => {
          if (success) {
            uploadTrackerInfo({
              eventSign: 'deleteReplayVideo',
              eventName: '删除回放视频',
              otherParams: baseTrackParams,
            });
            Notify.success('删除成功');
            setUpdateSignal(new Date().getTime());
          } else {
            return Promise.reject('网络异常，请稍后重试');
          }
        })
        .catch(Notify.error);
    },
    [alias, baseTrackParams],
  );

  const handleOrderChange = React.useCallback(
    (curDatasets: ILiveVideoResponse[], prevDatasets: ILiveVideoResponse[]) => {
      const prevOrder = prevDatasets.map((dataset) => dataset.vid);
      const newOrders = curDatasets.map((dataset) => dataset.vid);
      // 如果前后顺序没有改变，就不请求排序
      if (prevOrder.join('-') === newOrders.join('-')) return;
      modifyReplayOrders({
        alias,
        newOrders,
      })
        .then((success) => {
          if (success) {
            Notify.success('排序成功');
            return 'done';
          } else return Promise.reject();
        })
        .catch(() => Notify.error('网络异常，请稍后重试'))
        .finally(() => {
          // 更新列表
          setUpdateSignal(new Date().getTime());
        });
    },
    [alias],
  );

  const filterCallback = React.useCallback(() => hasPreparedVideo, [hasPreparedVideo]);

  return (
    <div className="live-manage__recordManage">
      <div className="header">
        <div className="partial">
          <h1 className="subtitle">视频列表</h1>
          <Button outline bordered={false} type="primary" onClick={handleUpdateVideoList}>
            刷新
          </Button>
        </div>
        {showReplaySetting && hasReplayVideo && (
          <div className="partial">
            <div className="description">
              回放已{replayState === ReplayStatusEnums.AVAILABLE ? '开启' : '关闭'}
            </div>
            <Button
              outline
              bordered={false}
              type="primary"
              style={{ paddingRight: 0 }}
              onClick={handleOpenReplaySetting}
            >
              回放设置
            </Button>
          </div>
        )}
      </div>
      <DragList
        rowKey="vid"
        noData="暂无数据"
        disabledAnchor={<DisabledAnchor />}
        fetchDatasets={fetchVideoList}
        columns={getVideoListColumns({
          download: () =>
            uploadTrackerInfo({
              eventSign: 'downloadReplayVideo',
              eventName: '下载合并视频',
              otherParams: baseTrackParams,
            }),
          preview: handlePreviewVideo,
          deleteVideo: handleDeletePlaybackVideo,
        })}
        filter={filterCallback}
        // filter={dargRowFilter}
        updateSignal={updateVideoList}
        onOrderChange={handleOrderChange}
      />
    </div>
  );
};

export default RecordManage;

// const dargRowFilter = (row: ILiveVideoResponse) => row.status === FoundationAvailable.AVAILABLE;
interface ITrackPrams {
  eventSign: string;
  eventName: string;
  otherParams?: Record<string, any>;
}
export const uploadTrackerInfo = (params: ITrackPrams) => {
  clickTracker({
    ...params,
    pageType: 'liveManage',
  });
};
