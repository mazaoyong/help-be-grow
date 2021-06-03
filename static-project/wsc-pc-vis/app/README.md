# node 目录结构

参考 [Astroboy目录结构](https://www.youzanyun.com/astroboy/zh-cn/%E5%9F%BA%E7%A1%80%E5%8A%9F%E8%83%BD/%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84.html)

```
.
├── README.md                         # 说明文件
├── constants                         # 存放一些业务常量，枚举值，配置等
├── controllers                       # Controller 文件存放目录
│   ├── base                          # 基础类，所有的 Controller 都继承这个类
        ├── BaseController.js         
│   ├── common                        # 公共接口，如获取店铺状态、小程序二维码等
│   ├── cource                        # 存放课程相关内容
│   │   └── projects(Controller.js)   # 项目名
│   │       └── XxxController.js
│   └── edu-admin                     # 存放教务管理相关页面
│       ├── projects                  # 模块名
│       │   └── XxxController.js
│       ├── XxxController.js          
├── exceptions
├── extends                           # Koa 4 个内置对象扩展存放目录
│   ├── application.js                # Koa Application 对象扩展（可选）
│   ├── context.js                    # Koa Context 对象扩展（可选）
│   ├── request.js                    # Koa Request 对象扩展（可选）
│   └── response.js                   # Koa Response 对象扩展（可选）
├── middlewares                       # 中间件存放目录
├── routers                           # 路由文件存放目录
│   ├── common                        # 公共接口
│   │   └── xxx.js                    # 公共接口文件
│   ├── cource                        # 课程相关
│   │   └── xxx.js                    
│   ├── edu-admin                     # 教务相关
│   │   └── xxx.js                    
│   ├── paidcontent                   # 知识付费
│   │   ├── common.js                 # 公共接口
│   │   └── projects.js               # 项目名.js
├── run                               # 运行生产的缓存文件
├── services                          # Service 文件存放目录
│   ├── base                          # baseService
│   ├── api                           # 根据 wsc-pc 的规范，以后 dubbo 接口都放在 api 目录下
│   │   └── owl                       # 以 dubbo com.youzan.xxx 的 xxx 作为文件名，可嵌套文件，
│   │       └── XxxService.js         # 以 xxxService 或者 xxxFacade 作为 XxxServicde 文件名，首字母大写
│   └── NodeServiceFolder             # node 实现的业务 service 放在文件夹下
│       └── NodeService               # service 文件夹
├── views                             # HTML 模板文件存放目录
│   ├── common                        # 全局模版配置，主要包括菜单、帮助中心等，项目的模版要 extends 'common/base.html'
│   ├── cource                        # 课程相关
│   │   ├── xxx.html
│   │    └── projects                 # 项目名
│   │       └── xxx.html                   
│   ├── paidcontent                   # 知识付费
│   │   └── projects                  # 项目名
│   │       └── index.html
├── app.js                            # 应用实际入口文件
└── cluster.app.js                    # 应用实际入口文件（cluster 模式的时候）
```