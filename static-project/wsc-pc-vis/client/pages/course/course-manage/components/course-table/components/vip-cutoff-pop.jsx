import { Pop } from '@zent/compat';
import React from 'react';
import { Radio, Button, Notify } from 'zent';

import '../style.scss';

const { Group } = Radio;

class VipCutoffPop extends React.Component {
  static defaultProps = {
    onOk: () => {},
    onCancel: () => {},
    onShow: () => {},
    onClose: () => {},
    alias: [],
  };

  state = {
    checked: false,
  };

  confirm() {
    const { alias, onOk, pop } = this.props;
    const { checked } = this.state;
    if (alias.length === 0) {
      Notify.error('请选择一个课程商品后再进行操作');
      return 0;
    }
    onOk(checked, alias);
    pop.close();
  }

  cancel() {
    const { alias, onCancel, pop } = this.props;
    onCancel(alias);
    pop.close();
  }

  render() {
    const { checked } = this.state;
    return (
      <div className="shortcut-pop__container">
        <Group onChange={() => this.setState({ checked: !checked })} value={checked}>
          <Radio value={true}>参与</Radio>
          <Radio value={false}>不参与</Radio>
        </Group>
        <Button
          style={{ marginLeft: '15px' }}
          type="primary"
          size="small"
          onClick={this.confirm.bind(this)}
        >
          确定
        </Button>
        <Button size="small" onClick={this.cancel.bind(this)}>
          取消
        </Button>
      </div>
    );
  }
}

export default Pop.withPop(props => {
  return <VipCutoffPop {...props} />;
});
