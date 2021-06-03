import { computed, hookOf, reactive, ref, watch } from '@youzan/tany-vue';
import { IExerciseDetailItemDTO } from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';
import {
  MEDIA_ITEM_TYPE,
  PUBLISH_TYPE,
  SCORE_RULE,
  SCORE_TYPE,
} from 'domain/supv/homework/constants';
import Homework from 'domain/supv/homework/entities/Homework';
import {
  fetchEditHomework,
  createHomework as createHomeworkService,
  updateHomework as updateHomeworkService,
} from 'domain/supv/homework/services/homework';
import { Toast } from 'vant';
import { useAppModel } from '../../../App.model';
import { detailRoute, listRoute, useRouter } from '../../../router';
import { createMediaItem } from '../utils';

const FormModel = () => {
  const { backWhenFinish, setBackWhenFinish } = useAppModel();
  const { route } = useRouter();
  const { path, params } = route.value;
  const isEdit = computed(() => path.includes('edit'));

  const homeworkDetail = ref({} as Homework);
  const form = reactive({
    id: Number(params.homeworkId),
    title: '',
    detail: [
      createMediaItem(MEDIA_ITEM_TYPE.RICHTEXT, { content: '' }),
    ] as IExerciseDetailItemDTO[],
    publishSettings: {
      enableTimer: PUBLISH_TYPE.NORMAL,
      publishTime: 0,
      endTime: 0,
    },
    reviewSettings: {
      scoreType: SCORE_TYPE.LEVEL,
      scoreRule: SCORE_RULE.TEN,
    },
    workbook: {
      id: params.workbookId,
    },
  });
  const errorMsg = reactive({
    title: '',
    detail: [] as string[],
    publishTime: '',
    endTime: '',
  });
  const updateForm = (key: string, value: any) => {
    let obj = form as any, paths;
    for (let i = 0; i < (paths = key.split('.')).length - 1; i++) {
      obj = (form as any)[paths[i]];
    }
    const lastPath = paths[paths.length-1];
    obj[lastPath] = value;

    let validater;
    if (lastPath === 'publishTime' &&
      (validater = validaters[lastPath as keyof typeof validaters])
    ) {
      validater();
    }
  };
  const createHomework = async () => {
    const result = await createHomeworkService(form as any);
    handleFinish(result);
  };
  const updateHomework = async () => {
    const result = await updateHomeworkService(form as any);
    handleFinish(result);
  };
  const handleFinish = (result: any) => {
    if (result) {
      if (backWhenFinish.value) {
        history.back();
        setBackWhenFinish(false);
      } else {
        if (isEdit.value) {
          detailRoute.push({
            params: {
              homeworkId: params.homeworkId,
            },
          });
        } else {
          listRoute.push({
            params: {
              workbookId: form.workbook.id,
            },
          });
        }
      }
    }
  };
  const validaters = {
    title() {
      if (!form.title) {
        errorMsg.title = '请输入作业名称';
      } else {
        errorMsg.title = '';
      }
    },
    detail() {
      if (form.detail.length) {
        errorMsg.detail = form.detail.map(item => {
          if (item.mediaType === MEDIA_ITEM_TYPE.RICHTEXT &&
            !item.richTextItem?.content
          ) {
            return '请布置作业内容';
          } {
            return '';
          }
        });
      } else {
        errorMsg.detail = [];
      }
    },
    publishTime() {
      if (form.publishSettings.enableTimer && !form.publishSettings.publishTime) {
        errorMsg.publishTime = '请选择发布时间';
      } else {
        errorMsg.publishTime = '';
      }
    },
    endTime() {
      let publishTime, endTime;
      if (form.publishSettings.enableTimer &&
        (publishTime = form.publishSettings.publishTime) &&
        (endTime = form.publishSettings.endTime) &&
        new Date(endTime).getTime() <= new Date(publishTime).getTime()
      ) {
        Toast(errorMsg.endTime = '截止时间需晚于发布时间');
      } else {
        errorMsg.endTime = '';
      }
    },
  };
  const validate = () => {
    for (let validater of Object.values(validaters)) {
      validater();
    }
    const hasError = Object.keys(errorMsg).some(key => {
      const value = (errorMsg as any)[key]
      if (Array.isArray(value)) {
        return value.some(v => !!v);
      } else {
        return !!value;
      }
    });
    return !hasError;
  };
  const isSubmitting = ref(false);
  const submit = async () => {
    if (!validate()) {
      return;
    }

    isSubmitting.value = true;
    try {
      isEdit.value ? await updateHomework() : await createHomework();
    } finally {
      isSubmitting.value = false;
    }
  };
  const initForm = (homework: Homework) => {
    console.log('初始化表单------------>', homework);
    updateForm('workbook.id', homework.workbook?.id || 0);
    updateForm('title', homework.title);
    updateForm('detail', homework.detail);
    updateForm('publishSettings.enableTimer', homework.publishSettings.enableTimer);
    updateForm('publishSettings.publishTime', homework.publishSettings.publishTime);
    updateForm('publishSettings.endTime', homework.publishSettings.endTime);
    updateForm('reviewSettings.scoreType', homework.reviewSettings.scoreType);
    updateForm('reviewSettings.scoreRule', homework.reviewSettings.scoreRule);
  };

  // init
  if (isEdit.value) {
    fetchEditHomework(Number(params?.homeworkId))
      .then(res => {
        if (res) {
          homeworkDetail.value = res.homework;
          initForm(res.homework);
        } else {
          Toast('获取作业详情失败');
        }
      })
      .catch(errMsg => {
        Toast(errMsg || '获取作业详情失败');
      });
  }

  return {
    isEdit,
    homeworkDetail,

    errorMsg,
    form,
    updateForm,

    isSubmitting,
    submit,
  };
};

export default FormModel;
export const useFormModel = hookOf(FormModel);
