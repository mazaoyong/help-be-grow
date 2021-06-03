
import { Popover, Form } from '@zent/compat';
/**
 * 推荐购买组件
 */
import React, { Component } from 'react';
import { Sweetalert, Icon } from 'zent';
import PropTypes from 'prop-types';
import formatMoney from 'zan-utils/money/format';
import SkuCard from '../sku-card';
import { wscPkgPrice, periods } from '../../constants';
import './style.scss';

// TODO hardcode
const WSCPKGDATA = {
  title: '微商城扩展包',
  subTitle: '教育周边实物销售、周末亲子游、门票卡券销售等，带来额外的生意',
  price: wscPkgPrice,
};

const yearOptions = periods.map(item => ({
  text: `${item} 年`,
  value: item,
}));

class RecommendField extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleChange: PropTypes.func,
    hasPhysicalGoods: PropTypes.bool,
    version: PropTypes.number,
    period: PropTypes.number,
  };

  static defaultProps = {
  };

  state = {
    selectYears: this.props.value,
    popVisiable: false
  };

  componentDidMount() {
    const { value } = this.props;
    // 初始触发一次更新默认价格
    this.onRecommendChange(value);
  }

  componentDidUpdate(prevProps, _prevState, _snapshot) {
    // value存在被外层更改和重置的可能性，此处特殊检查一下，确保外层价格也是对的
    if (this.props.period !== prevProps.period) {
      this.setState({
        selectYears: this.props.period,
      });
    }
  }

  // 向上级通报展示与否
  onRecommendChange = (value) => {
    this.props.handleChange(value);
  };

  onYearSelectChange = (value) => {
    this.setState({
      selectYears: value
    });
    if (this.props.value) {
      this.onRecommendChange(value);
    }
  }

  // 处理卡片选择&反选
  onRecommendCardCheck = () => {
    const { value, hasPhysicalGoods } = this.props;
    if (value) {
      if (!hasPhysicalGoods) {
        Sweetalert.confirm({
          title: '订购提醒',
          className: 'recommend-cards__dialog',
          content: (
            <p>
              确定放弃购买「微商城扩展包」吗？若放弃，则无法销售教材教辅等实物，电子卡券、活动票务等商品，仅适配实物/虚拟商品的营销应用也不能使用。
            </p>
          ),
          confirmText: '重新订购',
          cancelText: '放弃订购',
          onCancel: () => this.onRecommendChange(0),
          parentComponent: this,
        });
      } else {
        Sweetalert.alert({
          title: '订购提醒',
          className: 'recommend-cards__dialog',
          content: (
            <p>
              想要放弃购买「微商城扩展包」吗？若放弃，店铺中所有实物/虚拟商品需先下架，不然会导致用户无法正常下单，影响你店铺的用户购买体验。
            </p>
          ),
          confirmText: '我知道了',
          parentComponent: this,
        });
      }
    } else {
      // 如果卡片反选再选择，取传入的defaultValue来更新
      this.onRecommendChange(this.state.selectYears);
    }
  };

  render() {
    const { value } = this.props;
    const { selectYears, popVisiable } = this.state;
    return (
      <div className="recommend-cards">
        <SkuCard
          className="recommend-cards__card"
          checked={value}
          title={WSCPKGDATA.title}
          actions={<Popover
            position={Popover.Position.BottomLeft}
            display="inline"
            visible={popVisiable}
            onVisibleChange={v => this.setState({ popVisiable: v })}
            cushion={5}>
            <Popover.Trigger.Click>
              <span onClick={(e) => e.stopPropagation()} className="wscpackage-year__trigger">x {selectYears} 年<Icon type={popVisiable ? 'up' : 'down'} /></span>
            </Popover.Trigger.Click>
            <Popover.Content>
              <div className="wscpackage-year__container">
                {yearOptions.map((item, index) => (<div key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    this.onYearSelectChange(item.value);
                    this.setState({ popVisiable: false });
                  }}
                  className="wscpackage-year__option">
                  {item.text}
                </div>))}
              </div>
            </Popover.Content>
          </Popover>}
          subTitle={WSCPKGDATA.subTitle}
          // 控制显示，至少显示1年
          price={`￥ ${formatMoney(WSCPKGDATA.price * selectYears, false).replace('.00', '')}`}
          onCheck={() => this.onRecommendCardCheck()}
        >
        </SkuCard>
      </div>
    );
  }
}

export default Form.getControlGroup(RecommendField);
