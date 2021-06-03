import { computed, Ref, ref, watch } from '@youzan/tany-vue';

import AssignmentService from '@/domain/assignment-domain/services';

import { Toast } from 'vant';

import { format } from 'date-fns';
import zhCN from 'date-fns/locale/zh_cn';
import { IAssignmentPageDTO } from 'definitions/api/owl/api/UserExerciseFacade/findUserAssignmentPage';

const CompletedListModel = () => {
  const totalNum = ref(-1);
  const currentNum = ref(0);
  const currentPage = ref(1);
  watch(
    [currentNum, totalNum],
    () => {
      if (currentNum.value === totalNum.value) {
        isCompletedListFinished.value = true;
      }
    },
  );
  const isCompletedListFinished = ref(false);
  const setIsCompletedListFinished = (value: boolean) => {
    isCompletedListFinished.value = value;
  };
  const isCompletedListError = ref(false);
  const setIsCompletedListError = (value: boolean) => {
    isCompletedListError.value = value;
  };
  const isCompletedListLoading = ref(false);
  const setIsCompletedListLoading = (value: boolean) => {
    isCompletedListLoading.value = value;
  };

  const resetStatus = () => {
    totalNum.value = -1;
    currentNum.value = 0;
    currentPage.value = 1;
    isCompletedListFinished.value = false;
    isCompletedListError.value = false;
    isCompletedListLoading.value = false;
    completedListGroups.value = {};
  };

  const completedListGroups: Ref<Record<string, IAssignmentPageDTO[]>> = ref({});

  const completedListGroupsArray = computed(() => {
    const res = [];
    for (const key in completedListGroups.value) {
      res.push({
        date: key,
        value: completedListGroups.value[key],
      });
    }

    return res;
  });

  /**
   *
   * @param workbookAlias 作业别称
   * @param studentId 学员id
   * @param mode 请求模式，eager模式会在生成获取函数时主动调用一次. lazy模式只会响应列表加载
   */

  const useFetchCompletedList = (workbookAlias: string | undefined, studentId: number | undefined, mode?: 'eager' | 'lazy') => {
    if (!mode) {
      mode = 'eager';
    }
    if (workbookAlias && studentId) {
      resetStatus();
      const fetchCompletedList = () => {
        if (!isCompletedListLoading.value) {
          isCompletedListLoading.value = true;
          return AssignmentService.getAssignmentList({
            query: {
              alias: workbookAlias,
              studentId: studentId,
              /** 作业本状态：0 全部 1 未完成且未截止 2 未完成且已截止 3 已完成 */
              status: 3,
            },
            pageRequest: {
              pageNumber: currentPage.value,
              pageSize: 10,
            },
          })
            .then((assignmentPage) => {
              isCompletedListLoading.value = false;
              totalNum.value = assignmentPage.total;
              currentNum.value += assignmentPage.content.length;
              currentPage.value += 1;

              // 临时变量
              const result = Object.assign({}, completedListGroups.value);
              assignmentPage.content.forEach((assignment) => {
                const dateKey = format(assignment.submitTime, 'MM月DD日 dddd', { locale: zhCN });
                if (result[dateKey]) {
                  result[dateKey].push(assignment);
                } else {
                  result[dateKey] = [assignment];
                }
              });
              completedListGroups.value = result;
            })
            .catch((e: string) => {
              isCompletedListError.value = true;
              Toast(e);
            });
        }
      };
      if (mode === 'eager') {
        fetchCompletedList();
        return fetchCompletedList;
      } else {
        return fetchCompletedList;
      }
    } else {
      return () => Promise.resolve();
    }
  };

  return {
    totalNum,
    currentNum,
    currentPage,
    isCompletedListFinished,
    setIsCompletedListFinished,
    isCompletedListError,
    setIsCompletedListError,
    isCompletedListLoading,
    setIsCompletedListLoading,
    resetStatus,
    completedListGroupsArray,
    useFetchCompletedList,
  };
};

export const useCompletedListModel = CompletedListModel;
