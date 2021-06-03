# 弹窗引导用户扫码

PC 直播详情引导用户扫码组件

## 注意事项

## 使用方

- 直播详情页 - 立即报名，路径：/client/pages/course/pc-detail/modules/buy/index.ts
- 直播详情页 - 进入直播间，路径：/client/pages/course/pc-detail/modules/navigation/live.ts

## 参数说明

name | 说明 | 类型 | 可选值 | 默认值
-|-|-|-|-
options|接收参数|IDialogOptions||

```typescript
interface IDialogOptions {
  onCompleted?: () => void;
  props: {
    title: string;
    subtitle?: string;
    /** 扫码执行的操作 */
    actionText: string;
    cancelText?: string;
    okText?: string;
  }
}
```

## 接入指南

```typescript
import openQrcodeDialog from '@/components/dialog-qrcode/index';

openQrcodeDialog({
    // onCompleted: () => window.location.reload(),
    props: {
        actionText: '提交',
        title: '扫码提交报名信息',
        subtitle: '为了更好地服务你，提交报名信息后即可观看直播课程',
        okText: '已完成提交',
        cancelText: '暂不提交',
    },
});
```

## changelog

## 使用示例图

![使用示例图](https://img.yzcdn.cn/upload_files/2021/01/05/FhGIxYGqkdooID45tLrPwLA8p9yS.png)
