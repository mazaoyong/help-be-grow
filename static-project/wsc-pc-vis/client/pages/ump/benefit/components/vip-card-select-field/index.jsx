
import { Form } from '@zent/compat';
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Button } from 'zent';
import fullfillImage from 'zan-utils/fullfillImage';
import chooseCard from '../card-dialog/dialog';
import { COLORCODE } from '../../constants';
import './style.scss';

const { getControlGroup } = Form;

const Card = props => {
  const style = {
    backgroundImage: `url(${fullfillImage(props.cover, '!100x100.jpg')})`,
    backgroundColor: props.color || 'rgb(99, 179, 89)',
    backgroundSize: 'cover',
  };
  return (
    <div className="vip-card-select-field__card">
      <div className="vip-card-select-field__card__cover" style={style} />
      {!props.isUse && (
        <span className="vip-card-select-field__card__delete" onClick={props.onDelete}>
          删除
        </span>
      )}
      <div className="vip-card-select-field__card__name">
        <span>{props.name}</span>
      </div>
    </div>
  );
};

class VipCardSelectField extends Component {
  openDialog = () => {
    chooseCard({
      onChoose: data => {
        if (Array.isArray(data) && data.length > 0) {
          const card = data[0];
          this.props.onChange(card);
        }
      },
      config: window._global,
    });
  };
  deleteCard = () => {
    this.props.onChange({});
  };
  render() {
    const { isUse } = this.props;
    let { name, cover: coverUrl, color: colorCode } = this.props.value;
    if (COLORCODE[colorCode]) {
      coverUrl = coverUrl || COLORCODE[colorCode].imageUrl;
      colorCode = COLORCODE[colorCode].bgColor;
    }
    let btnText = '关联会员卡';
    let card = null;
    if (name) {
      btnText = '修改会员卡';
      card = (
        <Card
          name={name}
          cover={coverUrl}
          color={colorCode}
          onDelete={this.deleteCard}
          isUse={isUse}
        />
      );
    }
    if (isUse) {
      return (
        <div className="vip-card-select-field can-not-delete">
          {card}
          <p className="zent-form__help-desc">
            当权益包所关联的会员卡已经被用户领取，不能修改会员卡
          </p>
        </div>
      );
    }
    return (
      <div className="vip-card-select-field">
        <Button
          className="vip-card-select-field__btn"
          onClick={this.openDialog}
          type="primary"
          outline
        >
          {btnText}
        </Button>
        <a
          className="dpSoto"
          rel="noopener noreferrer"
          target="_blank"
          href={`${window._global.url.base}/v4/scrm/membercard`}
        >
          管理会员卡
        </a>
        {card}
        <p className="zent-form__help-desc">关联会员卡后，可以到会员卡详情管理会员卡权益</p>
      </div>
    );
  }
}

export default getControlGroup(VipCardSelectField);
