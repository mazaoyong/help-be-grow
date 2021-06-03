import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import cx from 'classnames';
import './style.scss';

export default class CreateLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const { kdtId } = this.props.location.query;
    setTimeout(() => {
      if (kdtId) {
        window.location.href = `${window._global.url.www}/account/team/change.html?kdt_id=${kdtId}`;
      } else {
        hashHistory.push({
          pathname: '/create',
        });
      }
    }, 3000);
    document.title = '创建店铺';
  }

  render() {
    const cls = cx({
      'create-result__progress-inner': true,
      loading: this.state.loading,
    });
    return (
      <div className="create-result">
        <img
          className="create-result__img"
          src={`${
            window._global.url.imgqn
          }/public_files/2017/6/27/3eb2191de63dedef804047f40b09df97.png`}
          alt="店铺创建中..."
        />
        <span className="create-result__progress">
          <span className={cls} />
        </span>
        <p className="create-result__text">店铺创建中...</p>
      </div>
    );
  }
}
