import VisApp from '@/common/plugins/module/App';
import store from './store';
import router from './router';
import App from './App.vue';

import createDetailPage from './containers/detail';
import createAnswerPage from './containers/answer';
import createResultPage from './containers/result';
import createListPage from './containers/list';
import createInvalidPage from './containers/invalid';

import createRecommendModule from './modules/recommend';
import { createAnswer, createResult } from './modules/answer-card';
import createStartExam from './modules/start-exam';

import { initWXSdk } from '@youzan/wxsdk';
initWXSdk();

const DetailPage = createDetailPage();
DetailPage.useModule(createRecommendModule);
DetailPage.useModule(createStartExam);
VisApp.usePage(DetailPage);

const AnswerPage = createAnswerPage();
AnswerPage.useModule(createAnswer);
VisApp.usePage(AnswerPage);

const Result = createResultPage();
Result.useModule(createResult);
Result.useModule(createRecommendModule);
Result.useModule(createStartExam);
VisApp.usePage(Result);

const List = createListPage();
List.useModule(createRecommendModule);
VisApp.usePage(List);

const Invalid = createInvalidPage();
Invalid.useModule(createRecommendModule);
VisApp.usePage(Invalid);

VisApp({
  app: App,
  router,
  store,
});
