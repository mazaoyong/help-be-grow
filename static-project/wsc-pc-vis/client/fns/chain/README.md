# 教育连锁中使用的通用判断逻辑

## 基础判断方法 isInStoreCondition

### 入参

默认 false

如果你的页面判断即会在教育的店铺类型，也会在微商城的店铺类型，比如知识付费页面，需要使用 `supportBranchStore` 这些判断，不要使用 `supportEduBranchStore` 仅作用教育的字段


```
export interface IConditionParam {
  supportBranchStore: boolean, // 支持分店（包含微商城和教育）
  supportHqStore: boolean,
  supportSingleStore: boolean,
  supportChainStore: boolean,
  supportEduBranchStore: boolean, // 支持分店（只判断教育的店铺
  supportEduHqStore: boolean,
  supportEduSingleStore: boolean,
  supportEduChainStore: boolean,
  supportRetailShop: boolean,
}
```

### Example

```
const chainSupportHqAndSingle = IConditionParam({
  supportHqStore: true,
  supportSingleStore: true,
});
```

## 组件的展示与否 showWrapper

### Example

```
const ChainSupportSingleFiled = showWrapper(true, Field);
<ChainSupportSingleFiled></ChainSupportSingleFiled>
```

## 组件的展示与否 ShowWrapper(组件)

比较适用需要包裹的 ReactElement 比较散乱

### Example

```
<ShowWrapper
 isInStoreCondition={isInStoreCondition({ supportBranchStore: true})}
>
  我是需要根据店铺类型进行判断的组件
  <Button>按钮</Button>
</ShowWrapper>
```

## 数组的项展示与否 arrayWrapper

### Example

```
const originList = ['dog', 'cat', 'people'];
const formatList = arrayWrapper({
 '0': false,
}, originList); // -> ['cat', 'people']
```

## 数组的项展示与否 arrayWrapperHOF 高阶方法

### Example

```
const originList = ['dog', 'cat', 'people'];
const formatFirstList = arrayWrapperHOF({
 '0': false,
});
const formatList = formatFirstList(originList); // -> ['cat', 'people']
```

## 数组的项展示与否 arrayColumnWrapper

对原数组产生侵入性，但是更直观，适用对象数组

### Example

```
const originList = [
 {
   a: 123,
 },
 {
   a: 345,
   chainState: false, // 这项需要判断显示与否，true 为显示
 }
]
const formatList = arrayColumnWrapper(originList); // -> [{a: 123}]
```

## 对象的项展示与否 objectWrapper

### Example

```
const originObj = {
 a: 1,
 b: 2,
 c: 3
}
const formatObj = objectWrapper({
 a: false
}, originObj); // -> {b: 2, c: 3}
```

## 对象的项展示与否 objectWrapperHOF 高阶方法

## 不同店铺类型不同的展示 switchWrapper

### Example

```
switchWrapper({
  supportBranchStore: () => {
    return '分店';
  },
  supportSingleStore: () => {
    return '单店';
  },
  defaultCpn: () => {
    return '其余店铺类型都展示这个';
  },
});

```

## 表单的全局 disable 处理 chainDisableForm

true 代表可以编辑

### Example

```
const ChainForm = chainDisableForm(true, Form);
<ChainForm>
  <Field></Field>
  <Field></Field>
</ChainForm>
```