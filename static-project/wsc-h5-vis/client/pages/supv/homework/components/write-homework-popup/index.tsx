import { createComponent, ModelOf } from '@youzan/tany-vue';
import WriteHomeworkPopupModel, { IWriteHomeworkPopupProps } from './model';

import { ImgUploaderSingle, UploaderViewContainer, VideoUploader, AudioUploader, ImgWrap } from '@youzan/vis-ui';
import { CountDown, Field, Button, Popup } from 'vant';

import './style.scss'


function WriteHomeworkPopup(model: ModelOf<typeof WriteHomeworkPopupModel>) {
  const {
    props,
    mainColor,

    assignmentText,
    setAssignmentText,
    assignmentImageList,
    setAssignmentImageList,
    assignmentVideoList,
    setAssignmentVideoList,
    assignmentAudioList,
    setAssignmentAudioList,
    handleSubmitHomework,
    leftTime,
    setOvertime,
    isOvertime,
    setOpenWithDraft,
    height,
    onOpen
  } = model;
  const {
    open,
    hasWritten,
  } = props;

  return (
    <Popup
      class="write-homework-popup"
      position="bottom"
      closeable
      closeIcon="cross"
      closeIconPosition="top-right"
      closeOnClickOverlay
      closeOnPopstate
      lockScroll
      safeAreaInsetBottom
      round
      value={open}
      onOpen={onOpen}
      onInput={(value: boolean) => {
        setOpenWithDraft(value)
      }}
    >
      <div class="write-homework-popup__title">
        <p class="write-homework-popup__main-title">写作业</p>
        {
          leftTime.value <= 5 * 60 * 1000 && !hasWritten
          ? (
            <p class="write-homework-popup__sub-title">
              <CountDown
                time={ leftTime.value }
                format="mm : ss "
                onFinish={setOvertime}
              />后截止提交作业
            </p>
          ) : null
        }
      </div>
      <div
        class="write-homework-popup__content"
        style={{
          height: height.value
        }}
      >
        <Field
          type="textarea"
          value={assignmentText.value}
          autosize={false}
          rows={10}
          maxlength={10000}
          placeholder="请填写作业内容"
          showWordLimit={true}
          on={{
            input: (value: string) => {
              setAssignmentText(value);
            }
          }}
        />
        <div class="media-container">
          <UploaderViewContainer
            priority={['image', 'video']}
            anchor="imgvideo"
          >
          </UploaderViewContainer>
          <UploaderViewContainer
            priority={['audio']}
            anchor="audio"
          >
          </UploaderViewContainer>
        </div>

      </div>
      <div class="write-homework-popup__operations">
        <div class="write-homework-popup__operations__functions">
          <AudioUploader
            values={assignmentAudioList.value}
            onChanged={setAssignmentAudioList}
            anchor="audio"
            max={9}
          >
            <div>
              <ImgWrap
                width="30px"
                height="30px"
                src={'data:image/png;base64,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'}
                alt="录语音"
                disableLazyload={true}
              />
              <p class="write-homework-popup__operations__functions__name">录语音</p>
            </div>
          </AudioUploader>
          <ImgUploaderSingle
            canMaxHiddenInput={false}
            previewImage={false}
            max={9}
            max-size={10 * 1024 * 1024}
            value={assignmentImageList.value}
            onChanged={setAssignmentImageList}
            token-url="/wscvis/getQiniuAggregateUploadToken.json"
            options={
              {
                mediaAccessType: 1,
                storeType: 2,
                channel: 'owl_ceres_img',
              }
            }
            anchor="imgvideo"
          >
            <div>
              <ImgWrap
                width="30px"
                height="30px"
                src={'data:image/png;base64,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'}
                alt="传图片"
                disableLazyload={true}
              />
              <p class="write-homework-popup__operations__functions__name">传图片</p>
            </div>
          </ImgUploaderSingle>
          <VideoUploader
            value={assignmentVideoList.value}
            onChanged={setAssignmentVideoList}
            token-url="/wscvis/videoUploadToken.json"
            confirm-url="/wscvis/confirmVideoUpload.json"
            publish-url="/wscvis/publishVideo.json"
            max-size={1 * 1024 * 1024 * 1024}
            canMaxHiddenInput={false}
            preview={false}
            max={9}
            anchor="imgvideo"
          >
            <div>
              <ImgWrap
                width="30px"
                height="30px"
                src={'data:image/png;base64,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'}
                alt="传视频"
                disableLazyload={true}
              />
              <p class="write-homework-popup__operations__functions__name">拍视频</p>
            </div>
        </VideoUploader>
        </div>
        <Button
          class="write-homework-popup__operations__submit"
          color={ isOvertime.value ? '#c8c9cc' : mainColor }
          onClick={ handleSubmitHomework }
          props={{ round: true, size: 'large' }}
        >
          提交
        </Button>
      </div>
    </Popup>
  )
}

export default createComponent(WriteHomeworkPopup, {
  model: WriteHomeworkPopupModel,
  initialState: {
    open: false,
    setOpen: (v: boolean) => {},
    mediaBlocks: [],
    assignmentId: 0,
    studentId: 0,
    setSubmitted: undefined,
    deadline: undefined,
    targetKdtId: 0,
    hasWritten: false,
  }
})