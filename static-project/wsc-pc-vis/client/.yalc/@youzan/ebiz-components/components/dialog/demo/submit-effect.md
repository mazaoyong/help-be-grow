---
order: 01
title: 构建一个带有loading按钮的Dialog
subtitle: SubmitEffect
---

如果你想 Dialog 根据提交之后的行为的完成与否来决定是否关闭 Dialog，并且按钮能够在点击“确认”按钮开始
按钮就进入`loading`状态，当请求完成之后能够结束`loading`状态;

```jsx
import { Dialog } from '@youzan/ebiz-components';
import { Button, Input } from 'zent';
const { openDialog, DialogBody, DialogFooter } = Dialog;

const DialogContent = (props) => {
  const { dialogref, loadingState } = props;
  return (
    <>
      <DialogBody>弹窗内容</DialogBody>
      <DialogFooter>
        <Button type="primary" loading={loadingState} onClick={dialogref.submit}>
          确定
        </Button>
        <Button onClick={dialogref.close}>取消</Button>
      </DialogFooter>
    </>
  );
};

class SubmitEffect extends React.Component {
  onClick = () => {
    openDialog(DialogContent, {
      data: { input: 'hello world' },
      title: 'DEMO TEST',
      mask: true,
      submitEffect() {
        return new Promise((resolve) => setTimeout(() => resolve(true), 2000));
      },
    })
      .afterClosed()
      .then(() => {
        console.log('submit');
      })
      .catch(() => {
        console.log('close');
      });
  };

  render() {
    return (
      <>
        <Button type="primary" onClick={this.onClick}>
          Click Me
        </Button>
      </>
    );
  }
}

ReactDOM.render(<SubmitEffect />, mountNode);
```
