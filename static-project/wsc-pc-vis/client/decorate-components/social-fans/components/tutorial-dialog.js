import React, { Component } from 'react';
import { Dialog } from 'zent';
import { RadioButton } from '../../common';
import '../style/tutorial-dialog.scss';
import { TUTORIAL_GIF } from '../constants';

const { openDialog } = Dialog;
const id = 'my_dialog';

class DialogContent extends Component {
  constructor(props) {
    super(props);
    this.state = { tutorialType: '0' };
  }

  handleOnChange = e => {
    const { value } = e.target;

    this.setState({
      tutorialType: value,
    });
  };

  render() {
    const { tutorialType } = this.state;

    return (
      <div className="tutorial-dialog-container">
        <RadioButton.Group value={tutorialType} onChange={this.handleOnChange} perLine={3}>
          <RadioButton name="tutorialType" value="0">
            加微信群
          </RadioButton>
          <RadioButton name="tutorialType" value="1">
            关注公众号
          </RadioButton>
          <RadioButton name="tutorialType" value="2">
            加个人微信
          </RadioButton>
        </RadioButton.Group>
        <img src={TUTORIAL_GIF[+tutorialType]} />
      </div>
    );
  }
}

export const openTutorialDialog = (tutorialType, onChange) => {
  openDialog({
    dialogId: id, // id is used to close the dialog
    title: '小程序操作流程',
    children: <DialogContent tutorialType={tutorialType} onChange={onChange} />,
    onClose() {},
  });
};
