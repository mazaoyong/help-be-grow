import {
  React,
  useState,
  useEffect,
  useMemo,
  useRef,
  createModel,
  useCallback,
} from '@youzan/tany-react';
import { Validators, ValidateOccasion, Notify } from 'zent';

import { EasyFormConfigType, IEasyFormInstance } from '@youzan/ebiz-components/es/types/easy-form';
import Detail from '../components/detail';
import { RateType, ScoreRule } from 'domain/homework-domain/types/homework';
import HomeworkService from 'domain/homework-domain/services';
import WorkbookService from 'domain/workbook-domain/services';

import { useHomeworkRouterModel, homeworkCreateRoute, homeworkEditRoute } from '../../../router';
import { emptyRichTextField } from '../constants';
import type { HomeworkEditPageType } from '../types';
import { BooleanLike, ElementType, IFormElement } from '../../../../types';
import {
  IExerciseDetailItemDTO,
  IRichTextDetailItemDTO,
} from 'definitions/api/owl/pc/HomeworkFacade/getHomeworkDetail';

const getEditPageViewType = (routerRoute): HomeworkEditPageType => {
  if (routerRoute.path === homeworkCreateRoute.path && routerRoute.query?.workbookId) {
    return 'create';
  } else if (routerRoute.path === homeworkEditRoute.path && routerRoute.params?.id) {
    return 'edit';
  }
  return 'unknown';
};

const { onFetchHomeworkData, onCreateHomework, onUpdateHomework } = HomeworkService;

const { getWorkbookDetail } = WorkbookService;

