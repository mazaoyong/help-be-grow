import smoothscroll from 'smoothscroll-polyfill';
import ProxyPolyfill from './proxy-polyfill';

smoothscroll.polyfill();

window._isNativeProxy = true;
if (!window.Proxy) {
  window._isNativeProxy = false;
  window.Proxy = ProxyPolyfill;
}
