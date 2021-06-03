---
- title: 积分价格组件
- owner:
  - 王晨
- description: 积分价格组件
- cover: https://img01.yzcdn.cn/upload_files/2020/07/08/FtaeO2KMhGwZw_G1SGOuSTXFG9EF.png
- tag:
  - products
  - goods
  - ump
  - activity
  - points
  - price
  - info
---

## 积分兑换价

### 示例

```
<points
  :min-price="{
    points: 2000,
    price: 20,
  }"
  :max-price="{
    points: 3000,
    price: 20,
  }"
/>
```

### props

name | 类型 | 是否必填 | 默认值 | 描述
- | - | - | - | -
minPrice | Object | 否 | null | 最低价 { price: Number, points: Number }
maxPrice | Object | 否 | null | 最高价 { price: Number, points: Number }
showIcon | Boolean | 否 | true | 是否展示积分图标
