import { computed, ModelOf, onBeforeUnmount, onMounted, Ref, ref, take } from '@youzan/tany-vue';
import { createReview } from 'domain/supv/homework/services/assignment';
import { useRootModel } from '../../Root.model';
import { OPEN_REVIEW_POPUP } from '../../events';
import { ShortcutPopupModel } from './fragments/shortcut-popup';
import Assignment from 'domain/supv/homework/entities/Assignment';
import { Toast } from 'vant';
import { ReviewFormModel } from '../../models/ReviewForm';
import { quickCommentUseLog, submitCorrectLog } from '../../../../log';
import { MEDIA_ITEM_TYPE } from 'domain/supv/homework/constants';

const ReviewPopupModel = () => {
  const { currentAssignment, refreshCurrent } = useRootModel();

  const show = ref(false);
  const open = () => show.value = true;
  const close = () => {
    show.value = false;
    submitDraft();
  };
  take(OPEN_REVIEW_POPUP, open);

  const title = computed(() => {
    return `批阅${currentAssignment.value?.student?.name || ''}的作业`;
  });

  const reviewFormModel = ReviewFormModel(currentAssignment as Ref<Assignment>);

  const isSubmitting = ref(false);
  const submit = () => {
    if (reviewFormModel.validate()) {
      const submitForm = reviewFormModel.getFormValue({
        type: 1, // 1 是批阅 2 是草稿
        assignmentId: Number(currentAssignment.value.id) || 0,
      });
      submitCorrectLog({
        video_number: submitForm.comment.filter(d => d.mediaType === MEDIA_ITEM_TYPE.VIDEO).length,
        audio_number: submitForm.comment.filter(d => d.mediaType === MEDIA_ITEM_TYPE.AUDIO).length,
        image_number: submitForm.comment.filter(d => d.mediaType === MEDIA_ITEM_TYPE.IMAGE).length,
      })

      isSubmitting.value = true;
      createReview(submitForm)
        .then(() => {
          setTimeout(() => {
            Toast('提交成功');
          }, 0);
          refreshCurrent();
          close();
        })
        .catch((errMsg: string) => Toast(errMsg || '批阅失败'))
        .finally(() => isSubmitting.value = false);
    }
  };
  const submitDraft = () => {
    const { isEmptyComment, isSelected, score } = reviewFormModel;
    if (!isEmptyComment() || isSelected.value || score.value) {
      const submitForm = reviewFormModel.getFormValue({
        type: 2,
        assignmentId: Number(currentAssignment.value.id) || 0,
      });
      createReview(submitForm);
    }
  };

  const onSelectComment = (comment: string) => {
    console.log('选择了快捷评语', comment);
    quickCommentUseLog();
    reviewFormModel.setTextComment(comment);
  };

  let timer: number;
  const AUTO_SUBMIT_TIME = 10000;
  onMounted(() => {
    timer = setInterval(() => {
      if (show.value) {
        submitDraft();
      }
    }, AUTO_SUBMIT_TIME);
  });
  onBeforeUnmount(() => {
    clearInterval(timer);
  });

  return {
    show,
    open,
    close,

    title,

    isSubmitting,
    submit,

    reviewFormModel,
    shortcutModel: ShortcutPopupModel(onSelectComment),
  };
};

export type ReviewPopupModelType = ModelOf<typeof ReviewPopupModel>;
export default ReviewPopupModel;
