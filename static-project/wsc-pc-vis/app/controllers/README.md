## controller 目录

### Domain业务域： 一级目录说明(可以类比后台一级导航理解)
- base 基础
- common 通用业务，如公众号关注等，通常调用第三方service
- course 课程商品相关，售卖单元，如内容 专栏 直播 线下课等
- edu-admin 教务管理相关逻辑，如排课 预约等
- recruit 招生相关，如线索，报名等
- student 学员管理相关，如学员管理 学员导入
- ump 营销 + 督学插件相关
- shop 教育店铺管理相关 + 多校区管理相关
- paidcontent 特殊业务域：微商城知识付费插件
- other 特殊业务域：不属于以上任何一个业务域，且也不是通用的业务，可以放到other（往此目录放需要经过评审通过后才可以）

### Module模块： 二级目录说明（可以类比后台二级导航理解）
 - 按照上面说明在一级目录内放置对应文件，不得随意新增一级目录
 - 二级目录中的结构：
   - 简单的二级导航页面：直接写controller 文件，如：course/ContentController.js (提供内容列表+编辑所有接口)
   - 复杂的二级导航页面：可以加一级目录，如：course/xxx/CourseContrller.js(线下课列表对应接口) course/xxx/CourseProduct.js(线下课编辑对应接口),同属于一个二级导航页面，但是做了controller拆分
   - 每个后台二级导航，在目录中只能对应一个Controller 文件或对应一个目录。举例：二级导航：课程-专栏，这边目录中只能存在ColumnController.js或者 column/XxxController.js
   - 不理解的话去参考目录实际文件或联系凯文
 
 ### 文件名规范 
 - controller js文件为首字母大写驼峰命名方式, 目录为中划线分割全小写命名方式,举例：`sample-dir/sample-sub-dir/SampleController.js`

TODO：增加commit检查