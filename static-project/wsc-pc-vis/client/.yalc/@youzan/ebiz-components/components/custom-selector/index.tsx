import React, { PureComponent, createElement } from 'react';
import { Dialog, Notify } from 'zent';
import uuid from 'uuid';

import './styles.scss';

import renderHeader from './header';
import renderTable from './table';
import renderFooter from './footer';
import { IDialogOptions } from './types';

const { openDialog, closeDialog } = Dialog;

export * from './types';

export default function chooseDialog(options: IDialogOptions) {
  const { header, table, footer, ext, onFetch, onSubmit, afterFetch, ...dialogOptions } = options;
  const dialogId = uuid.v4();
  const { selectedRows } = table;

  class DialogComponent extends PureComponent<any, any> {
    state = {
      header: {},
      table: {
        rowKey: table.rowKey || 'id',
        totalItem: 0,
        pageSize: 20,
        current: 1,
        selectedRows: selectedRows || [] as any[],
      },
      footer: {},
      ext,
      loading: false,
      datasets: [],
    };

    wrapFetch = (data: { header: any, table: any, footer: any }, params?: any) => {
      this.setState({ loading: true });
      onFetch(data, params)
        .then(this.afterFetch)
        .catch(err => {
          Notify.error(err);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    };

    componentDidMount() {
      this.wrapFetch({
        header: this.state.header,
        table: this.state.table,
        footer: this.state.footer,
      });
    }

    public render() {
      return (
        <div className="edu-dialog">
          {renderHeader(header, this.getPropsByType('header'))}
          {renderTable(table, this.getPropsByType('table'), this.state.datasets)}
          {renderFooter(footer, this.getPropsByType('footer'))}
        </div>
      );
    }

    private getPropsByType = (type: 'header' | 'table' | 'footer') => {
      const { state: { header, table, footer, datasets, ext, loading }, fetch, select, setExt, submit, cancel } = this;
      return {
        header,
        table,
        footer,
        datasets,
        ext,
        loading,
        fetch,
        select,
        setExt,
        submit,
        cancel,
        change: (value: any) => new Promise(resolve => {
          this.setState({ [type]: Object.assign({}, this.state[type], value) }, resolve);
        }),
      };
    };

    private setExt = (ext: any, cb?: (() => void) | undefined) => {
      this.setState({
        ext: Object.assign({}, this.state.ext, ext),
      }, cb);
    }

    private fetch = (params?: any) => {
      const { header, table, footer } = this.state as any;
      return this.wrapFetch({ header, table, footer }, params);
    };

    private afterFetch = ({ datasets, totalItem, current, pageSize }: any) => {
      const _table = Object.assign({}, this.state.table);
      const rowKey = _table.rowKey;
      const newSelectedRows: any[] = [];
      const oldSelectedRows = _table.selectedRows || [];

      oldSelectedRows.forEach(row => {
        const newRow = (datasets || []).find((v: any) => v[rowKey] === row[rowKey]);
        newSelectedRows.push(newRow || row);
      });
      _table.totalItem = totalItem;
      _table.current = current;
      _table.selectedRows = newSelectedRows;
      if (pageSize) {
        _table.pageSize = pageSize;
      }
      this.setState({ datasets, table: _table }, () => {
        if (afterFetch) {
          afterFetch(this.getPropsByType('table'));
        }
      });
      return Promise.resolve();
    };

    private submit = () => {
      const { table, ext } = this.state;
      const selectedRows = (table && table.selectedRows) || [];
      return onSubmit(selectedRows, ext).then(() => {
        this.close();
      }).catch((e: any) => {
        let message = '';
        if (e && e.message) {
          message = e.message;
        } else {
          message = e;
        }
        Notify.error(message);
      });
    }

    private cancel = () => {
      closeDialog(dialogId, { triggerOnClose: true });
    };

    private close = () => {
      closeDialog(dialogId, { triggerOnClose: false });
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private select = (selectedRowKeys: any, selectedRows: any, _currentRow: number) => {
      const rowKey = (this.state.table && this.state.table.rowKey) || 'id';
      const preSelectedRows = (this.state.table && this.state.table.selectedRows) || [];

      const curSelectedRows = selectedRowKeys.map((selectedRowKey: any) => {
        return selectedRows.find((selectedRow: { [x: string]: any; }) => selectedRow[rowKey] === selectedRowKey) ||
        preSelectedRows.find(selectedRow => selectedRow[rowKey] === selectedRowKey);
      });

      const table = Object.assign({}, this.state.table);
      if (options.onSelect) {
        const { ext } = this.state;
        const res = options.onSelect(curSelectedRows, this.state.ext, valueOrFunc => {
          if (typeof valueOrFunc === 'function') {
            this.setExt(valueOrFunc(ext));
          } else {
            this.setExt(valueOrFunc);
          }
        });
        if (res instanceof Promise) {
          res.then(_selectedRows => {
            table.selectedRows = _selectedRows;
            this.setState({ table });
          });
          return;
        }
      }
      table.selectedRows = curSelectedRows;
      this.setState({ table });
    };
  }

  const children = createElement(DialogComponent);

  openDialog({ dialogId, children, ...dialogOptions });
}
