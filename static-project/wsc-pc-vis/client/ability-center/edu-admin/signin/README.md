---
- title: 签到记录
- owner: 逐浪
- description: 签到记录的复用组件
- ref:
- tag:
    - 签到列表
    - 签到状态组件
---

# 签到记录

## 签到状态组件

根据签到状态，渲染出相对应的样式，用法如下：

```tsx
import { SignInTag, SignInStateEnum } from '@ability-center/edu-admin/signin';

<SignInTag state={data.signInStatus} />;
```

## 「接口」获取签到记录

```typescript
import { getSignInRecords, signinListQueryFormatter } from '@ability-center/edu-admin/signin';

const data = await getSignInRecords(signinListQueryFormatter(query));
```

## 「接口」导出签到记录

```typescript
import { exportSigninRecord } from '@ability-center/edu-admin/signin';
```
