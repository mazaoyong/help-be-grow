import React, { PureComponent } from 'react';
import { Radio, Dialog, Button } from 'zent';
import { Form } from '@zent/compat';
import { IDivideUnit } from 'definitions/local-delivery';

const RadioGroup = Radio.Group;
const { openDialog, closeDialog } = Dialog;

export interface IProps {
  value: IDivideUnit;
  onChange: (v: IDivideUnit) => void;
}

const prefix = 'custom-divide-unit';

/**
 * 时段细分字段组件
 */
class DivideUnit extends PureComponent<ZENT_FIELD_COMP<IProps>> {
  handleChange = evt => {
    this.props.onChange(evt.target.value);
  };

  handleExample = () => {
    const id = '__example__';
    const example = (
      <div className="example">
        <p>例如：配送时间段为10:00~18:00</p>
        <div className="clearfix wrap">
          <div className="image-area">
            <p>按半小时细分</p>
            <img
              width="230"
              height="498"
              src="https://img.yzcdn.cn/public_files/2019/06/18/6191c6019e6c27040ca378413e175a03.jpg"
            />
          </div>
          <div className="image-area">
            <p>按一小时细分</p>
            <img
              width="230"
              height="498"
              src="https://b.yzcdn.cn/public_files/2019/06/18/04acc08c66e6974cf4bd15c8d738d0a9.jpg"
            />
          </div>
        </div>
      </div>
    );
    openDialog({
      dialogId: id,
      title: '买家送达时间选择示例',
      children: example,
      className: 'local-delivery-time-divide-example',
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
        <RadioGroup className={`${prefix}__switch`} value={value} onChange={this.handleChange}>
          <Radio value="day">天</Radio>
          <Radio value="meal">上午下午晚上（12:00和18:00为分界点）</Radio>
          <Radio value="hour">小时</Radio>
          <Radio value="halfhour">半小时</Radio>
        </RadioGroup>
        <p className="help-desc">
          买家可选的送达时间会根据时段进行细分。
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
