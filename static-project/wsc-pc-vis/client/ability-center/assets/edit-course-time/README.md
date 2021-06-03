---
- title: 修改学员课时弹框
- owner:
  - 达达
- description: 对学员的资产进行课时修改操作
- cover:
- tag:
  - 能力
  - 修改课时
---

# Name
## demo
```jsx
import { OpenAvailableDialog as OpenEditAvailableTime, OpenCourseDialog as OpenEditCourseTime, EduClassChangeDialog } from '@ability-center/assets';

OpenEditCourseTime({
  defaultData: {
    kdtId: kdtId, // 当前校区 kdtId
    assetNo: assetNo, // 资产 no
    studentId: studentId, // 学员 id
  },
  callback: () => {
    location.reload();
  }
});
```
## api
| 属性名  | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| ------ | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
|        |                     |                                                      |         |                     |

## ChangeLog
