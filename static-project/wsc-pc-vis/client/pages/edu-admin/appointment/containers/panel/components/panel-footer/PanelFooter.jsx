import React, { Component } from 'react';
import { Checkbox } from 'zent';
import { RESERVE_STATUS_TEXT } from '../../../../constants';

const CheckboxGroup = Checkbox.Group;
// const colorMap = {
//   1: '#ff7019',
//   2: '#3dc16b',
//   4: '#3388ff',
// };

export default class PanelFooter extends Component {
  onChange = checkedList => {
    this.props.filterStatus({
      1: checkedList.indexOf(1) > -1,
      2: checkedList.indexOf(2) > -1,
      4: checkedList.indexOf(4) > -1,
    });
  };

  render() {
    const { reserveStatus } = this.props;
    const checkedList = [];
    for (let key in reserveStatus) {
      if (reserveStatus[key]) checkedList.push(+key);
    }
    return (
      <div className="panel-footer">
        <CheckboxGroup value={checkedList} onChange={this.onChange}>
          {RESERVE_STATUS_TEXT.map((item, index) => {
            if (item.status === 5) return null;
            if (item.status === 1) return null;
            return (
              <Checkbox className={`reserve_status_${item.status === 2 ? 'enabled' : 'deprecated'}`} key={index} value={item.status}>
                {/* <span
                  className="panel-footer__color-span"
                  style={{ backgroundColor: colorMap[item.status] }}
                /> */}
                {item.text}
              </Checkbox>
            );
          })}
        </CheckboxGroup>
      </div>
    );
  }
}
