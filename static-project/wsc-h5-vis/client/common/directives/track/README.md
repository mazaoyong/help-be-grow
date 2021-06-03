# Track

## 关于埋点方案

关于埋点方案的设计以及思考，可以看这个文章：[埋点方案](https://shimo.im/docs/B1Aw1yr4NjiEwnqm)

## 初始化

初始化 Track 包括两步：

1. 在页面 Vue 实例同级目录下新增文件`track-list.ts`；
2. 引入 track Vue plugin。

```jsx
import Track from "@/common/directives/track";
import ZanTracker from "@youzan/zan-web-tracker";

import trackConfig from "./track-list";

Vue.use(Track, {
  configs: trackConfig,
  logClient: ZanTracker
});
```

### Options

Track 能够在初始化 Vue Plugin 时通过设置 options，来修改一些环境埋点统一的环境变量（下表的具体的 TS 定义，可见属性介绍部分）。

| 属性             | 描述                                                                     | 类型                    | 是否必填 |
| ---------------- | ------------------------------------------------------------------------ | ----------------------- | -------- |
| config           | 埋点任务配置                                                             | `IConfig[]`             | 是       |
| logClient        | 埋点采用的 SDK<br />（其实只能用<br />zan-web-tracker)                   | `ZanWebTracker`         | 是       |
| logClientSetting | 透传给 SDK 的配置项                                                      | `IGlobalTrackerSetting` | 否       |
| userInfoPath     | 用户信息路径<br />默认为*\_global.yz_user*<br />备选值是*\_global.buyer* | string                  | 否       |
| attachTimestamp  | 是否在上报数据中<br />附上时间戳                                         | boolean                 | 否       |
| globalPageType   | 全局 pt 的值                                                             | string                  | 否       |

### 例子

以`wsc-h5-vis`知识付费页面的埋点为例，配置如下：

```javascript
Vue.use(Track, {
  // attachTimestamp: true,
  config: trackConfig,
  logClient: ZanTracker,
  logClientSetting: {
    app: "wsc-h5-vis"
  },
  globalPageType: "pct"
});
```

## 属性介绍

### IGlobalTrackerSetting

```typescript
interface IGlobalTrackerSetting {
  yai?: string;
  app?: string;
  requestUrl?: string;
  autoEnterpage?: boolean;
  autoSinglePageEnterpage?: boolean;
  autoSpm?: boolean;
  autoClick?: boolean;
  autoNodeClick?: boolean;
  autoNodeView?: boolean;
  beforeEnterpage?: boolean;
}
```

