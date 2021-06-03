const renderItemStatus = item => {
  const status = item.status;
  const isVideo = item.media_type === 3;
  const videoPreviewStatus = item.video_preview_status;
  const videoStatus = item.video_status;

  let statusStr = '';
  let errorClass = '';
  let currentVideoStatus = 0;
  let errorArrStatus = [3, 5, 6];
  let publishStatus = status === 1 ? (statusStr = '出售中') : (statusStr = '已停售');

  if (!isVideo) {
    statusStr = publishStatus;
  } else {
    if (videoPreviewStatus) {
      if (videoPreviewStatus === 4 && videoStatus === 4) {
        statusStr = publishStatus;
        currentVideoStatus = 4;
      } else if (videoPreviewStatus > videoStatus) {
        statusStr = item.video_status_desc;
        currentVideoStatus = videoStatus;
      } else if (videoPreviewStatus < videoStatus) {
        statusStr = item.video_preview_status_desc;
        currentVideoStatus = videoPreviewStatus;
      } else {
        statusStr = item.video_status_desc;
        currentVideoStatus = videoStatus;
      }
    } else {
      statusStr = publishStatus;
      currentVideoStatus = videoStatus;

      if (videoStatus !== 4) {
        statusStr = item.video_status_desc;
      }
    }
    errorClass = errorArrStatus.includes(currentVideoStatus) ? 'red' : '';
  }

  return {
    statusDesc: statusStr,
    videoStatus: currentVideoStatus,
    errorClass,
  };
};

export default renderItemStatus;
