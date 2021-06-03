## 按店铺来源分组选择来源

导入路径` client/pages/other/stat/components/source-filter`

### 适用场景

线索分析业务组件

### 代码演示

![source-filter](https://img.yzcdn.cn/upload_files/2020/03/26/FvppCDQ2UYOOoBjT47Aff-9f5IB_.png)

```jsx
  <SourceFilter
    value={[srcGroupId, srcId]}
    onChange={onChangeSrcId}
  />
```

### config配置项

| 参数      | 说明                       | 类型             | 默认值   | 是否必填 |
| :-------- | :------------------------ | :-------------- | :------ | :------- |
| value     | 选中项id     | `any[]`       | 无      | 是       |
| onChange  | 选中项改变时的回调函数   | `(checked: any[]) => void`       | 无      | 是     |

