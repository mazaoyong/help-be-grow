
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import GoodsSelector from 'components/good-selector';

const { getControlGroup } = Form;

class GoodsSelectWrap extends Component {
  state = {
    showGoodsSelect: false,
  };

  handleShowGoodsSelectModal = () => {
    this.setState({
      showGoodsSelect: true,
    });
  };

  handleCLoseGoodSelectModal = () => {
    this.setState({
      showGoodsSelect: false,
    });
  };

  handleModalSubmit = data => {
    this.props.onChange(data);
    this.setState({
      showGoodsSelect: false,
    });
  };

  render() {
    return (
      <div className="goods-field-wrapper">
        {this.props.value.alias && (
          <a
            className="goods-title ellipsis"
            href={this.props.value.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.props.value.title}
          </a>
        )}

        {/* <GoodsSelect
          visible={this.state.showGoodsSelect}
          activityId={this.props.activityId}
          activityType={9}
          selected={this.props.value}
          isSingleSelection
          detail
          onClose={() => this.handleCLoseGoodSelectModal()}
          onSubmit={data => this.handleModalSubmit(data)}
          shouldSelect={rowData => !(rowData.join === 2)}
        /> */}

        <GoodsSelector
          isOnlyEdu={true}
          disabled={this.props.disabled}
          hasSku
          singleMode
          selected={this.props.value}
          btnTxt={this.props.value.alias ? '重新选择' : '添加'}
          activityType={9}
          activityId={+this.props.activityId || 0}
          onChange={data => this.handleModalSubmit(data)}
        />
        {!this.props.value.alias && (
          <span className="goods-field__desc"> 单选商品，作为本次活动的奖励 </span>
        )}
      </div>
    );
  }
}

export default getControlGroup(GoodsSelectWrap);
