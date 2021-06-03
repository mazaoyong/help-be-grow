---
- title: ImportPage 通用导入页
- owner:
  - 赵梓皓
- description: ImportPage 通用导入页
- cover: https://b.yzcdn.cn/public_files/5b81f68ba76aa4e091814f702ffb9165.png
- tag:
  - ImportPage
  - 通用导入页
---

# ImportPage 通用导入页

### 适用场景
用于导入页面

### 使用示例
* 示例页面 (client/pages/student/student-import/components/file-upload/index.jsx)

### 使用截图
![](https://b.yzcdn.cn/public_files/5b81f68ba76aa4e091814f702ffb9165.png)

#### API
name | 说明 | 默认值
-|-|-
className | 类名 | '' |
needSteps | 是否需要展示类似Step样式的步骤图标 | false |
prefields | 固定字段前面的字段（固定字段为文件模板和文件上传两个区域） | [] |
suffields | 固定字段后面的字段 | [] |
enableTemplateField | 是否需要“文件模板字段”，默认文件模板为单一模板 | true |
templateFieldLabel | 文件模板字段label | '' |
templateFieldDesc | 文件模板字段说明 | '导入前，请下载文件模板，并按照模板格式填写数据后再导入' |
templateLink | 模板文件链接 | '' |
enableUploadField | 是否需要“文件上传”字段，默认字段为单一字段 | true |
fileMaxSize | 文件最大大小，现阶段只允许上传excel文件（单位“M”） | 2 |
uploadFieldLabel | 文件模板字段label | '' |
uploadFieldDesc | 文件模板字段说明 | (<div className="file-uploader__desc">
  <p>当前仅支持 excel 格式文件（大小在2M以内），请使用 Office 2010 及以上版本，否则可能出现乱码</p>
  <p>必须严格按照模板内容填入数据，否则可能会出现导入异常。</p>
</div>) |
agreeProtocol | 是否同意用户协议 | true |
toggleAgreeProtocol | 由外部控制用户是否同意文件上传协议 | noop |
onUploadFileChange | 上传文件变化的回调 | noop |

### 其他
1. 说明：
prefields和suffields中的字段说明：
字段同Easyform的字段，现阶段每个外部传入的field如果需要显示steps样式的步骤图标（needSteps = true)，需要额外在props中传一个index字段。之后会做成自己生成序号，不需要外部通过props传进来。

### ChangeLog
2020-5-29 增加此组件
