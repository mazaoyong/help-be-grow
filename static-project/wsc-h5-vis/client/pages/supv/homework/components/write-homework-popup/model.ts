import { computed, onMounted, onUnmounted, ref, nextTick } from '@youzan/tany-vue';
import { useAppModel } from '../../App.model';

import AssignmentService from '@/domain/assignment-domain/services';
import Draft from '@/domain/assignment-domain/entities/draft';
import { IMediaBlock as IMediaUploadBlock, MediaTypeEnum } from '@/domain/workbook-domain/entities/workbook';

import { Toast, Dialog } from 'vant';
import { IMediaBlock as IMediaDetailBlock } from 'vis-shared/components/supv/homework/media-container';

export interface IWriteHomeworkPopupProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  setSubmitted?: (v: boolean) => void;
  mediaBlocks: IMediaDetailBlock[];
  assignmentId: number;
  studentId: number;
  deadline?: Date;
  targetKdtId: number;
  hasWritten: false,
}

export interface IVideoUploaderInputValue {
  url: string;
  videoId: number;
  cover?: string;
  /** 视频的审核状态 */
  videoStatus: number;
  duration?: number;
  /** 视频是否已被删除 */
  deleted?: boolean;
  size?: {
    width: number | string;
    height: number | string;
  };
  /** 视频的上传状态 */
  status?: number;
}

const deviceHeight = document.documentElement.clientHeight;

