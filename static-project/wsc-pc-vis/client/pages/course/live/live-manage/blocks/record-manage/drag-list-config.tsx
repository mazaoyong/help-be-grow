import { Pop } from '@zent/compat';
import React from 'react';
import { Notify } from 'zent';
import { Operations } from '@youzan/react-components';
import { Icon, EasyList, PopEllipsisText } from '@youzan/ebiz-components';
import { IDragListProps } from '@youzan/ebiz-components/es/types/drag-list';

import { ILiveVideoResponse } from '../../../api/live-manage';

const { GridPop } = EasyList;

enum ScreenRatioMap {
  FHD = 1920,
  HD = 1440,
  SD = 1280,
}
const bodyWidth = document.body.offsetWidth;
// 改了这个值记得去改css
const videoNameWidthMap: Record<ScreenRatioMap, number> = {
  [ScreenRatioMap.FHD]: 245,
  [ScreenRatioMap.HD]: 125,
  [ScreenRatioMap.SD]: 100,
};
let currentWidth = videoNameWidthMap[ScreenRatioMap.FHD];
if (bodyWidth < ScreenRatioMap.FHD && bodyWidth >= ScreenRatioMap.HD) {
  currentWidth = videoNameWidthMap[ScreenRatioMap.HD];
} else if (bodyWidth < ScreenRatioMap.HD) {
  currentWidth = videoNameWidthMap[ScreenRatioMap.SD];
}

export interface IGetColumnsMethods {
  download(): void;
  preview(videoSource: string): void;
  deleteVideo(videoId: string, fileId: string): void;
}
type GetVideoListColumnsType = (
  params: IGetColumnsMethods,
) => IDragListProps<ILiveVideoResponse>['columns'];
export const getVideoListColumns: GetVideoListColumnsType = ({
  preview,
  deleteVideo,
  download,
}) => {
  return [
    {
      title: '视频名称',
      bodyRender(row) {
        return <PopEllipsisText width={currentWidth} text={row.name} renderVirtualNode />;
      },
    },
    {
      title: '视频时长',
      name: 'duration',
      width: 120,
    },
    {
      title: '直播开始时间',
      name: 'startTime',
      width: 200,
      bodyRender(row) {
        if (row.startTime) {
          const dateStringGroups = row.startTime.split(' ');
          return (
            <div className="live-manage__recordManage__startTime">
              <p>{dateStringGroups[0]}</p>
              <p>{dateStringGroups[1]}</p>
            </div>
          );
        }
        return '-';
      },
    },
    {
      title: '状态',
      helpDesc: '直播后需等待视频转码完成才可进行回放。',
      width: 120,
      bodyRender(row) {
        return row.status ? '可回放' : <span style={{ color: '#2DA641' }}>准备中</span>;
      },
    },
    {
      name: 'surplusDownTime',
      title: '剩余下载时长',
      width: 150,
      helpDesc: '为保证视频存储的安全性，视频需在直播结束后160天内进行下载。',
    },
    {
      title: '操作',
      textAlign: 'right',
      width: 150,
      bodyRender(row) {
        const actions: React.ReactNode[] = [];
        if (row.status === 1) {
          actions.push(
            <GridPop
              text="删除"
              key="delete"
              trigger="click"
              confirmText="确定"
              className="double-confirm"
              content="视频删除后无法恢复，确定删除吗？"
              onConfirm={() => deleteVideo(row.vid, row.fileId)}
            />,
          );
          // 如果是三分屏，且在合并中
          const isDisabled =
            row.liveScene === 1 && (row.mergeStatus === 2 || row.mergeStatus === 0);
          if (isDisabled) {
            // 视频在长时间合并的提示
            const disabledContent =
              row.mergeStatus === 2
                ? '5月10日前进行的三分屏直播，需要较长的时间进行批量处理，如需下载请联系客服。'
                : '下载准备中，暂时无法预览和下载。';
            actions.unshift(
              <GridPop
                key="preview"
                text="预览"
                disabled
                trigger="hover"
                content={disabledContent}
              />,
              <GridPop
                key="download"
                text="下载"
                disabled
                trigger="hover"
                content={disabledContent}
              />,
            );
          } else if (row.surplusDownTime !== '' && row.surplusDownTime !== '0') {
            actions.unshift(
              <a key="preview" onClick={() => linkCheck(row.downLink, preview)}>
                预览
              </a>,
              <a
                key="download"
                target="_blank"
                download="回放视频"
                href={row.downLink}
                rel="noopener noreferrer"
                onClick={(evt) => linkCheck(row.downLink, download, evt)}
              >
                下载
              </a>,
            );
          }
        }
        return actions.length ? <Operations items={actions} /> : '-';
      },
    },
  ];
};

const linkCheck = (targetLink: any, callback: any, evt?: any) => {
  const hasTarget = Boolean(targetLink);
  if (hasTarget) {
    callback && callback(targetLink);
  } else {
    if (evt) {
      evt.stopPropagation();
      evt.preventDefault();
    }
    Notify.error('获取下载地址错误，请重试或联系客服');
  }
};

export const DisabledAnchor: React.FC<{}> = () => (
  <Pop
    content="有视频正在准备中，请等待准备完成后再进行排序。"
    trigger="hover"
    position="right-center"
  >
    <div style={{ cursor: 'not-allowed' }}>
      <Icon type="drag" color="#DCDEE0" />
    </div>
  </Pop>
);
