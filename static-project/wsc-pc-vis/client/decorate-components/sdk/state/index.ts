import { combineReducers } from 'redux';

import comsState from './coms-list';
import editorsState from './editors';
import extraOptionsState from './extra-options';
import previewState from './preview';

export default combineReducers({
  comsState,
  editorsState,
  extraOptionsState,
  previewState,
});
