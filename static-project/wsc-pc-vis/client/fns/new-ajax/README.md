# Ajax 请求

## 使用方式

```ts
import ajax, { visAjax, wscAjax, ironAjax } from 'fns/new-ajax';
import ajaxWrap from 'fns/new-ajax/ajax-wrap';
```

### ajax 方法

ajax 方法是对 [zan-pc-ajax](http://npm.qima-inc.com/package/zan-pc-ajax) 的封装，只做了一层数据转换和添加了 `contentType: application/json` 请求头。

使用方式：

```ts
import ajax from 'fns/new-ajax';

/**
 * 通用 ajax 请求方法
 * @param {string} method 方法
 * @param {string} url 请求地址
 * @param {object} [data={}] 参数
 * @returns {Promise<any>}
 */
function ajax(
  method: string,
  url: string,
  data?: {},
  options?: IAjaxOptionsWithoutUrl,
): Promise<any>;
```

### ajaxWrap 方法

ajaxWrap 方法是一个高阶函数，它支持传入一个 prefix 字符串，然后返回一个 ajax 方法，此 ajax 方法会在 url 参数上加上 prefix 前缀请求。

使用方式

```ts
import ajaxWrap from 'fns/new-ajax/ajax-wrap';

const visAjax = ajaxWrap(window._global.url.v4 + '/vis');

visAjax(method, url, (data = {}), (options = {}));
```

此时，visAjax 方法的 url 请求时都会变成 `window._global.url.v4 + '/vis' + url` 的形式。

 已经封装好了三个方法：

```ts
// 请求 wsc-pc-vis 的接口用这个方法，会自动补齐 domain/v4/vis
export const visAjax = ajaxWrap(window._global.url.v4 + '/vis');
// 请求 wsc-node 的接口用这个方法，会自动补齐 domain/v3
export const wscAjax = ajaxWrap(window._global.url.wsc);
// 请求 iron 的接口用这个方法，会自动补齐 domain/v2
export const ironAjax = ajaxWrap(window._global.url.www);
```
