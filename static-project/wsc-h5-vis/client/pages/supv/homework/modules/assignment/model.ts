import { computed, hookOf, reactive, ref } from '@youzan/tany-vue';
import { useRouter, communicationRegionRoute } from '../../router';
import { useAppModel } from '../../App.model';

import AssignmentService from '@/domain/assignment-domain/services/index';
import WorkbookService from '@/domain/workbook-domain/services/index';

import { IMediaBlock } from 'vis-shared/components/supv/homework/media-container';
import { HomeworkScoreRuleEnum, HomeworkScoreStyleEnum } from 'vis-shared/components/supv/homework/homework-score';
import { Toast } from 'vant';
import { IUserAssignmentDTO } from 'definitions/api/owl/api/UserExerciseFacade/getStudentAssignment';

import { initWXSdk } from '@youzan/wxsdk';

initWXSdk();

const AssignmentModuleModel = () => {
  // hack方法，推入一个空的state
  // 用户配合mediaContainer playVideoInAnotherPage={true}
  // 需求在 https://shimo.im/sheets/dvyQHVWHhRcjgjqT/7FIMp 第8行
  history.pushState('', document.title, null);

  const { route } = useRouter();
  window._global.kdt_id = Number(route.value.query.kdt_id);

  const {
    track,
  } = useAppModel();
  track.collect('homework:pageType', 'assignment');
  const loaded = ref(false);
  const assignmentId = computed(() => route.value.query.assignmentId);
  const studentId = computed(() => route.value.query.studentId);
  const hasCorrected = ref(false);
  const homeworkDetailInfo = reactive<{
    title: string;
    publishDate: Date;
    mediaBlocks: IMediaBlock[];
  }>({
    title: '',
    publishDate: new Date(),
    mediaBlocks: [],
  });

  const assignmentInfo = reactive<{
    name: string;
    commitDate: Date;
    avatar: string;
    scoreRule: HomeworkScoreRuleEnum;
    scoreStyle: HomeworkScoreStyleEnum;
    score: number | string;
    isExcellent: boolean;
    mediaBlocks: IMediaBlock[];
    hasCorrected: boolean;
    deadline?: Date;
    draft: IMediaBlock[];
    targetKdtId: number;
  }>({
    name: '',
    commitDate: new Date(),
    avatar: '',
    scoreRule: HomeworkScoreRuleEnum.HUNDRED,
    scoreStyle: HomeworkScoreStyleEnum.GRADE,
    score: '',
    isExcellent: false,
    mediaBlocks: [],
    hasCorrected: false,
    deadline: undefined,
    draft: [],
    targetKdtId: 0,
  });

  const correctInfo = reactive<{
    correctDate: Date;
    mediaBlocks: IMediaBlock[];
  }>({
    correctDate: new Date(),
    mediaBlocks: [],
  });

  const bottomOperationInfo = reactive<{
    avatars: string[];
  }>({
    avatars: [],
  });

  const assignmentData = ref<IUserAssignmentDTO | undefined>(undefined);

  const homeworkAlias = ref('');

  const operationsLoaded = ref(false);
  const isJoined = ref(false);
  const isSelfHomework = ref(false);
  const workbookDeleted = ref(false);
  const isCanWatchOtherHomework = ref(false);

  if (assignmentId.value && studentId.value) {
    AssignmentService
      .getAssignment(Number(studentId.value), Number(assignmentId.value), undefined, { withErrorCode: true })
      .then(assignment => {
        document.title = assignment.homework.title;
        assignmentData.value = assignment;
        WorkbookService.getWorkbookDetail({ alias: assignment.exercise.alias })
          .then(workbook => {
            if (workbook.hasJoined) {
              isJoined.value = true;
              const idx = workbook.studentList.findIndex(s => s.id === Number(studentId.value));
              if (idx !== -1) {
                isSelfHomework.value = true;
              }

              AssignmentService.getOtherStudentInfo({ assignmentId: assignment.assignmentId })
                .then((studentList) => {
                  bottomOperationInfo.avatars = studentList.map((student) => student.avatar);
                  operationsLoaded.value = true;
                })
                .catch((e: string) => {
                  Toast(e);
                });
            } else {
              operationsLoaded.value = true;
            }
          }).catch((e: string) => {
            Toast(e);
          });
        hasCorrected.value = assignment.hasReviewed;
        assignmentInfo.hasCorrected = assignment.hasReviewed;
        if (assignment.exercise.studentViewOtherWorkType === 1 ||
          (assignment.exercise.studentViewOtherWorkType === 2 && assignment.hasReviewed)) {
          isCanWatchOtherHomework.value = true;
        }

        homeworkDetailInfo.title = assignment.homework.title;
        homeworkDetailInfo.publishDate = new Date(assignment.homework.publishTime);
        homeworkDetailInfo.mediaBlocks = assignment.homework.detail;

        assignmentInfo.avatar = assignment.studentDTO.avatar;
        assignmentInfo.commitDate = new Date(assignment.submitTime);
        assignmentInfo.mediaBlocks = assignment.answerDetail;
        assignmentInfo.name = assignment.studentDTO.name;
        assignmentInfo.scoreRule = assignment.homework.scoreRule;
        assignmentInfo.scoreStyle = assignment.homework.scoreStyle;
        assignmentInfo.deadline = assignment.homework.deadline ? new Date(assignment.homework.deadline) : undefined;
        assignmentInfo.draft = assignment.answerDraft;
        assignmentInfo.targetKdtId = assignment.kdtId;

        if (assignment.hasReviewed) {
          assignmentInfo.score = assignment.reviewDTO.comment.score;
          assignmentInfo.isExcellent = Boolean(assignment.reviewDTO.comment.excellentScore);

          correctInfo.correctDate = new Date(assignment.reviewDTO.reviewTime);
          correctInfo.mediaBlocks = assignment.reviewDTO.comment.comment;
        }

        homeworkAlias.value = assignment.homework.alias;
        loaded.value = true;
      }).catch((e: {code: number, msg: string;}) => {
        if (e.code === 323010001) {
          workbookDeleted.value = true;
        } else {
          Toast(e.msg);
        }
      });
  }

  const jumpToCommunicationRegion = () => {
    communicationRegionRoute.push({
      query: {
        homeworkAlias: homeworkAlias.value,
        studentId: studentId.value,
        kdt_id: assignmentInfo.targetKdtId,
      },
    });
  };

  return {
    loaded,
    hasCorrected,
    homeworkDetailInfo,
    assignmentInfo,
    correctInfo,
    bottomOperationInfo,
    operationsLoaded,
    isJoined,
    assignmentId,
    studentId,
    assignmentData,
    isSelfHomework,
    workbookDeleted,
    isCanWatchOtherHomework,

    jumpToCommunicationRegion,
  };
};

export const useAssignmentModuleModel = hookOf(AssignmentModuleModel);
export default AssignmentModuleModel;
