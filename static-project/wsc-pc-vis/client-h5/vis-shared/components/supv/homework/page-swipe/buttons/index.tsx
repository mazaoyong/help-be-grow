import { createComponent, ModelOf, ref } from '@youzan/tany-vue';
import { icon as VisIcon } from '@youzan/vis-ui';
import './style';

const initialState = {
  showNext: false,
  showPrev: false,
  nextText: '',
  prevText: '',
  handleNext: () => {},
  handlePrev: () => {},
}

const ButtonsModel = (props: typeof initialState) => {
  const innerNextText = ref(props.nextText || '');
  if (innerNextText.value) {
    // 四秒后隐藏下一个学员
    setTimeout(() => {
      innerNextText.value = '';
    }, 4000);
  }

  const innerPrevText = ref(props.prevText || '');
  if (innerPrevText.value) {
    // 四秒后隐藏下一个学员
    setTimeout(() => {
      innerPrevText.value = '';
    }, 4000);
  }

  return {
    innerNextText,
    innerPrevText,
    props,
  };
}

function Buttons(model: ModelOf<typeof ButtonsModel>) {
  const { props } = model;
  return (
    <div class="swipe-buttons">
      {
        props.showPrev
          ? (
            <div
              class="swipe-buttons__button swipe-buttons__button--arrow-up"
              onClick={props.handlePrev}
            >
              <VisIcon name="d-arrow-down" size="16px" color="#323233" />
              {
                model.innerPrevText.value
                  ? (
                      <span>
                        { model.innerPrevText.value }
                      </span>
                    )
                  : null
              }
            </div>
          )
          : null
      }
      {
        props.showNext
          ? (
            <div class="swipe-buttons__button" onClick={props.handleNext}>
              <VisIcon name="d-arrow-down" size="16px" color="#323233" />
              {
                model.innerNextText.value
                  ? (
                      <span>
                        { model.innerNextText.value }
                      </span>
                    )
                  : null
              }
            </div>
          )
          : null
      }
    </div>
  );
}

export default createComponent(Buttons, {
  model: ButtonsModel,
  initialState,
});