const HomeworkEditModel = () => {
  const { route } = useHomeworkRouterModel();

  const viewType: HomeworkEditPageType = getEditPageViewType(route) || 'initial';

  const homeworkId = route.params?.id;

  const formRef = useRef<IEasyFormInstance>(null);

  const [workbookId, setWorkbookId] = useState(route.query?.workbookId);
  const [submitTotalNum, setSubmitTotalNum] = useState(0);
  const [formLoading, toggleFormLoading] = useState(true);
  const [formData, setFormData] = useState<any>();
  const [isAuthorized, toggleIsAuthorized] = useState(false);

  const showErrorRef = useRef<boolean>();

  // todo: remove
  const [hasPublishTimer, setHasPublishTimer] = useState(0);
  const [rateType, setRateType] = useState(2);

  // 用于预览
  const [title, setTitle] = useState('作业名称');
  const [detail, setDetail] = useState([] as IExerciseDetailItemDTO[]);
  const [publishTime, setPublishTime] = useState('');

  useEffect(() => {
    if (viewType === 'edit' && homeworkId) {
      toggleFormLoading(true);
      onFetchHomeworkData({ homeworkId: Number(homeworkId || '0') })
        .then((res) => {
          if (res) {
            setWorkbookId(String(res.workbookId));
            setTitle(res.title);
            setDetail(res.detail || []);
            setSubmitTotalNum(res.submitTotalNum ?? 0);

            const formData = {
              ...res,
              hasPublishTimer: String(res?.hasPublishTimer || 0),
              scoreRule: String(res?.scoreRule || ScoreRule.HUNDRED),
              rateType: String(res?.rateType || RateType.GRADE),
            };

            // todo: remove
            setHasPublishTimer(res?.hasPublishTimer);
            setRateType(res?.rateType);

            toggleFormLoading(false);
            setFormData(formData);

            return res.workbookId;
          }
        })
        .then((workbookId) => {
          if (workbookId) {
            getWorkbookDetail({ id: Number(workbookId) }).then((workbook) => {
              const teacherIdList = workbook?.teacherList?.map((t) => t.teacherId) || [];
              toggleIsAuthorized(teacherIdList.includes(_global.userId));
            });
          } else {
            Notify.error('查询作业本信息失败，请稍后重试');
          }
        })
        .catch((e) => {
          Notify.error(e || '获取作业详情失败，请稍后刷新重试');
          toggleFormLoading(false);
        });
    } else if (workbookId) {
      getWorkbookDetail({ id: Number(workbookId) }).then((workbook) => {
        const teacherIdList = workbook?.teacherList?.map((t) => t.teacherId) || [];
        toggleIsAuthorized(teacherIdList.includes(_global.userId));
      }).catch((e) => {
        Notify.error(e || '获取作业本信息失败，请稍后刷新重试');
      }).finally(() => {
        toggleFormLoading(false);
      });
    } else {
      // 为了编辑时先获取form状态再initialise
      toggleFormLoading(false);
    }
  }, [homeworkId, viewType, workbookId]);

  useEffect(() => {
    if (formData && !formLoading) {
      formRef.current && formRef.current.zentForm.initialize(formData);
    }
  }, [formData, formLoading]);

  const config: EasyFormConfigType[] | any = useMemo(
    () => [
      {
        name: 'baseInfo',
        type: 'Plain',
        node: <h1>基础信息</h1>,
      },
      {
        name: 'title',
        label: '作业名称',
        type: 'Input',
        required: true,
        inheritProps: {
          width: 240,
          placeholder: '最多可输入40个字',
        },
        validateOccasion: ValidateOccasion.Change,
        validators: [
          Validators.required('请输入作业名称'),
          Validators.maxLength(40, '最多可输入40个字'),
        ],
        onChange: setTitle,
      },
      {
        name: 'detail',
        label: '详情',
        required: true,
        type: 'Custom',
        renderField: Detail,
        inheritProps: {
          ref: showErrorRef,
        },
        defaultValue: [emptyRichTextField],
        onChange: setDetail,
        validators: [
          (detail: IFormElement[]) => {
            const noEmptyRichtext = detail.every(
              (value) =>
                value.mediaType !== ElementType.RichText ||
                (value.mediaType === ElementType.RichText &&
                (value.detail as IRichTextDetailItemDTO).content),
            );
            if (!noEmptyRichtext) {
              return {
                name: 'has empty richtext field',
                message: '',
              };
            }
            return null;
          },
        ],
      },
      {
        name: 'timeSettings',
        type: 'Plain',
        node: <h1 className="new-block">时间设置</h1>,
      },
      {
        name: 'hasPublishTimer',
        label: '定时发布',
        required: true,
        type: 'Radio',
        options: [
          { value: String(BooleanLike.True), text: '开启' },
          { value: String(BooleanLike.False), text: '关闭' },
        ],
        defaultValue: String(BooleanLike.False),
        disabled: !!submitTotalNum,
      },
      {
        name: 'timerPublishAt',
        label: '发布时间',
        required: true,
        type: 'DatePicker',
        inheritProps: {
          showTime: true,
          format: 'YYYY-MM-DD HH:mm:ss',
          min: new Date().getTime(),
          valueType: 'date',
        },
        helpDesc: '在开始时间以前，用户可以看到该作业标题，但是无法查看作业详情。',
        // defaultValue: Math.ceil(curTimestamp / 3600000) * 3600000, // 下一整点
        validateOccasion: ValidateOccasion.Change,
        validators: [
          (value: number, ctx) => {
            const { hasPublishTimer } = ctx.getSectionValue() || {};
            if (hasPublishTimer === String(BooleanLike.False) || submitTotalNum) {
              return null;
            }
            if (!value) {
              return {
                name: 'required publish time',
                message: '请填写定时发布时间',
              };
            }
            if (viewType === 'create' && value < new Date().getTime() + 1) {
              return {
                name: 'invalid publish time',
                message: '发布时间不能早于当前时间',
              };
            }
            return null;
          },
        ],
        visible: !!hasPublishTimer || false,
        watch: {
          hasPublishTimer(value, ctx) {
            ctx.set({
              status: {
                visible: value === String(BooleanLike.True),
              },
            });
          },
        },
        onChange: setPublishTime,
        disabled: !!submitTotalNum,
      },
      {
        name: 'deadlineTime',
        label: '截止时间',
        type: 'DatePicker',
        inheritProps: {
          showTime: true,
          format: 'YYYY-MM-DD HH:mm:ss',
          min: viewType === 'create' ? new Date().getTime() : undefined,
          valueType: 'date',
        },
        helpDesc: '在截止时间以后，用户无法提交作业。',
        // defaultValue: Math.ceil(curTimestamp / 3600000) * 3600000, // 下一整点
        validateOccasion: ValidateOccasion.Change,
        validators: [
          (value: number, ctx) => {
            if (!value || submitTotalNum) {
              return null;
            }
            const { hasPublishTimer, timerPublishAt } = ctx.getSectionValue() || {};
            if (
              hasPublishTimer === String(BooleanLike.True) &&
              timerPublishAt &&
              value < timerPublishAt
            ) {
              return {
                name: 'wrong deadline',
                message: '截止时间需晚于发布时间',
              };
            }
            return null;
          },
          (value: number) => {
            if (!value) {
              return null;
            }
            if (viewType === 'create' && value < new Date().getTime() + 1) {
              return {
                name: 'invalid deadline time',
                message: '截止时间不能早于当前时间',
              };
            }
            return null;
          },
        ],
      },
      {
        name: 'markSettings',
        type: 'Plain',
        node: <h1 className="new-block">评分设置</h1>,
      },
      {
        name: 'rateType',
        label: '评分机制',
        required: true,
        type: 'Radio',
        options: [
          { value: String(RateType.GRADE), text: '等第制' },
          { value: String(RateType.POINT), text: '分数制' },
        ],
        defaultValue: String(RateType.GRADE),
        disabled: !!submitTotalNum,
      },
      {
        name: 'scoreRule',
        label: '计分规则',
        required: true,
        type: 'Radio',
        options: [
          { value: String(ScoreRule.TEN), text: '十分制' },
          { value: String(ScoreRule.HUNDRED), text: '百分制' },
        ],
        defaultValue: String(ScoreRule.TEN),
        visible: rateType === RateType.POINT || false,
        disabled: !!submitTotalNum,
        watch: {
          rateType(value, ctx) {
            ctx.set({
              status: {
                visible: value === String(RateType.POINT),
              },
            });
          },
        },
      },
    ],
    [hasPublishTimer, rateType, submitTotalNum, viewType],
  );

  const onShowErrorChange = useCallback((val: boolean) => {
    showErrorRef.current = val;
  }, []);

  return {
    title,
    detail,
    publishTime,
    formLoading,
    homeworkId,
    viewType,
    config,
    formRef,
    onCreateHomework,
    onUpdateHomework,
    workbookId,
    isAuthorized,
    onShowErrorChange,
  };
};

export default createModel(HomeworkEditModel);
