import * as React from 'react';
import { IVideouploaderProps, IVideoValue, IVideoLocalProps, IVideoOutputValue } from './types';
import { UploadV2 } from '@youzan/react-components';
import { generateVideoPlayInfo } from './api';

let videoIndex = 0;
const VideoUploader: React.FC<IVideouploaderProps> = (props) => {
  const propsConfig = props;

  const getInitList = React.useCallback(function(list: IVideoValue[]) : IVideoLocalProps[] {
    console.log('video-uploader init', list);
    return list.map(item => {
      return {
        data: item.url,
        key: ++videoIndex,
        status: item.status || 0,
        origin: item,
        videoId: item.videoId || 0,
        name: item.name || '',
        videoStatus: item.videoStatus || 4,
        videoSize: item.size || {},
        deleted: item.deleted || false,
        coverUrl: item.coverUrl || '',
        fileSize: item.fileSize || 0,
        duration: item.duration || 0,
      };
    });
  }, []);

  const [list, setList] = React.useState(() => {
    document.addEventListener(`uploaderViewContainer-${propsConfig.anchor}`, (ev: any) => {
      console.log('接收到来自 uploader-view-container 的消息', ev.detail.list);
      if (ev.detail.type === 'video') {
        const list = ev.detail.list;
        const newList = getInitList(list);

        // 更新本地数据
        setList(newList);
        // 触发外部更新回调
        propsConfig.onChanged(formatOutputList(newList));
      }
    });

    return getInitList(propsConfig.value);
  });

  React.useEffect(() => {
    setList(getInitList(propsConfig.value));

    // 为了 uploader-view-container 的数据交互
    const event = new CustomEvent(`videoUploader-${propsConfig.anchor}`, { 'detail': { list: propsConfig.value } });
    document.dispatchEvent(event);
  }, [propsConfig.value, getInitList]);

  const getAddInitList = React.useCallback(function(fileList: any[]) : IVideoLocalProps[] {
    // status: 0: 上传成功 1：刚接收 -1：上传失败
    console.log('video-uploader init Add', fileList);
    return fileList.map(item => {
      const videoSize = item.cover_width ? {
        width: `${item.cover_width}px`,
        height: `${item.cover_height}px`,
      } : {};
      return {
        data: item.attachment_url,
        videoId: item.video_id,
        key: ++videoIndex,
        name: item.video_name,
        status: 0,
        origin: {},
        videoStatus: item.status,
        videoSize: videoSize,
        fileSize: item.video_size,
        duration: item.video_duration,
        deleted: false,
        coverUrl: item.cover_url,
      };
    });
  }, []);

  const formatOutputList = React.useCallback(function(list: IVideoLocalProps[]) : IVideoOutputValue[] {
    return list.map(item => {
      return {
        url: item.data,
        status: item.status,
        videoId: item.videoId,
        coverUrl: item.coverUrl,
        videoStatus: item.videoStatus,
        deleted: item.deleted,
        size: item.videoSize,
        name: item.name,
        fileSize: item.fileSize,
        duration: item.duration,
      };
    });
  }, []);

  const handleList = React.useCallback((data) => {
    const _data = Array.isArray(data) ? data : [data];
    const newlist = getAddInitList(_data);
    const nextList = list.concat(newlist);

    const videoPlayInfoPromises = nextList.map(o => {
      if (!o.data) {
        return generateVideoPlayInfo({
          request: {
            mediaId: o.videoId,
            partnerBizType: 1,
          },
        })
          .then(resp => {
            o.data = resp.playUrl;
            o.coverUrl = resp.tencentVideoDTO.coverUrl;
            // o.duration = resp.tencentVideoDTO ? resp.tencentVideoDTO.duration : 0;
            return Promise.resolve(o);
          }).catch(err => {
            console.error('获取视频详情错误', err);
            return Promise.resolve(o);
          });
      } else {
        return Promise.resolve(o);
      }
    });

    Promise.all(videoPlayInfoPromises)
      .then((res) => {
        setList(res);
        propsConfig.onChanged(formatOutputList(res));
      })
      .catch(() => {

      });
  }, [list, setList, formatOutputList, getAddInitList, propsConfig]);

  // 视频选择器点击上传
  const openVideoUpload: (e: React.MouseEvent) => void = React.useCallback(e => {
    e.preventDefault();
    const baseUrl = window._global.url.v4;

    const uploadOptions = {
      channel: 'pc_vis_node',
      imageChannel: 'wsc_web',
      materials: true,
      tokenUrl: `${baseUrl}/vis/commom/material/videoUploadToken.json`,
      mediaListUrl: `${baseUrl}/api/iron/materials/videoList.json`,
      videoConfirmUrl: `${baseUrl}/vis/commom/material/confirmVideoUpload.json`,
      videoPublishUrl: `${baseUrl}/api/iron/materials/publishVideo.json`,
      maxAmount: propsConfig.max - list.length,
      maxSize: 3 * 1024 * 1024 * 1024,
      onSuccess: handleList,
    };

    UploadV2.VideoUpload.initialize(uploadOptions);
  }, [handleList, list.length, propsConfig.max]);

  return (
    <div onClick={openVideoUpload}>
      {
        props.children
      }
    </div>
  );
};

export default VideoUploader;
