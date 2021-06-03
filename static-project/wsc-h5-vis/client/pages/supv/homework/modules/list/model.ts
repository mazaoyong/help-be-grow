import { computed, hookOf, ref, watch } from '@youzan/tany-vue';
import { useAppModel } from '../../App.model';
import { useCompletedListModel } from './models/completed-assignment-model';
import { useUncompletedListModel } from './models/uncompleted-assignment-model';
import { useRouter, detailRoute } from '../../router';

import WorkbookService from '@/domain/workbook-domain/services';
import Workbook from '@/domain/workbook-domain/entities/workbook';
import HomeworkStudent from '@/domain/student-domain/entities/homeworkStudent';

import { getDefaultCallback } from 'vis-shared/components/empty/index';
import { Toast } from 'vant';

import { LocalStorageCacheManager } from '@/utils/cache/localStorageCacheManager';

const ListModuleModel = () => {
  document.title = '我的作业';

  const { route } = useRouter();
  const kdtId = route.value.query.kdt_id;
  window._global.kdt_id = window._global.shopMetaInfo.rootKdtId || Number(kdtId);
  const localStorageCacheManager = LocalStorageCacheManager.getInstance<string | HomeworkStudent>(kdtId);
  const storageWorkbookAlias = localStorageCacheManager.getItem('latestWorkbookAlias');
  const storageStudent = localStorageCacheManager.getItem('latestStudent');

  const {
    mainColor,
    currentStudentInfo,
    setCurrentStudentInfo,
  } = useAppModel();

  const {
    totalNum: unCompletedTotalNum,
    useFetchUncompletedList,
    isUncompletedListError,
    isUncompletedListFinished,
    isUncompletedListLoading,
    setIsUncompletedListLoading,
    setIsUncompletedListError,
    overtimeListGroupsArray,
    unfinishedListGroupsArray,
    currentOvertimeNum,
  } = useUncompletedListModel();

  const isShare = route.value.query.isShare;
  const homeworkAlias = route.value.query.homeworkAlias;
  const showOverTimeButton = computed(() => currentOvertimeNum.value > 0);
  const showOvertime = ref(false);
  const handleShowOvertime = () => {
    showOvertime.value = !showOvertime.value;
  };
  const computedUnCompletedTotalNum = computed(() => {
    return unCompletedTotalNum.value < 0 ? 0 : unCompletedTotalNum.value;
  });

  const {
    totalNum: completedTotalNum,
    useFetchCompletedList,
    isCompletedListError,
    isCompletedListFinished,
    isCompletedListLoading,
    setIsCompletedListLoading,
    setIsCompletedListError,
    completedListGroupsArray,
  } = useCompletedListModel();
  const computedCompletedTotalNum = computed(() => {
    return completedTotalNum.value < 0 ? 0 : completedTotalNum.value;
  });

  const workbookAlias = route.value.query.workbookAlias;
  const studentId = route.value.query.studentId;
  const needAutoChoose = ref(false);
  // url指定workbookAlias目前只可能是从领取作业本过来的
  if (workbookAlias) {
    WorkbookService.getWorkbookDetail({ alias: workbookAlias }, { withErrorCode: true })
      .then((workbook) => {
        const student = workbook.studentList.find((s) => s.id === Number(studentId));
        if (student) {
          setCurrentStudentInfo(student);
          localStorageCacheManager.setItem('latestStudent', student);
        } else if (workbook.studentList.length > 0) {
          // 可能是拼链接，找不到就给默认选择第一个学员
          setCurrentStudentInfo(workbook.studentList[0]);
          localStorageCacheManager.setItem('latestStudent', workbook.studentList[0]);
        } else {
          needAutoChoose.value = true;
          return;
        }
        currentWorkbook.value = workbook;
        localStorageCacheManager.setItem('latestWorkbookAlias', workbook.alias);
        // 删除重复的作业本
        const dupIndex =
          workbookList.value
            .findIndex((w) => w.alias === workbook.alias &&
            w.studentList[0].id === currentStudentInfo.value?.id);
        if (dupIndex !== -1) {
          workbookList.value.splice(dupIndex, 1);
        }
        workbookList.value.unshift(workbook);
        // 触发刷新
        workbookList.value = workbookList.value.concat([]);
        if (isShare === '1' && homeworkAlias) {
          // B端分享未加入的作业链接，领取作业本后的跳转逻辑
          detailRoute.redirectTo({
            query: {
              alias: homeworkAlias,
              studentId: currentStudentInfo.value?.id,
              kdt_id: workbook.targetKdtId,
            },
          });
        }
      })
      .catch((e: {code: number; msg: string; }) => {
        if (e.code === 323010001) {
          // 作业本不存在降级，自动选择作业本列表的第一个作业本
          needAutoChoose.value = true;
        } else {
          Toast(e.msg);
        }
      });
  } else if (storageWorkbookAlias && storageStudent) {
    WorkbookService.getWorkbookDetail({ alias: storageWorkbookAlias as string }, { withErrorCode: true })
      .then((workbook) => {
        const storageStudentId = Number((storageStudent as HomeworkStudent).id);
        const student = workbook.studentList.find((s) => s.id === storageStudentId);
        // 记住的上一次访问的学员可能已经退出了作业本
        // 需要将数据降级成为缓存中的学员数据
        if (!student) {
          workbook.studentList = [storageStudent as HomeworkStudent];
          setCurrentStudentInfo(storageStudent as HomeworkStudent);
        } else {
          setCurrentStudentInfo(student);
        }
        currentWorkbook.value = workbook;
        // 删除重复的作业本
        const dupIndex = workbookList.value
          .findIndex((w) => w.alias === storageWorkbookAlias &&
          w.studentList[0].id === storageStudentId);
        if (dupIndex !== -1) {
          workbookList.value.splice(dupIndex, 1);
        }
        workbookList.value.unshift(workbook);
        // 触发刷新
        workbookList.value = workbookList.value.concat([]);
      })
      .catch((e: {code: number; msg: string; }) => {
        if (e.code === 323010001) {
          // 作业本不存在降级，自动选择作业本列表的第一个作业本
          needAutoChoose.value = true;
        } else {
          Toast(e.msg);
        }
      });
  }

  // 👇会被workbook-choose-block赋值
  const currentWorkbook = ref<Workbook | undefined>();
  const setCurrentWorkbook = (v: Workbook) => {
    currentWorkbook.value = v;
  };
  const workbookNum = ref(-1);
  const setWorkbookNum = (v: number) => {
    workbookNum.value = v;
  };
  const workbookList = ref<Workbook[]>([]);
  const setWorkbookList = (v: Workbook[]) => {
    workbookList.value = v;
  };
  watch(needAutoChoose, () => {
    if (workbookList.value.length > 0 && needAutoChoose.value) {
      currentWorkbook.value = workbookList.value[0];
      setCurrentStudentInfo(workbookList.value[0].studentList[0]);
      localStorageCacheManager.setItem('latestWorkbookAlias', workbookList.value[0].alias);
      localStorageCacheManager.setItem('latestStudent', workbookList.value[0].studentList[0]);
    }
  });
  const handleSwitchWorkbook = ref(() => {});
  const setHandleSwitchWorkbook = (v: () => void) => {
    handleSwitchWorkbook.value = v;
  };
  // 👆

  const isEmpty = ref(false);
  const emptyLevel = ref<'list' | 'page'>('page');
  const emptyDescText = ref('还没有加入任何作业本，先去逛逛吧');
  const emptyShowButton = ref(true);
  const emptyButtonText = ref('去逛逛');
  const emptyButtonCallback = ref(getDefaultCallback());
  const resetEmpty = () => {
    isEmpty.value = false;
    emptyLevel.value = 'page';
    emptyDescText.value = '还没有加入任何作业本，先去逛逛吧';
    emptyShowButton.value = true;
    emptyButtonText.value = '去逛逛';
    emptyButtonCallback.value = getDefaultCallback();
  };
  watch(unCompletedTotalNum, () => {
    if (unCompletedTotalNum.value === 0) {
      resetEmpty();
      isEmpty.value = true;
      emptyLevel.value = 'list';
      emptyDescText.value = '此作业本暂无作业，等待老师布置吧';
      if (workbookList.value.length > 1) {
        emptyButtonText.value = '切换作业本';
        emptyButtonCallback.value = handleSwitchWorkbook.value;
      } else {
        emptyShowButton.value = false;
      }
    }
  });
  watch(workbookNum, () => {
    if (workbookNum.value === 0) {
      resetEmpty();
      isEmpty.value = true;
    }
  });

  const fetchUncompletedList = ref(useFetchUncompletedList(currentWorkbook.value?.alias, currentStudentInfo.value?.id, 'eager'));
  watch([currentWorkbook, currentStudentInfo], () => {
    resetEmpty();
    fetchUncompletedList.value = useFetchUncompletedList(currentWorkbook.value?.alias, currentStudentInfo.value?.id, 'eager');
  });
  const fetchCompletedList = ref(useFetchCompletedList(currentWorkbook.value?.alias, currentStudentInfo.value?.id, 'eager'));
  watch([currentWorkbook, currentStudentInfo], () => {
    resetEmpty();
    fetchCompletedList.value = useFetchCompletedList(currentWorkbook.value?.alias, currentStudentInfo.value?.id, 'eager');
  });

  return {
    mainColor,

    isEmpty,
    emptyLevel,
    emptyDescText,
    emptyShowButton,
    emptyButtonText,
    emptyButtonCallback,
    isUncompletedListError,
    setIsUncompletedListError,
    isUncompletedListFinished,
    isUncompletedListLoading,
    setIsUncompletedListLoading,
    fetchUncompletedList,
    overtimeListGroupsArray,
    unfinishedListGroupsArray,
    isCompletedListError,
    setIsCompletedListError,
    isCompletedListFinished,
    isCompletedListLoading,
    setIsCompletedListLoading,
    fetchCompletedList,
    completedListGroupsArray,
    currentWorkbook,
    setCurrentWorkbook,
    showOvertime,
    handleShowOvertime,
    computedUnCompletedTotalNum,
    computedCompletedTotalNum,
    showOverTimeButton,
    workbookList,
    setWorkbookList,
    handleSwitchWorkbook,
    setHandleSwitchWorkbook,
    workbookNum,
    setWorkbookNum,
    needAutoChoose,
  };
};

export const useListModuleModel = hookOf(ListModuleModel);
export default ListModuleModel;
