import { createBlock, React } from '@youzan/tany-react';
import VideoUploader from 'pages/supv/homework/components/video-uploader';
import UploaderViewContainer from 'pages/supv/homework/components/uploader-view-container';
// import VideoUploaderPreview from 'pages/supv/homework/components/video-uploader-preview';
import AppModel from './model';
import './style.scss';

function App(model) {
  return (
    <div className="demo-img">
      <p className="demo-img__title">视频区域 - 上传</p>
      <VideoUploader
        max={9}
        value={model.localImgViewList}
        onChanged={model.handleImgChange}
        // token-url="/wscvis/getQiniuAggregateUploadToken.json"
        anchor="video"
      >
        <div className="demo-img-uploader">
          视频
        </div>
      </VideoUploader>

      <p className="demo-img__title">视频区域 - 展示</p>
      <UploaderViewContainer
        anchor="video"
      >
      </UploaderViewContainer>
      {/* <div>
        {
          model.localImgViewList.map((o, index) => {
            return (
              <VideoUploaderPreview
                key={index}
                url={o.url}
                width={'80px'}
                height={'80px'}
                videoId={o.videoId}
                coverUrl={o.cover}
                deleted={o.deleted}
              />
            );
          })
        }
      </div> */}
    </div>
  );
};

export default createBlock({
  model: AppModel,
  root: App,
});
