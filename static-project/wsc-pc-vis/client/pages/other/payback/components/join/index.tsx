import React, { Component } from 'react';
import { Icon, Notify } from 'zent';
import { connect } from 'react-redux';
import { Actions } from 'zan-shuai';
import classnames from 'classnames';
import ApplyRequire from '../dialogs/ApplyRequire';
import Btn from './Btn';
import { applyStatusTextMap } from '../../constant';
import { checkApply, apply } from '../../api';
import { MainState } from '../../states';
import { EffectTypes } from '../../effects';
import { ICheckApplyResult } from '../../definitions';

import './index.scss';

const ServiceLink = 'https://www.youzan.com/intro/rule/detail?alias=x6yfr1vd&pageType=rules';
const BBSLink = 'https://bbs.youzan.com/forum.php?mod=viewthread&tid=678025';

interface States {
  requirement: ICheckApplyResult['list'];
  applyLoading: boolean; // 申请、查看进度按钮加载状态
  showApplyRequire: boolean; // 是否显示申请要求
}
class Join extends Component<MainState, States> {
  private $$ = Actions as EffectTypes;

  constructor(props) {
    super(props);
    this.state = {
      applyLoading: false,
      showApplyRequire: false,
      requirement: [],
    };
  }

  // 申请开通
  public handleApply = () => {
    // TODO fetch data here
    this.setState({ applyLoading: true });

    checkApply()
      .then(resp => {
        const { list = [] } = resp;
        let pass = true;
        list.map((item) => {
          pass = pass && item.result;
        });
        if (!pass) {
          this.setState({
            requirement: list,
            applyLoading: false,
            showApplyRequire: true,
          });
          return;
        }
        apply()
          .then(isPass => {
            if (isPass === true) {
              Notify.success('开通教育快速回款成功！');
              this.handleRefreshStatus();
            }
          })
          .catch(msg => {
            Notify.error(msg);
          })
          .finally(() => {
            this.setState({ applyLoading: false });
          });
      })
      .catch(msg => {
        Notify.error(msg);
        this.setState({ applyLoading: false });
      });
  };

  public handleRefreshStatus = () => {
    this.$$.fetchInfoData();
  };

  public render() {
    const { status } = this.props;
    const joined = status === 1;
    const { requirement, applyLoading, showApplyRequire } = this.state;
    const cls = classnames('status', {
      'status--joined': joined,
    });

    return (
      <div className="join-wrapper">
        <div className="join-content">
          <p className="logo">课程快速回款</p>
          <span className={cls}>
            <Icon type="check-circle-o" />
            {applyStatusTextMap[status]}
          </span>
          <p className="desc">
            有赞教育为教育行业商家实现付款成功后即可结算，快速提高商家资金周转效率的服务。
            <a href={BBSLink} target="_blank" rel="noopener noreferrer">
              了解详情
            </a>
          </p>
          {
            !joined && (
              <Btn
                status={status}
                applyLoading={applyLoading}
                ServiceLink={ServiceLink}
                handleApply={this.handleApply}
              />
            )
          }
        </div>

        {/* dialog here */}
        {showApplyRequire && (
          <ApplyRequire
            data={requirement}
            onClose={() => this.setState({ showApplyRequire: false })}
          />
        )}
      </div>
    );
  }
}

export default connect((state: MainState) => state)(Join);
