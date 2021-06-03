import React from 'react';
interface IUseUserScript {
  uniqueId: string;
  script: string;
  /** 在组件挂在阶段，会执行这个脚本，用于清除`script`的副作用 */
  callback?(): void;
}
/**
 * 将脚本插入到body中，可以用在动态添加图标，通过使用`script`属性并配合`callback`，就能通过
 * 操作DOM，为当前页面添加Iconfont的图标（*为了方便这种场景，在hooks中还提供了`iconfontAdaptor`
 * 方法，用于引用图标*）
 *
 * **请注意，在插入的脚本中，必须在头部添加`// dangerous insert scripts, userId=${getYZUid()}`
 * 这样的注释**
 */
export const useUserScript = (params: IUseUserScript) => {
  const { uniqueId, script, callback } = params;

  React.useEffect(() => {
    const scriptId = `script[data-script="${uniqueId}"]`;
    if (isLegalInsertScript(script)) {
      if (!document.body.querySelector(scriptId)) {
        const userScript = document.createElement('script');
        userScript.setAttribute('data-override', uniqueId);
        userScript.setAttribute('type', 'text/javascript');
        userScript.innerHTML = script;
        document.body.appendChild(userScript);
      }
    }
    // 在react router模式下，需要在组件卸载的时候移除样式，否则会在页面回退的时候产生样式错误
    return () => {
      if (callback) callback();
      const userScript = document.querySelector(scriptId);
      if (userScript) document.body.removeChild(userScript);
    };
  }, [callback, script, uniqueId]);
};

function isLegalInsertScript(scriptStr: string) {
  const yzUid = getYZUid();
  const checkStr = `// dangerous insert scripts, userId=${yzUid}`;
  return scriptStr.startsWith(checkStr);
}

export function getYZUid() {
  const cookie = document.cookie;
  if (cookie) {
    const matchedYZUid = cookie.match(/yz_log_uuid=([\d\w\-_]+);/);
    if (matchedYZUid) return matchedYZUid[1];
  }
  return '';
}

/**
 * @param pageName 页面名，会作为script标签的ID，必须指定，然后会在hooks移除的时候删除该script
 * @param iconfontCDN iconfont的symbol地址
 */
export function iconfontAdaptor(pageName: string, iconfontCDN: string) {
  const userScript = `// dangerous insert scripts, userId=${getYZUid()}
const iconfontTarget = document.createElement('script');
iconfontTarget.id="${pageName}";
iconfontTarget.src="${iconfontCDN}";
document.head.appendChild(iconfontTarget);`;

  function deleteUserScriptAndIconfont() {
    const userScript = document.getElementById(pageName);
    if (userScript) {
      document.head.removeChild(userScript);
    }
  }
  return {
    script: userScript,
    callback: deleteUserScriptAndIconfont,
  };
}
