import Vue from 'vue';
import App from './App.vue';
import AppMoments from './AppMoments';
import Args from 'zan-utils/url/args';

const pageFrom = Args.get('pageFrom');

let AppContainer = App;

if (pageFrom === 'moments' || pageFrom === 'momentsEdit') {
  AppContainer = AppMoments;
} else {
  AppContainer = App;
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(AppContainer),
});
