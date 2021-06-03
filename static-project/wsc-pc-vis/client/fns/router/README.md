# Router

> Owner 明远

路由配置相关方法，包括 `createRouter`、`visPush`、`withVisRouter`

## createRouter

react-router 的封装，采用类似 vue-router 的 json 配置的方式实现，同时将面包屑等与页面业务无关的逻辑到路由来做。

### 使用方式

```ts
import ReactDOM from 'react-dom';
import { createRouter } from 'fns/router';

const routes = [...];
const Routes = createRouter(routes);

ReactDOM.render(Routes, document.getElementById('#app'));
```

createRouter 的参数类型是 `IVisRoutes[]`:

```ts
import { RouteProps } from 'react-router';

interface IVisRoutes extends RouteProps {
  children?: IVisRoutes[]; // 子路由
  redirect?: string; // 重定向的路由
  index?: string; // IndexRedirect 子路由
  breadcrumb?: string | IVisBreadcrumb | ((nextState: RouterState) => string | IVisBreadcrumb); // 面包屑
}

interface IVisBreadcrumb {
  project?: string | { name: string; href?: string };
  page?: string;
}
```

### breadcrumb 面包屑

面包屑现在只需要在创建路由时在页面定义就可以了，不用在页面中修改，让页面更加专注于功能实现。

通过 `createRouter` 方法中的 `breadcrumb` 这个属性修改面包屑;

路由需要在 views 模版中配置，模版如下：

```html
<div class="zent-breadcrumb" id="js-page-breadcrumb"></div>
  <a href="{{ URL.site('/ump/appcenter', 'v4') }}">应用中心</a>
  <a href="{{ URL.site('/ump/appcenter/edu', 'v4') }}">督学互动</a>
  <span class="project" data-href="{{ URL.site('/vis/pct/page/punch', 'v4') }}"></span>
</div>
```

`breadcrumb` 会在 `Router` 的 `onChange` 方法时执行。可以接受 3 中类型的参数：

#### 1. `string`

 当 `breadcrumb` 的参数类型为 `string` 时， 会把 `.project` 的 `span` 标签 更改为 `a` 标签，并把 `data-href` 的属性赋给 `href`，同时会在 `.project` 后面 `append('<span class="page">${breadcrumb value</span>}')` ;

#### 2. `IVisBreadcrumb`

```ts
interface IVisBreadcrumb {
  project?: string | { name: string; href?: string };
  page?: string;
}
```

 当参数类型为 `IVisBreadcrumb` 时，可以同时修改 `.project` 和 `.page`.

- 当 `project` 为 `string` 时，只会修改 `.project` 的 text;
- 当 `project` 为对象时，如果有 `name` 属性，则 `.project` 的 text 改为 `project.name`，如果有 href，则将 `data-href` 改为 `project.href`，如果没有 `href`，则将 `.project` 改为 `span` 标签;
- 当有 `page` 时，如果时空字符串，则会将 `.project` 改为 `span` 标签；
- 当有 `page` 时，如果不为空字符串，如果已存在 `.page` 标签，先 remove，然后将 `.project` 改为 `a` 标签，将 `data-href` 的属性赋给 `href`，同时会在 `.project` 后面 `append('<span class="page">${page}</span>')`

#### 3. `((nextState: RouterState) => string | IVisBreadcrumb)`

当参数类型为  函数是，会在 `Router` 的 `onChange` 触发时运行这个方法，并将 `RouterState` 传入，取返回值，按照上面的方法处理。

## visPush

visPush 是一个方法，主要是用来在知识付费各个页面之前跳转使用。

### API

```ts
function visPush(path: string, target?: string): void;
```

### 使用方式

```ts
import { visPush } from 'fns/router';

visPush('content/add', '_blank');
```

该方法接受一个 `string` 作为 `path`，会对 `path` 进行正则匹配:

```ts
const reg = /^(\/*)(\w+)\/(.+)/;
const paths = path.match(reg);
```

跳转方式如下:

- 第一个匹配位忽略;
- 第二个匹配位进行拼接 `/v4/vis/pct/page/${paths[2]}`，判断是否与 `window.location.pathname` 相等;
- 若相等，则用 `hashHistory.push(paths[3])`;
- 若不相等，则用 `` window.location.href =`${baseURL}/${paths[2]}#/\${paths[3]}`; ``

第二个参数可传可不传，如果传 '\_blank'，则会在新页面打开，传其它值，则忽略；

### example

```ts
visPush('content/add');
// tabs 页面
window.location.href = `${baseURL}/content#/add`;
// content 页面
hashHistory.push('add');

visPush('punch/detail/3nht7cakzvjbw');
// tabs 页面
window.location.href = `${baseURL}/punch#/detail/3nht7cakzvjbw`;
// punch 页面
hashHistory.push('detail/3nht7cakzvjbw');
```

## `withVisRouter`

高阶组件，包括对 `visPush` 和 `pctCheck` 的封装.

### API

```ts
interface IVisRouterProps {
  pctCheck?: boolean;
  to?: string;
  href?: string;
  onClick?: () => void;
  [key: string]: any;
  target?: string;
}
```

### 使用方式

```tsx
import withVisRouter, { IVisRouterProps } from './with-router';

export const VisButton = withVisRouter(Button as ComponentType<IVisRouterProps>);

<VisButton pctCheck to="content/add">
  Click Me
</VisButton>;
```

- `pctCheck` 属性点击时用 `auth/pctCheck` 方法进行权限校验，如果不通过会提示订阅，通过会触发 `onClick` 或 跳转;
- `to` 和 `href` 支持传入 `visPush` 的参数，会在点击时调用 `visPush` 方法做页面见跳转，`href` 会覆盖 `to`;
- 若有 `onClick` 方法，则会执行 `onClick` 方法，不会执行 `visPush`;

## VisButton

`withVisRouter` 对 `zent` `Button` 的封装;

## VisLink

`withVisRouter` 对 `react-router` `Link` 的封装;

## Change Log

### docs: 添加说明文档 (2019/01/22)

- `router-wrap` rename `with-router` @明远
- add `README.md` @明远

## TODO

- [ ] `createRouter` 使用 `react-Router` 的 `routes` 参数来做;
