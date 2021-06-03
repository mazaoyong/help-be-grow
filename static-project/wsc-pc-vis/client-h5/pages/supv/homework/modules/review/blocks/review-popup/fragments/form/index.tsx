import { field as VanField, checkbox as VanCheckbox } from 'vant';
import { ModelOf } from '@youzan/tany-vue';
import { UploaderViewContainer, Icon as VisIcon } from '@youzan/vis-ui';
import { ReviewFormModel } from '../../../../models/ReviewForm';
import './style';

export function ReviewForm(model: ModelOf<typeof ReviewFormModel>) {
  return (
    <div class="review-form">
      <div class="review-form__block review-form__score">
        {
          model.isLevelScore.value
            ? (
              <div class="review-form__level-list">
                {
                  model.levelList.map(level => (
                    <div
                      class={[
                        'review-form__level-item',
                        `review-form__level-item--${level}`,
                        model.score.value === level
                          ? 'review-form__level-item--selected' : '',
                      ]}
                      onClick={() => model.setScore(level)}
                    >
                      {level}
                    </div>
                  ))
                }
              </div>
            )
            : (
              <VanField
                size="large"
                label="作业得分"
                value={model.score.value}
                placeholder={model.scorePlaceholder.value}
                type="number"
                errorMessage={model.scoreErrorMsg.value}
                onInput={model.setScore}
              />
            )
        }
      </div>

      <div class="review-form__block">
        <VanCheckbox
          value={model.isSelected.value}
          checkedColor="#00b389"
          onClick={model.triggerSelected}
        >
          选为优秀作业
          {
            model.isSelected.value
              ? <VisIcon slot="icon" name="check-circle" color="#00b389" />
              : null
          }
        </VanCheckbox>
      </div>

      <div class="review-form__block review-form__comment">
        <VanField
          value={model.textComment.value}
          placeholder="请输入评语"
          type="textarea"
          rows="3"
          onInput={model.setTextComment}
        />

        <UploaderViewContainer
          priority={['image', 'video']}
          img={{}}
          anchor="imgvideo"
        >
        </UploaderViewContainer>
      </div>
    </div>
  );
}
