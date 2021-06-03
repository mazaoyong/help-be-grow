import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import cn from 'classnames';
import { Button, Icon, Input, BlockLoading } from 'zent';
import get from 'lodash/get';
import { getEduCourseListAPI } from '../../api';
import Indicatrix from '../indicatrix';

import './style.scss';

const clsPrefix = 'course-select-pop';

const initState = {
  animate: false,
  page: 1,
  options: [],
  totalPages: 1,
  loading: false,
  name: '',
};

export default class CourseSelectPop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initState,
    };
  }

  defaultProps = {
    kdtId: _global.kdtId,
  }

  componentDidMount() {
    this.fetchSourceList();
  }

  componentDidUpdate(prevProps) {
    const { kdtId: prevKdtId } = prevProps;
    const { kdtId } = this.props;
    if (kdtId !== prevKdtId) {
      this.setState({ ...initState }, () => {
        this.fetchSourceList();
      });
    }
  }

  fetchSourceList(name = '', callback) {
    const { kdtId } = this.props;
    const { page, options } = this.state;
    this.setState({ loading: true });
    getEduCourseListAPI({
      // applicableCampusType: isEduChainStore && !kdtId ? 1 : 0, 不需要传递
      kdtId: kdtId || _global.kdtId,
      pageNumber: page,
      pageSize: 30,
      name,
    }).then((res) => {
      const { content = [], totalPages } = res || {};
      const data = content.map(item => {
        return {
          text: item.name,
          value: item.id,
        };
      });
      if (page === 1 && !name) {
        data.splice(0, 0, {
          text: '通用课程',
          value: 0,
        }, {
          text: '未指定课程',
          value: -999,
        });
      }
      const optionsData = options.length ? options[0].data.concat(data) : data;
      this.setState({
        pageTotal: totalPages,
        options: [{
          label: '',
          data: optionsData,
        }],
      });
      callback && callback(optionsData.map(item => item.value));
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  handleLoadMore = () => {
    const { page, loading, pageTotal } = this.state;
    if (page >= pageTotal || loading) return;
    this.setState({
      page: page + 1,
    }, this.fetchSourceList);
  }

  // 处理课程选择变化
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

  onChangeKeyword = e => {
    const { value } = e.target;
    this.setState({ name: value });
  }

  onPressEnter = e => {
    const { value } = e.target;
    const { onKeywordChange } = this.props;
    this.setState({ ...initState, name: value }, () => {
      this.fetchSourceList(value, onKeywordChange);
    });
  }

  onClose = () => {
    const { onClose } = this.props;
    onClose && onClose();
  }

  renderContent() {
    const { animate, options, page, pageTotal, name, loading } = this.state;
    const { indicatrix } = this.props;
    return (
      <div className={clsPrefix}>
        <div className={`${clsPrefix}__title`}>
          自定义课程
          <Input
            className={`${clsPrefix}__search`}
            icon="search"
            placeholder="请输入课程名称"
            inline
            width={184}
            value={name}
            onChange={this.onChangeKeyword}
            onPressEnter={this.onPressEnter} />
        </div>
        <BlockLoading loading={loading}>
          <div className={`${clsPrefix}__item`}>
            {
              get(options, '[0].data.length')
                ? <Indicatrix
                  type="checkbox"
                  value={indicatrix}
                  onChange={this.handleIndicatrixChange}
                  className={`${clsPrefix}__group`}
                  config={options}
                  allowEmpty
                />
                : <p className={`${clsPrefix}__empty`}>暂无课程</p>
            }
            {
              page < pageTotal && (
                <div className={`${clsPrefix}__more`} onClick={this.handleLoadMore}>
                  点击查看更多<Icon type="down" />
                </div>
              )
            }
          </div>
        </BlockLoading>
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
      <Pop trigger="click" position="bottom-left" content={this.renderContent()} onClose={this.onClose}>
        <Button>自定义课程</Button>
      </Pop>
    );
  }
}
