import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import isFunction from 'lodash/isFunction';
import defaultTo from 'lodash/defaultTo';

import './index.scss';

export interface IProps {
  dragStartHandler: (arg0: any, any) => void;
  item: any;
}

export interface IState {
  hoverOnCom: any;
}

export default class ComItem extends Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      hoverOnCom: false,
    };
  }

  mouseEnterHandler() {
    this.setState({
      hoverOnCom: true,
    });
  }

  dragStartHandler(event) {
    event.dataTransfer.setData('drag', 'null');
    const { dragStartHandler, item } = this.props;
    if (isFunction(dragStartHandler)) {
      dragStartHandler(event, item);
    }
  }

  mouseLeaveHandler() {
    this.setState({
      hoverOnCom: false,
    });
  }

  render() {
    const { item } = this.props;
    const { hoverOnCom } = this.state;
    const { couldCreate } = item;
    return defaultTo(couldCreate, true) ? (
      <div
        className={hoverOnCom ? 'com-item com-item-active' : 'com-item'}
        onMouseEnter={this.mouseEnterHandler.bind(this)}
        onMouseLeave={this.mouseLeaveHandler.bind(this)}
        onDragStart={this.dragStartHandler.bind(this)}
        draggable={true}
      >
        <i
          className="com-item__icon"
          style={{
            backgroundImage: `url(${item.icon})`,
          }}
        />
        <div className="com-item__name">{item.name}</div>
        <div className="com-item__num">
          {item.usedNum}/{item.maxNum}
        </div>
      </div>
    ) : (
      <div className="com-item com-item-disable" draggable={true}>
        <Pop trigger="hover" position="top-center" content={item.disableText}>
          <div>
            <i
              className="com-item__icon"
              style={{
                backgroundImage: `url(${item.icon})`,
              }}
            />
            <div className="com-item__name">{item.name}</div>
            <div className="com-item__link">{item.disableLink}</div>
          </div>
        </Pop>
      </div>
    );
  }
}
