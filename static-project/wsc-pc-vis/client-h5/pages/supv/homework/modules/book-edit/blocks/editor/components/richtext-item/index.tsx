import { popup as VanPopup } from 'vant';
import { icon as VisIcon, ImgUploaderSingle as VisImgUploaderSingle } from '@youzan/vis-ui';
import { createComponent, ModelOf } from '@youzan/tany-vue';
import RichTextItemModel, { initialState } from './model';
import './style';

function RichTextItem(
  model: ModelOf<typeof RichTextItemModel>,
) {
  return (
    <div
      ref="itemRef"
      class="richtext-item"
    >
      <div
        ref="editorRef"
        class="richtext-item__editor"
        contentEditable
        domPropsInnerHTML={model.parsedContent.value}
        onFocus={model.focus}
        onBlur={model.blur}
      />

      <VanPopup
        value={model.focused.value}
        overlay={false}
        position="bottom"
        style={{
          bottom: `${model.keyboardHeight.value || 0}px`,
        }}
      >
        <div
          class="richtext-item__keyboard-toolbar"
        >
          <VisImgUploaderSingle
            canMaxHiddenInput={false}
            previewImage={false}
            max={9999}
            onChanged={model.addImage}
            token-url="/v4/vis/h5/edu/commom/material/getQiniuAggregateUploadToken.json"
            options={
              {
                mediaAccessType: 1,
                storeType: 2,
                channel: 'owl_ceres_img',
              }
            }
          >
            <span>
              <VisIcon name="tupian" size="18px" color="#323233" />
              插入图片
            </span>
          </VisImgUploaderSingle>
          {
            model.keyboardHeight.value
              ? null
              : (
                <div class="fake-input">
                  <input ref="inputRef" onFocus={model.getKeyboardHeight}></input>
                </div>
              )
          }
          <span class="text--green" onClick={model.blur}>
            完成
          </span>
        </div>
      </VanPopup>
    </div>
  );
}

export default createComponent(
  RichTextItem,
  {
    model: RichTextItemModel,
    initialState,
  },
);
