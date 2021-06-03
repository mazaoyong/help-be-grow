import Editor from './AudioEditor';
import Preview from './AudioPreview';

import './style/index.scss';

export default {
  type: Editor.designType,
  editor: Editor,
  preview: Preview,
};
