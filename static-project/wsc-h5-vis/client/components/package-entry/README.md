---
- title: 优惠套餐入口卡片
- owner:
  - 王晨
- description: 优惠套餐入口卡片
- cover: https://img01.yzcdn.cn/upload_files/2020/07/08/FrURvmgL9kW7z6A4u9g14srTV3dX.png
- tag:
  - products
  - goods
  - package
  - card
  - entry
  - info
  - navigator
---

优惠套餐入口

使用页面：

- 线下课详情页
- 专栏详情页
- 内容详情页

使用方法：
```
<template>
...

<!-- 优惠套餐 开始 -->
<package-entry
  v-if="mixinPackage.showPackageEntry"
  :package-type="mixinPackage.packageType"
  :goods-list="mixinPackage.packageGoodsList"
  :goods-num="mixinPackage.packageGoodsNum"
  :discount-price="mixinPackage.packageDiscountPrice"
/>
<!-- 优惠套餐 结束 -->

...
</template>

<script>
...
import mixinPackage from 'components/package-entry/mixin';

export default {
  ...

  mixins: [
    ...
    mixinPackage,
  ],

  ...
};
</script>
```