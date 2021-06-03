// import { skynetLogger } from './logger';

export default function asyncComponentLoader(promiseFn, name, { tryTime = 2 } = {}) {
  // 重试两次
  function tryLoadComponent() {
    let componentPromise = promiseFn();
    while (tryTime) {
      componentPromise = componentPromise.catch(e => promiseFn());
      tryTime--;
    }
    return componentPromise;
  }

  return () => tryLoadComponent().catch(error => {
    // skynetLogger(`${name} 组件加载失败`, { error });
    console.error(`${name} 组件加载失败`, { error });
    return {
      render: h => h('div'),
    };
  });
}
