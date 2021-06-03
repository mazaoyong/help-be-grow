# live 直播列表页面

## 代码结构
├── constant.ts
├── index.tsx
├── list.tsx
├── model.ts
├── README.md
└── style.scss

## 依赖
  - 课程商品卡片 ` client/pages/course/common/components/live/course-goods-item`
  - 由于直播列表的操作按钮及相关处理逻辑，会被专栏内容管理页面复用，故被提取到course共用组件下 ` client/pages/course/common/components/live/action-menu`

## changelog
  - 20200309 直播二期 @gaotian
    - 添加顶部添加直播卡片
    - 列表支持视频直播
    - 增加视频直播统计tab
  - 20200310 [第三方直播-未绑定保利威直播帐号隐藏该选项](http://xiaolv.qima-inc.com/#/demand/search?show=true&ids=42490) @gaotian
    - 支持屏蔽保利威入口
  - 20200323 [有赞教育-视频直播-流量补贴计划](https://doc.qima-inc.com/pages/viewpage.action?pageId=268825796) @gaotian
    - 直播剩余观看时长逻辑收拢到common 
  - 20200421 [校区支持自建课程直播](https://doc.qima-inc.com/pages/viewpage.action?pageId=235293797) @gaotian
    - 直播列表创建直播卡片屏蔽总部展示 
    - 直播列表列表筛选多校区屏蔽课程分组
    - 直播列表接入校区选择器(连锁总部)
    - 直播统计页面接入校区选择器(连锁总部) & 代码优化
    - 教育店铺不支持流量充值

