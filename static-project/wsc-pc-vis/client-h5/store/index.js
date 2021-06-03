import Vue from 'vue';
import Vuex from 'vuex';
import clueDetailModule from './clue-detail.js';
import editTagModule from './edit-tag';
import transferClueModule from './transfer-clue';
import abandonClueModule from './abandon-clue';
import updateClueModule from './update-clue';
import permissionModule from './permission';
import clueListModule from './my-clue';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    clueDetailModule,
    editTagModule,
    transferClueModule,
    abandonClueModule,
    updateClueModule,
    permissionModule,
    clueListModule,
  },
});

export default store;
