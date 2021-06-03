---
category: 组件
type: 通用组件
title: 图标
subtitle: Icon
author:
  - Eric
description: 使用iconfont图标
cover:
tags:
  - iconfont
---

## 使用指南

- 分图标分为实心和描线两个版本, 使用 -o（字母）来区分, e.g. calendar (实心)和 calendar-o (描线).

```javascript
import { Icon } from '@youzan/ebiz-components';

<Icon type="calendar" />;
<Icon type="calendar" width="50px" />;
```

## iconfont 图标

- iconfont 创建项目，设置 `icon-` 前缀;
- 上传自定义 svg 图标;
- 下载 code;
- 在代码中引入 `iconfont.js`;
- 使用图标库，会自动添加 `icon-` 前缀，使用时省略前缀;