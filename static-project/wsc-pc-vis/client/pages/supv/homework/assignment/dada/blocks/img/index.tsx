import { createBlock, React } from '@youzan/tany-react';
import ImgUploader from 'pages/supv/homework/components/img-uploader';
// import UploaderViewContainer from './components/uoloader-view-container';
import UploaderViewContainer from 'pages/supv/homework/components/uploader-view-container';
import AppModel from './model';
import './style.scss';

function App(model) {
  return (
    <div className="demo-img">
      <p className="demo-img__title">图片区域 - 上传</p>
      <ImgUploader
        max={9}
        value={model.localImgViewList}
        onChanged={model.handleImgChange}
        // token-url="/wscvis/getQiniuAggregateUploadToken.json"
        anchor="img"
      >
        <div className="demo-img-uploader">
          图片
        </div>
      </ImgUploader>

      <p className="demo-img__title">图片区域 - 展示</p>
      <UploaderViewContainer
        // priority={['image', 'video']}
        // img={{}}
        anchor="img"
      >
      </UploaderViewContainer>
      {/* <div>
        {
          model.localImgViewList.map((o, index) => {
            return (
              <ImgUploaderPreview
                key={index}
                url={o.url}
                width={'80px'}
                height={'80px'}
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
