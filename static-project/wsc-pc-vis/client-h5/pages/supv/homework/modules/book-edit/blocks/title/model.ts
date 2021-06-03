import { computed, ref } from '@youzan/tany-vue';
import { useFormModel } from '../../models/form';

const AppModel = () => {
  const { isEdit, form, updateForm, errorMsg } = useFormModel();

  const title = computed(() => form.title);
  const setTitle = (value: string) => {
    updateForm('title', value)
  };
  const errMsg = computed(() => errorMsg['title']);

  return {
    isEdit,
    title,
    errMsg,
    setTitle,
  };
};

export default AppModel;
