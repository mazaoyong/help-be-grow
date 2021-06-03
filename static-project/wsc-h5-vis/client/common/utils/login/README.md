---
- title: 登录方法和组件
- owner:
  - 达达
- description: 登录方法和组件
- cover: https://img01.yzcdn.cn/upload_files/2020/07/08/FpQPKDhSRGnSi09HTSQ12TumKC7W.png
- tag:
  - login
  - popup
---

## vis 登录方法

### login

**说明**
通用登录方法，业务中不建议使用，业务中请使用 checkAndLogin forcePhoneLogin

**入参**
1、getUser 是否获取用户信息，默认 false
2、forceLogin 是否不允许关闭弹框，默认 true

**使用方法**

```javascript
import commonLogin from '@/common/utils/login';
commonLogin({
    getUser: true,
  })
    .then((userInfo) => {
      // 登录成功回调
      // { sessionId userId } = userInfo;
    })
    .catch(() => {
      // 取消弹框回调
    })
```

### checkAndLogin

**说明**
判断没有登录态信息时需要登录
适用场景：普通 h5 环境没有登录时，会弹框登录，微信环境中不弹框

**入参**
1、fn 回调

**使用方法**

```javascript
import { checkAndLogin } from '@/common/utils/login';
checkAndLogin((sessionId, userId, doLogin) => {
  // doLogin 作用
  // 因为已经登录的情况下，也会触发回调
  // 所以需要增加一个标志，判断是否是点击完登录后触发的回调
});
```

### forcePhoneLogin

**说明**
判断没有手机号（绑定）信息时需要登录
适用场景：普通 h5 环境没有登录时，或者在微信环境中判断该用户没有绑定手机号时显示登录

**入参**
1、fn 回调

**使用方法**

```javascript
import { forcePhoneLogin } from '@/common/utils/login';
forcePhoneLogin((sessionId, userId, doLogin) => {
  // doLogin 作用
  // 因为已经登录的情况下，也会触发回调
  // 所以需要增加一个标志，判断是否是点击完登录后触发的回调
});
```