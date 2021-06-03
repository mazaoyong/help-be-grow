import React, { PureComponent } from 'react';
import { Steps, Button, Dialog } from 'zent';
import YZlocalstorage from '@youzan/utils/browser/local_storage';
import './style.scss';

const { closeDialog } = Dialog;

type IMenuAction = 'prev' | 'next' | 'close';

interface IMenuItem {
  type: 'link' | 'button';
  text: string;
  action: IMenuAction;
  isPrimary?: boolean;
}

interface IIntroConfig {
  imageUrl: string;
  title: string;
  description: string | null;
  menus: IMenuItem[];
}

const introConfig: IIntroConfig[] = [
  {
    imageUrl: 'https://img.yzcdn.cn/public_files/2018/11/20/64e4dad0e385e9854b17ea5f5df58d1c.png',
    title: '开启同城配送功能，需要在【设置-订单设置-同城配送】设置好店铺地址、配送方式、配送区域等',
    description:
      '建议：若你没有配送团队，可以开启第三方配送服务。第三方配送的收费标准，可前往《第三方配送服务协议》下载附件查看。若你有多家门店，希望按门店设置配送区域和起送价，推荐你使用有赞多网点功能',
    menus: [
      {
        type: 'link',
        text: '跳过',
        action: 'close',
      },
      {
        type: 'button',
        isPrimary: true,
        text: '下一步',
        action: 'next',
      },
    ],
  },
  {
    imageUrl: 'https://img.yzcdn.cn/public_files/2018/11/20/8695cbc392a2186791e64660daa7d126.png',
    title: '填写完整配送信息，保存之后，点击上方【开启】总开关，开启同城配送',
    description: null,
    menus: [
      {
        type: 'button',
        text: '上一步',
        action: 'prev',
      },
      {
        type: 'button',
        isPrimary: true,
        text: '我知道了',
        action: 'close',
      },
    ],
  },
];

interface IProps {
  dialogId: string;
}

interface IState {
  current: number;
}

/**
 * 功能介绍弹框
 */
export default class SopIntroDialog extends PureComponent<IProps, IState> {
  state: IState = {
    current: 1,
  };

  handleClick = (action: IMenuAction) => {
    const { dialogId } = this.props;
    const { current } = this.state;

    if (action === 'close') {
      closeDialog(dialogId, {
        triggerOnClose: true,
      });
      YZlocalstorage.setItem('sop_show_board', false);
    } else if (action === 'prev') {
      this.setState({
        current: current - 1,
      });
    } else if (action === 'next') {
      this.setState({
        current: current + 1,
      });
    }
  };

  renderMenu(menu: IMenuItem, index: number) {
    if (menu.type === 'link') {
      return (
        <a href="javascript:;" key={index} onClick={() => this.handleClick(menu.action)}>
          {menu.text}
        </a>
      );
    }

    return (
      <Button
        type="primary"
        outline={!menu.isPrimary}
        key={index}
        onClick={() => this.handleClick(menu.action)}
      >
        {menu.text}
      </Button>
    );
  }

  render() {
    const { current } = this.state;
    const intro = introConfig[current - 1];

    return (
      <div className="sop-intro-dialog">
        <Steps current={current} status="process">
          <Steps.Step title="" />
          <Steps.Step title="" />
        </Steps>
        <div className="intro-content">
          <img src={intro.imageUrl} alt="" className="intro-content__img" />
          <p className="intro-content__title">{intro.title}</p>
          <p className="intro-content__description">{intro.description}</p>
        </div>
        <div className="sop-intro-footer">
          {intro.menus.map((menu, index) => this.renderMenu(menu, index))}
        </div>
      </div>
    );
  }
}
