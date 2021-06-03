import React, { PureComponent } from 'react';
import { Radio, Dialog, Button } from 'zent';
import { Form } from '@zent/compat';
import { TimeSpanUnit } from 'definitions/self-fetch';

const RadioGroup = Radio.Group;
const { openDialog, closeDialog } = Dialog;

export interface IProps {
  value: TimeSpanUnit;
  onChange: (v: TimeSpanUnit) => void;
}

const prefix = 'custom-time-divide';

/**
 * 时段细分字段组件
 */
class DivideUnit extends PureComponent<ZENT_FIELD_COMP<IProps>> {
  onChange = e => {
    this.props.onChange(e.target.value);
  };

  handleExample = () => {
    const id = 'self-fetch__example__';
    const example = (
      <div className="example">
        <p>例如：自提时间为14:00～22:00</p>
        <div className="clearfix wrap">
          <div className="image-area">
            <p>按半小时细分</p>
            <img
              width="230"
              height="498"
              src="https://img.yzcdn.cn/public_files/2019/06/18/c3a8e4ee77d349ac594d1d136eac7f1e.jpg"
            />
          </div>
          <div className="image-area">
            <p>按一小时细分</p>
            <img
              width="230"
              height="498"
              src="https://b.yzcdn.cn/public_files/2019/06/18/0b193ab31151564dd1bca55b7bd2dd29.jpg"
            />
          </div>
        </div>
      </div>
    );
    openDialog({
      dialogId: id,
      title: '买家自提时间选择示例',
      children: example,
      className: 'self-fetch-time-divide-example',
      footer: (
        <Button
          type="primary"
          onClick={() => {
            closeDialog(id, { triggerOnClose: true });
          }}
        >
          我知道了
        </Button>
      ),
    });
  };

  render() {
    const { value } = this.props;

    return (
      <div className={prefix}>
        <RadioGroup className={`${prefix}__switch`} value={value} onChange={this.onChange}>
          <Radio value="day">天</Radio>
          <Radio value="meal">上午下午晚上（12:00和18:00为分界点）</Radio>
          <Radio value="hour">小时</Radio>
          <Radio value="halfhour">半小时</Radio>
        </RadioGroup>
        <p className="zent-form__help-desc">
          买家可选的自提时间会根据时段进行细分。
          <a style={{ cursor: 'pointer' }} onClick={this.handleExample}>
            查看示例
          </a>
        </p>
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(DivideUnit);
