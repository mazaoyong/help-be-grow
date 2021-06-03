import { initMallCloudSandbox } from '../common/mall-cloud-sandbox';
const actions = {
  // yzyun 定制数据前端jsonp异步获取，加个检查避免异步出现问题，蛋疼
  CHECK_YZYUN_DESIGN_STATUS({ state, commit }) {
    let maxCheckCnt = 10;
    function checkNewDesign() {
      maxCheckCnt--;
      if ((state.design || []).length > 0) {
        initMallCloudSandbox();
        return;
      }
      if ((_global.design || []).length > 0) {
        initMallCloudSandbox();
        commit('UPDATE_DESIGN_DATA', _global.design);
        return;
      };
      if (maxCheckCnt > 0) {
        setTimeout(() => {
          checkNewDesign();
        }, 500);
      }
    }
    checkNewDesign();
  },
};
export default actions;
