import { ref, reactive, Ref, computed } from '@youzan/tany-vue';
import { format } from 'date-fns';
import {
  SCORE_RULE,
  SCORE_TYPE,
} from 'domain/supv/homework/constants';
import { useFormModel } from '../../models/form';

const SettingsModel = () => {
  const { homeworkDetail } = useFormModel();

  const disabled = computed(() => !!homeworkDetail.value.submitAndExitCount);

  return {
    disabled,
    ...PublishSettingsModel(),
    ...ReviewSettingsModel(),
  };
};

const PublishSettingsModel = () => {
  const { form, errorMsg, updateForm } = useFormModel();
  const publishSettings = form.publishSettings;

  const formatDate = (date: Date) => {
    return format(date, 'YYYY[年]MM[月]DD[日] HH:mm');
  };
  const publishAtValue = computed(
    () => publishSettings?.publishTime
      ? formatDate(new Date(publishSettings?.publishTime || '')) : '请选择'
  );
  const endAtValue = computed(
    () => publishSettings?.endTime
      ? formatDate(new Date(publishSettings?.endTime || '')) : '请选择'
  );
  const setPublishType = (type: boolean) => {
    updateForm('publishSettings.enableTimer', type);
  };
  const setPublishAt = (date: Date) => {
    updateForm('publishSettings.publishTime', date);
  };
  const publishTimeErrMsg = computed(() => {
    return errorMsg['publishTime'];
  });
  const showPublishTimeErrorMsg = computed(() => {
    return !!publishTimeErrMsg.value;
  });
  const setEndAt = (date: Date) => {
    updateForm('publishSettings.endTime', date);
  };
  const clearEndAt = (e: Event) => {
    e.stopPropagation();
    updateForm('publishSettings.endTime', '');
  };
  const ifShowPublishAtCell = (cell: any) => {
    return publishSettings?.enableTimer ? cell : null;
  };

  // date picker model
  const initPickerModel = (
    targetSetter?: (date: Date) => void,
    prevDate?: Date,
    minDate?: Date,
    maxDate?: Date,
  ) => {
    const now = new Date();
    const currentDate = prevDate || now;
    minDate = minDate || now;

    const model = reactive({
      currentDate,
      minDate,
      maxDate,
      setCurrentDate: (date: Date) => {},
      confirmPickDate: (date: Date) => {},
    });

    model.setCurrentDate = (date: Date) => {
      console.log('setCurrentDate', date);
      model.currentDate = date;
    };

    model.confirmPickDate = (date: Date) => {
      console.log('confirmPickDate', date, targetSetter);
      closeDatePickerPopup();

      targetSetter && targetSetter(date);
    };

    return model;
  };
  const datePicker = ref(initPickerModel());
  const showDatePickerPopup = ref(false);
  const openDatePickerPopup = (type: 'publishAt' | 'endAt') => {
    showDatePickerPopup.value = true;

    if (type === 'publishAt') {
      datePicker.value = initPickerModel(
        setPublishAt,
        new Date(publishSettings?.publishTime || Date.now()),
      )
    } else {
      datePicker.value = initPickerModel(
        setEndAt,
        new Date(publishSettings?.endTime || Date.now()),
      )
    }
  };
  const closeDatePickerPopup = () => {
    showDatePickerPopup.value = false;
  };

  return {
    publishSettings,
    publishAtValue,
    publishTimeErrMsg,
    showPublishTimeErrorMsg,
    endAtValue,
    clearEndAt,
    setPublishType,
    ifShowPublishAtCell,

    datePicker,
    showDatePickerPopup,
    closeDatePickerPopup,
    openDatePickerPopup,
  };
};

const ReviewSettingsModel = () => {
  const { form, updateForm } = useFormModel();

  const scoreTypeOptions = [
    { name: '等第制', value: SCORE_TYPE.LEVEL },
    { name: '分数制', value: SCORE_TYPE.SCORE },
  ];
  const scoreRuleOptions = [
    { name: '十分制', value: SCORE_RULE.TEN },
    { name: '百分制', value: SCORE_RULE.HUNDREDS },
  ];
  const reviewSettings = form.reviewSettings;
  const scoreTypeValue = computed(() => {
    return scoreTypeOptions
      .filter(
        action => action.value === reviewSettings?.scoreType
      )[0].name;
  });
  const scoreRuleValue = computed(() => {
    if (reviewSettings?.scoreRule) {
      return scoreRuleOptions
        .filter(
          action => action.value === reviewSettings?.scoreRule
        )[0].name;
    } else {
      return '';
    }
  });
  const setScoreRule = (rule: SCORE_RULE) => {
    updateForm('reviewSettings.scoreRule', rule);
  };
  const setScoreType = (type: SCORE_TYPE) => {
    updateForm('reviewSettings.scoreType', type);

    if (type === SCORE_TYPE.SCORE) {
      setScoreRule(reviewSettings?.scoreRule || SCORE_RULE.TEN);
    }
  };
  const isScore = computed(() => reviewSettings?.scoreType === SCORE_TYPE.SCORE);
  const ifShowRuleCell = (cell: any) => isScore.value ? cell : null;

  // action sheet model
  interface Action {name:string;value:any}
  const initActionSheetModel = (
    targetSetter?: (value: any) => void,
    title?: string,
    options?: Action[],
  ) => {

    return {
      title,
      options,
      onSelect: (action: Action) => {
        closeActionSheet();
        targetSetter && targetSetter(action.value);
      },
    };
  }
  const actionSheet = ref(initActionSheetModel())
  const showActionSheet = ref(false);
  const openActionSheet = (target: 'type' | 'rule') => {
    showActionSheet.value = true;

    if (target === 'type') {
      actionSheet.value = initActionSheetModel(
        setScoreType,
        '评分机制',
        scoreTypeOptions,
      );
    } else {
      actionSheet.value = initActionSheetModel(
        setScoreRule,
        '计分规则',
        scoreRuleOptions,
      );
    }
  };
  const closeActionSheet = () => showActionSheet.value = false;

  return {
    reviewSettings,
    isScore,
    scoreTypeValue,
    scoreRuleValue,
    setScoreType,
    setScoreRule,
    ifShowRuleCell,

    actionSheet,
    showActionSheet,
    openActionSheet,
    closeActionSheet,
  };
}

export default SettingsModel;
