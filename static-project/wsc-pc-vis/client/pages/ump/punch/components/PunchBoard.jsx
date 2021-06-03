import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Notify } from 'zent';
import { Img } from '@youzan/ebiz-components';
import fen2yuan from 'fns/fen2yuan';

import { PUNCH_STATUS } from '../constants';
import { updatePunchStatusAPI } from '../api';

const OPERATOR = { source: window._global.mobile };
const { ImgWrap } = Img;
export default class PunchBoard extends Component {
  static propTypes = {
    gciAlias: PropTypes.string.isRequired,
    data: PropTypes.object,
    showOperate: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    showOperate: false, // 是否显示操作
  };

  // 上下架群打卡
  updatePunchStatus = status => {
    this.setState({
      tableLoading: true,
    });

    const req = {
      gciAlias: this.props.gciAlias,
      status,
      operator: OPERATOR,
    };

    updatePunchStatusAPI(req)
      .then(() => {
        const text = status === 1 ? '上架' : '下架';
        Notify.success(text + '成功！');
        this.props.onChange();
      })
      .catch(msg => {
        Notify.error(msg || '网络错误！');

        this.setState({
          tableLoading: false,
        });
      });
  };

  // 参与方式
  renderParticipate() {
    const {
      participateWay,
      participatePrice,
      // participateColumnAlias,
      // participatePassword,
      // participatePasswordCopy,
    } = this.props.data;
    switch (participateWay) {
      case 1:
        return '免费参加';
      case 2:
        return `付费参加 (¥ ${fen2yuan(participatePrice)})`;
      case 3:
        return '购买专栏参加';
      case 4:
        return '输入密码参加';
      default:
        return '—';
    }
  }

  render() {
    const alias = this.props.gciAlias;
    const { name, coverUrl, proceedStatus, joinPersonNum, status } = this.props.data;
    return (
      <div className="punch-board">
        <div className="punch-board__cover">
          <ImgWrap
            width="100%"
            height="100%"
            src={coverUrl}
            backgroundColor="transparent"
            fullfill="!150x150.jpg"
          />
        </div>
        <div className="punch-board__content">
          <div className="punch-board__content__title">
            <h3 className="title">{name}</h3>
            <span className="status">{PUNCH_STATUS[proceedStatus] || '-'}</span>
          </div>
          <div className="punch-board__content__desc">
            <span className="way">
              参与方式：
              {this.renderParticipate()}
            </span>
            {joinPersonNum !== 0 && (
              <span className="join">
                参与人数：
                {joinPersonNum || 0}人
              </span>
            )}
            {this.props.showOperate && (
              <div className="operate">
                <Link className="ui-link--split" to={`/edit/${alias}`}>
                  编辑
                </Link>
                <Link className="ui-link--split" to={`/promote/${alias}`}>
                  推广配置
                </Link>
                {status === 1 && (
                  <Pop
                    trigger="click"
                    position="left-center"
                    content={[
                      '下架后所有用户均无法继续参与和查看',
                      <br key="br" />,
                      '打卡内容，确定下架吗？',
                    ]}
                    onConfirm={() => this.updatePunchStatus(2)}
                  >
                    <Link className="ui-link--split"> 下架 </Link>
                  </Pop>
                )}
                {status === 2 && [
                  <Link
                    className="ui-link--split"
                    key="down"
                    onClick={() => {
                      this.updatePunchStatus(1);
                    }}
                  >
                    上架
                  </Link>,
                ]}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
