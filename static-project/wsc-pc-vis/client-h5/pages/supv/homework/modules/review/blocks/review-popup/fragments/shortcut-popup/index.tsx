import { ModelOf, ref } from '@youzan/tany-vue';
import { IExerciseDetailItemDTO } from 'definitions/api/owl/api/ReviewerExerciseFacade/findLatestComment';
import { MEDIA_ITEM_TYPE } from 'domain/supv/homework/constants';
import { fetchLatestComment } from 'domain/supv/homework/services/assignment';
import {
  popup as VanPopup,
  icon as VanIcon,
} from 'vant';
import './style';

export const ShortcutPopupModel = (
  onSelect: (text: string) => any
) => {
  const show = ref(false);
  const open = () => {
    show.value = true;

    setLatestComment();
  };
  const close = () => {
    show.value = false;
  };

  const latestComment = ref('');
  // todo: 上 Apollo
  const shortcutComments = ref([
    '这是一份非常优秀的作业。',
    '相信你还可以做得更好！',
    '期待看到你的进步！',
    '作业完成得不错，请再接再厉！',
    '作业的进步非常大，继续加油！',
  ]);

  function setLatestComment() {
    fetchLatestComment()
      .then((res: IExerciseDetailItemDTO[]) => {
        if (res && res.length) {
          const textCommentItems = res.filter(
            item => item.mediaType === MEDIA_ITEM_TYPE.RICHTEXT
          );

          if (textCommentItems && textCommentItems.length) {
            const item = textCommentItems[0];
            latestComment.value = item.richTextItem?.content || '';
          } else {
            latestComment.value = '';
          }
        }
      });
  }

  return {
    show,
    open,
    close,
    onSelect: (comment: string) => {
      onSelect(comment);
      close();
    },

    latestComment,
    shortcutComments,
  };
};

export function ShortcutPopup(model: ModelOf<typeof ShortcutPopupModel>) {
  return (
    <div class="shortcut-popup">
      <VanPopup
        value={model.show.value}
        position="bottom"
        round
        closeOnClickOverlay={false}
      >
        <div class="shortcut-popup__container">
          <div class="shortcut-popup__header">
            快捷评语

            <VanIcon
              name="cross"
              size="22px"
              color="#c8c9cc"
              onClick={model.close}
            />
          </div>

          <div class="shortcut-popup__main">
            {
              model.latestComment.value
                ? (
                  <div class="shortcut-popup__block shortcut-popup__latest">
                    <div class="shortcut-popup__block__title">
                      最近评语
                    </div>

                    <div
                      class="shortcut-popup__latest__content"
                      onClick={() => model.onSelect(model.latestComment.value)}
                    >
                      { model.latestComment.value }
                    </div>
                  </div>
                )
                : null
            }

            <div class="shortcut-popup__block shortcut-popup__shortcut">
              <div class="shortcut-popup__block__title">
                快捷评语
              </div>

              <div class="shortcut-popup__shortcut__list">
                {
                  model.shortcutComments.value.map(comment => (
                    <div
                      class="shortcut-popup__shortcut__item"
                      onClick={() => model.onSelect(comment)}
                    >
                      {comment}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </VanPopup>
    </div>
  );
}
