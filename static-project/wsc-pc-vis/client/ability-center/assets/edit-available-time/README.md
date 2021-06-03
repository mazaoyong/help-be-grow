---
- title: 调整有效期弹框
- owner:
  - 达达
- description: 调整有效期弹框
- cover: 
- tag:
  - 能力
  - 调整有效期
---

# Name
## demo
```jsx
OpenEditAvailableTime({
  defaultData: {
    kdtId: kdtId, // 当前校区 kdtId
    assetNo: assetNo, // 资产 no
    studentId: studentId, // 学员 id
    time: defaultAvailableTime, // 默认的显示时间 时间戳 array
  },
  callback: () => {
    location.reload();
  }
});
```

## api
| 属性名  | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| ------ | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
|    defaultData    |                     |                                                      |         |                     |

## ChangeLog
