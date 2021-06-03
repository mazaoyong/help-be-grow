---
- title: Shop Selector 教务课程页校区选择器
- owner:
    - 埃里克
- description: Shop Selector 教务课程页校区选择器
- cover: https://b.yzcdn.cn/public_files/4e057b85eb0824d2567dd007f7f512d7.png
- tag:
    - Shop Selector
    - 教务课程
    - 校区选择器
---

# Shop Selector 教务课程页校区选择器

### 适用场景
多校区-教务课程页面的校区选择

### 使用示例
* 多校区-证书-添加证书-适用校区(client/pages/edu/certificate/containers/editor/admission/form.jsx)
* 多校区-好友助力-新建活动-适用校区(client/pages/pct/boost/pages/edit/index.js)

### 使用截图
![](https://b.yzcdn.cn/public_files/4e057b85eb0824d2567dd007f7f512d7.png)
![](https://b.yzcdn.cn/public_files/73d817d5488cd7a1eccf47996957ab15.png)

### 使用说明
#### API
name | 说明 | 默认值
-|-|-
shopInfo | 校区信息，Object类型，包含两个字段：applicableCampusList为table显示数据，applicableCampusType为是否选择全部校区：1为全部，0为选择校区 | -
id | 课程ID | -
isEdit | 是否正在编辑 | false
label | 在页面中校区选择radio前面的标签 | 上课校区:
validations | 校验正确性方法 | null
isCheckRemove | 是否查看校区是否可以被删除 | false
isCanDelete | 是否可以删除 | 
required | 是否必选 | -

### 注意事项


### Changelog

知识付费支持零售 3.0 项目中做了如下升级：
在非教育店铺下，「校区」显示为「网店」
