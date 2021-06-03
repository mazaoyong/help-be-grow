---
- title: 教务详情面板左侧资产信息列表
- owner:
  - 赵梓皓
- description: 教务详情面板（日程详情、班级详情、老师详情）左侧信息列表
- cover: https://b.yzcdn.cn/public_files/14fc64fc6942ef9c9603be9a762c273b.png
- tag:
  - 教务
  - 详情
  - 信息
  - 列表
---

# 教务详情面板左侧资产信息列表
## demo
```jsx
```
## api
| 属性名     | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| --------- | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
| type      | 种类（'seperator'或'data'，为空默认选择'data'类型） | 'seperator'&#124;'data'      |   否    |      data        |
| key       | 传入数据的字段名（key名），type为seperator时不需填写 | string      | type为默认或'data'时必填   |         -        |
| value     | 传入数据的值（value名），type为seperator时不需填写  | string      | type为默认或'data'时必填   |         -         |
| hidden    | 是否隐藏字段，type为seperator时不需填写            | boolean     |            否            |      false        |
| needClamp | 是否需要用ClampLines包裹value                    | boolean     |            否            |      false        |


## 使用场景
教务页面中包含详情页时，用于详情页左侧边栏展示列表信息。

## 使用说明
1. 传入的数据列表中，每条数据都可以分为两种type，其中data类型，必传key和value，用于展示信息；当需要分隔符分割某两片展示区域时，可以使用type='seperator'。
2. 传入的value为空时，会自动不展示对应字段
3. 可以使用hidden来为字段的隐藏添加额外条件（如多校区情况下需要控制某些字段不显示）

## example
client/pages/edu-admin/schedule/containers/detail/pannel/List.jsx

## ChangeLog
- `2020-07-13` kick off

