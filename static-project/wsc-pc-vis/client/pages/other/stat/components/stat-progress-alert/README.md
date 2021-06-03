## 数据页面昨日数据尚未跑完的提示

导入路径` client/pages/other/stat/components/stat-progress-alert`

### 适用场景

根据window._global.yesterdayReady判断是否展示，该值可通过StatBaseController中的通用接口和函数获取并给_global.yesterdayReady赋值


### 代码演示

![stat-progress-alert](https://img.yzcdn.cn/upload_files/2020/03/26/Fn-PA2VxEJIg-oqnRAR999Z6OVWN.png)

```jsx
  <StatProgressAlert />
```

### config配置项
无

