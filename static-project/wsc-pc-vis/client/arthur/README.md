# Arthur

## Arthur 周边能力

Arthur 平台提供了一整套从`node`到`client`的权限获取和权限控制的解决方案，通过该平台，能够配置页面中各个节点的展示与否，并且通过组件适配，就能在不同的店铺环境下（单店和连锁类型店铺）对页面文案进行替换等。

[Arthur Scheduler](https://gitlab.qima-inc.com/ebiz-web/arthur-scheduler)中包含了阿童木插件以及 B 端组件。

在 Arthur 权限平台中，需要配置诸如`filter`或者是`url`等字段，为了方便维护，统一放置在各个项目`client/arthur`文件夹中。

目录层级结构如下：

```yaml
client:
  - arthur:
    - filters: 存放权限点关联的过滤器
      - micro-class: 「举例」针对商业化版本“微课堂”的过滤器
        - filterFoo.ts(x):
        - filterBoo.ts(x):
        - index.ts: 所有的filter都通过index入口文件向外导出
      - filterFoo.ts(x):
      - filterBoo.ts(x):
      - index.ts:
    - assets: 资源文件
      - ...: 资源文件包括一些静态变量或者是一些样式表
    - adaptors: 数据适配器，目录结构类似filters，用于处理不同版本之间不同类型的数据转换
```

## filter 的编写

### filter 的形式

filter 一般形式如下：

```typescript
type FilterType<T = any> = (originData: T[], opts?: Record<string, any>) => T[];
```

filter 一般由两个参数组成，第一个参数表示原有数据，第二个参数控制 filter 的具体行为，返回数据类型应该跟原始数据类型相同。
在一些场景中，filter 也可以返回一些静态数据，这时候它的类型更像是这样：

```typescript
type FilterType<T = any> = (originData?: never[], opts?: Record<string, any>) => T[];
```

或者是

```typescript
type FilterType<T = any> = () => T[];
```

在这些场景中，filter 的返回值并不依赖于入参的 originData 的值，但是为了对齐参数，在需要参数来控制 filter 方法行为的时候，即使第一个参数是无用的，也请声明出来。

### filter 入口文件

filter 一般情况下，都通过`client/arthur/filters/index.ts'导出。 需要注意的是，在这个文件中导出的filter方法，通用性往往都比较高，如果你的filter方法跟店铺类型、商业化版本等特殊信息有很强的关联，更建议在`client/arthur/filters/[xxx]()/index.ts`中导出。

一般情况下，index 文件中的内容大致都像下面：

```typescript
import filterFoo from './filterFoo';
export filterBoo from './filterBoo';

// 我们假设有个filter方法集合，名字叫做filterCollectA
const filterCollectA = {
  filterFoo,
  filterBoo,
}

export default filterCollectA;
```

通常，我们导出都是导出一个对象，用于表示一个 filter 方法集合，这么做的目的在于，当我们在项目中引用他们的时候，我们只需要将整个对象导入`<ArthurDecorator />`组件的 filterMap 属性中去，后续如果我们需要添加额外的方法，或者修改权限配置中的 filter 为集合中的另一个方法，就会非常的方便。
