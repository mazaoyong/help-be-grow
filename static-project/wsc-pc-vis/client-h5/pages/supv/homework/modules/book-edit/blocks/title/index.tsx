import { Field as VanField } from 'vant';
import { createBlock, ModelOf } from '@youzan/tany-vue';
import TitleModel from './model';
import './style';

function Title(model: ModelOf<typeof TitleModel>) {
  return (
    <div class="card block-title">
      <VanField
        value={model.title.value}
        placeholder="请输入作业名称，最多40个字"
        maxLength={40}
        rows="1"
        autosize
        type="textarea"
        onInput={model.setTitle}
      />

      {
        model.errMsg.value
          ? (
            <div class="block-title__error-msg">
              {model.errMsg.value}
            </div>
          )
          : null
      }
    </div>
  );
};

export default createBlock({
  model: TitleModel,
  root: Title,
});
