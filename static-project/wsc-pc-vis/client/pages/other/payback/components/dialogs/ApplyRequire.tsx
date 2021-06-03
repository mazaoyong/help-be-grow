import { Pop, Table } from '@zent/compat';
import React, { Component } from 'react';
import { Dialog, Icon, Button, Notify } from 'zent';
import CommonLink from 'components/common-link';
import Tips from '../tips';
import { queryUnitedQualStatus } from '../../api';

import './ApplyRequire.scss';

/**
 * 教育资质认证状态
 */
enum EduQualStatus {
  /** 未认证 */
  tobeDelivered = -1,
  /** 审核中 */
  tobeApproved = 2,
  /** 已通过认证 */
  approved = 4,
  /** 已驳回 */
  rejected = 5,
}

interface Props {
  data: any[];
  onClose: () => void;
}

interface States {
  visible: boolean;
  unitedQualStatus: EduQualStatus;
}

const urlMap = {
  SHOP_STAFF_CHECK: '/v4/setting/staff',
  DURATION: '',
  MAIN_CERT: `${_global.url.v4}/cert/principal/intro`,
  EDU_CERT: `${_global.url.v4}/cert/qualification/edu/intro`,
  MONTHLY_TRADE: '',
};

const eduCertUrlMap = {
  '-1': '/v4/cert/qualification/edu/intro',
  '2': '/v4/cert/qualification/edu/preview',
  '4': '/v4/cert/qualification/edu/info',
  '5': '/v4/cert/qualification/edu/info',
};

// 需要先完成主体认证才能继续认证的认证项列表
const needMainCertList = ['EDU_CERT'];

class ApplyRequire extends Component<Props, States> {
  public state = {
    visible: true,
    unitedQualStatus: -1,
  };

  mainCertStatus = this.props.data &&
    this.props.data.find(item => item.type === 'MAIN_CERT');
  isMainCertFinished = !!(this.mainCertStatus && this.mainCertStatus.result);

  componentDidMount() {
    queryUnitedQualStatus()
      .then(res => {
        this.setState({ unitedQualStatus: res });
      })
      .catch(e => {
        Notify.error(e || '查询教育资质认证信息失败，请稍后刷新重试');
      });
  }

  public handleClose = () => {
    this.setState({
      visible: false,
    });
    this.props.onClose();
  };

  renderAction = (data) => {
    const { unitedQualStatus } = this.state;
    const url = data.type === 'EDU_CERT'
      ? eduCertUrlMap[unitedQualStatus]
      : urlMap[data.type];
    if (url && !data.result) {
      if (needMainCertList.includes(data.type) && !this.isMainCertFinished) {
        return (
          <Pop trigger="hover" content="请先完成主体认证">
            <span className="disabled">去完成</span>
          </Pop>
        );
      }
      return (
        <CommonLink url={url} target="_blank">
          去完成
        </CommonLink>
      );
    }
    return '—';
  }

  public getColumns() {
    return [
      {
        title: '申请条件',
        name: 'check',
        width: '70%',
      },
      {
        title: '是否达成',
        textAlign: 'center',
        bodyRender: data => {
          if (data.result) {
            return <Icon type="check-circle" className="sucess-icon" />;
          }
          return <Icon type="close-circle" className="fail-icon" />;
        },
      },
      {
        title: '任务入口',
        bodyRender: this.renderAction,
      },
    ];
  }

  public render() {
    const { visible } = this.state;
    const { data } = this.props;

    return (
      <Dialog
        className="apply-requirement"
        title="开通快速回款"
        visible={visible}
        onClose={this.handleClose}
        style={{ width: 700 }}
      >
        <div className="apply-requirement-content">
          <Tips>很遗憾，你的店铺暂不符合申请开通条件，请持续经营一段时间后重试</Tips>
          <Table className="require-table" columns={this.getColumns() as any} datasets={data} />

          {/* footer */}
          <div className="apply-progress-footer">
            <Button type="primary" onClick={this.handleClose}>
              我知道了
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default ApplyRequire;
