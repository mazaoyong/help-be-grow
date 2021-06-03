import { computed, ref, Ref, watch } from '@youzan/tany-vue';
import { MEDIA_ITEM_TYPE, SCORE_RULE, SCORE_TYPE } from 'domain/supv/homework/constants';
import Assignment from 'domain/supv/homework/entities/Assignment';
import { Toast } from 'vant';

export const ReviewFormModel = (currentAssignment: Ref<Assignment>) => {
  const score = ref('');
  const scoreType = computed(
    () => currentAssignment.value?.homework?.reviewSettings.scoreType || SCORE_TYPE.SCORE
  );
  const scoreRule = computed(
    () => currentAssignment.value?.homework?.reviewSettings.scoreRule || SCORE_RULE.TEN
  );
  const scorePlaceholder = computed(
    () => `满分 ${scoreRule.value === SCORE_RULE.TEN ? 10 : 100} 分`
  );
  const setScore = (value = '') => {
    let pointIndex = -1;
    score.value = '';
    if ((pointIndex = value.indexOf('.')) > -1) {
      score.value = value.slice(0, pointIndex + 3);
    } else {
      score.value = value;
    }
  };
  const isLevelScore = computed(() => scoreType.value === SCORE_TYPE.LEVEL);
  const levelList = ['S', 'A', 'B', 'C', 'D'];
  const scoreMaxLength = computed(
    () => scoreRule.value === SCORE_RULE.TEN ? 2 : 3
  );
  const scoreErrorMsg = ref('');
  const setScoreErrorMsg = (message: string) => {
    scoreErrorMsg.value = message;
  };

  const isSelected = ref(false);
  const triggerSelected = () => {
    isSelected.value = !isSelected.value;
  };

  const textComment = ref('');
  const setTextComment = (value: string) => {
    textComment.value = value;
  };

  const imageComment = ref([] as string[]);
  const addImageComment = (imageUrl: string) => {
    console.log('添加图片：', imageUrl);
    imageComment.value.push(imageUrl);
  };
  const deleteImageComment = (index: number) => {
    imageComment.value.splice(index, 1);
  };
  const onImagesChanged = (imageFileList: { url: string, status: number }[]) => {
    console.log('有图片更新', imageFileList);
    const uploadedImages = imageFileList.filter(image => image.status === 0);
    const newImages = uploadedImages.map(images => images.url);
    if (newImages.length !== imageComment.value.length) {
      imageComment.value = uploadedImages.map(item => item.url);
      console.log('更新了图片', imageComment.value);
    }
  };

  interface videoItem {
    videoId: number
    status?: number
    cover?: string
    coverUrl?: string
  };
  const videoComment = ref([] as videoItem[]);
  const videoIds = computed(() => videoComment.value.map(video => video.videoId));
  const addVideoComment = (video: videoItem) => {
    console.log('添加视频：', video);
    videoComment.value.push({
      ...video,
      cover: video.coverUrl || '',
      status: 0,
    });
  };
  const deleteVideoComment = (index: number) => {
    console.log('删除了视频', index)
    videoComment.value.splice(index, 1);
  };
  const onVideosChanged = (videoFileList: { videoId: number; status: number; url: string }[]) => {
    console.log('有视频更新 ------------------>', videoFileList);
    const uploadedVideos = videoFileList.filter(video => video.status === 0);
    const newVideoIds = uploadedVideos.map(video => video.videoId);
    if (newVideoIds.length !== videoIds.value.length) {
      videoComment.value = uploadedVideos.map(
        video => ({ videoId: video.videoId, url: video.url })
      );
      console.log('更新了视频 ------------------>', videoComment.value);
    }
  };

  const audioComment = ref([] as { url: string }[]);
  const audioUrls = computed(() => audioComment.value.map(audio => audio.url));
  const addAudioComment = (audio: { url: string }) => {
    audioComment.value.push(audio);
  };
  const deleteAudioComment = (index: number) => {
    audioComment.value.splice(index, 1);
  };
  const onAudiosChanged = (audioFileList: { url: string, status: number }[]) => {
    console.log('有音频更新 ------------------>', audioFileList);
    const uploadedAudios = audioFileList.filter(audio => audio.status === 0);
    const newAudioList = uploadedAudios.map(audio => audio.url);
    if (newAudioList.length !== audioUrls.value.length) {
      audioComment.value = uploadedAudios.map(audio => ({ ...audio }));
      console.log('更新了音频 ------------------>', audioComment.value);
    }
  };

  const init = (assignment: Assignment) => {
    setScore(assignment.draftScore);
    isSelected.value = assignment.draftSelected;
    textComment.value = '';
    imageComment.value = [];
    audioComment.value = [];
    videoComment.value = [];
    assignment.draft?.forEach(item => {
      switch(item.mediaType) {
        case MEDIA_ITEM_TYPE.RICHTEXT:
          setTextComment(item.richTextItem?.content || '');
          break;
        case MEDIA_ITEM_TYPE.IMAGE:
          addImageComment(item.pictureItem?.url || '');
          break;
        case MEDIA_ITEM_TYPE.AUDIO:
          addAudioComment(item.audioItem || {});
          break;
        case MEDIA_ITEM_TYPE.VIDEO:
          addVideoComment({
            ...(item.videoItem || {}),
            videoId: item.videoItem.id,
          });
          break;
      }
    });
  };

  const isEmptyComment = () => {
    const comment = getComment();
    if (!comment.length) {
      return true;
    }

    if (comment.length === 1) {
      const firstComment = comment[0];
      let detail: any;
      if (firstComment &&
        firstComment.mediaType === MEDIA_ITEM_TYPE.RICHTEXT &&
        (detail = firstComment.detail) &&
        !detail.content
      ) {
        return true;
      }
    }

    return false;
  };
  const validate = (showErrorMsg = true) => {
    if (scoreType.value === SCORE_TYPE.SCORE) {
      const scoreValue = Number(score.value);
      if (!scoreValue && score.value !== '0') {
        if (showErrorMsg) {
          setScoreErrorMsg('请输入作业得分');
        }
        return false;
      }
      if (scoreRule.value === SCORE_RULE.TEN && scoreValue > 10 ||
        scoreRule.value === SCORE_RULE.HUNDREDS && scoreValue > 100
      ) {
        if (showErrorMsg) {
          setScoreErrorMsg(`分数不能大于 ${
            scoreRule.value === SCORE_RULE.TEN ? 10 : 100
          } 分`);
        }
        return false;
      }
      setScoreErrorMsg('');
    } else if (!score.value) {
      if (showErrorMsg) {
        Toast('评分不能为空');
      }
      return false;
    }

    if (isEmptyComment()) {
      if (showErrorMsg) {
        Toast('评语不能为空');
      }

      return false;
    }

    return true;
  };

  function getComment() {
    return [
      {
        mediaType: MEDIA_ITEM_TYPE.RICHTEXT,
        detail: {  content: textComment.value },
      },
      ...imageComment.value.map(url => ({
        mediaType: MEDIA_ITEM_TYPE.IMAGE,
        detail: { url },
      })),
      ...videoComment.value.map(videoItem => ({
        mediaType: MEDIA_ITEM_TYPE.VIDEO,
        detail: { id: videoItem.videoId },
      })),
      ...audioComment.value.map(audio => ({
        mediaType: MEDIA_ITEM_TYPE.AUDIO,
        detail: { ...audio },
      })),
    ];
  };
  const getFormValue = (otherParams: Record<string, any>) => ({
    score: scoreType.value === SCORE_TYPE.SCORE ? String(Number(score.value)) : score.value,
    reviewerId: 0,
    excellentScore: isSelected.value ? 1 : 0,
    comment: getComment(),
    ...otherParams,
  });

  // Init the form by current assignment
  watch([currentAssignment], ([currentAssignment]) => {
    if (currentAssignment) {
      init(currentAssignment as Assignment);
    }
  }, { immediate: true });

  return {
    score,
    scorePlaceholder,
    isLevelScore,
    levelList,
    scoreMaxLength,
    scoreErrorMsg,
    setScoreErrorMsg,
    setScore,

    isSelected,
    triggerSelected,

    textComment,
    setTextComment,

    imageComment,
    addImageComment,
    deleteImageComment,
    onImagesChanged,

    videoComment,
    addVideoComment,
    deleteVideoComment,
    onVideosChanged,

    audioComment,
    addAudioComment,
    deleteAudioComment,
    onAudiosChanged,

    init,
    isEmptyComment,
    validate,
    getFormValue,
  };
};
