import React from 'react';
import { Dialog, Steps, Button, IStepsProps } from 'zent';
import s from './index.m.scss';

const { openDialog, closeDialog } = Dialog;

const dialogId = 'EXPRESS_SOP_INTRO_DIALOG';

const steps = [
  {
    img: '//b.yzcdn.cn/public_files/2018/12/12/express-guide-01@2x.png',
    desc:
      '指定配送区域，非配送区域不可下单；设定不同区域运费不同。请在【设置-订单设置-快递发货】“新建运费模板”',
  },
  {
    img: '//b.yzcdn.cn/public_files/2018/12/12/express-guide-02@2x.png',
    desc: '设置模板名称，按需选择计费方式，设置配送区域及运费规则',
    extra: '建议：可创建不同的运费模板，应用于不同的商品',
  },
  {
    img: '//b.yzcdn.cn/public_files/2018/12/12/express-guide-03@2x.png',
    desc: '在【商品-商品管理】，选择对应的商品之后，点击“编辑”按钮，进入商品编辑页面',
  },
  {
    img: '//b.yzcdn.cn/public_files/2018/12/12/express-guide-04@2x.png',
    desc: '给商品选择对应的运费模板即可',
  },
];
type IState = Required<Pick<IStepsProps, 'current' | 'status'>>;

export class DialogContent extends React.Component<{}, IState> {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      status: 'finish',
    };
  }

  handleClose = () => {
    try {
      closeDialog(dialogId);
      window.localStorage.setItem('sop_show_board', 'false');
    } catch (error) {
      // NOTHING
    }
  };

  go = current => {
    this.setState({
      current,
    });
  };

  renderSteps() {
    const steps = [1, 2, 3, 4];
    const { current, status } = this.state;
    return (
      <Steps current={current} status={status}>
        {steps.map(item => (
          <Steps.Step key={item} title="" description="" />
        ))}
      </Steps>
    );
  }

  renderContent() {
    const { current } = this.state;
    const { img, desc, extra = '' } = steps[current - 1];
    return (
      <div className={s.content}>
        <img className={s.img} src={img} />
        <div className={s.desc}>{desc}</div>
        {extra && <span className={s.extra}>{extra}</span>}
      </div>
    );
  }

  renderFooter() {
    const { current } = this.state;
    const footers: JSX.Element[] = [];
    if (current < 4) {
      const skip = (
        <span key="skip" className={s.skip} onClick={this.handleClose}>
          跳过
        </span>
      );
      footers.push(skip);
    }
    if (current > 1) {
      const prev = (
        <Button key="prev" onClick={() => this.go(current - 1)}>
          上一步
        </Button>
      );
      footers.push(prev);
    }
    if (current < 4) {
      const next = (
        <Button key="next" type="primary" onClick={() => this.go(current + 1)}>
          下一步
        </Button>
      );
      footers.push(next);
    }
    if (current === 4) {
      const completed = (
        <Button key="completed" type="primary" onClick={this.handleClose}>
          我知道了
        </Button>
      );
      footers.push(completed);
    }
    return <div className={s.footer}>{footers}</div>;
  }

  render() {
    return (
      <div>
        {this.renderSteps()}
        {this.renderContent()}
        {this.renderFooter()}
      </div>
    );
  }
}

export default () => {
  let showSopBoard = false;
  try {
    showSopBoard = window.localStorage.getItem('sop_show_board') === 'true';
  } catch (error) {
    // NOTHING
  }
  if (!showSopBoard) {
    return;
  }
  return openDialog({
    title: '快递发货',
    dialogId,
    style: {
      width: '690px',
    },
    children: <DialogContent />,
  });
};
