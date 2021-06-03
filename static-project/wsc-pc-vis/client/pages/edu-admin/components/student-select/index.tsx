import React, { PureComponent, createElement } from 'react';
import { Dialog, Notify } from 'zent';
import uuid from 'uuid';

import './styles.scss';

import renderHeader from './header';
import renderTable from './table';
import renderFooter from './footer';
import { IDialogOptions } from './types';

const { openDialog, closeDialog } = Dialog;

export default function openCustomSelector(options: IDialogOptions) {
  const { header, table, footer, onFetch, onSubmit, ...dialogOptions } = options;
  const dialogId = uuid.v4();
  const { selectedRows, columns } = table;

  class DialogComponent extends PureComponent<any, any> {
    state = {
      header: {},
      table: {
        totalItem: 0,
        pageSize: 20,
        current: 1,
        selectedRows: selectedRows || [] as any[],
      },
      footer: {},
      loading: false,
      datasets: [],
    };

    wrapFetch = (params: { header: any, table: any, footer: any }) => {
      this.setState({ loading: true });
      onFetch(params)
        .then(this.afterFetch)
        .finally(() => {
          this.setState({ loading: false });
        });
    };

    renderColumns = () => {
      let _columns: any[] = [];
      if (columns && Array.isArray(columns)) {
        _columns = columns.map(({ bodyRender, ...restOpts }) => {
          if (bodyRender) {
            return {
              bodyRender: (data: any) => bodyRender(data, () => this.fetch()),
              ...restOpts,
            };
          }
        });
        table.columns = _columns;
      }
    }

    componentDidMount() {
      this.renderColumns();
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
      const { state: { header, table, footer, loading }, fetch, select, submit, cancel } = this;
      return {
        header,
        table,
        footer,
        loading,
        fetch,
        select,
        submit,
        cancel,
        change: (value: any) => new Promise<void>(resolve => {
          this.setState({ [type]: Object.assign({}, this.state[type], value) }, () => resolve());
        }),
      };
    };

    private afterFetch = ({ datasets, totalItem, current, pageSize }: any) => {
      const _table = Object.assign({}, this.state.table);
      _table.totalItem = totalItem;
      _table.current = current;
      if (pageSize) {
        _table.pageSize = pageSize;
      }
      this.setState({ datasets, table: _table });
      return Promise.resolve();
    };

    private fetch = () => {
      const { header, table, footer } = this.state as any;
      return this.wrapFetch({ header, table, footer });
    };

    private submit = () => {
      const { table } = this.state;
      const selectedRows = (table && table.selectedRows) || [];
      return onSubmit(selectedRows).then(() => {
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
      this.close();
    };

    private close = () => {
      closeDialog(dialogId, { triggerOnClose: true });
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private select = (_: any, selectedRows: any, _currentRow: number) => {
      const table = Object.assign({}, this.state.table);
      if (options.onSelect) {
        const res = options.onSelect(selectedRows);
        if (res instanceof Promise) {
          res.then(_selectedRows => {
            table.selectedRows = _selectedRows;
            this.setState({ table });
          });
          return;
        }
      }
      table.selectedRows = selectedRows;
      this.setState({ table });
    };
  }

  const children = createElement(DialogComponent);

  openDialog({ dialogId, children, ...dialogOptions });
}
