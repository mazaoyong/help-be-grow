import React, { Component } from 'react';
import { Link } from 'react-router';
import { BlockLoading, Tag, Notify, MiniPagination } from 'zent';

import cx from 'classnames';
import get from 'lodash/get';

import isToday from 'fns/is-today';

import { getPunchTaskListAPI } from '../../api';

export default class DiaryTaskList extends Component {
  state = {
    loading: true,
    list: [],
    page: 1,
    total: 0,
  };

  componentDidMount() {
    const page = Math.floor(parseInt(this.props.activeDay - 1) / 10) + 1;
    this.getPunchTaskList(page, parseInt(this.props.activeDay));
  }

  // 选择任务
  onChooseTask = task => {
    if (task.id !== get(this.props.active, 'id')) {
      this.props.onChange(task);
    }
  };

  getPunchTaskList = (current, activeDay) => {
    this.setState({
      loading: true,
    });

    const { page } = this.state;

    getPunchTaskListAPI({
      gciAlias: this.props.alias,
      page: current || page,
      size: 10,
    })
      .then(({ content = [], total = 0, pageable = { pageNumber: 1 } }) => {
        const { pageNumber } = pageable;

        this.setState({
          list: content,
          page: pageNumber,
          total,
        });

        if (total > 0 && activeDay) {
          this.onChooseTask(content[(activeDay - 1) % 10]);
        } else {
          this.onChooseTask(content[0]);
        }
      })
      .catch(msg => {
        Notify.error(msg || '网络错误！');
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  renderItem = one => {
    const { name, id, taskDate } = one;

    const styleClass = cx({
      'punch-diary__task__list__item': true,
      active: get(this.props.active, 'id') === id,
      gray: name === '',
    });

    return (
      <div className={styleClass} key={id} onClick={() => this.onChooseTask(one)}>
        <h4>{name || '暂未设置任务'}</h4>
        {name === '' && (
          <Link className="setting" to={`/task/${id}`}>
            去设置
          </Link>
        )}
        <div className="sub">
          {taskDate}
          {isToday(taskDate) && <Tag color="blue">今天</Tag>}
        </div>
      </div>
    );
  };

  render() {
    const { loading, page, total, size } = this.state;

    return (
      <div className="punch-diary__task">
        <BlockLoading loading={loading}>
          <h3 className="punch-diary__task__title">任务列表</h3>
          <div className="punch-diary__task__list">
            {this.state.list.map(one => this.renderItem(one))}
          </div>
          <div className="punch-diary__task__bottom">
            <MiniPagination
              current={page}
              total={total}
              pageSize={size}
              onChange={({ current }) => this.getPunchTaskList(current)}
            />
          </div>
        </BlockLoading>
      </div>
    );
  }
}
