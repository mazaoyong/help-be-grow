# PAGES 目录

!> 如有新的页面请参考下面的结构放置，页面路由请保持一致


## 结构

固定的三级结构：一级为业务域，二级为模块，三级为页面。

目前划分的一级目录：

- common：一些通用的用于过渡和兜底的页面。
- course: 课程商品相关，包括线下课、知识付费专栏和内容、直播商品的详情页和相关页面
- edu：老的教育相关目录
- edu-admin：教务，包括预约流程相关、课程表、学员列表等页面
- paid-content：老的知识付费大单页
- supv：督学，包含家校圈、群打卡、小测试、证书奖励等
- trade：包括交易流程相关的页面，预下单页、支付成功页等
- ump：营销相关页面
- （招生和学员相关的目录如有需要，后续会单独抽到一个目录里）


## 模块和页面结构

参考 client/templates/module 文件夹

### 模块

- components/                        参考下面的”各目录职责-组件“
- mixins/                                   mixins 存放页面和组件之间公用的逻辑
- PAGE_NAME/                       页面目录，参考下面
- apis/                                       模块内所有的接口都放在这，文件按照页面来划分
- constants.*s                          模块内必须只有一个 contants 文件，保证代码的复用性
- README.md                         README 内容参考下面的规范
- utils.*s                                     一些公用的逻辑可以放在这里

### 页面

- containers                             如果页面使用了 router，路由组件放在这里
- blocks/                                   参考下面的 ”blocks 和 components 的区别“
  - block-a.vue                     为了区分block和component，建议使用前缀 ‘block-’
- components/                        参考下面的”各目录职责-组件“
  - b.vue
- store/                                     页面如果有划 block 的话，必须使用 Vuex
  - index.*s
  - state.*s
  - mutations.*s
  - mutation-types.*s
  - actions.*s
  - getters.*s
- App.vue
- router.*s                                 所有 router 代码都放在这里
- main.js
- README.md                         README 内容参考下面的规范

### blocks 和 components 的区别？

- block 是页面能够清晰地拆分出来的独立的视图结构，它是页面中能够独立存在的容器组件。在这里之所以和 component 区分开来，更重要的是 block 是可以承接页面接口数据的二级组件，一级组件是页面根组件，也是唯一的能承接接口数据的非根组件，可以参考智能组件的定义。
- component 和 block 区分开来之后，从数据管理的角度来说，它不能包含任何接口数据逻辑，也符合对木偶组件的定义。区分之后，对组件设计影响最大的是组件的交互逻辑，比如以前点击按钮之后直接发送数据，现在需要把发送动作和数据上抛，交给block来发送。这样带来的好处是，组件职责划分更清晰，数据逻辑的处理交给了 block，component 只负责 UI 和交互逻辑。component 的可复用性也会有明显的提升。
