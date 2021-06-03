import { computed, ref, watch } from '@youzan/tany-vue';
import { useAppModel } from '../../../../App.model';
import { useListModuleModel } from '../../model';
import { useRouter } from '../../../../router';

import Workbook from '@/domain/workbook-domain/entities/workbook';
import WorkbookService from '@/domain/workbook-domain/services';

import { Toast } from 'vant';

import { LocalStorageCacheManager } from '@/utils/cache/localStorageCacheManager';
import HomeworkStudent from '@/domain/student-domain/entities/homeworkStudent';

const WorkbookChooseBlockModel = () => {
  const { route } = useRouter();
  const localStorageCacheManager =
  LocalStorageCacheManager.getInstance<string | HomeworkStudent>(window._global.kdt_id);
  const storageWorkbookAlias = localStorageCacheManager.getItem('latestWorkbookAlias') as string | undefined;
  const {
    currentWorkbook,
    setCurrentWorkbook,
    workbookList,
    setWorkbookList,
    handleSwitchWorkbook,
    setHandleSwitchWorkbook,
    setWorkbookNum,
    needAutoChoose,
  } = useListModuleModel();

  const {
    setCurrentStudentInfo,
  } = useAppModel();

  const isPopupOpen = ref(false);
  const setIsPopupOpen = (v: boolean) => {
    isPopupOpen.value = v;
  };
  setHandleSwitchWorkbook(() => {
    isPopupOpen.value = true;
  });

  // loading由自己控制，交给vant-list会有无限加载问题
  const loading = ref(false);
  const error = ref(false);
  const setError = (v: boolean) => {
    error.value = v;
  };
  const currentPage = ref(1);
  const currentLoadedNum = ref(0);
  const totalNum = ref(-1);
  watch(totalNum, () => {
    setWorkbookNum(totalNum.value);
  });
  const finished = computed(() => {
    return currentLoadedNum.value === totalNum.value;
  });
  const onLoad = () => {
    if (!loading.value) {
      loading.value = true;
      return WorkbookService.getWorkbookList({
        pageNumber: currentPage.value,
        pageSize: 10,
      })
        .then((workbookListPage) => {
          loading.value = false;
          currentPage.value += 1;
          totalNum.value = workbookListPage.total;
          currentLoadedNum.value += workbookListPage.content.length;
          // 去重
          const filteredList = workbookListPage.content
            .filter((w1) =>
              workbookList.value.findIndex((w2) => w2.alias === w1.alias &&
                w2.studentList[0].id === w1.studentList[0].id) === -1);
          setWorkbookList(workbookList.value.concat(filteredList) as Workbook[]);
          return workbookListPage;
        })
        .catch((e: string) => {
          Toast(e);
          error.value = true;
        });
    }
  };
  // 初始化时获取一次以验证是否有多个作业本
  // 加载默认作业本，学员
  onLoad()?.then((workbookListPage) => {
    if ((workbookListPage &&
      workbookListPage.content.length > 0) &&
      ((!route.value.query.workbookAlias &&
      !storageWorkbookAlias) || needAutoChoose.value)
    ) {
      setCurrentWorkbook(workbookListPage.content[0]);
      setCurrentStudentInfo(workbookListPage.content[0].studentList[0]);
      localStorageCacheManager.setItem('latestWorkbookAlias', workbookListPage.content[0].alias);
      localStorageCacheManager.setItem('latestStudent', workbookListPage.content[0].studentList[0]);
    }
  });
  const showSwitchWorkbook = computed(() => workbookList.value.length > 1);
  const handleChooseWorkbook = (workbook: Workbook) => {
    return () => {
      isPopupOpen.value = false;
      setCurrentWorkbook(workbook);
      setCurrentStudentInfo(workbook.studentList[0]);
      localStorageCacheManager.setItem('latestWorkbookAlias', workbook.alias);
      localStorageCacheManager.setItem('latestStudent', workbook.studentList[0]);
      const selectedIndex = workbookList.value.findIndex((w) => w.alias === workbook.alias &&
        w.studentList[0].id === workbook.studentList[0].id);
      const newWorkbookList = workbookList.value.concat([]);
      if (selectedIndex !== -1) {
        newWorkbookList.splice(selectedIndex, 1);
        newWorkbookList.unshift(workbook);
      }
      setWorkbookList(newWorkbookList as Workbook[]);
    };
  };

  return {
    loading,
    error,
    finished,
    workbookList,
    onLoad,
    setError,
    showSwitchWorkbook,
    currentWorkbook,
    handleSwitchWorkbook,
    handleChooseWorkbook,
    isPopupOpen,
    setIsPopupOpen,
  };
};

export default WorkbookChooseBlockModel;
