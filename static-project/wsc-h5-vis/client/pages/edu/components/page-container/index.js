import PageContainer from './index.vue';

PageContainer.install = function(Vue) {
  Vue.component(PageContainer.name, PageContainer);
};

export default PageContainer;
