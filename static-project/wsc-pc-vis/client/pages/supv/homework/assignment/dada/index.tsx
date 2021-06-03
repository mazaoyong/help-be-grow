import { createBlock, React } from '@youzan/tany-react';
import AppModel from './model';
// import ImgBlock from './blocks/img';
import VideoBlock from './blocks/video';
// import ImgVideoBlock from './blocks/img-video';
// import Audio from './blocks/audio';
// import ImgVideo from './blocks/img-video';

function App() {
  return (
    <div>
      {/* <ImgBlock /> */}
      <VideoBlock />
      {/* <Audio /> */}
      {/* <ImgVideo /> */}
      {/* <ImgVideoBlock /> */}
    </div>
  );
};

export default createBlock({
  model: AppModel,
  root: App,
});
