---
- title: 教育连锁店铺多校区选择组件
- owner:
  - 埃里克
- description: 教育连锁店铺多校区选择组件
- cover: https://img.yzcdn.cn/upload_files/2020/03/26/Fsr31-FkUdbZQQXIG7DBPNtbJ9Jm.png
- tag:
  - 校区选择
  - 连锁
---

## 教育连锁店铺多校区选择组件

导入路径`client/components/campus-filter`
推荐直接使用`client/components/campus-filter/campus-provider`

### 适用场景

连锁店铺的数据页面顶部切换全部校区/指定校区查看数据，如果使用campus-provider则只会在总部展示这个组件。


### 代码演示

![campus-filter](https://img.yzcdn.cn/upload_files/2020/03/26/Fsr31-FkUdbZQQXIG7DBPNtbJ9Jm.png)

```jsx
  <CampusFilter
    showFilter
  />
```

### config配置项

| 参数      | 说明                       | 类型             | 默认值   | 是否必填 |
| :-------- | :------------------------ | :-------------- | :------ | :------- |
| showHqStore     | 下拉框是否展示总部     | `Boolean`       | 无      | 否       |
| showFilter  | 是否展示Select筛选输入框   | `Boolean`       | 无      | 否       |
| divideItem | filter之前的使用分隔线的Item | `Array<{ text: string, kdtId: number }>` | [{ text: '全部校区', kdtId: 0 }] | 否

