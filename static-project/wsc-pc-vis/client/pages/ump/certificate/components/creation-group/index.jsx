import { Popover } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Button } from 'zent';
import { hashHistory } from 'react-router';
import './styles.scss';

class CertificateLink extends PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className="certificate-link" onClick={this.handleRedirect}>{children}</div>
    );
  }

  handleRedirect = () => {
    hashHistory.push(this.props.link);
  }
}

export default function CreationGroup() {
  return (
    <div>
      <Popover position={Popover.Position.BottomLeft}>
        <Popover.Trigger.Hover>
          <Button type="primary" className="certificate-btn-create">新建证书</Button>
        </Popover.Trigger.Hover>
        <Popover.Content>
          <div className="certificate-link-group">
            <CertificateLink link="editor/admission">新建入学证书</CertificateLink>
            <CertificateLink link="editor/graduation">新建毕业证书</CertificateLink>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  );
}
