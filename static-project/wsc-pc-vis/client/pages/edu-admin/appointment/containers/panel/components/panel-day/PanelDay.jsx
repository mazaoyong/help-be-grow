import React, { Component } from 'react';
import { Dialog } from 'zent';
import PanelCell from '../panel-cell';
import CreateTip from './CreateTip';
import DialogReserve from '../../../../components/dialog-reserve';
import { RESERVE_DIALOG_NAME } from '../../../../constants';
import classnames from 'classnames';
import parseDate from 'zan-utils/date/parseDate';

const { openDialog, closeDialog } = Dialog;

export default class PanelDay extends Component {
  state = {
    hoverQuarter: '',
    clientX: 0,
    clientY: 0,
    isSafeTime: false,
  };

  openDialog = date => {
    openDialog({
      maskClosable: false,
      dialogId: RESERVE_DIALOG_NAME,
      title: '新建预约',
      children: (
        <DialogReserve
          appointmentTime={date}
          closeDialog={() => closeDialog(RESERVE_DIALOG_NAME)}
          updateReserveData={this.props.updateKanbanData}
        />
      ),
      onClose() {
        // 这里进行关闭回调处理
      },
    });
  };

  isSafeTime = date => {
    return date >= Date.now();
  };

  // todo 这几个鼠标事件可以优化
  onMouseOver = (e, quarter, isSafeTime) => {
    if (e.target.className.indexOf('panel-day__row') > -1) {
      this.setState({ hoverQuarter: quarter, isSafeTime });
    } else {
      this.setState({ hoverQuarter: '', isSafeTime: false });
    }
  };

  onMouseOut = (e, quarter, isSafeTime) => {
    this.setState({ hoverQuarter: '' });
  };

  onMouseMove = e => {
    this.setState({ clientX: e.clientX, clientY: e.clientY });
  };

  onClick = (e, date, isSafeTime) => {
    if (!isSafeTime) return;
    if (e.target.className.indexOf('panel-day__row') > -1) {
      this.openDialog(date);
    }
  };

  genRows() {
    const { hoverQuarter } = this.state;
    const {
      quarters,
      nowQuarter,
      panelData,
      dateValue,
      reserveStatus,
      isToday,
      updateKanbanData,
    } = this.props;
    const rows = quarters.map((quarter, index) => {
      const rowClass = classnames({
        'panel-day__row': true,
        'panel-day__active': nowQuarter === quarter && isToday,
        'panel-day__row-hover': quarter === hoverQuarter,
        'panel-day__row-disabled': !this.state.isSafeTime,
      });
      const date = +parseDate(dateValue + ' ' + quarter, 'YYYY-MM-DD HH:mm');
      const isSafeTime = this.isSafeTime(date);
      const rowData = panelData[date] || [];

      return (
        <div
          key={index}
          className={rowClass}
          onMouseOver={e => this.onMouseOver(e, quarter, isSafeTime)}
          onMouseOut={e => this.onMouseOut(e, quarter, isSafeTime)}
          onClick={e => this.onClick(e, date, isSafeTime)}
        >
          {rowData.map(reserve => {
            if (!reserveStatus[reserve.status]) return null;
            // todo 这个updateKanbanData方法传递的层次太多了需要优化
            return (
              <PanelCell key={reserve.id} reserve={reserve} updateReserveData={updateKanbanData} />
            );
          })}
        </div>
      );
    });
    return rows;
  }

  render() {
    const { hoverQuarter, isSafeTime, clientX, clientY } = this.state;
    return (
      <div className="panel-day" id="panelDay" onMouseMove={this.onMouseMove}>
        {this.genRows()}
        {!!(hoverQuarter && isSafeTime) && <CreateTip x={clientX} y={clientY} />}
      </div>
    );
  }
}
