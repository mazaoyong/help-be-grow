import Editor from './RichtextEditor';
import Preview from './RichtextPreview';

import './style/index.scss';

export default {
  type: Editor.designType,
  editor: Editor,
  preview: Preview,
};
