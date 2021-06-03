import { ElementType, IFormElement } from '../../../types';

export const emptyRichTextField: IFormElement = {
  mediaType: ElementType.RichText,
  detail: {
    content: '',
  },
  serialNo: 0,
};

function transP(node) {
  node.tagName = 'p';
  node.setStyle();
}

export const richTextFilter = {
  // 直接删除及其字节点内容
  'caption': transP,
  'th': transP,
  'tr': transP,
  'h1': transP,
  'h2': transP,
  'h3': transP,
  'h4': transP,
  'h5': transP,
  'h6': transP,
};
