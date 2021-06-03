import { createBlock, ModelOf } from '@youzan/tany-vue';
import AppModel from './App.model';
import { AppRouterView } from './router';
import Vue from 'vue';
import { Toast } from 'vant';

Vue.use(Toast);

function App(model: ModelOf<typeof AppModel>) {
  return (
    <div id="App">
      <AppRouterView />
    </div>
  );
};

export default createBlock({
  model: AppModel,
  root: App,
});
