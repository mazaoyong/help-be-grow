import * as React from 'react';

import { formatDate } from '../utils';
import DatePanelBody from './DatePanelBody';
import MonthPanel from './MonthPanel';
import PanelHeader from '../common/PanelHeader';

export default class DatePanel extends React.PureComponent<any> {
  static defaultProps = {
    showPrev: true,
    showNext: true,
  };

  state = {
    showMonth: false,
  };

  showMonth = () => {
    this.setState({
      showMonth: true,
    });
  };

  /*
   * 在 monthPicker 的时候选择年不隐藏 monthPanel.
   */
  onSelectMonth = (val, hide) => {
    this.props.onChange(val);
    this.setState({
      showMonth: hide || false,
    });
  };

  render() {
    const {
      props: {
        actived,
        mark,
        disabledDate,
        i18n,
        onHover,
        onNext,
        onPrev,
        onSelect,
        range,
        selected,
        showNext,
        showPrev,
        disableSelectedHighlight,
      },
      state: { showMonth },
    } = this;

    let monthPanel;
    if (showMonth) {
      monthPanel = (
        <MonthPanel
          actived={actived}
          selected={selected}
          onChange={this.onSelectMonth}
          onSelect={this.onSelectMonth}
          i18n={i18n}
        />
      );
    }

    return (
      <div className="date-panel">
        <PanelHeader
          title={formatDate(actived, 'YYYY年MM月')}
          onClickTitle={this.showMonth}
          prev={onPrev}
          next={onNext}
          showPrev={showPrev}
          showNext={showNext}
        />
        <DatePanelBody
          disableSelectedHighlight={disableSelectedHighlight}
          actived={actived}
          range={range}
          selected={selected}
          mark={mark}
          disabledDate={disabledDate}
          onSelect={onSelect}
          onHover={onHover}
          i18n={i18n}
        />
        {showMonth && monthPanel}
      </div>
    );
  }
}
