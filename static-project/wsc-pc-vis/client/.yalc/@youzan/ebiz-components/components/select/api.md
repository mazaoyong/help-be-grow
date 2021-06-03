---
category: 组件
type: 展示
title: 下拉选择
subtitle: Select
description: 一个符合标准的下拉选择，支持异步获取选项
---

### 基础属性 IBaseSelectProps

| 属性名            | 描述                                                                      | 类型                                                  | 是否必填 | 默认值                                       |
| ----------------- | ------------------------------------------------------------------------- | ----------------------------------------------------- | -------- | -------------------------------------------- |
| tags              | 是否多选                                                                  | boolean                                               | -        | false                                        |
| multiple          | 是否多选                                                                  | boolean                                               | -        | false                                        |
| width             | 输入框和下拉框的宽度                                                      | string                                                | -        | 185px                                        |
| value             | select 的值                                                               | `any[]`                                               | -        | -                                            |
| defaultValue      | select 的默认值，与 value 不同，defaultValue 只会在从无到有的时候装载一次 | any                                                   | -        | -                                            |
| defaultOptions    | 与 defaultValue 配合使用，渲染默认值                                      | `IOption[]`                                           | -        | -                                            |
| placeholder       | 输入框的 placeholder                                                      | string                                                | -        | 开启 filter：请输入<br />关闭 filter：请选择 |
| disabled          | 是否禁用 selet 组件                                                       | boolean                                               | -        | false                                        |
| maxSize           | 多选模式下最多可以选择多少个选项                                          | number                                                | -        | -                                            |
| offset            | dropdown 对于输入框的偏移量                                               | number                                                | -        | 4                                            |
| noData            | 没有数据的时候的提示                                                      | ReactNode                                             | -        | 暂无数据                                     |
| filter            | 开启过滤，可以是个返回 boolean 值的过滤函数                               | boolean\|(keyword:string, option: IOption) => boolean | -        | false                                        |
| options           | 需要展示的选项，如果 mode 为 async，会忽略传入的这个值                    | IOption[]                                             | -        | -                                            |
| mode              | 是否从接口获取选项                                                        | sync \| async                                         | -        | sync                                         |
| prefixOption      | 会渲染在选项列表最前面                                                    | ReactNode                                             | -        | -                                            |
| suffixOption      | 会渲染在选项列表最后面，如果是 async 模式，这个值会替代 loading 文案      | ReactNode                                             | -        | -                                            |
| onOpen            | 打开 dropdown 的时候会触发                                                | () => void                                            | -        | -                                            |
| onClose           | 关闭 dropdown 的时候会触发                                                | () => void                                            | -        | -                                            |
| onChange          | 当 value 改变的时候会触发                                                 | (value: any, items: IOption[] \| undefined) => void   | -        | -                                            |
| onSelect          | 当选中某个选项的时候会触发                                                | (value: any, items: IOption[] \| undefined) => void   | -        | -                                            |
| clearable         | 是否显示删除按钮                                                          | boolean                                               | -        | true                                         |
| noKeyboardHandle  | 是否启用键盘事件                                                          | boolean                                               | -        | true                                         |
| onKeywordChange   | 筛选关键字改变的回调函数                                                  | (keyword: string) => void                             | -        | -                                            |
| displayNum        | 多选模式下显示的 tag 最大数量，0表示不折叠tag                                             | number                                                | -        | 0                                           |
| className  | 最外层容器的样式名称                                                          | string                                               | -        | -                                         |
| dropdownClassName  | 下拉弹窗的样式名称                                                          | string                                               | -        | -                                         |

#### 选项 IOption

```typescript
interface IOption {
  // 展示的文本
  text: any;
  // 选中之后的value
  value: any;
  // 额外的展示内容，这个ReactNode会展示在选项列表中，但是选中之后
  // 输入框展示的值仍旧是text的内容，一般用于对当前选项内容添加说明
  extra?: ReactNode | ReactNode[];
  // 当前选项是否可选
  disabled?: boolean;
}
```

**注意：**

在`ebiz-select`组件中，由于业务要求，`value`的值可以是任意类型，而不仅仅是字符串类型，`value`可以是
一个对象用来传递更多的信息。在组件中，对于选中状态的判断，是通过对其序列化来进行比较的。具体实现如下
：

```typescript
function aEqualB(a: any, b: any): boolean {
  const convertA = typeof a !== 'string' ? JSON.stringify(a) : a;
  const convertB = typeof b !== 'string' ? JSON.stringify(b) : b;

  return convertA === convertB;
}
```

### API 模式 IAsyncSelectProps

这个是`ebiz-select`与`zent/select`的主要区别，在这个模式下，可以通过传入`fetchOptions`属性来控制每一
页的选项的展示的内容和选中的值。

| 属性名         | 描述                                                  | 类型                                                                                                         | 是否必填 | 默认值                                      |
| -------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------- |
| fetchOnOpened  | 是否在 dropdown 开启的时候请求                        | boolean                                                                                                      | -        | false                                       |
| fetchOnMounted | 是否在组件加载完成之后请求                            | boolean                                                                                                      | -        | false                                       |
| debounceConf   | 防抖函数配置                                          | {leading?: boolean; trailing?: boolean; wait?: number}                                                       | -        | {leading: false, trailing: true, wait: 200} |
| showRefresh    | 是否展示刷新按钮                                      | boolean                                                                                                      | -        | false                                       |
| showAdd        | 是否展示新增按钮                                      | boolean                                                                                                      | -        | false                                       |
| fetchOptions   | 一个 Promise 方法，返回 IOption[]来改变组件的 options | (filterKeyword: string, pageRequest: IPageRequest) => Promise<{options: IOption[]; pageInfo: IPageRequest;}> | 是       | -                                           |
| onRefresh      | 当点击刷新按钮的时候触发的函数                        | () => void                                                                                                   | -        | -                                           |
| onAdd          | 当点击新增按钮的时候触发的函数                        | () => void                                                                                                   | -        | -                                           |
| closeOnSelect  | 是否需要选中任意选项就关闭弹窗                        | boolean                                                                                                      | -        | false                                       |

#### 分页参数 IPageRequest

```typescript
interface IPageRequest {
  // 当前的页码
  current: number;
  pageSize?: number;
  // 必须要返回，组件需要根据这个来判断是否拉完了全部的option
  total: number;
}
```
