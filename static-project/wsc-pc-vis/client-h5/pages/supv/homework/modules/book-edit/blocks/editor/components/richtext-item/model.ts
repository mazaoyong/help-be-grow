import Vue from 'vue';
import { computed, ref, watch } from '@youzan/tany-vue';
import UA from '@youzan/utils/browser/ua_browser';
import './style';
import { parseContent } from './parseContent';

export const initialState = {
  content: '',
  index: -1,
  updateItem: (index: number, payload: any) => {},
};

type Props<P> = {
  [k in keyof P]: P[k];
} & { children: any };

const RichTextItemModel = (
  props: Props<typeof initialState>,
) => {
  const { index, updateItem } = props;

  const content = ref(props.content);
  watch([() => props.content], ([newContent]) => {
    content.value = newContent;
  });
  const placeholder = computed(() => focused.value ? '' : '<div class="text--gray">请输入作业内容</div>');
  const parsedContent = computed(() => parseContent(content.value || placeholder.value));
  const setContent = (text: string) => {
    console.log('setContent', text)
    content.value = text;
  };

  // 实现恢复上一次的光标位置
  let lastRange: any;
  const setLastRange = () => {
    // Get insert container
    const selection = window.getSelection();
    if (selection) {
      lastRange = selection.getRangeAt(0);
    } else {
      lastRange = null;
    }
  }
  const restoreRange = () => {
    if (lastRange) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(lastRange);
      }
      lastRange = null;
    }
  }

  // Editor
  const focused = ref(false);
  const editorRef = ref(null);
  const inputRef = ref(null);
  const itemRef = ref(null);
  let keyboardHeight = ref(0);
  const viewportHeight = window.innerHeight;
  const moduleElem = document.querySelector('.module-book-edit');
  const focus = () => {
    focused.value = true;
    if (moduleElem) {
      (moduleElem as any).style.paddingBottom = '100vh';
    }
    setTimeout(() => {
      if (index !== 0) {
        (editorRef.value as any).scrollIntoView(true);
      }

      if (!keyboardHeight.value) {
        if (UA.isIOS()) {
          setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
            (inputRef.value as any).focus();
            // restoreRange();
          }, 100);
        } else {
          keyboardHeight.value = -1;
        }
      }
    }, 100);
  };
  const blur = () => {
    if (moduleElem) {
      (moduleElem as any).style.paddingBottom = '100px';
    }

    if (keyboardHeight.value) {
      focused.value = false;
    }

    // setLastRange();

    setContent((editorRef.value as any).innerHTML);
    updateItem(index, {
      content: content.value,
    });
  };
  const getKeyboardHeight = () => {
    setTimeout(() => {
      keyboardHeight.value = (viewportHeight - window.innerHeight) || -1;
      Vue.nextTick(() => {
        (editorRef.value as any).focus();
      });
    }, 200);
  };

  // Uploader
  const uploaderRef = ref(null);
  const openUploader = (e: InputEvent) => {
    e.stopPropagation();
    (uploaderRef.value as any).click();
  }
  const images = ref([] as any[]);
  const addImage = (data: any) => {
    if (data.length) {
      const imageFile = data[data.length - 1];

      // Insert before upload
      if (imageFile.url && imageFile.status === 0) {
        (editorRef.value as any).focus();
        Vue.nextTick(() => {
          document.execCommand('insertImage', false, imageFile.url);
          (editorRef.value as any).blur();
        });
      }
    }
  }

  return {
    itemRef,
    editorRef,
    inputRef,
    focused,
    focus,
    blur,

    keyboardHeight,
    getKeyboardHeight,

    content,
    parsedContent,
    setContent,

    uploaderRef,
    openUploader,

    images,
    addImage,
  };
};

export default RichTextItemModel;
