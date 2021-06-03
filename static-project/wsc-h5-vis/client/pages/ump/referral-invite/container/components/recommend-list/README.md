---
- title: 推荐有奖模块内的推荐商品列表
- owner:
  - 达达
- description: 包含接口逻辑
- cover: 'path/to/png'
- tag:
---
主体内容：
# Name
## demo
```jsx
<recommend-list
      :items="items"
    />
```
## api
| 属性名  | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| ------ | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
| items | 推荐列表 |  array of object | 非必填 | [] |

## ChangeLog
- `2020-10-22` 修改了组件数据源
- `2020-09-07` 修改了 title 的 width
