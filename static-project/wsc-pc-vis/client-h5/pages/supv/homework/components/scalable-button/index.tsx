import { computed, createComponent, ModelOf, reactive, ref } from '@youzan/tany-vue';
import './style';

interface ScalableButtonProps {
  autoHidden: boolean
  hiddenTime: number
  buttonText: string
  handleClick: () => any
  icon: JSX.Element
}

const ScalableButtonModel = (props: ScalableButtonProps) => {
  const { autoHidden = true, hiddenTime = 4000 } = props;
  const showText = ref(true);
  if (autoHidden) {
    setTimeout(() => {
      showText.value = false;
    }, hiddenTime);
  }

  const prevTranslate = { x: 0, y: 0 };
  const translate = reactive({
    x: 0,
    y: 0,
  });
  const transform = computed(() => `translate(${translate.x}px, ${translate.y}px)`);
  let x = 0;
  let y = 0;
  const onDragstart = (e: DragEvent) => {
    x = e.x;
    y = e.y;
    console.log('onDragstart', e);
    e.dataTransfer?.setDragImage(document.createElement('div'), 10, 10);
    e.dataTransfer && (e.dataTransfer.effectAllowed = 'none');
  };
  const onDrag = (e: DragEvent) => {
    if (e.x && e.y) {
      translate.x = e.x - x + prevTranslate.x;
      translate.y = e.y - y + prevTranslate.y;
    }
    console.log('onDrag', e);
  };
  const onDragend = (e: DragEvent) => {
    x = 0;
    y = 0;
    prevTranslate.x = translate.x;
    prevTranslate.y = translate.y;
    console.log('onDragend', e);
  };

  document.addEventListener('dragover', e => e.dataTransfer && (e.dataTransfer.dropEffect = 'none'));

  return {
    props,

    showText,
    transform,

    onDragstart,
    onDrag,
    onDragend,
  };
};

function ScalableButton(
  model: ModelOf<typeof ScalableButtonModel>,
) {
  return (
    <div
      class="scalable-button"
      onClick={model.props.handleClick}
      on={{
        dragstart: model.onDragstart,
        drag: model.onDrag,
        dragend: model.onDragend,
      }}
      draggable
      style={{
        transform: model.transform.value,
      }}
    >
      {model.props.icon}

      <span class={`scalable-button__text
        ${model.showText.value ? '' : 'scalable-button__text--hidden'}`
      }>
        { model.props.buttonText }
      </span>
    </div>
  );
}

export default createComponent(ScalableButton, {
  model: ScalableButtonModel,
  initialState: {
    autoHidden: true,
    hiddenTime: 4000,
    buttonText: '',
    handleClick: () => ({}),
    icon: {},
  },
});
