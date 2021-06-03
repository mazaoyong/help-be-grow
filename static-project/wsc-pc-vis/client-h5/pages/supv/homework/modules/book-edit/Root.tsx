import TitleBlock from './blocks/title';
import EditorBlock from './blocks/editor/index';
import SettingsBlock from './blocks/settings/index';
import BottomActionsBlock from './blocks/bottom-actions/index';

function Root() {
  return (
    <div class="module-book-edit">
      <TitleBlock />
      <EditorBlock />
      <SettingsBlock />
      <BottomActionsBlock />
    </div>
  );
};

export default Root;
