# Punch List 打卡列表

## 目录组成

├── App.vue           入口文件
├── README.md         说明文件
├── blocks            存放页面分块的文件夹
├── components        存放组件的文件夹
├── main.js
├── store.ts          VueX store
└── utils             公共方法

### 页面入参

- alias string 打卡活动的alias **必填**
- start_date string 要查看的群打卡活动的开始时间 YYYY-MM-DD 不传时分秒，按照零时处理 **如果不传，初次进入页面不会判断倒计时**
- current_date string 指定一开始展示的任务日期 YYYY-MM-DD
