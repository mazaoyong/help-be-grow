import {
  popup as VanPopup,
  button as VanButton,
  icon as VanIcon,
} from 'vant';
import { createBlock, ModelOf } from '@youzan/tany-vue';
import ReviewPopupModel from './model';
import { ShortcutPopup } from './fragments/shortcut-popup';
import { ReviewForm } from './fragments/form';
import Toolbar from './fragments/toolbar';
import './style';

function ReviewPopup(model: ModelOf<typeof ReviewPopupModel>) {
  return (
    <div class="review-popup">
      <VanPopup
        value={model.show.value}
        position="bottom"
        round
        closeOnClickOverlay={false}
      >
        <div class="review-popup__container">
          <div class="review-popup__header">
            {model.title.value}

            <VanIcon
              name="cross"
              size="22px"
              color="#c8c9cc"
              onClick={model.close}
            />
          </div>

          <div class="review-popup__main">
            {ReviewForm(model.reviewFormModel)}
          </div>

          <div class="review-popup__footer">
            {Toolbar(model)}

            <VanButton
              disabled={model.isSubmitting.value}
              block
              round
              color="#00b389"
              onClick={model.submit}
            >
              提交评语
            </VanButton>
          </div>
        </div>
      </VanPopup>

      {ShortcutPopup(model.shortcutModel)}
    </div>
  );
}

export default createBlock({
  root: ReviewPopup,
  model: ReviewPopupModel,
});
