import { useAppModel } from '@/pages/supv/homework/App.model';
import { useRouter } from '@/pages/supv/homework/router';
import { computed } from '@youzan/tany-vue';
import { useRootModel } from '../../Root.model';

const BlockDetailModel = () => {
  const { setBackWhenFinish } = useAppModel();
  const { route } = useRouter();
  const { homeworkDetail } = useRootModel();

  return {
    homeworkId: computed(() => route.value.params?.homeworkId || 0),
    homeworkDetail,
    setBackWhenFinish,
  };
};

export default BlockDetailModel;
