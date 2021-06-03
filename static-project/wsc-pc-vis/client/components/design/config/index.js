import Editor from './ConfigEditor';
import Preview from './ConfigPreview';

import './style/index.scss';

export default {
  type: Editor.designType,
  editor: Editor,
  preview: Preview
};
