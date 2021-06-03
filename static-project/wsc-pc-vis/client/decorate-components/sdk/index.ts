import state from './state';
import API from './api';
import { Actions } from 'zan-shuai';
import { checkCompatibleBrowser } from './common/compatible-browser';

const api = new API();
const store = api.configureStore(state);

checkCompatibleBrowser();

window.decorateSDK = {
  api,
  store,
  Actions,
};

export { api, store };
