# 导出记录能力


## 介绍

导出记录是一个公用的页面，每次有新的导出需求的时候导出类型的时候，后端都会去登记一个新的导出 Type，接口、返回数据都是统一的，这样前端只需跳转到对应的链接即可，无需开发。

详情：[导出&导入业务类型登记](https://doc.qima-inc.com/pages/viewpage.action?pageId=268795967)


## 能力

### 导出类型 Enum

导出类型的枚举值

### 获取导出记录页面链接

现在代码里有很多都是直接拼参数跳转到页面，现在提供一个通用的跳转链接方法。

### 导出记录页面链接组件

封装了一个 commonLink 组件，新增如下参数：

| props | 类型                | 注释         |
| ----- | ------------------- | ------------ |
| type  | EXPORT_RECORD_TYPES | 导出类型枚举 |

并支持 commonLink 的其它参数
