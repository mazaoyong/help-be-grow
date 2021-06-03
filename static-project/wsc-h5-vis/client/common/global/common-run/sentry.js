import RavenVue from 'raven-js/plugins/vue';
import Vue from 'vue';
import get from 'lodash/get';

try {
  const Raven = window.Raven;
  if (Raven) {
    const _global = window._global || {};
    const mpData = _global.mp_data || {};
    const ravenOptions = {
      ignoreUrls: [
        // Chrome extensions
        /extensions\//i,
        /^chrome:\/\//i,
        // ignore js
        /libs\/ravenjs\//i,
        /qbox\.me\/vds\.js/i,
      ],
      whitelistUrls: [
        /yzcdn\.cn/,
      ],
      ignoreErrors: [
        /WeixinJSBridge is not defined/,
        /_vds_hybrid/,
        /TouTiao is not defined/,
        /WebViewJavascriptBridge is not defined/,
        /Can't find variable: MyAppGetLinkHREFAtPoint/,
        /ToutiaoJSBridge is not defined/,
        /setWebViewFlag is not defined/,
        /Cannot read property 'remove' of undefined/,
        /sendPic2Native is not defined/,
        /Can only call Element.matches on instances of Element/,
        /mag is not defined/,
        /The object is in an invalid state/,
        /Failed to execute 'send' on 'WebSocket'/,
        /onNativeTopLeftClick is not defined/,
        /x5onSkinSwitch is not defined/,
        /ResizeObserver loop limit exceeded/,
        /evaluating 'document.elementFromPoint/,
        /Illegal invocation/,
        /调用的对象无效/,
        /Invalid calling object/,
        /Unable to get property 'oldUrl' of undefined or null reference/,
      ],
      dataCallback(data = {}) {
        if (data.logger !== 'ajax') {
          const msg = get(data, 'exception.values[0]', {});
          window.yzStackLog.log({
            name: 'sentry',
            message: `${msg.type} ${msg.value} ${_global.yzLogUuid}`,
            extra: data,
            level: 'warn',
          });
          window.yzStackLog.monitor({
            extra: {
              name: 'sentry',
              action: 'ajax',
            },
          });
        }
        return data;
      },
    };
    Raven.config('https://962f46c60db24911b4a15be6cf63fc29@crash.youzan.com/86', ravenOptions)
      .addPlugin(RavenVue, Vue)
      .install();
    Raven.setUserContext({
      project: 'wsc-h5-vis',
      kdt_id: _global.kdt_id,
      shop_name: mpData.shop_name,
    });
    Raven.setTagsContext({
      uuid: _global.yzLogUuid,
    });
  }
} catch (e) {
  console.log(e);
}
