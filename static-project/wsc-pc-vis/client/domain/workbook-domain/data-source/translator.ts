import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import accMul from '@youzan/utils/number/accMul';
import accDiv from '@youzan/utils/number/accDiv';
import {
  IWorkbookFormAdd,
  IWorkbookFormEdit,
  BooleanLike,
  IWorkbookListData,
  IWorkbookSummaryData,
  visibleOccasionType,
  visibleRangeType,
  IWorkbookRelClassPageDTO,
  joinLimit,
} from '../types';
import { IExerciseBookDTO } from 'definitions/api/owl/pc/ExerciseBookFacade/getExerciseBookDetail';
import { IExerciseBookPageDTO } from 'definitions/api/owl/pc/ExerciseBookFacade/findPageByCondition';
import { IExerciseBookOverviewDTO } from 'definitions/api/owl/pc/ExerciseBookStatisticsFacade/getExerciseBookOverview';
import { IExerciseRelClassPageDTO } from 'definitions/api/owl/pc/ExerciseBookFacade/findExerciseRelClassPage';

/** 编辑作业本 - 后端接口数据转化为表单数据 */

export const workbookDataToFormData = (workbookData: IExerciseBookDTO): IWorkbookFormEdit => {
  const {
    id,
    alias,
    title,
    infoCollect,
    joinSetting,
    kdtId,
    studentViewWorkScope,
    status,
    studentViewOtherWorkType,
    teacherList,
  } = workbookData || {};
  // const transformedDetail = rawDetail?.map(item => ({
  //   type: item.mediaType,
  //   detail: item.detail,
  //   order: item.serialNo,
  // }));
  const needInfoCollect = infoCollect?.open ?? BooleanLike.False;
  const joinType = {
    type: joinSetting?.joinType,
    eduClass: joinSetting?.eduClass,
  };

  return {
    id,
    alias,
    title,
    needInfoCollect,
    // @ts-ignore
    infoCollect,
    joinType,
    kdtId,
    visibleOccasion: String(studentViewOtherWorkType) as visibleOccasionType,
    visibleRange: String(studentViewWorkScope) as visibleRangeType,
    status,
    teacherList,
  };
};

/** 新建/编辑作业本 - 表单数据转化为提交到后端的数据格式 */

export const formToWorkbookData = (formData: IWorkbookFormEdit | IWorkbookFormAdd): Partial<IExerciseBookDTO> => {
  const {
    title,
    needInfoCollect,
    infoCollect: formInfoCollect,
    joinType,
    visibleOccasion,
    visibleRange,
    teacherList,
  } = formData;

  // @ts-ignore
  const id = formData?.id;

  const infoCollect = {
    ...formInfoCollect,
    attributeIds: needInfoCollect === BooleanLike.True ? formInfoCollect?.attributeIds : [],
    open: needInfoCollect,
  };

  const userJoinType = joinType.type;

  const joinSetting = {
    ...joinType,
    joinType: userJoinType,
  };

  return omitBy(
    {
      id,
      title,
      infoCollect: userJoinType === joinLimit.boundClass // 关联班级不传信息采集
        ? null
        : infoCollect,
      joinSetting,
      studentViewOtherWorkType: Number(visibleOccasion),
      studentViewWorkScope: Number(visibleRange),
      teacherList,
    },
    (val) => isNil(val) || val === '',
  );
};

/** 作业本列表数据 */

export const parseListData = (data: IExerciseBookPageDTO[]): IWorkbookListData[] => {
  return data?.map((item) => {
    const {
      homeworkNum,
      kdtId,
      createTime,
      alias,
      submitNum,
      teacherList,
      id,
      title,
      studentNum,
      status,
      joinSetting,
    } = item;
    return {
      id,
      alias,
      title,
      kdtId,
      assignmentNum: homeworkNum,
      joinStudentNum: studentNum,
      submitStudentNum: submitNum,
      teacherList,
      createdAt: createTime,
      status,
      joinSetting,
    };
  });
};

/** 作业本概览数据 */

export const parseWorkbookSummary = (data: IExerciseBookOverviewDTO): IWorkbookSummaryData => {
  const { homeworkNum = 0, toReviewNum = 0, id, title, studentNum = 0, subNum = 0, kdtId } = data || {};

  return {
    assignmentNum: homeworkNum,
    awaitMarkingNum: toReviewNum,
    id,
    title,
    studentNum,
    subNum,
    submitRate: homeworkNum <= 0 || studentNum <= 0
      ? '0'
      : accMul(accDiv(subNum, homeworkNum * studentNum), 100).toFixed(0),
    kdtId,
  };
};

/** 班级关联的作业本信息解析 */

export const parseEduClassWorkbookList = (data: IExerciseRelClassPageDTO[]): IWorkbookRelClassPageDTO[] => {
  return data?.map(workbook => {
    const { title, exerciseBookId } = workbook || {};

    return {
      title,
      workbookId: exerciseBookId,
    };
  });
};
