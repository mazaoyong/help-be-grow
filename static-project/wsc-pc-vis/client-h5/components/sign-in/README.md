## 通用 sign-in 签到方法

> 属于预约签到能力线

### props

```JavaScript
props: {
    students: {
      type: Array,
      default() {
        return [{studentLessonNo}]; // 操作的学员列表(学员课节编号)
      },
    },
    lessonNo: {
      type: String,
      default: '', // 课节 number
    },
    type: {
      type: String,
      default: '', // [sign-in, leave, not-arrived]
    },
    kdtId: {
      type: [String, Number], // 校区 kdtId
      default: 0,
    },
    startTime: {
      type: Number,
      default: 0, // 课节开始时间
    },
    signInAllStudents: {
      type: Boolean,
      default: false, // 是否是点击待签到全部签到
    },
    signInAllStudentsNumber: {
      type: Number,
      default: 0, // 如果 signInAllStudents true，则需要传有多少个
    },
  },
```

用于系统中对学员的某个课节进行状态变更，在变更状态时会对学员的资产进行校验，组件内包含后续多个逻辑。

![](https://b.yzcdn.cn/public_files/2fd4c048fa8eb70a0cda61d7216b4923.png)

![](https://b.yzcdn.cn/public_files/960c940fc69225324c46759516d31c6d.png)

![](https://b.yzcdn.cn/public_files/65a1e13e5f97e6336adb0718586bcfa6.png)
