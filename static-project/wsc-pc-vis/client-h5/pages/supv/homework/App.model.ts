import { checkAccess } from '@/utils/permission';
import { computed, hookOf, reactive, ref } from '@youzan/tany-vue';
import { fetchWorkbookTeachers } from 'domain/supv/homework/services/workbook';

const AppModel = () => {
  // 进入批阅页面需要的一些数据
  const reviewPageData = reactive({
    isReviewed: false,
    isSelected: false,
    total: 0,
    currentIndex: 0,
  });
  const setReviewPageData = (name: keyof typeof reviewPageData, value: any) => {
    (reviewPageData[name] as any) = value;
  };

  // 编辑页面，新建或编辑完成后，是否是直接后退
  // 如果是直接通过链接进入的，看回调逻辑
  const backWhenFinish = ref(false);
  const setBackWhenFinish = (value: boolean) => {
    backWhenFinish.value = value;
  };

  // 从作业本列表进入作业列表时，传递所选的作业本名称
  const currentBookTitle = ref('作业本');
  const setCurrentBookTitle = (value: string) => {
    currentBookTitle.value = value;
  };

  const teacherList = ref([]);
  const hasAuthorized = computed(() =>
    checkAccess('督学互动', '作业', '编辑') ||
    teacherList.value.some((teacher: any) => teacher.teacherId === _global.userId)
  );
  const initTeacherList = (id: number) => {
    fetchWorkbookTeachers(id)
      .then(res => {
        if (res) {
          teacherList.value = res;
        }
      });
  };

  return {
    reviewPageData,
    setReviewPageData,

    backWhenFinish,
    setBackWhenFinish,

    currentBookTitle,
    setCurrentBookTitle,

    hasAuthorized,
    initTeacherList,
  };
};

export const useAppModel = hookOf(AppModel);
export default AppModel;
