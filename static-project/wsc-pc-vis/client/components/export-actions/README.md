---
- title: ExportAction EasyList-导出组件
- owner:
  - 郑健
- description: 搭配 EasyList 的 Filter 使用的导出组件
- cover: https://b.yzcdn.cn/upload_files/2020/11/09/readme/cXg4t4.png
- tag:
  - 导出
  - easylist
  - 报表
  - export
---


# ExportAction  EasyList-导出组件

![demo](https://b.yzcdn.cn/upload_files/2020/11/09/readme/cXg4t4.png)

这个组件用于在 EasyList 的 Filter 中，渲染导出和导出记录两个按钮，组件提供了跳转到导出记录的功能，也封装了弹出授权弹窗的逻辑。

在使用该组件的时候，你需要先得知一个导出记录类型，一般来说后端都会直接告诉你（https://doc.qima-inc.com/pages/viewpage.action?pageId=268795967），然后将这个类型枚举加入到 @ability-center/ump/export-record 里面，接下来只需要将值作为 `type` props 传给该组件即可。

一般来说，创建导出任务成功后会跳转到导出记录页面，这个组件已经包含了这个逻辑，组件通过 onExport 回调返回的 promise 的的状态来判断是不是需要跳转（即导出任务是不是成功）

该组件接受一个 onExport 作为点击导出按钮的回调，它必须返回一个 Promise 且状态标明成功或失败，如果你要在出错时显示 Notify，你只需 reject 一个错误消息即可，组件内部已经有这个错误处理了，如果你需要做额外的错误处理，记得一定要

```javascript
createExportTask().catch(errMsg=>{
  // 错误处理
   return Promise.reject('')
})
```



如果你需要在导出前弹窗授权弹窗，那么只需设置 `withAgreementConfirm`props，组件默认弹窗数据导出承诺函，当然你也可以自定义协议的内容，通过 `agreementContent`。





##  demo

```jsx
const demo = () => {
  
  const handleExport = filter => Api.createExportTask(format(filter));
  
  
  return (
    <List mode="hash" ref={ListRef} delay={200} onSubmit={handleSubmit} onError={Notify.error}>
      <section className="clue-list__header">
        <SamButton name="编辑" type="primary" onClick={handleAddClue}>
          添加线索
        </SamButton>
        <Filter
          config={filterConfig}
          formatQueries={handleFormatQueries}
          actionsOption={{
            beforeReset(filter) {
              return (
                <ExportActions
                  withAgreementConfirm
                  onExport={() => handleExport(filter)}
                  type={EXPORT_RECORD_TYPES.CLUE}
                />)
              ;
            }
          }}
        />
        <Tabs name="phase" defaultValue="0" tabs={tabConfig} />
      </section>
      <EasyGrid
        easySelection
        rowKey="clueId"
        scroll={{ x: 1500 }}
        className="clue-list__table"
        pageSizeOptions={[20, 30, 50]}
        columns={getGridConfig(pageType)}
        batchRender={renderBatchComponents}
      />
    </List>
  )
}
```
## api

| 属性名  | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| ------ | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
| type | 导出类型，见上文 | EXPORT_RECORD_TYPES | 是 | 无 |
| exportButtonText | 导出按钮的文案 | string | 否 | 导出 |
| exportRecordButtonText | 查看已导出列表按钮的文案 | string | 否 | 查看已导出列表 |
| withAgreementConfirm | 是否需要确认协议书 | Boolean | 否 | false |
| agreementContent | 确认协议书的内容，应该为富文本 | string | 否 | 数据导出授权协议书 |
| agreementDialogTitle | 确认协议书弹窗的标题 | string | 否 | 数据导出 |
| agreementDialogConfirmButton | 确认协议书弹窗的确认按钮文案 | string | 否 | 同意并导出 |
| onExport | 导出按钮的回调函数，必须返回一个 Promise，且 Promise 的状态表示导出是否成功 | () => Promise<any>; | 是 | 无 |
| samName | 权限按钮的名称 | string | 否 | `''` |

## ChangeLog

- `2020-11-09` 增加文档

