---
- title: 获取学员详情URL链接
- owner: 逐浪
- description: 通过调用函数的方式获取学员详情页的URL链接
- ref: client/pages/student/student-detail/utils/get-student-detail-url
- tag:
  - 学员详情
  - 跳转
  - 函数调用
  - Link组件
---

# 获取学员详情链接

当需要从某个页面跳转到学员详情页面的时候，需要使用这个函数进行跳转；
同时跳转也提供一个使用`a`标签包裹的组件让使用者调用进行跳转。

> 函数的入参为一个对象，即使目前只有一个入参；之所以如此，是为了在后续扩展字段时减少修改，并且，对象的方式传递参数，会让增强参数的阅读性

## 函数调用

```typescript
import { getStudentDetailUrl } from '@ability-center/student';

const url = getStudentDetailUrl({ studentNo: 1 });
```

- studentNo `number|string` 学员NO

## 组件调用

```tsx
import { StudentDetialLink } from '@ability-center/student';
...
<StudentDetailLink studentNo={1}>
  查看详情
</StudentDetailLink>
```