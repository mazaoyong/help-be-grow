## pages 目录

### Domain业务域： 一级目录说明
- a-sample-domain 示例文件夹，开发前请参考文件夹里的内容
  
- course 课程商品相关，售卖单元，如内容 专栏 直播 线下课等
- edu-admin 教务管理相关逻辑，如排课 预约等
- recruit 招生相关，如线索，报名等
- student 学员管理相关，如学员管理 学员导入
- ump 营销 + 督学插件相关
- shop 教育店铺管理相关 + 多校区管理相关
- other 不属于以上任何一个业务域，且也不是通用的业务，可以放到other

- pct 微商城店铺知识付费插件相关业务
- global 打到globaljs 的内容，通常你不需要修改这个
- cy 餐饮相关页面

### Module模块： 二级目录说明
 - 按照上面说明在一级目录内放置对应文件，不得随意新增一级目录
 - components 和 pages 目录下允许放置其他只属于这个组件或页面的抽象，比如page的布局文件等
 - 二级目录中的结构，以 a-sample-domain 为例：
<pre>
|-- a-sample-domain // 业务域文件夹
    |-- api  // 业务域内公用api，通常不需要此文件夹，参见readme
    |-- components  // 业务域内公用组件，通常不需要此文件夹，参见readme
    |-- sample-module // 模块文件夹结构
        |-- api.ts
        |-- constants.ts // 可选文件
        |-- main.ts
        |-- routes.ts
        |-- utils // 目录
        |-- types.ts // 模块内通用types定义，可选文件
        |-- components // 模块内组件文件夹
        |   |-- sample
        |       |-- README.md
        |       |-- index.tsx
        |       |-- types.ts
        |       |-- style.sass
        |-- pages // 模块内页面文件夹
            |-- list-page
                |-- index.tsx
                |-- types.ts
                |-- style.sass
</pre>
 
 ### 文件名规范 
 - 文件为驼峰命名方式, 目录为中划线分割全小写命名方式

TODO：增加commit检查