import { React, useState, useEffect, useMemo, useCallback, useRef, createModel } from '@youzan/tany-react';
import { Notify, Dialog, Button } from 'zent';
import qs from 'querystring';
import { IEasyFormInstance } from '@youzan/ebiz-components/es/types/easy-form';
import { IHomeworkDetailDTO, RateType, ScoreRule } from 'domain/homework-domain/types/homework';
import { assignmentCorrectRoute, useAssignmentRouterModel } from '../../../router';
import { parseCorrectDatatoFormData, parseFormData, isCorrectFormEmpty } from '../utils';
import { superDecoder } from '../../../../utils';
import { correctSortMap, emptyFormData, correctDialogId } from '../constants';

import { CorrectPageViewType, CorrectPageSource, ICorrectForm } from '../types';
import { BooleanLike } from '../../../../types';
import CorrectService from 'domain/correct-domain/services';
import { CorrectSubmitType } from 'domain/correct-domain/types';
import { IExerciseDetailItemDTO } from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';

const { openDialog, closeDialog } = Dialog;

const { fetchAssignment, fetchCorrectSiblings, postCorrectReview } = CorrectService;

let intervalFlag;

const handleWindowClose = (e: Event) => {
  e.returnValue = true;
};

const CorrectPageModel = () => {
  const { route } = useAssignmentRouterModel();

  const id = useMemo(() => route.params?.id, [route.params]);

  const [isEdit, toggleIsEdit] = useState(
    assignmentCorrectRoute.query?.viewType !== CorrectPageViewType.VIEW ?? true,
  );
  const [studentName, setStudentName] = useState('加载中...');
  const [homework, setHomework] = useState<IHomeworkDetailDTO>();
  const [homeworkId, setHomeworkId] = useState<number>();
  const [workbookId, setWorkbookId] = useState(route?.query?.workbookId);
  const [answerDetail, setAnswerDetail] = useState<IExerciseDetailItemDTO[]>();
  const [rateType, setRateType] = useState<RateType>();
  const [scoreRule, setScoreRule] = useState(ScoreRule.TEN);
  const [isGoodAssignment, toggleIsGoodAssignment] = useState<BooleanLike>();
  const [authorizedStaffList, setAuthorizedStaffList] = useState<number[]>([]);
  const [formData, setFormData] = useState<ICorrectForm>();
  const [correctData, setCorrectData] = useState<ICorrectForm>();
  const [formLoading, setFormLoading] = useState<boolean>(true);
  const [workbookKdtId, setWorkbookKdtId] = useState<number>();

  // 上一个、下一个信息
  const [viewPrevAssignmentId, setViewPrevAssignmentId] = useState<number>();
  const [viewNextAssignmentId, setViewNextAssignmentId] = useState<number>();
  const [reviewNextAssignmentId, setReviewNextAssignmentId] = useState<number>();

  // 提交表单
  const [submitLoading, toggleSubmitLoading] = useState(false);

  const homeworkTitle = useMemo(() => homework?.title || '', [homework]);

  const formRef = useRef<IEasyFormInstance>(null);

  const recordRef = useRef<any>(null);

  const correctPageViewTypeChangeToEdit = useCallback((isEdit: boolean) => {
    toggleIsEdit(isEdit);
  }, []);

  const [rawPageQuery] = useState(qs.parse(location.search.substr(1)));

  const pageQuery = useMemo(() => {
    const { userId, homeworkId, status, isGoodAssignment, workbookId, source, studentName, title } =
      rawPageQuery || {};

    const reviewerId = Number(rawPageQuery['reviewerId[0]']) || null;
    const publishStartTime = rawPageQuery['publishTimeRange[0][0]'] || null;
    const publishEndTime = rawPageQuery['publishTimeRange[0][1]'] || null;
    const submitStartTime = rawPageQuery['submitTimeRange[0][0]'] || null;
    const submitEndTime = rawPageQuery['submitTimeRange[0][1]'] || null;

    const q = {
      ...rawPageQuery,
      assignmentId: Number(id),
      workbookId: Number(workbookId) || null,
      channel: source === CorrectPageSource.WORKBOOK ? 1 : 2,
      userId: userId && Number(userId),
      homeworkId: homeworkId && Number(homeworkId),
      status: status ? Number(status) : 0,
      reviewerId,
      isGoodAssignment: isGoodAssignment ?? Number(isGoodAssignment),
      title: superDecoder(title as string),
      studentName: superDecoder(studentName as string),
      publishTimeRange: {
        startTime: publishStartTime ? publishStartTime + ' 00:00:00' : null,
        endTime: publishEndTime ? publishEndTime + ' 23:59:59' : null,
      },
      submitTimeRange: {
        startTimeRange: submitStartTime ? submitStartTime + ' 00:00:00' : null,
        endTime: submitEndTime ? submitEndTime + ' 23:59:59' : null,
      },
    };
    return q;
  }, [id, rawPageQuery]);

  useEffect(() => {
    if (isEdit) {
      window.addEventListener('beforeunload', handleWindowClose);
    } else {
      window.removeEventListener('beforeunload', handleWindowClose);
    }
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, [isEdit]);

  useEffect(() => {
    if (isEdit && id && rateType) {
      intervalFlag = setInterval(() => {
        const formValue = formRef && formRef.current?.zentForm?.getValue();
        if (formValue) {
          if (isCorrectFormEmpty(formValue) || workbookKdtId !== _global.kdtId) {
            return;
          }
          postCorrectReview({
            assignmentId: Number(id),
            type: CorrectSubmitType.DRAFT,
            ...parseFormData(rateType, formValue),
          });
        }
      }, 10000);
    } else {
      clearInterval(intervalFlag);
    }
    return () => {
      clearInterval(intervalFlag);
      closeDialog(correctDialogId);
    };
  }, [id, isEdit, rateType, workbookKdtId]);

  useEffect(() => {
    setFormLoading(true);
    setFormData(undefined);
    fetchAssignment({ id: Number(id) })
      .then((assignment) => {
        if (assignment) {
          const {
            hasReviewed,
            homework,
            answerDetail = [],
            reviewDTO,
            studentDTO,
            workbook,
          } = assignment;
          if (hasReviewed === false) {
            // 如果没有被批阅过，进入到“查看批阅”视角，改成批阅状态
            toggleIsEdit(true);
          }
          if (homework) {
            const { rateType, scoreRule, id } = homework;
            setHomework(homework);
            setScoreRule(scoreRule);
            setRateType(rateType);
            setHomeworkId(id);

            if (answerDetail) {
              setAnswerDetail(answerDetail);
            }
            if (rateType && reviewDTO) {
              const correctDraft = reviewDTO?.draft || {};
              const correctDetail = reviewDTO?.comment || {};

              const { isGoodAssignment } = correctDraft;

              toggleIsGoodAssignment(isGoodAssignment);

              const formData = parseCorrectDatatoFormData(correctDraft, rateType);
              // setFormLoading(false);
              // if (hasReviewed === false || isEdit) {
              //   console.log('setFormdata', formData);
              //   formRef.current && formRef.current.patchValue(formData);
              // }

              const correctData = parseCorrectDatatoFormData(correctDetail, rateType);
              setFormData(formData);
              setCorrectData(correctData);
            } else {
              // setFormLoading(false);
              // if (isEdit) {
              //   formRef.current && formRef.current.patchValue(emptyFormData);
              // }
              // console.log('hasnot reviewed, patch empty');
              setFormData(emptyFormData);
              setCorrectData(emptyFormData);
            }
            setStudentName(studentDTO?.name || studentDTO?.mobile || '匿名用户');
          }

          const teacherList = workbook?.teacherList || [];
          setAuthorizedStaffList(teacherList.map((teacher) => teacher.teacherId));
          setWorkbookKdtId(workbook.kdtId);
          return workbook;
        }
      })
      .then((workbook) => {
        const workbookId = workbook?.id;
        setWorkbookId(String(workbookId));
        if (workbookId) {
          // @ts-ignore
          const orderBy = pageQuery?.sortBy || null;
          // @ts-ignore
          const order = pageQuery?.sortType || null;
          return fetchCorrectSiblings({
            ...pageQuery,
            orderBy: orderBy && correctSortMap[orderBy],
            order: order && order.toUpperCase(),
            workbookId,
          } as any);
        }
      })
      .then((res) => {
        const { viewPrevAssignmentId, viewNextAssignmentId, reviewNextAssignmentId } =
          res || {};
        setViewPrevAssignmentId(viewPrevAssignmentId);
        setViewNextAssignmentId(viewNextAssignmentId);
        setReviewNextAssignmentId(reviewNextAssignmentId);
      })
      .catch((e) => {
        Notify.error(e || '获取批阅详情失败，请稍后重试');
      })
      .finally(() => {
        setFormLoading(false);
      });
  }, [id, pageQuery]);

  useEffect(() => {
    if (isEdit && !formLoading && formData) {
      formRef.current && formRef.current.zentForm.patchValue(formData);
    }
  }, [formData, formLoading, isEdit]);

  // 批阅部分
  const getPageUrl = useCallback((query) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { source, viewType, ...newQuery } = query || {};

    // 去掉reviewerId，不回填这个（异步select组件选中值为list）
    delete newQuery['reviewerId%5B0%5D'];

    const querystring = qs.stringify(newQuery);

    switch (source) {
      case CorrectPageSource.WORKBOOK:
        // workbookStudentAssignmentListRoute.push({ query });
        return `/v4/vis/supv/homework/assignment/list?${querystring}`;
      case CorrectPageSource.HOMEWORK:
        // homeworkStudentAssignmentsRoute.push({ params: { id: homeworkId }, query });
        return `/v4/vis/supv/homework/work/${homeworkId}/assignments?${querystring}`;
      default:
    }
  }, [homeworkId]);

  const afterSubmit = useCallback(
    (nextId?: string | number, edit?: boolean) => {
      if (nextId) {
        const { query = {} as any } = route;
        setFormLoading(true);
        if (!edit) {
          toggleIsEdit(false);
        }
        assignmentCorrectRoute.replace({
          params: { id: String(nextId) },
          query: {
            ...query,
            viewType: edit ? 'edit' : 'view',
          },
        });
      } else {
        const { query = {} as any } = route;
        const redirectLink = getPageUrl(query);

        redirectLink && location.replace(redirectLink);
      }
    },
    [getPageUrl, route],
  );

  const postCorrect = useCallback(formData => {
    if (rateType && formData) {
      toggleSubmitLoading(true);
      postCorrectReview({
        assignmentId: Number(id),
        type: CorrectSubmitType.NORMAL,
        ...parseFormData(rateType, formData),
      })
        .then((res) => {
          if (res) {
            Notify.success('批阅成功');
            afterSubmit(reviewNextAssignmentId);
          }
        })
        .catch((e) => {
          Notify.error(e || '提交批阅失败，请稍后重试');
        })
        .finally(() => {
          toggleSubmitLoading(false);
          closeDialog(correctDialogId);
        });

      // 批阅埋点
      const { media } = formData;
      const { image = [], audio = [], video = [] } = media;

      window.Logger && window.Logger.log({
        et: 'click',
        ei: 'submit_correct',
        en: '提交批阅（非草稿）',
        pt: 'homeworkCorrect',
        params: {
          video_cnt: video.length,
          kdt_id: _global.kdtId,
          image_cnt: image.length,
          audio_cnt: audio.length,
        },
      });
    }
  }, [afterSubmit, id, rateType, reviewNextAssignmentId]);

  const handleSubmit = useCallback(
    (form: IEasyFormInstance) => {
      const formData = form.zentForm?.getValue() as any;

      if (formData && rateType) {
        // 如果没有填写评语或上传多媒体
        const { comment, media } = formData;
        const { image = [], audio = [], video = [] } = media;
        if (
          !comment &&
          image.length === 0 &&
          video.length === 0 &&
          audio.length === 0
        ) {
          Notify.error('请完成点评内容');
          return;
        }

        if (image.length > 9) {
          Notify.error('最多添加9张图片');
          return;
        }
        if (video.length > 9) {
          Notify.error('最多添加9个视频');
          return;
        }
        if (audio.length > 9) {
          Notify.error('最多添加9段音频');
          return;
        }

        // 防止跳页弹窗提示
        window.removeEventListener('beforeunload', handleWindowClose);

        const { isPause, isRecording } = recordRef?.current?.value || {};
        const shouldOpen = isPause || isRecording;

        if (shouldOpen) {
          openDialog({
            dialogId: correctDialogId,
            title: '提示',
            maskClosable: false,
            children: `正在录音中，确认提交后当前录音将不会被保存。是否确认提交？`,
            footer: (
              <div>
                <Button onClick={() => closeDialog(correctDialogId)}>取消</Button>
                <Button loading={submitLoading} type="primary" onClick={() => postCorrect(formData)}>
                  提交
                </Button>
              </div>
            ),
          });
        } else {
          postCorrect(formData);
        };
      }
    },
    [postCorrect, rateType, submitLoading],
  );

  const onCancel = useCallback(
    (needSave: boolean, nextId?: number | string) => {
      window.removeEventListener('beforeunload', handleWindowClose);

      if (needSave) {
        setFormLoading(true);
        const formValue = formRef && formRef.current?.zentForm.getValue();
        if (formValue && rateType) {
          if (isCorrectFormEmpty(formValue)) {
            afterSubmit(nextId, false);
            closeDialog(correctDialogId);
            return;
          }
          postCorrectReview({
            assignmentId: Number(id),
            type: CorrectSubmitType.DRAFT,
            ...parseFormData(rateType, formValue),
          })
            .then((res) => {
              if (res) {
                afterSubmit(nextId, false);
              }
            })
            .catch(e => {
              Notify.error(e || '提交批阅草稿失败');
              afterSubmit(nextId, false);
            })
            .finally(() => {
              setFormLoading(false);
              toggleSubmitLoading(false);
            });
        }
      } else if (nextId) {
        afterSubmit(nextId, false);
      } else {
        const { query = {} as any } = route;

        const redirectLink = getPageUrl(query);

        redirectLink && location.replace(redirectLink);
      };
      closeDialog(correctDialogId);
    },
    [route, getPageUrl, formRef, id, rateType, afterSubmit],
  );

  const handleLeave = useCallback((nextId?: number | string) => {
    const formValue = formRef && formRef.current?.zentForm?.getValue();
    const formNotEmpty = formValue && !isCorrectFormEmpty(formValue);

    if (isEdit && formNotEmpty) {
      const { isPause, isRecording } = recordRef?.current?.value || {};
      const recording = isPause || isRecording;

      const text = recording
        ? `正在录音中，确定后当前录音将不会被保存。是否确认${nextId ? '离开当前页面' : '返回列表'}？`
        : `当前批阅内容还未提交，确认${nextId ? '离开当前页面' : '返回列表'}吗？`;

      openDialog({
        dialogId: correctDialogId,
        title: '提示',
        maskClosable: false,
        children: text,
        footer: (
          <div>
            <Button onClick={() => closeDialog(correctDialogId)}>取消</Button>
            <Button type="primary" onClick={() => onCancel(true, nextId)}>
              确定
            </Button>
          </div>
        ),
      });
    } else {
      onCancel(false, nextId);
    }
  }, [onCancel, isEdit]);

  return {
    assignmentId: id,
    workbookId,
    route,
    formRef,
    formData,
    correctData,
    formLoading,
    studentName,
    homework,
    homeworkTitle,
    answerDetail,
    isEdit,
    homeworkId,
    workbookKdtId,
    correctPageViewTypeChangeToEdit,
    authorizedStaffList,
    rateType,
    scoreRule,
    isGoodAssignment,
    viewPrevAssignmentId,
    viewNextAssignmentId,
    reviewNextAssignmentId,
    pageQuery,
    // 批阅相关
    handleSubmit,
    handleLeave,
    afterSubmit,
    submitLoading,
    recordRef,
  };
};

export default createModel(CorrectPageModel);
