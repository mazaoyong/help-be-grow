# 目录结构
```
├── app                   
│   ├── index.js           // 启动服务和跑定时任务的，每天凌晨2点会更新接口数据
│   ├── main.js            // 解析接口的主函数
│   ├── src
│   │   ├── AstGetter.js   // 基于acorn封装的ast语法树实例，用来解析文件获取接口信息
│   │   ├── dataGetter.js  // 获取一些文件的静态数据
│   │   ├── download.js    // 拉取仓库
│   │   └── service.js     // 启动服务
│   └── utils.js
├── client
│   ├── src
│   │   ├── App.tsx
│   │   ├── api            // 接口
│   │   ├── components     // 组件
│   │   ├── constants.ts   // 常理
│   │   ├── index.tsx      
│   │   ├── pages          // 页面
│   │   ├── typings        // 数据类型
│   │   └── utils.ts       // 工具
├── config.json            // 仓库配置
├── search.test.json       // 这个用来测试单个接口的搜索，下文会详细讲到
└── tsconfig.json
```

# 本地开发
1. 安装依赖  
```make install```

2. 启动服务  
```make qa-server```

3. 前端开发  
```make dev```

# 接口搜索测试
根目录下新增*search.test.json*文件，内容示例：  
```json
{
  "owlinvoke":{
    "api":"wscvis/edu/appointment/calendar.json", // 需要搜索的接口名称
    "appName":"wsc-h5-vis"                        // 接口所在的应用名称
  }
}
```
使用：```make search --mode=owlinvoke```
