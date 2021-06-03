import { createBlock, React } from '@youzan/tany-react';
import AudioUploader, { Record } from 'pages/supv/homework/components/audio-uploader';
import UploaderViewContainer from 'pages/supv/homework/components/uploader-view-container';
// import AudioUploaderPreview from 'pages/supv/homework/components/audio-uploader-preview';
import AppModel from './model';
import './style.scss';

function App(model) {
  const refRecord = React.useRef<any>(null);
  const handleGetStatus = () => {
    console.log('record 状态', refRecord.current.value);
  };
  return (
    <div className="demo-img">
      <p className="demo-img__title">音频区域 - 上传</p>
      <AudioUploader
        max={9}
        value={model.localImgViewList}
        onChanged={model.handleImgChange}
        // token-url="/wscvis/getQiniuAggregateUploadToken.json"
        anchor="audio"
        supportRecord={true}
      >
        <div className="demo-img-uploader">
          音频
        </div>
      </AudioUploader>

      <Record
        maxSize={20000 * 1024}
        ref={refRecord} anchor="audio" countTime={20} isAscendCount={true}
        formatName={(timestamp) => {
          return `作业点评-XX的作业-${timestamp}`;
        }}
      />

      <div onClick={handleGetStatus}>获取 Record 的状态</div>

      <p className="demo-img__title">音频区域 - 展示</p>
      <UploaderViewContainer
        // priority={['image', 'video']}
        // img={{}}
        anchor="audio"
        className="audio-uploader-view-container"
      >
      </UploaderViewContainer>
      {/* <div>
        {
          model.localImgViewList.map((o, index) => {
            return (
              <AudioUploaderPreview
                key={index}
                url={o.url}
                name={o.name}
                audioId={o.audioId}
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
