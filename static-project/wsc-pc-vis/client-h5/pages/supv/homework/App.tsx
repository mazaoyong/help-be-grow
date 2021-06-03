import { createBlock } from '@youzan/tany-vue';
import AppModel from './App.model';
import { AppRouterView } from './router';
import './style';

function App() {
  return (
    <div id="App" class="app-homework">
      <AppRouterView />
    </div>
  );
};

export default createBlock({
  model: AppModel,
  root: App,
});
