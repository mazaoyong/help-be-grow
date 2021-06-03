import { computed, Ref, ref, watch } from '@youzan/tany-vue';

import AssignmentService from '@/domain/assignment-domain/services';

import { Toast } from 'vant';

import { format } from 'date-fns';
import zhCN from 'date-fns/locale/zh_cn';
import { IAssignmentPageDTO } from 'definitions/api/owl/api/UserExerciseFacade/findUserAssignmentPage';

const UncompletedListModel = () => {
  /** 未完成已截止 */
  const totalOvertimeNum = ref(-1);
  const currentOvertimePage = ref(1);
  const currentOvertimeNum = ref(0);
  const isOvertimeListFinished = computed(() => {
    return totalOvertimeNum.value === currentOvertimeNum.value;
  });
  /** 未完成未截止 */
  const totalUnfinishedNum = ref(-1);
  const currentUnfinishedPage = ref(1);
  const currentUnfinishedNum = ref(0);
  const isUnfinishedListFinished = computed(() => {
    return totalUnfinishedNum.value === currentUnfinishedNum.value;
  });

  const totalNum = computed(() => {
    if (totalOvertimeNum.value !== -1 && totalUnfinishedNum.value !== -1) {
      return totalOvertimeNum.value + totalUnfinishedNum.value;
    }
    // 这里随便返回个负数就行
    return -2;
  });
  const currentNum = computed(() => {
    return currentOvertimeNum.value + currentUnfinishedNum.value;
  });
  watch(
    [currentNum, totalNum],
    () => {
      if (currentNum.value === totalNum.value) {
        isUncompletedListFinished.value = true;
      }
    },
  );

  const isUncompletedListFinished = ref(false);
  const setIsUncompletedListFinished = (value: boolean) => {
    isUncompletedListFinished.value = value;
  };
  const isUncompletedListError = ref(false);
  const setIsUncompletedListError = (value: boolean) => {
    isUncompletedListError.value = value;
  };
  const isUncompletedListLoading = ref(false);
  const setIsUncompletedListLoading = (value: boolean) => {
    isUncompletedListLoading.value = value;
  };

  const resetStatus = () => {
    totalOvertimeNum.value = -1;
    currentOvertimeNum.value = 0;
    currentOvertimePage.value = 1;
    totalUnfinishedNum.value = -1;
    currentUnfinishedNum.value = 0;
    currentUnfinishedPage.value = 1;
    isUncompletedListFinished.value = false;
    isUncompletedListError.value = false;
    isUncompletedListLoading.value = false;
    unfinishedListGroups.value = {};
    overtimeListGroups.value = {};
  };

  const unfinishedListGroups: Ref<Record<string, IAssignmentPageDTO[]>> = ref({});
  const unfinishedListGroupsArray = computed(() => {
    const res = [];
    for (const key in unfinishedListGroups.value) {
      res.push({
        date: key,
        value: unfinishedListGroups.value[key],
      });
    }

    return res;
  });
  const fetchUnfinishedList = (workbookAlias: string, studentId: number) => {
    if (isUnfinishedListFinished.value) {
      return Promise.resolve();
    } else {
      return AssignmentService.getAssignmentList({
        query: {
          alias: workbookAlias,
          studentId: studentId,
          /** 作业本状态：0 全部 1 未完成且未截止 2 未完成且已截止 3 已完成 */
          status: 1,
        },
        pageRequest: {
          pageNumber: currentUnfinishedPage.value,
          pageSize: 10,
        },
      })
        .then((assignmentPage) => {
          totalUnfinishedNum.value = assignmentPage.total;
          currentUnfinishedNum.value += assignmentPage.content.length;
          currentUnfinishedPage.value += 1;

          // 临时变量
          const result = Object.assign({}, unfinishedListGroups.value);
          assignmentPage.content.forEach((assignment) => {
            const dateKey = format(assignment.publishTime, 'MM月DD日 dddd', { locale: zhCN });
            if (result[dateKey]) {
              result[dateKey].push(assignment);
            } else {
              result[dateKey] = [assignment];
            }
          });
          unfinishedListGroups.value = result;
        });
    }
  };
  const overtimeListGroups: Ref<Record<string, IAssignmentPageDTO[]>> = ref({});
  const overtimeListGroupsArray = computed(() => {
    const res = [];
    for (const key in overtimeListGroups.value) {
      res.push({
        date: key,
        value: overtimeListGroups.value[key],
      });
    }

    return res;
  });
  const fetchOvertimeList = (workbookAlias: string, studentId: number) => {
    if (isOvertimeListFinished.value) {
      return Promise.resolve();
    } else {
      return AssignmentService.getAssignmentList({
        query: {
          alias: workbookAlias,
          studentId: studentId,
          /** 作业本状态：0 全部 1 未完成且未截止 2 未完成且已截止 3 已完成 */
          status: 2,
        },
        pageRequest: {
          pageNumber: currentOvertimePage.value,
          pageSize: 10,
        },
      })
        .then((assignmentPage) => {
          totalOvertimeNum.value = assignmentPage.total;
          currentOvertimeNum.value += assignmentPage.content.length;
          currentOvertimePage.value += 1;

          // 临时变量
          const result = Object.assign({}, overtimeListGroups.value);
          assignmentPage.content.forEach((assignment) => {
            const dateKey = format(assignment.publishTime, 'MM月DD日 dddd', { locale: zhCN });
            if (result[dateKey]) {
              result[dateKey].push(assignment);
            } else {
              result[dateKey] = [assignment];
            }
          });
          overtimeListGroups.value = result;
        });
    }
  };

  /**
   *
   * @param workbookAlias 作业别称
   * @param studentId 学员id
   * @param mode 请求模式，eager模式会在生成获取函数时主动调用一次. lazy模式只会响应列表加载
   */

  const useFetchUncompletedList = (workbookAlias: string | undefined, studentId: number | undefined, mode?: 'eager' | 'lazy') => {
    if (!mode) {
      mode = 'eager';
    }
    if (workbookAlias && studentId) {
      resetStatus();
      const fetchUncompletedList = () => {
        if (!isUncompletedListLoading.value) {
          isUncompletedListLoading.value = true;
          return Promise.all([
            fetchUnfinishedList(workbookAlias, studentId),
            fetchOvertimeList(workbookAlias, studentId),
          ])
            .then(() => {
              isUncompletedListLoading.value = false;
            })
            .catch((e: string) => {
              isUncompletedListError.value = true;
              Toast(e);
            });
        }
      };

      if (mode === 'eager') {
        if (!isUncompletedListLoading.value) {
          fetchUncompletedList();
        }
        return fetchUncompletedList;
      } else {
        return fetchUncompletedList;
      }
    } else {
      return () => Promise.resolve();
    }
  };

  return {
    totalNum,
    currentNum,
    currentUnfinishedPage,
    currentOvertimePage,
    totalOvertimeNum,
    currentOvertimeNum,
    totalUnfinishedNum,
    currentUnfinishedNum,
    isOvertimeListFinished,
    isUnfinishedListFinished,
    isUncompletedListFinished,
    setIsUncompletedListFinished,
    isUncompletedListError,
    setIsUncompletedListError,
    isUncompletedListLoading,
    setIsUncompletedListLoading,
    overtimeListGroupsArray,
    unfinishedListGroupsArray,
    resetStatus,
    useFetchUncompletedList,
  };
};

export const useUncompletedListModel = UncompletedListModel;
