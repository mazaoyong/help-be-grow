import BlockList from './blocks/list';
import BlockDetail from './blocks/detail';
import BlockSelectedEntry from './blocks/selected-entry';
import { RootModelType } from './Root.model';

export default function Root(model: RootModelType) {
  return (
    <div class="module-detail">
      {model.showDetail(<BlockDetail />)}
      {model.showEntry(<BlockSelectedEntry />)}
      {model.showList(<BlockList />)}
    </div>
  );
}
