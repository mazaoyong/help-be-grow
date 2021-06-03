import Vue from 'vue';
import { MEDIA_ITEM_TYPE } from '@/domain/supv/homework/constants';
import { computed, hookOf, ModelOf } from '@youzan/tany-vue';
import { IExerciseDetailItemDTO } from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';
import { useFormModel } from '../../models/form';
import { createMediaItem } from '../../utils';

const EditorModel = () => {
  const { isEdit, form, errorMsg, updateForm } = useFormModel();

  const errMsg = computed(() => errorMsg['detail']);
  const showOperators = computed(() => form.detail.length > 1);
  const addItem = (type: MEDIA_ITEM_TYPE, payload: any) => {
    const item = createMediaItem(
      type,
      payload,
    );
    updateForm('detail', [
      ...form.detail,
      item,
    ]);

    try {
      Vue.nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    } finally {}
  };
  const deleteItem = (index: number) => {
    const copyArr = [...form.detail];
    copyArr.splice(index, 1);
    updateForm('detail', copyArr);
  };
  const updateItem = (index: number, payload: any) => {
    let item, newItem = {} as IExerciseDetailItemDTO
    if (item = form.detail[index]) {
      switch (item.mediaType) {
        case MEDIA_ITEM_TYPE.RICHTEXT:
          newItem = createMediaItem(
            MEDIA_ITEM_TYPE.RICHTEXT,
            {
              ...item.richTextItem,
              ...payload,
            },
          );
          break;
        case MEDIA_ITEM_TYPE.AUDIO:
          newItem = createMediaItem(
            MEDIA_ITEM_TYPE.AUDIO,
            {
              ...item.audioItem,
              ...payload,
            },
          );
          break;
        case MEDIA_ITEM_TYPE.VIDEO:
          newItem = createMediaItem(
            MEDIA_ITEM_TYPE.VIDEO,
            {
              ...item.videoItem,
              ...payload,
            },
          );
          break;
        default:
      }

      const copyArr = [...form.detail];
      copyArr.splice(index, 1, newItem);
      updateForm('detail', copyArr);
    } else {}
    console.log('更新 EdiorModel contentItems', index, payload, item, newItem);
  }

  return {
    isEdit,

    errMsg,
    showOperators,
    form,
    addItem,
    deleteItem,
    updateItem,
  };
};

export type EditorModelType = ModelOf<typeof EditorModel>
export const useEditorModel = hookOf(EditorModel);
export default EditorModel;
