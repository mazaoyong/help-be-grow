import * as ReactDOM from 'react-dom';

export default function registerPage(options) {
  let customProps = options.customProps || {};
  // 容器的react与业务方的react彼此隔离，无法处理业务页面的Notify、dialog等公共组件的清理
  customProps = {
    ...customProps,
    unmountComponent: ReactDOM.unmountComponentAtNode,
  };

  window.ZanSpa.registerPage({
    ...options,
    customProps,
  });
}
