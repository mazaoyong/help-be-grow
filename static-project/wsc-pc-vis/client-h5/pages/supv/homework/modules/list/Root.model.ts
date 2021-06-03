import { computed, ref, Ref, unref } from '@youzan/tany-vue';
import { format } from 'date-fns';
import zh_cn from 'date-fns/locale/zh_cn';
import fetchHomeworkListApi from 'domain/supv/homework/data-source/apis/fetchHomeworkList'
import { useAppModel } from '../../App.model';
import { useRouter } from '../../router';

const ListModuleModel = () => {
  const {
    setBackWhenFinish,
    currentBookTitle = '作业本',
    initTeacherList,
    hasAuthorized,
  } = useAppModel();
  const { route } = useRouter();
  const { params } = route.value;

  // 设置标题
  (document || {} as any).title = unref(currentBookTitle);

  const isFinished = ref(false);
  const isError = ref(false);
  const isLoading = ref(false);
  const setIsLoading = (value: boolean) => {
    isLoading.value = value;
  };
  let pageNumber = 1;
  const PAGE_SIZE = 10;
  const homeworkListGroups: Ref<Record<string, any>> = ref({});

  const homeworkListGroupsArray = computed(() => {
    const res = [];
    for (const key in homeworkListGroups.value) {
      res.push({
        date: key,
        value: homeworkListGroups.value[key],
      });
    }

    return res;
  });

  const showBtnText = ref(true);
  // 四秒后隐藏按钮文本
  setTimeout(() => {
    showBtnText.value = false;
  }, 4000);

  const fetchHomeworkList = () => {
    if (isLoading.value || isFinished.value) {
      return;
    }

    setIsLoading(true);
    return fetchHomeworkListApi(
      {
        pageNumber: pageNumber,
        pageSize: PAGE_SIZE,
        sort: {
          orders: [
            { direction: 'DESC', property: 'publish_time', },
          ],
        },
      },
      {
        exerciseBookId: Number(params.workbookId),
        title: '',
      },
    )
      .then(res => {
        isFinished.value = pageNumber >= (res as any).totalPages;
        const result = Object.assign({}, homeworkListGroups.value);

        if (res && res.content) {
          res.content.forEach((homework) => {
            const dateKey = format(homework.publishTime, 'MM月DD日 dddd', { locale: zh_cn});
            if (result[dateKey]) {
              result[dateKey].push({
                id: homework.id,
                title: homework.title,
                status: homework.status,
                totalNumber: homework.dueNum,
                submitNumber: homework.submitNum,
                publishDate: homework.publishTime
              })
            } else {
              result[dateKey] = [{
                id: homework.id,
                title: homework.title,
                status: homework.status,
                totalNumber: homework.dueNum,
                submitNumber: homework.submitNum,
                publishDate: homework.publishTime
              }]
            }
          });

          pageNumber++;
        }
        homeworkListGroups.value = result;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 初始化老师列表
  // 在这里初始化是因为这个页面最先拿到 bookId
  initTeacherList(Number(params.workbookId));

  return {
    workbookId: params.workbookId,
    homeworkListGroupsArray,
    isFinished,
    isError,
    isLoading,
    showBtnText,
    hasAuthorized,
    setIsLoading,
    fetchHomeworkList,
    setBackWhenFinish,
  }
};

export default ListModuleModel;
