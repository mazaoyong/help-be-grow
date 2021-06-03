---
- title: 分享右上角提示引导
- owner:
  - 云舒
- description: 引导分享蒙层
- cover: https://img.yzcdn.cn/public_files/2020/04/07/share-mask.png
- tag:
  - share
  - 分享蒙层
---

# ShareMask

## demo
```
  <share-mask :show="show" @close=""show=false>
  <p slot="title">自定义文案1</p>
  <p slot="desc">自定义文案2</p>
  </share-mask>

  data() {
    return {
      show: true,
    };
  }

```

或者使用函数调用式

```
import OpenShare from '@/components/share-mask/main.js';
OpenShare();
```

## api
| 属性名  | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| ------ | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
|        |                     |                                                      |         |                     |

## ChangeLog
