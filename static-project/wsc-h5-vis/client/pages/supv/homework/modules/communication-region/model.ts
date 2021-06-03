import { computed, hookOf, ref, watch } from '@youzan/tany-vue';
import { useRouter } from '../../router';

import AssignmentService from '@/domain/assignment-domain/services/index';
import { IAssignmentExchangePageDTO } from 'definitions/api/owl/api/UserExerciseFacade/findAssignmentExchangePage';
import { IAjaxExtraOption } from '@/domain/assignment-domain/data-source/apis';

import { Toast } from 'vant';

function CommunicationRegionModuleModel() {
  // hack方法，推入一个空的state
  // 用户配合mediaContainer playVideoInAnotherPage={true}
  // 需求在 https://shimo.im/sheets/dvyQHVWHhRcjgjqT/7FIMp 第8行
  history.pushState('', document.title, null);

  const { route } = useRouter();
  window._global.kdt_id = Number(route.value.query.kdt_id);
  const loaded = ref(false);
  const currentIndex = ref(0);
  const totalNum = ref(-1);
  const loadedNum = ref(0);
  const currentPageNumber = ref(1);
  const loading = ref(false);
  const finished = computed(() => totalNum.value === loadedNum.value);
  const dataList = ref<{ loaded: boolean, assignment: IAssignmentExchangePageDTO }[]>([]);

  const homeworkAlias = computed(() => route.value.query.homeworkAlias);
  const studentId = computed(() => route.value.query.studentId);

  const workbookDeleted = ref(false);

  watch(currentIndex, () => {
    if (currentIndex.value === loadedNum.value - 2 && !finished.value) {
      onLoad({ loading: false, withErrorCode: true });
    }
  });

  const onLoad = (extraOptions?: IAjaxExtraOption) => {
    if (!loading.value && !finished.value) {
      loading.value = true;
      return AssignmentService.getOtherStudentAssignmentList({
        homeworkAlias: homeworkAlias.value,
        studentId: Number(studentId.value),
        pageSize: 4,
        pageNumber: currentPageNumber.value,
      }, extraOptions).then(assignmentList => {
        loading.value = false;
        const {
          total,
          content,
        } = assignmentList;
        if (content.length > 0) {
          document.title = content[0].homework.title;
        }
        if (totalNum.value === -1) {
          dataList.value = ' '.repeat(total)
            .split('').map(() => ({ loaded: false, assignment: {} as IAssignmentExchangePageDTO }));
        }
        totalNum.value = total;
        for (let i = loadedNum.value; i < loadedNum.value + content.length; i++) {
          dataList.value.splice(i, 1, {
            loaded: true,
            assignment: content[i - loadedNum.value],
          });
        }
        loadedNum.value += content.length;
        currentPageNumber.value += 1;

        return assignmentList;
      }).catch((e: {code: number; msg: string;}) => {
        loading.value = false;
        if (e.code === 323010001) {
          workbookDeleted.value = true;
        } else {
          Toast(e.msg);
        }
      });
    }
  };

  if (homeworkAlias.value && studentId.value) {
    onLoad({ withErrorCode: true })
      ?.then(assignmentList => {
        if (assignmentList) {
          loaded.value = true;
        }
      });
  }

  // 页面切换控制器
  const hasNext = computed(() => {
    return totalNum.value !== -1 && currentIndex.value < totalNum.value - 1 && currentIndex.value < loadedNum.value - 1;
  });
  const handleNext = () => {
    if (currentIndex.value < totalNum.value - 1) {
      currentIndex.value += 1;
    }
  };
  const hasPrev = computed(() => {
    return totalNum.value !== -1 && currentIndex.value > 0;
  });
  const handlePrev = () => {
    currentIndex.value -= 1;
  };

  return {
    hasNext,
    handleNext,
    hasPrev,
    handlePrev,
    loaded,
    dataList,
    workbookDeleted,
  };
}

export const useCommunicationRegionModuleModel = hookOf(CommunicationRegionModuleModel);
export default CommunicationRegionModuleModel;
