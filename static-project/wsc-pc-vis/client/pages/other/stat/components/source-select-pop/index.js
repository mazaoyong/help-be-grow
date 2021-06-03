import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import cn from 'classnames';
import { Button, Icon } from 'zent';
import { findSourceGroupPageAPI, findSourceGroupListAPI } from '../../api';
import Indicatrix from '../indicatrix';

import './style.scss';

const clsPrefix = 'source-select-pop';

export default class SourceSelectTop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animate: false,
      options: [],
    };
  }

  defaultProps = {
    kdtId: _global.kdtId,
  }

  componentDidMount() {
    this.fetchSourceList();
  }

  componentDidUpdate(prevProps) {
    const { type: prevType, kdtId: prevKdtId } = prevProps;
    const { type, kdtId } = this.props;
    if (prevType !== type || kdtId !== prevKdtId) {
      this.fetchSourceList();
    }
  }

  fetchSourceList() {
    const { type, kdtId } = this.props;
    if (!type || !kdtId) return;
    if (type === 'source') {
      findSourceGroupPageAPI({
        kdtId,
        pageRequest: {
          pageNumber: 1,
          pageSize: 100,
        },
        query: {
          needSystemDefault: true,
        },
      }).then(({ content = [] }) => {
        const options = content.map(item => {
          if (item.sourceDTOS && item.sourceDTOS.length > 0) {
            return {
              label: `${item.name}：`,
              data: item.sourceDTOS.map(source => ({
                value: source.sourceId,
                text: source.name,
              })),
            };
          }
          return null;
        }).filter(item => item);
        this.setState({ options });
      });
    } else {
      findSourceGroupListAPI({
        kdtId,
        needSystemDefault: true,
      }).then(data => {
        const options = [{
          label: '',
          data: data.map(item => {
            return {
              value: item.groupId,
              text: item.name,
            };
          }),
        }];
        this.setState({ options });
      });
    }
  }

  // 处理选中指标变化
  handleIndicatrixChange = ev => {
    let value = ev;
    try {
      // CheckboxGroup 和 RadioGroup 的 onChange 事件的 value 不同
      value = ev.target.value;
    } catch (err) {
      // console.error(err); // eslint-disable-line
    }
    // 处理最多选择 6 项
    if (Array.isArray(value) && value.length > 6) {
      this.showAnimate();
      return;
    }
    this.props.onChange('indicatrix', value);
  };

  // 选中指标多余 6 个的时候播放动画
  showAnimate() {
    this.setState({ animate: true }, () => {
      setTimeout(() => {
        this.setState({
          animate: false,
        });
      }, 400);
    });
  }

  renderTitle() {
    return this.props.type === 'source' ? '自定义来源' : '自定义来源分组';
  }

  renderContent() {
    const { animate, options } = this.state;
    const { indicatrix } = this.props;
    return (
      <div className={clsPrefix}>
        <div className={`${clsPrefix}__title`}>
          {this.renderTitle()}
        </div>
        <div className={`${clsPrefix}__item`}>
          <Indicatrix
            type="checkbox"
            value={indicatrix}
            onChange={this.handleIndicatrixChange}
            className={`${clsPrefix}__group`}
            config={options}
            allowEmpty
          />
        </div>
        <div className={`${clsPrefix}__tip`}>
          <Icon type="error-circle-o" />
          <span
            className={cn(`${clsPrefix}__tip-text`, {
              [`${clsPrefix}__tip-text--animate`]: animate,
            })}
          >
            最多选择 6 项
          </span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Pop trigger="click" position="bottom-right" content={this.renderContent()}>
        <Button>{this.renderTitle()}</Button>
      </Pop>
    );
  }
}
