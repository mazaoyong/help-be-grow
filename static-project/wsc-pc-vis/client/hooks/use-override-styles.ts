import React from 'react';
interface IUseOverrideStyleParams {
  uniqueId: string;
  overrideStyles: string;
}
/**
 * 在需要对.app-inner进行样式修改的时候，使用这个方法来注入一些样式会很方便
 *
 * 使用场景比如：
 * 1. **需要将内容分割成透明背景的上下两个部分**
 * 2. 重写高优先级的样式
 */
export const useOverrideStyle = (params: IUseOverrideStyleParams) => {
  const { uniqueId, overrideStyles } = params;

  React.useEffect(() => {
    // 覆盖样式背景
    const styleId = `style[data-override="${uniqueId}"]`;
    if (!document.querySelector(styleId)) {
      const overrideStyle = document.createElement('style');
      overrideStyle.setAttribute('data-override', uniqueId);
      overrideStyle.innerHTML = overrideStyles;
      document.head.appendChild(overrideStyle);
    }
    // 在react router模式下，需要在组件卸载的时候移除样式，否则会在页面回退的时候产生样式错误
    return () => {
      const overrideStyle = document.querySelector(styleId);
      if (overrideStyle) document.head.removeChild(overrideStyle);
    };
  }, [overrideStyles, uniqueId]);
};
