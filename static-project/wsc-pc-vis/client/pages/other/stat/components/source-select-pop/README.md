## 切换选择自定义来源/自定义来源分组

导入路径` client/pages/other/stat/components/source-select-pop`

### 适用场景

线索分析业务组件


### 代码演示

![source-select-pop](https://img.yzcdn.cn/upload_files/2020/03/26/FtqCHF5kcbfV-T7UW-D8qjeaR3d8.png)

```jsx
  <SourceSelectPop
    kdtId={context.subKdtId}
    type={dataType === 1 ? 'source' : 'group'}
    indicatrix={showSourceIdList}
    onChange={onSourceChange}
  />
```

### config配置项

| 参数      | 说明                       | 类型             | 默认值   | 是否必填 |
| :-------- | :------------------------ | :-------------- | :------ | :------- |
| type     | 来源/来源分组     | `"source" | "group"`       | 无      | 是       |
| kdtId  | 店铺kdtId   | `number`       | 无      | 是       |
| indicatrix | 选中项id   | `any[]`       | 无      | 是       |
| onChange  | 选中项改变时的回调函数   | `(checked: any[]) => void`       | 无      | 是       |

