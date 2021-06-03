---
- title: Agreements Dialog 协议弹窗
- owner:
  - 郑健
- description: 搭配 EasyList 的 Filter 使用的导出组件
- cover: https://b.yzcdn.cn/upload_files/2020/11/06/readme/Z3pjGc.png
- tag:
  - 导出
  - easylist
  - 报表
  - export
---

# ExportAction  EasyList-导出组件

![demo](https://b.yzcdn.cn/upload_files/2020/11/09/readme/cXg4t4.png)



这个组件封装了一个协议弹窗，可以展示富文本的协议且按照视觉规范调整了弹窗的样式，使用跟[openDialog](https://fedoc.qima-inc.com/ebiz-react-components/components/dialog) 一样。

因为协议内容比较长，基于文件大小的考虑，没有使用 type 来选择协议内容，在新增一个协议的时候，建议放到该组件目录 contents 文件夹下，默认导出一个富文本字符串。

如果你想在点击确认按钮的时候有 loading，跟[openDialog](https://fedoc.qima-inc.com/ebiz-react-components/components/dialog) 一样，那么你需要传入一个 submitEffect。



如果不需要的话，就按照 ebiz-components 的 openDialog 用

##  demo

```jsx
import defaultExportAgreement, { title as defaultAgreementDialogTitle } from 'components/agreements/contents/export-data';


     openAgreementDialog({
        content: agreementContent,
        title: agreementDialogTitle,
        confirmText: agreementDialogConfirmButton,
        callbacksubmitEffect () => onExportNormalized().then(() => {
          // 告知关闭弹窗
          return true;
        }),
      })
        .afterClosed()
        .then(() => {
 
        });
      return;
    }

  

```



## api

| 属性名  | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| ------ | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
| type | 导出类型，见上文 | EXPORT_RECORD_TYPES | 是 | 无 |
| submitEffect | 点击确定按钮的副作用，用于显示一个带 loading 的弹窗 | [openDialog](https://fedoc.qima-inc.com/ebiz-react-components/components/dialog) | 否 | 无 |
| title | 对话框的标题 | string | 是 | 无 |
| cancelText | 取消按钮的文案 | string | 否 | 取消 |
| confirmText | 确定按钮的文案 | string | 否 | 确定 |
| content | 协议内容，富文本 | string | 是 | 无 |

## ChangeLog

- `2020-11-09` 增加文档
