import React from 'react';
import { Dialog, Tabs, Input, CopyButton } from 'zent';

import '../style.scss';

const { TabPanel } = Tabs;

class PromoteModal extends React.Component {
  static defaultProps = {
    visible: false,
    name: '',
    wscHref: '',
    webviewpath: '',
    onClose: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      activeId: 'wsc',
      wscHref: '',
      bdappCode: '',
    };
  }

  changeTabs = tab => this.setState({ activeId: tab });

  copyBtn = href => <CopyButton text={href} onCopySuccess="复制成功" onCopyError="复制失败" />;

  render() {
    // TODO:这一期的小程序码暂时不上
    // const { visible, name, onClose, xcxHref, wscHref, wscQrcode } = this.props;
    const { visible, name, onClose, wscQrcode, wscHref, hideBdapp, bdappCode, webviewpath } = this.props;
    const { activeId } = this.state;
    const wscQrCodeStyle = {
      backgroundImage: `url(${wscQrcode})`,
      backgroundSize: '100% 100%',
    };
    // TODO:这一期的小程序码暂时不上
    // const xcxQrCodeStyle = {
    //   backgroundImage: `url(${xcxQrcode})`,
    //   backgroundSize: '100% 100%',
    // };

    let downloadHref = '';
    if (bdappCode) {
      downloadHref = `data:image/png;base64,${bdappCode}`;
    }
    const bdQrCodeStyle = {
      backgroundImage: `url(${downloadHref})`,
      backgroundSize: '100% 100%',
    };

    return (
      <Dialog
        title="推广课程"
        visible={visible}
        onClose={onClose}
        maskClosable={false}
        className="promote-modal"
        style={{ minWidth: '320px', borderRadius: '2px' }}
      >
        <Tabs onChange={this.changeTabs} activeId={activeId}>
          <TabPanel tab="h5" id="wsc">
            <Input value={wscHref} disabled addonAfter={this.copyBtn(wscHref || '')} />
            <div className="qr-code">
              <div style={wscQrcode && wscQrCodeStyle} className="qr-code-img" />
            </div>
            <div className="down-link">
              <a href={wscQrcode} download={name}>
                下载二维码
              </a>
              <a href={wscHref} target="_blank" rel="noopener noreferrer">
                在电脑上查看
              </a>
            </div>
          </TabPanel>
          {/* TODO:小程序这期不显示 */}
          {/* <TabPanel tab="小程序码" id="xcx">
            <Input value={xcxHref} disabled addonAfter={this.copyBtn(xcxHref)} />
            <div className="qr-code">
              <div style={xcxQrcode && xcxQrCodeStyle} className="qr-code-img" />
            </div>
            <div className="down-link">
              <a href={xcxQrcode} download={name}>
                下载小程序码
              </a>
            </div>
          </TabPanel> */}
          {
            !hideBdapp ? (
              <TabPanel tab="百度小程序" id="bd">
                <Input value={webviewpath} disabled addonAfter={this.copyBtn(webviewpath)} />
                <div className="qr-code">
                  <div style={bdQrCodeStyle} className="qr-code-img" />
                </div>
                <div className="down-link">
                  <a href={downloadHref} download={name}>
                    下载小程序码
                  </a>
                </div>
              </TabPanel>
            ) : null
          }
        </Tabs>
      </Dialog>
    );
  }
}

export default PromoteModal;
