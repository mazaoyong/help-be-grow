## 数据指标项

导入路径` client/pages/other/stat/components/indicatrix`

### 适用场景

可选数据指标项，支持checkbox和radio两种格式


### 代码演示

![indicatrix](https://img.yzcdn.cn/upload_files/2020/03/26/FkE2UWmIVlGoZs2bsXzcUMUuY3Ao.png)

```jsx
  <Indicatrix
    type="checkbox"
    value={indicatrix}
    onChange={this.handleIndicatrixChange}
    className={`${clsPrefix}__group`}
    config={options}
    allowEmpty
  />
```

### config配置项

| 参数      | 说明                       | 类型             | 默认值   | 是否必填 |
| :-------- | :------------------------ | :-------------- | :------ | :------- |
| type     |  单选或多选   | `"checkbox" | "radio"`       | 无      | 是       |
| value  | 选中项id   | `any[]`       | 无      | 是       |
| className  | className   | `string`       | 无      | 否       |
| groupClassName  | groupClassName   | `string`       | 无      | 否       |
| onChange  | 选中项改变时的回调函数   | `(checkedList: any[]) => void | e => void`       | 无      | 是       |
| config  | 数据项data   | `any[]`       | 无      | 是       |
| max  | checkbox最多可选数量   | `number`       | 无      | 否       |
| allowEmpty  | 选中是否可为空  | `boolean`       | 无      | 否       |
| tipLeft  | tip左外边距  | `React.CSSProperties['marginLeft']`       | 无      | 否       |
| disallowAnimation  | 是否开启tip动画  | `boolean`       | 无      | 否       |
