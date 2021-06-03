---
- title: 学员信息卡片
- owner: 逐浪
- description: 通过内置接口获取学员信息，通用于学员详情和线索详情页面
- cover: https://b.yzcdn.cn/cdn/student-info.png
- tag:
    - 展示学员信息
    - 收缩部分字段
    - 能够扩展内容
    - Divider组件
---

# StudentCard 学员信息卡片

学员信息卡片用于渲染学员信息，渲染工作方式依赖**自定义资料项的格式**：

```typescript
interface IAttributeItem {
  attributeId: number;
  attributeTitle: string;
  attributeItem?: Array<{ id: number; value: string }>;
  attributeKey?: string; // 只有有限的几个默认资料项会有固定的key，其他都是只有id
  value: string;
  dataType: DataType; // 数据类型的枚举值，详情见types
  applicableScenes: Array<{ applicableScene: number; required: boolean }>; // 大多数时候，需要依赖这个判断是否必填
}
```

学员信息卡片关注上面的`attributeTitle`和`value`，以及如果是特殊的类型，如地址和多选类型，前者会尝试将地址进行序列化然后展示，后者则是会去`attributeItem`属性中提取选中的值加以`，`拼接；

## 使用要点

学员信息卡片内含接口，不需要额外再请求接口然后传入数据；并且，大多数时候，渲染大都符合要求，如果不符合要求，请尝试使用`format`函数进行格式化每一行的数据；

**但是需要注意的是，头像、姓名、手机号以及性别，不会作为每一行渲染的数据被 format 函数格式化，**，所以，如果需要对这个部分数据进行格式化，请先问问设计或者产品，为什么这么干，理由充分合理请联系`@逐浪`进行修改！

### 关于 decorateData 函数

该函数，顾名思义，就是对数据进行格式化，一般用于接口返回数据**不满足**或者**数据需要进行预先计算**的场景，你可以使用这个方法，对获取到的学员详情的数据进行格式化操作，需要注意的是，
这个函数返回的数组中的每个对象需要确保含有`attributeTitle`和`value`两个属性；

## API

| 属性名              | 描述                                                                                   | 类型                                                          | 是否必填 | 默认值 |
| ------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------- | ------ |
| studentNo           | 学员 No，必传，即使在其他场景，也应该让后端返回这个值以作为查询条件                    | number                                                        | 是       | -      |
| clueId              | 作为兼容老接口而存在的必要，不能将这个值作为后续新接口的入参，并且会优先使用 studentNo | number                                                        | 否       | -      |
| showCollapse        | 是否展示收缩，需要配合 displayLimitation 来使用                                        | boolean                                                       | 否       | false  |
| triggerCollapse     | 每次切换数据的展开收起状态时候回触发的函数                                             | (isExpand: boolean) => void                                   | 否       | -      |
| displayLimitation   | 超出这个数值的资料项会被隐藏（需要配合 showCollapse)                                   | number                                                        | 否       | 5      |
| decorateData        | 格式化数据，用于修改渲染数据                                                   | (rawData: Recort<string, any>[]) => 返回见上 Tips             | 否       | -      |
| prefixContent       | 插在渲染内容之前的数据                                                                 | Recort<string, any>[] 具体内部属性见上 decorateData Tips      | 否       | -      |
| onStudentInfoChange | 当获取到学员信息的时候触发这个回调，一般用来外部使用详情信息                           | (rawData: Recort<string, any>[]) => void                      | 否       | -      |
| format              | 格式化内容部分的渲染，不包括（头像、姓名、手机以及性别）                               | (rowData: DataItem) => { label?: string; content: ReactNode } | 否       | -      |

## Divider 分割线组件

分割线组件，作用是分割代码和页面的内容，作用如下：

1. 分割代码
2. 渲染页面的分割线，分割内容区块

### 分割代码

```javascript
import { Divider } from '@ability-center/student';

const GoodExample = () => {
  return (
    <div>
      <section>some code here...</section>
      <Divider>
        <ComponentA />
        <SomeWrapper>
          <ComponentB />
        </SomeWrapper>
      </Divider>
      <Divider>
        <ComponentC />
        <ComponentD />
      </Divider>
    </div>
  );
};
```

如果不用`Divider`，代码风格可能会变成下面这样：

```javascript
const BadExample = () => {
  return (
    <div>
      <section>some code here...</section>
      <span className="divider class" />
      <ComponentA />
      <SomeWrapper>
        <ComponentB />
      </SomeWrapper>
      <span className="divider class" />
      <ComponentC />
      <ComponentD />
    </div>
  );
};
```

以上代码，在内容的多的时候，没有闭合的区块，如果将内容（甚至是逻辑判断）都写在两个 span 中间，那么区块的界限就不清晰，如果是作为 Divider 的 children，
那么能够在 components 增多的时候将他们合并成一个区块单独抽离，维护代码简洁的风格。

## Changelog

- 2020-03-24
  - 完成开发
- 2020-03-25
  - Divider 组件支持 children 属性渲染为分割线下面的内容
  - 添加prefixContent方法用于支持在content之前添加内容
