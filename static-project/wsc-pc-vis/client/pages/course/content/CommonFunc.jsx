import { Pop } from '@zent/compat';
import React from 'react';

export const renderStatusCloumn = () => {
  const Content = Pop.withPop(() => {
    return (
      <div className="column-pop-text">
        {/* <p><span>销售中：</span>已发布上线，买家端可见</p>
        <p><span>草稿：</span>未发布上线，买家端不可见</p>
        <p><span>即将开售：</span>未到开售时间，买家端不可见</p>
        <p><span>转码/审核中：</span>视频内容正在转码、审核中，买家端不可看</p>
        <p><span>转码/审核失败：</span>视频转码失败，建议编辑内容重新上传新视频</p> */}
        <p>
          <span>出售中：</span>
          内容已发布上线，买家可看
        </p>
        <p>
          <span>已停售：</span>
          内容未发布上线，买家不可看
        </p>
        <p>
          <span>转码/审核中：</span>
          视频内容正在转码、审核中，买家不可看
        </p>
        <p>
          <span>审核未通过：</span>
          视频涉嫌违规，已被风控锁定，建议编辑内容重新上传新视频
        </p>
        <p>
          <span>转码失败：</span>
          视频转码失败，建议编辑内容重新上传新视频
        </p>
      </div>
    );
  });

  return (
    <div className="table-list-column">
      出售状态
      <Pop trigger="hover" position="right-center" content={<Content />}>
        <i className="zenticon zenticon-help-circle help-icon" />
      </Pop>
    </div>
  );
};

export const renderItemStatus = item => {
  const status = item.status;
  const isVideo = item.mediaType === 3;
  const videoPreviewStatus = item.videoPreviewStatus;
  const videoStatus = item.videoStatus;

  let statusStr = '';
  let errorClass = '';
  let currentVideoStatus = 0;
  const errorArrStatus = [3, 5, 6];
  const publishStatus = status === 1 ? (statusStr = '出售中') : (statusStr = '已停售');

  if (!isVideo) {
    statusStr = publishStatus;
  } else {
    if (videoPreviewStatus) {
      if (videoPreviewStatus === 4 && videoStatus === 4) {
        statusStr = publishStatus;
        currentVideoStatus = 4;
      } else if (videoPreviewStatus > videoStatus) {
        statusStr = item.videoStatusDesc;
        currentVideoStatus = videoStatus;
      } else if (videoPreviewStatus < videoStatus) {
        statusStr = item.video_preview_statusDesc;
        currentVideoStatus = videoPreviewStatus;
      } else {
        statusStr = item.videoStatusDesc;
        currentVideoStatus = videoStatus;
      }
    } else {
      statusStr = publishStatus;
      currentVideoStatus = videoStatus;

      if (videoStatus !== 4) {
        statusStr = item.videoStatusDesc;
      }
    }
    errorClass = errorArrStatus.indexOf(currentVideoStatus) > -1 ? 'red' : '';
  }

  return {
    statusDesc: statusStr,
    videoStatus: currentVideoStatus,
    errorClass,
  };
};
