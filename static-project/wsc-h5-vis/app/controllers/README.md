# controllers/

!> 注意，业务域下的目录目前并没有完全按照规则放置，所以请参考下面的规则进行创建和调整

目录结构和路由、client/pages 的目录结构必须严格保持一致。
文件命名采用首字母大写的驼峰格式，文件名为 `页面名称 + Controller.js`。
例如接口路由`/wscvis/supv/punch/getTask.json` 在文件 `supv/punch/task.js` 中，
对应的 controller 文件就是 `controllers/supv/punch/TaskController.js`。


## 规则

1. 一级目录为业务域
2. 二级目录为模块
3. 三级页面对应的 controller 文件

!> 每个模块的 IndexController 可以放一些通用的接口和 render 方法


## 目录结构

- common：一些通用的用于过渡和兜底的页面。
- course: 课程商品相关，包括线下课、知识付费专栏和内容、直播商品的详情页和相关页面
- edu：老的教育相关目录
- edu-admin：教务，包括预约流程相关、课程表、学员列表等页面
- paid-content：老的知识付费大单页
- supv：督学，包含家校圈、群打卡、小测试、证书奖励等
- trade：包括交易流程相关的页面，预下单页、支付成功页等
- ump：营销相关页面
- pay：支付相关接口
