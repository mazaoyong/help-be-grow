import React, { Component } from 'react';
import { Tabs, Dialog } from 'zent';
import './style.scss';

import H5 from './H5';
import Weapp from './Weapp';
import Qrcode from './Qrcode';
import Bdapp from './Bdapp';
import { chainSupportHq } from '../../chain';
import { isInStoreCondition } from 'fns/chain';

import { getExamMpQrCode, showBdappCode, getBdappCode } from '../../api';

const TabPanel = Tabs.TabPanel;
const { openDialog } = Dialog;
const id = 'promotion-qr';

class PromotionQR extends Component {
  static defaultProps = {
    data: {
      backgroundPic: '',
      coverPic: '',
      title: '',
      questionCount: 0,
      joinUserCount: 0,
      style: 1,
      qrCode: '',
      redirectUrl: '',
    },
    hideWeb: false,
    hideWeapp: false,
  };

  state = {
    activeId: this.props.hideWeb ? 2 : 1,
    // 是否有公众号二维码
    hideQrcode: true,
    qrCode: '',
    // 百度小程序
    hideBdapp: true,
    bdCode: '',
  };

  componentDidMount() {
    const props = this.props || {};
    const cardInfo = props.data || {};
    const alias = cardInfo.alias;

    if (alias) {
      getExamMpQrCode({ examId: alias })
        .then(res => {
          if (res) {
            this.setState({
              hideQrcode: false,
              qrCode: res,
            });
          }
        })
        .catch(err => {
          console.error(err);
        });

      this.showBdappCode(alias);
    }
  };

  showBdappCode = (alias) => {
    showBdappCode()
      .then(res => {
        if (res.mpId) {
          this.getBdappCode(alias);
        }
      })
      .catch(() => void 0);
  }

  getBdappCode = (alias) => {
    const path = `/packages/edu/webview/index?targetUrl=${encodeURIComponent(`https://h5.youzan.com/wscvis/exam/detail?examId=${alias}&kdtId=${window._global.kdtId || 0}`)}`;
    getBdappCode({ path, businessType: 1 })
      .then(res => {
        this.setState({
          hideBdapp: false,
          bdCode: res,
        });
      })
      .catch(() => void 0);
  }

  onTabChange = id => {
    this.setState({
      activeId: id,
    });
  };

  render() {
    const { hideWeb, hideWeapp, data, isPreview } = this.props;
    const { hideQrcode, qrCode, hideBdapp, bdCode } = this.state;
    return (
      <Tabs
        className="promotion-qr-wrapper"
        activeId={this.state.activeId}
        onChange={id => this.onTabChange(id)}
      >
        {hideWeb ? null : (
          <TabPanel tab="微商城" id={1}>
            <H5 info={data} isPreview={isPreview} />
          </TabPanel>
        )}
        {hideWeapp || (chainSupportHq && isPreview) ? null : (
          <TabPanel tab="小程序" id={2}>
            <Weapp
              info={data}
              pagepath='packages/paidcontent/exam/exam-detail/index'
              alias={data.alias}
              identity={data.identity}
              isPreview={isPreview}
            />
          </TabPanel>
        )}
        {(hideQrcode || !isInStoreCondition({ supportSingleStore: true })) ? null : (
          <TabPanel tab="公众号" id={3}>
            <Qrcode info={data} qrCode={qrCode} />
          </TabPanel>
        )}
        {(hideBdapp || !isInStoreCondition({ supportSingleStore: true })) ? null : (
          <TabPanel tab="百度小程序" id={4}>
            <Bdapp
              info={data}
              bdCode={bdCode}
              alias={data.alias}
              identity={data.identity}
              isPreview={isPreview}
            />
          </TabPanel>
        )}
      </Tabs>
    );
  }
}

export default class extends Component {
  openPromotionDialog = () => {
    const { hideWeb, hideWeapp, info, isPreview } = this.props;
    openDialog({
      style: { width: '410px' },
      dialogId: id,
      children: (
        <PromotionQR hideWeb={hideWeb} hideWeapp={hideWeapp} data={info} isPreview={isPreview} />
      ),
    });
  };
  render() {
    const { name = '推广' } = this.props;
    return (
      <span onClick={this.openPromotionDialog}>
        {this.props.children || <a href="javascript:;">{name}</a>}
      </span>
    );
  }
}
