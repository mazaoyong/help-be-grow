/**
 * Copy from wsc-h5-trade
 * 异步加载 JS 文件
 */

export default function loadScript(src) {
  return new Promise((resolve, reject) => {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    head.appendChild(script);
  });
}
