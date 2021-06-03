import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import { moduleList, assignOrderData } from './modules';

const isDev = process.env.NODE_ENV !== 'production';
const options = {
  strict: isDev,
  state,
  getters,
  mutations,
  actions,
};

const combineModuleOptions = key => {
  options[key] = Object.assign(
    options[key],
    ...moduleList.map(({ store }) => store[key]),
  );
};

combineModuleOptions('state');
combineModuleOptions('getters');
combineModuleOptions('mutations');
combineModuleOptions('actions');

const prepare = _global.prepare || {};
assignOrderData(options.state, prepare);

export default options;
