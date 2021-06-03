import { MEDIA_ITEM_TYPE } from 'domain/supv/homework/constants';
import {
  VideoUploader as VisVideoUploader,
  AudioUploader as VisAudioUploader,
} from '@youzan/vis-ui';

export default [
  {
    text: '图文',
    type: MEDIA_ITEM_TYPE.RICHTEXT,
    iconName: 'tupian',
    uploader: (button: JSX.Element) => button,
  },
  {
    text: '视频',
    type: MEDIA_ITEM_TYPE.VIDEO,
    iconName: 'shipin',
    uploader: (
      button: JSX.Element,
      model: {
        handleChange: (data: any) => any,
      },
    ) => (
      <VisVideoUploader
        token-url="/v4/vis/h5/edu/commom/material/videoUploadToken.json"
        confirm-url="/v4/vis/h5/edu/commom/material/confirmVideoUpload.json"
        publish-url="/v4/vis/h5/edu/commom/material/publishVideo.json"
        onChanged={model.handleChange}
        canMaxHiddenInput={false}
        preview={false}
        max={9999}
      >
        {button}
      </VisVideoUploader>
    ),
  },
  {
    text: '语音',
    type: MEDIA_ITEM_TYPE.AUDIO,
    iconName: 'yinpin',
    uploader: (
      button: JSX.Element,
      model: {
        handleChange: (data: any) => any,
      },
    ) => (
      <VisAudioUploader
        class="audio-uploader"
        onChanged={model.handleChange}
        uploadUrl="/v4/vis/h5/common/materials/highWxMediaDownLoadAsyn.json"
        max={9999}
      >
        {button}
      </VisAudioUploader>
    ),
  },
];
