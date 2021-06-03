import { Toast } from 'vant';
import { useRouter } from '../../router';
import { hookOf, ModelOf, ref } from '@youzan/tany-vue';
import {
  fetchHomeworkDetail as fetchHomeworkDetailService,
} from 'domain/supv/homework/services/homework';
import Homework from 'domain/supv/homework/entities/Homework';

const RootModel = () => {
  const { route } = useRouter();
  const { params } = route.value;

  const inited = ref(false);
  const homeworkDetail = ref({} as Homework);
  const showDetail = (elem: any) => {
    return inited.value ? elem : null;
  };

  const showEntry = (elem: any) => {
    return homeworkDetail.value.selectedCount ? elem : null;
  };
  const showList = (elem: any) => {
    return inited.value ? elem : null;
  };

  // init
  fetchHomeworkDetailService(Number(params?.homeworkId))
    .then(res => {
      if (res) {
        homeworkDetail.value = res.homework;
        inited.value = true;
      } else {
        Toast('获取作业详情失败');
      }
    })
    .catch(errMsg => {
      Toast(errMsg || '获取作业详情失败');
    });

  return {
    showDetail,
    showEntry,
    showList,
    homeworkDetail,
  };
};

export type RootModelType = ModelOf<typeof RootModel>;
export const useRootModel = hookOf(RootModel);
export default RootModel;