设置定义同[`zan-web-tracker`](*http://fedoc.qima-inc.com/zan-web-tracker/docs/init.html*)；请按照官方文档指导初始化 tracker。

### IConfig

config 作为任务的配置项，主要用于配置自定义事件，建议将配置文件`track-list`设置为`ts`文件，方便导入类型获取完整的类型提示；即使是一个自定义的埋点事件，它也理应具有一个明确的分类来标识事件。

config 一共有 6 种类型，分别是：`进入页面`、`离开页面`、`交互事件`、`循环事件`、`数据变更事件`和`元素曝光事件`。在我们的项目中，一般不同关注前两个事件，前者会由 zan-web-tracker 自动埋点，后者因为 api 不稳定，不建议使用。

#### 基本配置

| 属性      | 描述                                         | 类型    | 是否必填 |
| --------- | -------------------------------------------- | ------- | -------- |
| name      | 事件名称（是个唯一值，名称为任意字符串）     | string  | 是       |
| eventId   | 埋点平台设置的 ei 的值                       | string  | 是       |
| eventName | 埋点平台设置的 en 的值                       | string  | 是       |
| timings   | 事件的分类，是一个枚举值                     | Timings | 是       |
| pageType  | 埋点平台的 pt 的值，一般在初始化中统一初始化 | string  | 否       |
| data      | 上报的数据，会添加到 params 字段中           | object  | 否       |

## 添加任务

任务存在一个任务池的概念，只有在任务池中的任务才能被触发，初始化过程中传入的 config 中定义的任务会被初始化，然后根据其类型（timing）来决定是否运行；没有被初始化的任务，可以通过在代码中主动调用：

```typescript
this.$track.addTask(task: IConfig | IConfig[])；
$track.addTask(task: IConfig | IConfig[]);
```

将任务动态的添加入任务池中。这么做能够更加精准的控制任务的添加，避免初始化过程中初始化过多的任务，以及避免一些意料之外的数据上报，这在一些错误埋点中非常有用。

以下将会提供一些任务定义的模板代码以供使用。

### EnterPage 进入页面

进入页面的埋点事件，有且只会触发一次，如果采用函数的方式返回数据，请注意使用的数据是否能够获取的到。

```typescript
import { Timings, IConfig } from "@/common/directives/track";

const $taskName: IConfig = {
  name: $taskName,
  eventName: $eventName,
  eventId: $eventId,
  timing: Timings.EnterPage,
  /** 设置来源字段的key，默认值为eduOrigin */
  // originKey?: string;
  /** 是否通过解析url中的来源信息 */
  // withOrigin?: boolean;
  data: {
    $property: $value
  }
};
```

在很多活动中，需要设置页面来源来追踪多少用户浏览过活动页之后进入商详页或者是下单页，这时候，通过在活动页中设置`edu`参数（格式为`eduOrigin=ORIGIN_KEY::ORIGIN_VALUE`），然后配合`EnterPage`类型中的`withOrigin`，
就能在进入页面事件中设置`origin`和`origin_value`的值，来上报来源信息。

### LeavePage 离开页面

事件触发并不稳定，如果可以，请避免使用该事件，转而定义目标页面的 enterPage 事件。

### Circulation 循环事件

循环时间将会启用一个定时器并循环触发事件队列，触发时间误差在 JS 误差范围内，当一个 Vue 实例中有多个循环事件时，会通过求得所有事件触发间隔的最大公约数来复用一个定时器来触发事件队列。

```typescript
import { Timings, IConfig } from '@/common/directives/track';

const $taskName: IConfig = {
  name: $taskName,
  eventName: $eventName,
  eventId: $eventId,
  timing: Timings.Circulation,
  /** 最大触发次数 */
  // maxTimes: number;
  /** 时间间隔，时间间隔要大于5s */
  interval: $interval;
  /** 页面加载就执行 */
  // runOnEnterPage: boolean;
  /** 在离开页面的时候执行事件 */
  // runOnLeavePage: boolean;
  data(store) {
    if () {
      return {
        $property: $value,
      };
    }
    return 'TERMINATE';
  },
}
```

### Interaction 交互事件

交互事件定义较为简单，需要配合 Vue 指令绑定目标元素，或者是在事件中主动调用函数运行事件。

```typescript
import { Timings, IConfig } from "@/common/directives/track";

const $taskName: IConfig = {
  name: $taskName,
  eventName: $eventName,
  eventId: $eventId,
  timing: Timings.Interaction,
  /** 最大触发次数 */
  // maxTimes: number;
  data: {
    $property: $value
  }
};
```

绑定事件：

```html
<template>
  <!--如果任务在任务队列中-->
  <target-ele v-track:click.$taskName />
  <!--如果任务不在任务队列中-->
  <target-ele v-track:ckick.$taskName="$taskName" />
</template>
<script>
  import { $taskName } from "path/to/task-list";
  export default {
    data() {
      return {
        $taskName
      };
    }
  };
</script>
```

主动触发事件：

```html
<template>
  <target-ele @click="handleClick" />
</template>
<script>
  export default {
    methods: {
      handleClick() {
        this.$track.runTask($taskName, Timings.Interaction);
      }
    }
  };
</script>
```

_大多数场景下，不建议采用这个方式触发，因为通过这个方式，zan-web-tracker 无法通过 evt 对象获取元素相关信息_

### ChangeByData 数据监听事件

数据监听事件能够监听 deps 数组中的数据，如果数据发生改变，就会触发埋点任务，因为该事件只会在数据发生改变的时候触发，所以建议初始化过程中直接将其添加至任务池进行初始化。

```typescript
import { Timings, IConfig } from "@/common/directives/track";

const $taskName: IConfig = {
  name: $taskName,
  eventName: $eventName,
  eventId: $eventId,
  timing: Timings.ChangeByData,
  /** 是否能够触发埋点请求，支持传入函数自行
   * 判断是否能够触发；或者是传入一个或多个key，
   *	通过判断key是否改变决定是否触发更新
   */
  // deps?: string | string[] | shouldInvokeFunc;
  /** 最大触发次数 */
  // maxTimes?: number;
  data: {
    $property: $value
  }
};
```

**shouldInvokeFunc**

通常情况下，是否触发当前任务由内部的比较函数代为判断，如果需要自己来进行更加细致的判断（比如，对比对象的某个标志位是否更新），你可以指定 deps 为一个入参为前一次更新的 store 和当前 store 的返回值为`boolean`类型的函数，函数定义如下：

```typescript
type shouldInvokeFunc = (
  prevStore: Record<string, any>,
  store: Record<string, any>
) => boolean;
```

### ViewDisplay 元素曝光事件

该事件对比原生的`zan-web-tracker`，扩展了 data 函数，为其添加了一个额外的`intersectionEntries`作为入参，该入参是通过 scorll，然后计算绑定元素进行 polyfill 的，具体定义与[MDN](*https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry*)保持一致。

```typescript
import { Timings, IConfig } from "@/common/directives/track";

const $taskName: IConfig = {
  name: $taskName,
  eventName: $eventName,
  eventId: $eventId,
  timing: Timings.ViewDisplay,
  data(store, intersectionEntries) {
    return {
      $property: $value
    };
  }
};
```

```typescript
interface IIntersectionObserverEntry {
  readonly element: HTMLElement;
  /** 内容展示占内容的比例 */
  readonly contentDisplayRatio: number;
  readonly intersectionRatio: number;
  readonly isIntersection: boolean;
  readonly intersectionRect: DOMRect;
  readonly boundingClientRect: () => DOMRect;
}
```

同时，需要在页面中绑定对应的元素：

```html
<template>
  <!--如果任务在任务队列中-->
  <target-ele v-track:view.$taskName />
  <!--如果任务不在任务队列中-->
  <target-ele v-track:view.$taskName="$taskName" />
</template>
<script>
  import { $taskName } from "path/to/track-list";
  export default {
    data() {
      return {
        $taskName
      };
    }
  };
</script>
```

如果想要知道具体实现，可以查看下面的实现代码。

### 主动运行任务

**当目标任务在任务池中的时候**，你可以通过调用如下 API 来主动触发任务：

```typescript
this.$track.runTask(id: string, timing: Timings);
$track.runTask(id: string, timing: Timings);
```

### 清空任务

清空任务可以使用下面的 API：

```typescript
this.$track.resetTasks();
$track.resetTasks();
```

## Data

data 作为埋点的核心，支持两种形式：

1. 静态数据，即 data 字段为对象；
2. 动态数据，data 为一个函数，入参根据`Timings`值会有些许不同，不过第一个参数都是`store`，即埋点的数据池。

data 的具体`TS`定义如下：

```typescript
type DataType = Record<string, any> | DataGetter;
type DataGetter = (store: Record<string, any>) => DataGetterRes;
type DataGetterRes = Record<string, any> | "TERMINATE";
```

### 数据池

数据在 track 中是全局共享的，通过调用`this.$track.collect(name, value)`在各个组件或是页面中进行收集，这就意味着，**数据池中的数据是依赖各个 Vue 实例的加载状况而定的，所以会存在一定的时序问题**。

所以建议使用过程中，**不要在`Timings.EnterPage`中使用动态数据类型，因为该任务只会运行一次，所以请确保运行时一定存在需要的数据。**

### 数据的命名

为了提高运行效率，并且为了能够方便精确的命中`Timings.ChangeByData`中监听的数据，建议使用`redis`方式进行数据命名，具体格式如下：

```javascript
this.$track.collect("module:foundation::name", value);
$track.collect("module:foundation::name", value);
```

这么做能够很好的展平数据，并且能够减少命名的负担。

#### 为什么不提供对象的方式去赋值？

不提供使用对象更新 store 的赋值方式；不建议将 value 设置为一个掺杂不同含义（功能不同）的对象来初始化一个通用字段的赋值方式。

以上方法，对于收集依赖和事件上报的节流操作是不友好的，尤其是在数据变更类型的事件中。并且，这种做法会导致一个字段不能通过字段名很好的体现出它的含义，不符合数据聚合的原则。

```javascript
// error
this.$track.collect({
  "course:video::playing": true
});
// bad
// deps: ['course:video::state'] 不得已，得将deps写成这样
this.$track.collect("course:video::state", {
  playing: true,
  current: currentTime,
  duration: duration
});
// ↑ 因为current存在，会一直检查有没有对应关联事件
// good
// deps: ['course:video::current']
this.$track.collect("course:video::playing", true);
this.$track.collect("course:video::duration", duration);
// ↑ 重复赋值将会跳过事件检查，只进行单纯赋值
this.$track.collect("course:video::current", currentTime);
// ↑ 将会检查有没有关联事件并触发相应事件
```

### 在何时收集数据？

数据收集应该在 Vue 实例中尽可能靠近数据获取的地方，因为`this.$track.collect`是个单纯的指令，不存在任何繁复的逻辑，且不存在返回值需要处理，所以不会对现有逻辑产生影响。

_请不要在 mounted 之前的生命周期中调用，以防影响例如 SSR 等功能。_

### 打断上传

在一些场景中，埋点任务可能会因为一些条件「不成熟」（比如视频播放开始才会上报数据），需要埋点任务可以等待这些条件达标之后再开始进行，这时候可以使用函数类型的 data 并通过判断条件返回`TERMINATE`字符串来达到打断任务进行的目的。

```typescript
cosnt configs: IConfig[] = [
  {
    ...
    data(store) {
      ...
      if (condition) {
        ...
      }
      return 'TERMINATE';
    },
  }
]
```

### 清空数据

如果想清空数据，可以调用如下 API 进行清除：

```typescript
this.$track.resetStore();
$track.resetStore();
```
