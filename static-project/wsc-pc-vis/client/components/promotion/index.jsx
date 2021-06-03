import React, { Component, cloneElement } from 'react';
import { Tabs, Dialog } from 'zent';
import './style.scss';

import Web from './Web';
import Weapp from './Weapp';
import Bdapp from './bdapp';

const TabPanel = Tabs.TabPanel;

export default class Promotion extends Component {
  static defaultProps = {
    data: {
      url: '',
      qrcode: '',
      pagePath: '',
      name: 'qrcode',
      getQrcode: null,
      webviewPath: '',
      hideBdapp: true, // 注：defaultProps在此处并不生效，传入data对象时它的值是undefined，在解构data时需重新提供默认值为true
    },
    hideWeb: false,
    hideWeapp: false,
  };

  state = {
    activeId: 0,
    qrcode: this.props.data.qrcode,
  };

  handleTabChange = id =>
    this.setState({
      activeId: id,
    });

  handleVisibleChange = visible => () => {
    const { getQrcode } = this.props.data;
    const setVisState = () => this.setState({ activeId: visible ? (this.props.hideWeb ? 2 : 1) : 0 }, () => {
      if (this.props.afterVisibleChange) {
        this.props.afterVisibleChange(visible);
      }
    });
    if (visible && getQrcode) {
      getQrcode().then(qrcode => {
        this.setState({ qrcode }, _ => setVisState());
      }, _ => setVisState());
    } else {
      setVisState();
    }
  };

  renderTrigger(children) {
    const customTrigger =
      children && cloneElement(children, { onClick: this.handleVisibleChange(true) });
    return (
      customTrigger || (
        <span className="ui-link--split" onClick={this.handleVisibleChange(true)}>
          推广
        </span>
      )
    );
  }

  render() {
    const { children, hideWeb, hideWeapp, data } = this.props;
    const { url, pagepath, alias, name, webviewPath, hideBdapp = true } = data;
    if (hideWeb && hideWeapp) {
      return null;
    }
    return (
      <>
        {this.renderTrigger(children)}
        <Dialog
          className="new-promotion"
          style={{ width: hideBdapp || hideWeapp ? '320px' : '410px', height: '540px', 'min-width': 'initial' }}
          visible={!!this.state.activeId}
          onClose={this.handleVisibleChange(false)}
          title="推广课程"
        >
          <Tabs
            align="center"
            activeId={this.state.activeId}
            onChange={this.handleTabChange}
          >
            {hideWeb ? null : (
              <TabPanel tab="h5" id={1}>
                <Web url={url} qrcode={this.state.qrcode} name={name} />
              </TabPanel>
            )}
            {hideWeapp ? null : (
              <TabPanel tab="小程序" id={2}>
                <Weapp pagepath={pagepath} alias={alias} name={name} />
              </TabPanel>
            )}
            {hideBdapp ? null : (
              <TabPanel tab="百度小程序" id={3}>
                <Bdapp pagepath={pagepath} alias={alias} name={name} webviewpath={webviewPath} />
              </TabPanel>
            )}
          </Tabs>
        </Dialog>
      </>
    );
  }
}
