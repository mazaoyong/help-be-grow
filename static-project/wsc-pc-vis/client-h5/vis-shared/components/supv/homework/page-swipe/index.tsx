import { computed, createComponent, ModelOf, onMounted, ref, Ref } from '@youzan/tany-vue';
import { Swipe as VanSwipe, SwipeItem as VanSwipeItem } from 'vant';
import Buttons from './buttons';
import './style';

const initialState = {
  list: [],
  initialIndex: 0,
  showNext: false,
  showPrev: false,
  nextText: '',
  prevText: '',
  handleNext: (index: number) => {},
  handlePrev: (index: number) => {},
};

const SwipeModel = (props: typeof initialState) => {
  const {
    initialIndex,
    handleNext,
    handlePrev,
  } = props;

  const swipeRef = ref(null);
  const currentIndex = ref(initialIndex);
  const initialSwipe = initialIndex;
  const isFirst = computed(() => currentIndex.value === 0);
  const isLast = computed(() => currentIndex.value >= props.list.length - 1);
  const onClickNext = () => {
    if (isLast.value) return;

    (swipeRef.value as any).next();
    currentIndex.value++;
    handleNext && handleNext(currentIndex.value);
  };
  const onClickPrev = () => {
    if (isFirst.value) return;

    (swipeRef.value as any).prev();
    currentIndex.value--;
    handlePrev && handlePrev(currentIndex.value);
  };
  const onSwipe = (index: number) => {
    currentIndex.value = index;
  };

  return {
    props,
    currentIndex,
    initialSwipe,
    isFirst,
    isLast,
    swipeRef,
    onClickNext,
    onClickPrev,
    onSwipe,
  }
}

function Swipe(model: ModelOf<typeof SwipeModel>) {
  const { props } = model;
  console.log('swipe compoennt', props, model);
  return (
    <div class="page-swipe">
      <VanSwipe
        ref="swipeRef"
        style={{ height: "100vh", }}
        vertical
        loop={false}
        showIndicators={false}
        onChange={model.onSwipe}
        stopPropagation={false}
        touchable={false}
        duration={500}
        initialSwipe={model.initialSwipe}
      >
        {props.list.map((item: any) => (
          <VanSwipeItem>{item}</VanSwipeItem>
        ))}
      </VanSwipe>

      <Buttons
        showNext={props.showNext && !model.isLast.value}
        showPrev={props.showPrev && !model.isFirst.value}
        prevText={props.prevText}
        nextText={props.nextText}
        handleNext={model.onClickNext}
        handlePrev={model.onClickPrev}
      />
    </div>
  );
}

export default createComponent(Swipe, {
  model: SwipeModel,
  initialState,
});
