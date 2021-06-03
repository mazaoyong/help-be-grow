## 教育连锁店铺多校区选择组件

导入路径` client/pages/other/stat/components/course-select-pop`

### 适用场景

按kdtId查询店铺全部课程，支持搜索和多选


### 代码演示

![course-select-pop](https://img.yzcdn.cn/upload_files/2020/03/26/FkgayXRCivWDwQta9BcqHu5mk1DY.png)

```jsx
  <CourseSelectPop
    kdtId={context.subKdtId}
    indicatrix={showCourseIdList}
    onChange={onSourceChange}
    onKeywordChange={onKeywordChange}
    onClose={onClose}
  />
```

### config配置项

| 参数      | 说明                       | 类型             | 默认值   | 是否必填 |
| :-------- | :------------------------ | :-------------- | :------ | :------- |
| kdtId     | 店铺kdtId     | `Number`       | 无      | 是       |
| indicatrix  | 选中项id   | `any[]`       | 无      | 是       |
| onChange  | 改变选中的回调函数   | `(checkded: any[]) => void`       | 无      | 是       |
| onKeywordChange  | 搜索框按下回车后的回调函数   | `(checkded: any[]) => void`       | 无      | 否       |
| onClose | 关闭弹层时的回调函数   | `() => void`       | 无      | 否      |

