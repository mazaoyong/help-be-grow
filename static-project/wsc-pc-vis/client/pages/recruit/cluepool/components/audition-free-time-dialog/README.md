# 线索详情页-办理试听弹窗主体

> 这不是一个通用组件，是报名弹窗内的表单主体

## 适用场景

该组件是线索详情页，办理试听弹窗内的表单。

即截图中红框圈出的部分：

![组件截图](https://img.yzcdn.cn/upload_files/2020/02/21/FpJqCwj6CXcRctWBMOb0r4plEe4W.png)

用作点击按钮时的回调 `openDialog` 的第一个参数。

参考 [zent openDialog 文档](https://youzan.github.io/zent/zh/component/dialog#opendialog)




## Changelog

### 2020-02-21

日常[线索办理试听弹窗样式问题](http://xiaolv.qima-inc.com/#/demand/search?show=true&ids=40290)，给`DialogFooter`组件的样式添加右对齐，解决因为 zent 升级带来的样式问题（原本应该右对齐的按钮变为左对齐）。

问题产生原因：

1. zent 7.x 版本之后适用 `data-zv` 来确定样式
2. `@youzan/ebiz-components` 中对于 Dialog 的实现在 zent 升级后存在问题，如下：

```

import { Dialog } from 'zent';

const { openDialog: zentOpenDialog } = Dialog;

export function openDialog(xxx){

    // ..... 省略代码

    // OpenDialog 是 zent 7.4.3 的原生方法，打开弹窗时创建的 DOM 会带上 data-zv
    zentOpenDialog(xxxx)

    // ..... 省略代码
}

// 导出的 DialogFooter 是手动实现的，没有带上 data-zv
export const DialogFooter =  ({ children }) => {
  return <div className="zent-dialog-r-footer">{children}</div>;
};

```

3. 代码中很多地方 Dialog 是从 `@youzan/ebiz-components` 中这样引入的

```
import { Dialog }  from '@youzan/ebiz-components'

const { openDialog, DialogFooter } = Dialog


openDialog(
    (<div>
        boday
        <DialogFooter>footer</DialogFooter>
    </div>)
)


```
这样就导致 DialogFooter 没有 zent 的样式了


已经通知 @埃里克 大哥，考虑到影响面，后续会修复。
