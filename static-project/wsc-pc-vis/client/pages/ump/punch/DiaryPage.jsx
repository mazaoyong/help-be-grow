import React, { Component } from 'react';

import get from 'lodash/get';

import DiaryTaskList from './components/diary/DiaryTaskList';
import DiaryComments from './components/diary/DiaryComments';

export default class DiaryPage extends Component {
  state = {
    activeTask: {
      id: '',
      name: '任务名称',
      taskDate: '',
      taskGciTimes: 0,
    },
  };

  onTaskChange = id => {
    this.setState({
      activeTask: id,
    });
  };

  render() {
    return (
      <div className="punch-diary">
        <DiaryTaskList
          alias={this.props.params.alias}
          active={this.state.activeTask}
          activeDay={get(this.props.location, 'query.activeDay') || 1}
          onChange={task => this.onTaskChange(task)}
        />
        <DiaryComments alias={this.props.params.alias} active={this.state.activeTask} />
      </div>
    );
  }
}
