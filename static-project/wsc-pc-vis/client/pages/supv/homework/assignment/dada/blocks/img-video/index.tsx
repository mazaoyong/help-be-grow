import { createBlock, React } from '@youzan/tany-react';
import VideoUploader from 'pages/supv/homework/components/video-uploader';
import ImgUploader from 'pages/supv/homework/components/img-uploader';
import UploaderViewContainer from 'pages/supv/homework/components/uploader-view-container';
import AppModel from './model';
import './style.scss';

function App(model) {
  return (
    <div className="demo-img">
      <p className="demo-img__title">图片视频区域 - 上传</p>
      <VideoUploader
        max={9}
        value={model.localVideoViewList}
        onChanged={model.handleVideoChange}
        // token-url="/wscvis/getQiniuAggregateUploadToken.json"
        anchor="img-video"
      >
        <div className="demo-img-uploader">
          视频
        </div>
      </VideoUploader>

      <ImgUploader
        max={9}
        value={model.localImgViewList}
        onChanged={model.handleImgChange}
        // token-url="/wscvis/getQiniuAggregateUploadToken.json"
        anchor="img-video"
      >
        <div className="demo-img-uploader">
          图片
        </div>
      </ImgUploader>

      <p className="demo-img__title">图片视频区域 - 展示</p>
      <UploaderViewContainer
        // priority={['image', 'video']}
        // img={{}}
        anchor="img-video"
      >
      </UploaderViewContainer>
    </div>
  );
};

export default createBlock({
  model: AppModel,
  root: App,
});
