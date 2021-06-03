## 上升下降箭头

导入路径` client/pages/other/stat/components/change-trend`

### 适用场景

对比上期数据的上升、下降、无变化的箭头展示（只包含箭头）


### 代码演示

![change-trend](https://img.yzcdn.cn/upload_files/2020/03/26/FgA4TddYd1A5-aRPTjyoQ_zGP3X_.png)

```jsx
  <ChangeTrend
    growth={0.1}
  />
```

### config配置项

| 参数      | 说明                       | 类型             | 默认值   | 是否必填 |
| :-------- | :------------------------ | :-------------- | :------ | :------- |
| className   | 下拉框是否展示总部     | `Boolean`       | 无      | 否       |
| growth  | growth>0上升；growth<0下降；其他无  | `Number`       | 无      | 否       |

