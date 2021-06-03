import { ModelOf, ref } from '@youzan/tany-vue';
import {
  popup as VanPopup,
  icon as VanIcon,
} from 'vant';

export const ShortcutPopupModel = () => {
  const show = ref(false);
  const open = () => {
    show.value = true
  };
  const close = () => {
    show.value = false;
  };

  return {
    show,
    open,
    close,
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
        </div>
      </VanPopup>
    </div>
  );
}
