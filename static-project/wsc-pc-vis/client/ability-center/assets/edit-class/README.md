---
- title: 对学员资产进行调班的弹框
- owner:
  - 达达
- description: 对学员资产进行调班
- cover:
- tag:
  - 能力
  - 调班
---

# Name
## demo
```jsx
import { OpenAvailableDialog as OpenEditAvailableTime, OpenCourseDialog as OpenEditCourseTime, EduClassChangeDialog } from '@ability-center/assets';
const { open: openEduClassChange } = EduClassChangeDialog;
openEduClassChange({
  defaultData: {
    kdtId: kdtId,
    assetNo,
    studentId,
  },
  className: 'student-dialog',
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
