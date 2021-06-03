---
order: 0
title: 基础用法
subtitle: Basic
---

你可以自己组织`Dialog`内的样式，然后通过`openDialog`打开它。

```jsx
import { Dialog } from '@youzan/ebiz-components';
import { Button, Input } from 'zent';
const { openDialog, DialogBody, DialogFooter } = Dialog;

class DialogContent extends React.Component {
  readonly state = { val: this.props.data.input };

  onSubmit = () => {
    this.props.dialogref.submit({ input: this.state.val });
  };

  onClose = () => {
    this.props.dialogref.close();
  };

  render() {
    const { val } = this.state;

    return (
      <>
        <DialogBody>
          <Input
            value={val}
            onChange={evt => this.setState({ val: evt.target.value })}
          />
        </DialogBody>
        <DialogFooter>
          <Button type="primary" onClick={this.onSubmit}>
            Submit
          </Button>
          <Button onClick={this.onClose}>Close</Button>
        </DialogFooter>
      </>
    );
  }
}

class BasicDemo extends React.Component {
  onClick = () => {
    const dialogRef = openDialog(DialogContent, {
      data: { input: 'hello world' },
      title: 'DEMO TEST',
      mask: true
    });

    dialogRef
      .afterClosed()
      .then(data => {
        console.log('submit value：', data);
      })
      .catch(() => {
        console.log('close');
      });

    setTimeout(() => {
      dialogRef.close();
    }, 5000);
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

ReactDOM.render(<BasicDemo />, mountNode);
```