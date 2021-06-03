import { computed, onMounted, onUnmounted, ref } from '@youzan/tany-vue';
import { useAppModel } from 'supv/homework/App.model';
import { useRouter, detailRoute, workbookRoute, assignmentRoute } from 'supv/homework/router';

import HomeworkService from '@/domain/homework-domain/services';
import AssignmentService from '@/domain/assignment-domain/services';
import WorkbookService from '@/domain/workbook-domain/services';
import { IUserAssignmentDTO } from 'definitions/api/owl/api/UserExerciseFacade/getStudentAssignment';

import { Toast } from 'vant';
// @ts-ignore
import { openStudentChoosePopup } from '../../components/student-choose-popup/index.vue';

import { initWXSdk } from '@youzan/wxsdk';
import { format } from 'date-fns';

initWXSdk();

const AppModel = () => {
  const { route } = useRouter();
  const {
    mainColor,
    track,
  } = useAppModel();
  track.collect('homework:pageType', 'homework');
  const kdtId = Number(route.value.query.kdt_id);
  window._global.kdt_id = kdtId;
  const alias = computed(() => route.value.query.alias);
  const assignmentId = computed(() => Number(route.value.query.assignmentId));
  const studentId = computed(() => Number(route.value.query.studentId));
  const assignment = ref<IUserAssignmentDTO | null>(null);
  const submitted = ref(false);
  const setSubmitted = (v: boolean) => {
    // 只会在提交作业的时候被触发
    assignmentRoute.redirectTo({
      query: {
        assignmentId: assignment.value?.assignmentId,
        studentId: studentId.value,
        kdt_id: kdtId,
      },
    });
    submitted.value = v;
  };
  const deadline = ref<Date | undefined>();
  const isOvertime = ref(false);
  const loaded = ref(false);
  // 获取数据后的学员作业id
  const loadedAssignmentId = ref(0);

  const showWriteHomeworkPopup = ref(false);
  const setShowWriteHomeworkPopup = (v: boolean) => {
    showWriteHomeworkPopup.value = v;
  };
  const isSelfHomework = ref(false);
  const isPublished = ref(false);
  const targetKdtId = ref(0);
  const workbookDeleted = ref(false);
  const buttonText = computed(() => {
    if (isPublished.value) {
      if ((assignment.value?.homework.deadline &&
        new Date(assignment.value?.homework.deadline) < new Date()) ||
        isOvertime.value) {
        return '已截止提交';
      } else {
        if (submitted.value) {
          return '重新编辑';
        } else {
          return '写作业';
        }
      }
    } else {
      return '作业未发布';
    }
  });
  const descText = computed(() => {
    if (isPublished.value) {
      return assignment.value?.homework.publishTime ? `发布于 ${format(assignment.value?.homework.publishTime, 'YYYY-MM-DD HH:mm')}` : '';
    } else {
      return assignment.value?.homework.publishTime ? `${format(assignment.value?.homework.publishTime, 'YYYY-MM-DD HH:mm')}发布` : '';
    }
  });
  const isActionable = computed(() => {
    return !((assignment.value?.homework.deadline &&
      new Date(assignment.value?.homework.deadline) < new Date()) ||
      isOvertime.value || !isPublished.value);
  });

  // eslint-disable-next-line no-mixed-operators
  if (assignmentId.value && studentId.value || alias.value && studentId.value) {
    AssignmentService.getAssignment(studentId.value, assignmentId.value, alias.value, { withErrorCode: true })
      .then((assignmentDTO) => {
        document.title = assignmentDTO.homework.title;
        WorkbookService.getWorkbookDetail({ alias: assignmentDTO.exercise.alias })
          .then(workbook => {
            if (workbook.hasJoined) {
              const idx = workbook.studentList.findIndex(student => student.id === studentId.value);
              if (idx !== -1) {
                isSelfHomework.value = true;
              }
            }
          })
          .catch((e: string) => {
            Toast(e);
          });
        loadedAssignmentId.value = assignmentDTO.assignmentId;
        assignment.value = assignmentDTO;
        loaded.value = true;
        submitted.value = !!assignmentDTO.submitTime;
        deadline.value = assignmentDTO.homework.deadline ? new Date(assignmentDTO.homework.deadline) : undefined;
        targetKdtId.value = assignmentDTO.kdtId;
        if (assignmentDTO.homework.timerPublish) {
          if (new Date() > new Date(assignmentDTO.homework.publishTime)) {
            isPublished.value = true;
          }
        } else {
          isPublished.value = true;
        }
      })
      .catch((e: {code: number; msg: string;}) => {
        loaded.value = true;
        if (e.code === 323010001) {
          workbookDeleted.value = true;
        } else {
          Toast(e.msg);
        }
      });
  } else if (alias.value) { // B端分享作业过来的
    HomeworkService.getHomeworkDetail(alias.value, { withErrorCode: true })
      .then((homeworkDTO) => {
        if (homeworkDTO.exerciseBook.ownAsset) {
          if (homeworkDTO.exerciseBook.studentList.length === 1) {
            detailRoute.redirectTo({
              query: {
                alias: alias.value,
                studentId: homeworkDTO.exerciseBook.studentList[0].userId,
                kdt_id: homeworkDTO.exerciseBook.kdtId,
              },
            });
          } else if (homeworkDTO.exerciseBook.studentList.length > 1) {
            openStudentChoosePopup({
              props: {
                studentList: homeworkDTO.exerciseBook.studentList,
              },
            }).then((studentId: number) => {
              detailRoute.redirectTo({
                query: {
                  alias: alias.value,
                  studentId,
                  kdt_id: homeworkDTO.exerciseBook.kdtId,
                },
              });
            });
          } else {
            Toast('网络异常');
          }
        } else {
          workbookRoute.push({
            query: {
              homeworkAlias: alias.value,
              isShare: 1,
              alias: homeworkDTO.exerciseBook.alias,
              kdt_id: homeworkDTO.exerciseBook.kdtId,
            },
          });
        }
      }).catch((e: {code: number; msg: string;}) => {
        loaded.value = true;
        if (e.code === 323010001) {
          workbookDeleted.value = true;
        } else {
          Toast(e.msg);
        }
      });
  } else {
    Toast('页面参数错误');
  }

  let timer: number | undefined;
  onMounted(() => {
    setTimeout(() => {
      if (assignment.value?.homework.deadline) {
        timer = setInterval(() => {
          if (assignment.value?.homework.deadline &&
            new Date(assignment.value?.homework.deadline) < new Date()
          ) {
            isOvertime.value = true;
            clearInterval(timer);
          }
        }, 1000);
      }
    }, 3000);
  });
  onUnmounted(() => {
    clearInterval(timer);
  });

  return {
    mainColor,

    assignment,
    showWriteHomeworkPopup,
    setShowWriteHomeworkPopup,
    assignmentId,
    studentId,
    submitted,
    setSubmitted,
    deadline,
    isOvertime,
    loaded,
    loadedAssignmentId,
    isSelfHomework,
    isPublished,
    targetKdtId,
    buttonText,
    isActionable,
    descText,
    workbookDeleted,
  };
};

export default AppModel;
