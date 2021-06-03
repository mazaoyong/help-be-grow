<script>
import { mapState } from 'vuex';
import GrouponExplainBlock from './modules/groupon-explain-block';
import PackageBuyBlock from './modules/package-buy-block';
import CourseBlock from './modules/course-block';
import StudentBLock from './modules/student-block';
import ClassBlock from './modules/class-block';
import ServiceBlock from './modules/service-block';
import CollectInfoBlock from './modules/info-collect-block';
import UmpBlock from './modules/ump-block';
import AssetsBlock from './modules/assets-block';
import BuyTipsBlock from './modules/buy-tips-block';
import SubmitBlock from './modules/submit-block';
import PayBlock from './modules/pay-block';
import { buyPrepare } from '../../func';

const components = [
  GrouponExplainBlock,
  PackageBuyBlock,
  CourseBlock,
  StudentBLock,
  ClassBlock,
  ServiceBlock,
  CollectInfoBlock,
  UmpBlock,
  AssetsBlock,
  BuyTipsBlock,
  SubmitBlock,
  PayBlock,
].reduce((components, component) => {
  components[component.name] = component;
  return components;
}, {});

export default {
  name: 'view-index',

  getters: ['customDesign'],

  computed: {
    ...mapState(['orderCreation']),
  },

  mounted() {
    buyPrepare(this.orderCreation);
  },

  render(createElement) {
    const elements = [];
    this.customDesign.forEach(config => {
      if (config.type && config.type.indexOf('cloud_') === 0) {
        elements.push(createElement(config.type));
      } else {
        const oneComponent = components[config.type];
        // design中的customProps只有在组件的props里声明过才能注入
        if (oneComponent) {
          const { customProps = {} } = config;
          const componentPropsData = {};
          if (oneComponent.props) {
            Object.keys(oneComponent.props).forEach(key => {
              componentPropsData[key] = customProps[key];
            });
          }
          elements.push(
            createElement(oneComponent, { props: componentPropsData })
          );
        }
      }
    });
    return createElement('div', { class: 'index-view' }, elements);
  },
};
</script>
