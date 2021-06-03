import {
  icon as VanIcon,
} from 'vant';
import {
  Icon as VisIcon,
  ImgUploaderSingle as VisImgUploader,
  VideoUploader as VisVideoUploader,
  AudioUploader as VisAudioUploader,
} from '@youzan/vis-ui';
import { ReviewPopupModelType } from '../../model';

export default function Toolbar(model: ReviewPopupModelType) {
  return (
    <div class="review-popup__toolbar toolbar">
      <div class="toolbar__shortcut" onClick={model.shortcutModel.open}>
        <VanIcon name="add-o" color="#00b389" size="14" />
        快捷评语
      </div>
      <div class="toolbar__media">
        <VisImgUploader
          canMaxHiddenInput={false}
          previewImage={false}
          max={9}
          value={model.reviewFormModel.imageComment.value.map(url => ({
            url,
          }))}
          onChanged={model.reviewFormModel.onImagesChanged}
          token-url="/v4/vis/h5/edu/commom/material/getQiniuAggregateUploadToken.json"
          options={
            {
              mediaAccessType: 1,
              storeType: 2,
              channel: 'owl_ceres_img',
            }
          }
          anchor="imgvideo"
        >
          <VisIcon name="tupian" color="#7D7E80" size="24" />
        </VisImgUploader>

        <VisVideoUploader
          value={model.reviewFormModel.videoComment.value}
          token-url="/v4/vis/h5/edu/commom/material/videoUploadToken.json"
          confirm-url="/v4/vis/h5/edu/commom/material/confirmVideoUpload.json"
          publish-url="/v4/vis/h5/edu/commom/material/publishVideo.json"
          onChanged={model.reviewFormModel.onVideosChanged}
          canMaxHiddenInput={false}
          preview={false}
          max={9}
          anchor="imgvideo"
        >
          <VisIcon name="shipin" color="#7D7E80" size="24" />
        </VisVideoUploader>

        <VisAudioUploader
          onChanged={model.reviewFormModel.onAudiosChanged}
          values={model.reviewFormModel.audioComment.value}
          anchor="imgvideo"
          uploadUrl="/v4/vis/h5/common/materials/highWxMediaDownLoadAsyn.json"
          max={9}
        >
          <VisIcon name="yinpin" color="#7D7E80" size="24" />
        </VisAudioUploader>
      </div>
    </div>
  );
}
