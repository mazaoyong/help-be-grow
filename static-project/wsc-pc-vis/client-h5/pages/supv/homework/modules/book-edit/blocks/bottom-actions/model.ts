import { useAppModel } from '@/pages/supv/homework/App.model';
import { computed } from '@youzan/tany-vue';
import { useFormModel } from '../../models/form';

const BottomActionsModel = () => {
  const { hasAuthorized } = useAppModel();
  const { submit, isSubmitting } = useFormModel();

  const disabled = computed(() => {
    return (!hasAuthorized.value) || isSubmitting.value;
  });

  return {
    disabled,
    isSubmitting,
    submit,
  };
};

export default BottomActionsModel;