function WriteHomeworkModel(props: IWriteHomeworkPopupProps) {
  const {
    mainColor,
    track,
  } = useAppModel();

  const {
    setOpen,
    setSubmitted,
    deadline,
    targetKdtId,
  } = props;

  const buttonHeight = ref(0);
  const titleHeight = ref(0);
  const height = computed(() => {
    return `${Math.floor(deviceHeight * 0.8) - buttonHeight.value - titleHeight.value}px`;
  });
  const onOpen = () => {
    nextTick(() => {
      buttonHeight.value = document.querySelector('.write-homework-popup__operations')!.getBoundingClientRect().height;
      titleHeight.value = document.querySelector('.write-homework-popup__title')!.getBoundingClientRect().height;
    });
  };

  const mediaBlocks = computed(() => props.mediaBlocks);
  const assignmentId = computed(() => props.assignmentId);
  const studentId = computed(() => props.studentId);
  const open = computed(() => props.open);
  const setOpenWithDraft = (v: boolean) => {
    if (!v) {
      submitDraft();
    }
    setOpen(v);
  };

  const assignmentText = ref('');
  const setAssignmentText = (v: string) => {
    assignmentText.value = v;
  };
  const assignmentImageList = ref<{url: string}[]>([]);
  // 接收上传组件回传信息
  const uploadedAssignmentImageList = ref<{url: string; status: number;}[]>([]);
  const setAssignmentImageList = (v: {url: string; status: number;}[]) => {
    uploadedAssignmentImageList.value = v;
  };
  const assignmentVideoList = ref<IVideoUploaderInputValue[]>([]);
  // 接收上传组件回传信息
  const uploadedAssignmentVideoList = ref<{videoId: number; status: number;}[]>([]);
  const setAssignmentVideoList = (v: {videoId: number; status: number;}[]) => {
    uploadedAssignmentVideoList.value = v;
  };
  const assignmentAudioList = ref<{url: string; name?: string;}[]>([]);
  // 接收上传组件回传信息
  const uploadedAssignmentAudioList = ref<{url: string; status: number;}[]>([]);
  const setAssignmentAudioList = (v: {url: string; status: number;}[]) => {
    uploadedAssignmentAudioList.value = v;
  };
  const initAssignmentData = () => {
    mediaBlocks.value.forEach((mediaBlock) => {
      if (mediaBlock.richTextItem) {
        assignmentText.value = mediaBlock.richTextItem.content;
      } else if (mediaBlock.pictureItem) {
        assignmentImageList.value.push({ url: mediaBlock.pictureItem.url });
        uploadedAssignmentImageList.value.push({ url: mediaBlock.pictureItem.url, status: 0 });
      } else if (mediaBlock.videoItem) {
        assignmentVideoList.value.push({
          url: mediaBlock.videoItem.url,
          videoId: mediaBlock.videoItem.id,
          cover: mediaBlock.videoItem.coverUrl,
          videoStatus: mediaBlock.videoItem.status,
          status: 0,
        });
        uploadedAssignmentVideoList.value.push({ videoId: mediaBlock.videoItem.id, status: 0 });
      } else if (mediaBlock.audioItem) {
        assignmentAudioList.value.push({ url: mediaBlock.audioItem.url });
        uploadedAssignmentAudioList.value.push({ url: mediaBlock.audioItem.url, status: 0 });
      }
    });
    // 触发刷新
    assignmentImageList.value = assignmentImageList.value.concat([]);
    assignmentVideoList.value = assignmentVideoList.value.concat([]);
    assignmentAudioList.value = assignmentAudioList.value.concat([]);
    uploadedAssignmentImageList.value = uploadedAssignmentImageList.value.concat([]);
    uploadedAssignmentVideoList.value = uploadedAssignmentVideoList.value.concat([]);
    uploadedAssignmentAudioList.value = uploadedAssignmentAudioList.value.concat([]);
  };
  initAssignmentData();

  const handleSubmitHomework = () => {
    if (isOvertime.value) {
      Dialog({
        message: '作业提交已截止',
        confirmButtonColor: mainColor,
      });
    } else {
      const detail: IMediaUploadBlock[] = [];
      let currentSerialNo = 0;
      let uploadFinished = true;
      if (assignmentText.value.trim() !== '') {
        detail.push({
          detail: {
            content: assignmentText.value,
          },
          mediaType: MediaTypeEnum.RICH_TEXT,
          serialNo: currentSerialNo,
        });
      }
      uploadedAssignmentImageList.value.forEach((image) => {
        if (image.status !== 0) {
          uploadFinished = false;
        } else {
          currentSerialNo += 1;
          detail.push({
            detail: {
              url: image.url,
            },
            mediaType: MediaTypeEnum.IMAGE,
            serialNo: currentSerialNo,
          });
        }
      });
      uploadedAssignmentVideoList.value.forEach((video) => {
        if (video.status !== 0) {
          uploadFinished = false;
        } else {
          currentSerialNo += 1;
          detail.push({
            detail: {
              id: video.videoId,
            },
            mediaType: MediaTypeEnum.VIDEO,
            serialNo: currentSerialNo,
          });
        }
      });
      uploadedAssignmentAudioList.value.forEach((audio) => {
        if (audio.status !== 0) {
          uploadFinished = false;
        } else {
          currentSerialNo += 1;
          detail.push({
            detail: {
              url: audio.url,
            },
            mediaType: MediaTypeEnum.AUDIO,
            serialNo: currentSerialNo,
          });
        }
      });
      const draft = new Draft({ detail });
      if (!uploadFinished) {
        Toast('有内容没有上传完成或者上传失败');
      } else if (detail.length === 0) {
        Toast('请填写作业内容');
      } else {
        track.collect('assignment:contentCount', {
          vd_n: draft.detail.filter((d) => d.mediaType === MediaTypeEnum.VIDEO).length,
          im_n: draft.detail.filter((d) => d.mediaType === MediaTypeEnum.IMAGE).length,
          ad_n: draft.detail.filter((d) => d.mediaType === MediaTypeEnum.AUDIO).length,
        });
        track.runTask('submit_homework');
        AssignmentService.submitAssignment(draft, assignmentId.value, studentId.value, targetKdtId)
          .then((res: any) => {
            if (res.code === 0) {
              setOpen(false);
              Dialog({
                message: res.data.message,
                confirmButtonColor: mainColor,
                confirmButtonText: '我知道了',
              }).then(() => {
                setSubmitted && setSubmitted(true);
              });
            } else if (res.code === 323050101) {
              Dialog({
                message: '作业已被删除，无法提交，请和老师联系。',
                confirmButtonColor: mainColor,
              });
            } else if (res.code === 323050102) {
              Dialog({
                message: '作业提交已截止',
                confirmButtonColor: mainColor,
              });
            } else {
              Toast(res.msg);
            }
          });
      }
    }
  };

  const submitDraft = () => {
    if (!isOvertime.value && open.value) {
      const detail: IMediaUploadBlock[] = [];
      let currentSerialNo = 0;
      if (assignmentText.value.trim() !== '') {
        detail.push({
          detail: {
            content: assignmentText.value,
          },
          mediaType: MediaTypeEnum.RICH_TEXT,
          serialNo: currentSerialNo,
        });
      }
      uploadedAssignmentImageList.value.forEach((image) => {
        if (image.status === 0) {
          currentSerialNo += 1;
          detail.push({
            detail: {
              url: image.url,
            },
            mediaType: MediaTypeEnum.IMAGE,
            serialNo: currentSerialNo,
          });
        }
      });
      uploadedAssignmentVideoList.value.forEach((video) => {
        if (video.status === 0) {
          currentSerialNo += 1;
          detail.push({
            detail: {
              id: video.videoId,
            },
            mediaType: MediaTypeEnum.VIDEO,
            serialNo: currentSerialNo,
          });
        }
      });
      uploadedAssignmentAudioList.value.forEach((audio) => {
        if (audio.status === 0) {
          currentSerialNo += 1;
          detail.push({
            detail: {
              url: audio.url,
            },
            mediaType: MediaTypeEnum.AUDIO,
            serialNo: currentSerialNo,
          });
        }
      });
      const draft = new Draft({ detail });

      if (detail.length !== 0) {
        AssignmentService.submitDraft(draft, assignmentId.value, studentId.value, targetKdtId)
          .catch((e: {code: number, message: string}) => {
            console.log(e.message);
          });
      }
    }
  };

  let draftTimer: number | undefined;
  let countDownTimer: number | undefined;
  const isOvertime = ref(false);
  const setOvertime = (v: boolean) => {
    isOvertime.value = v;
  };
  // 初始化剩余提交时间，数量无特殊含义，可能没有截止时间，写大一点
  const leftTime = ref(365 * 24 * 60 * 60 * 1000);
  onMounted(() => {
    draftTimer = setInterval(submitDraft, 10000);
    if (deadline) {
      countDownTimer = setInterval(() => {
        const left = deadline.getTime() - Date.now();
        const FIVE_MINUTES = 5 * 60 * 1000;
        if (left >= 0 && left <= FIVE_MINUTES) {
          leftTime.value = left;
          clearInterval(countDownTimer);
        } else if (left < 0) {
          leftTime.value = 0;
          clearInterval(countDownTimer);
        }
      }, 1000);
    }
  });
  onUnmounted(() => {
    clearInterval(draftTimer);
    clearInterval(countDownTimer);
  });

  onMounted(() => {
    const css = document.createElement('style');
    css.innerHTML = `
    .audio-popup__controll-starter,
    .audio-popup__controll-end {
      background-color: ${mainColor} !important; 
    }
    .audio-popup__controll-wave {
      background-color: ${mainColor} !important;
      opacity: .2;
    }`;
    document.body.appendChild(css);
  });

  return {
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
    isOvertime,
    setOvertime,
    setOpenWithDraft,
    height,
    onOpen,
  };
}

export default WriteHomeworkModel;
