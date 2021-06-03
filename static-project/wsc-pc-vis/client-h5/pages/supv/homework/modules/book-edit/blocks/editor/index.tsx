import { Button as VanButton } from 'vant';
import {
  icon as VisIcon,
  VideoPatch as VisVideoPatch,
  AudioWrap as VisAudioWrap,
} from '@youzan/vis-ui';
import { createBlock } from '@youzan/tany-vue';
import { MEDIA_ITEM_TYPE } from 'domain/supv/homework/constants';
import EditorModel, { EditorModelType } from './model';
import buttons from './fragments/buttons';
import './style';

import Editable from './components/editable';
import RichtextItem from './components/richtext-item';
import { IExerciseDetailItemDTO } from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';

const ButtonProps = { props: { size: 'small', round: true } };

function renderItem(
  item: IExerciseDetailItemDTO,
  index: number,
  updateItem: (index: number, payload: any) => void,
) {
  switch(item.mediaType) {
    case MEDIA_ITEM_TYPE.RICHTEXT:
      return (
        <RichtextItem
          content={item.richTextItem.content || ''}
          index={index}
          updateItem={updateItem}
        />
      );
    case MEDIA_ITEM_TYPE.AUDIO:
      return (
        <VisAudioWrap
          src={item.audioItem.url || ''}
          name={item.audioItem.name || ''}
          preload="none"
        />
      );
    case MEDIA_ITEM_TYPE.VIDEO:
      return (
        <VisVideoPatch
          poster={item.videoItem.coverUrl}
          source={item.videoItem.url}
        />
      );
    default:
      return null
  }
}

function renderButtons(
  addItem: EditorModelType['addItem'],
) {
  return (
    <div class="card block-editor__buttons">
      {
        buttons.map(button => button.uploader!(
            (
              <VanButton
                {...ButtonProps}
                onClick={
                  button.type === MEDIA_ITEM_TYPE.RICHTEXT
                    ? () => addItem(button.type, {}) : () => {}
                }
              >
                <VisIcon name={button.iconName} size="18px" color="#323233" />
                { button.text }
              </VanButton>
            ),
            {
              handleChange: (data) => {
                console.log('上传多媒体', data);
                let target
                if (data.length && (target = data[data.length-1]) && target.status === 0) {
                  addItem(button.type, target);
                }
              },
            },
          )
        )
      }
    </div>
  )
}

function Editor(model: EditorModelType) {
  return (
    <div class="block-editor">
      {
        model.form.detail.map((item, index) => (
          <Editable
            key={index+1}
            showOperators={model.showOperators.value}
            deleteItem={() => model.deleteItem(index)}
            errMsg={model.errMsg.value[index]}
          >
            { renderItem(item as any, index, model.updateItem) }
          </Editable>
        ))
      }

      { renderButtons(model.addItem) }
    </div>
  );
};

export default createBlock({
  root: Editor,
  model: EditorModel,
  components: [Editable, RichtextItem],
});
