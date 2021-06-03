# 版本控制配置中心

## 使用方式

1. 在 vis-shared 写配置
2. 用 Wrapper 包一下原有的组件或元素

## 如何写配置？

在 configs 找到应用和版本对应的配置：

- h5Basic: wsc-h5-vis应用 & 基础版店铺
- h5Pro: wsc-h5-vis应用 & 专业版店铺
- weappBasic: 商家端小程序 & 基础版店铺
- weappPro: 商家端小程序 & 专业版店铺

参考配置结构：

```
{
  // 目标 id，可以取功能名称、能够快速定位的特殊标识等
  targetId: {
    // 目标类型，选填，暂时只支持 'component'
    type: 'components',
    // 指定版本下对功能施加的影响，类型为对象数组，对象为 key-value 键值对
    // key 为影响类型，比如是否展示 -> 'show'
    // value 为对应的类型值
    configs: [
      // 标识在某个店铺下不展示
      { key: 'show', value: false }
    ]
  }
}

```

### 配置目标类型和可用效果

- 组件：type = 'component'
  1. 是否展示：key = 'show', value = true/false(default=true)
  2. 设置prop值: key = 'prop', value = { key: propName, value: any }
- 数组：type = 'array'
  1. 保留符合条件的数据：key = 'filter', value = 参考 lodash/filter https://www.lodashjs.com/docs/lodash.filter
  2. 过滤符合条件的数据：key = 'reject', value = 参考 lodash/reject https://www.lodashjs.com/docs/lodash.reject
- vuex 配置: type = 'vuex'
  1. 设置 getter 值： key = 'getter', value = { key: getterName, value: any }


## 如何在代码使用

1. 使用 Wrapper 组件

```
<template>
  <root>
    <version-wrapper name="id">
      <origin />
    </version-wrapper>
  </root>
</template>

<script>
import { VersionWrapper } from 'vis-shared/configs/version/components';

export default {
  ...

  components: {
    VersionWrapper,
  },

  ...
};
</script>
```

2. 使用 wrapper 方法

```
// 处理数组
import { versionWrapper } from 'vis-shared/configs/version/fns';
const result = versionWrapper('name', [...]);

// 处理 vuex
new Vuex(versionWrapper('name', store));
```
