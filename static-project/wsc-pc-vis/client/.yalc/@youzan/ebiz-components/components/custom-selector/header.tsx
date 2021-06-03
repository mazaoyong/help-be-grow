import React, { ReactNode, cloneElement, ReactElement } from 'react';
import { IHeaderOptions, IDialogProps, IHeaderChild } from './types';
import { Button, Input, Select, Checkbox } from 'zent';

export default function renderHeader(headerOptions: IHeaderOptions, props: IDialogProps): ReactNode {
  const { children, component } = headerOptions;
  let _custom: ReactNode = null;
  let _menu: ReactNode = null;
  if (component) {
    _custom = cloneElement(component, props);
  }
  if (children) {
    const left: ReactNode[] = [];
    const right: ReactNode[] = [];
    children.forEach((child, index) => {
      let el = transferHeaderChild(child, props, index);
      if (child.textAlign === 'right') {
        right.push(el);
      } else {
        left.push(el);
      }
    });
    _menu = (
      <div className="edu-dialog-header">
        <div className="edu-dialog-header-section">{left}</div>
        <div className="edu-dialog-header-section">{right}</div>
      </div>
    );
  }
  return (
    <>
      {_custom}
      {_menu}
    </>
  );
}

function transferHeaderChild(child: IHeaderChild, props: IDialogProps, index: number): ReactNode {
  child.key = index;

  if (child.type === 'Custom') {
    const _component = child.component as ReactElement<IDialogProps>;
    return React.cloneElement(_component, props);
  }

  switch (child.type) {
    case 'Button':
      return getHeaderButton(/* child, props */);

    case 'Checkbox':
      return getHeaderCheckbox(child, props);

    case 'Search':
      return getHeaderSearch(child, props);

    case 'Select':
      return getHeaderSelect(child, props);
  }
  return null;
}

function getHeaderButton(/* child: IHeaderChild, props: IDialogProps */) {
  return <Button>尚未实现</Button>;
}

function getHeaderCheckbox(child: IHeaderChild, props: IDialogProps) {
  const { name, text, ...restProps } = child;
  const { header, change } = props;
  return (
    <Checkbox checked={header[name]} onChange={e => change({ [name]: e.target.checked })} {...restProps}>
      {text}
    </Checkbox>
  );
}

function getHeaderSearch(child: IHeaderChild, props: IDialogProps) {
  const { name, ...restProps } = child;
  const { header, change, fetch } = props;
  return (
    <Input
      icon="search"
      value={header[name]}
      onChange={(e: { target: { value: any; }; }) => change({ [name]: e.target.value })}
      onPressEnter={() => fetch({ reset: true })}
      {...restProps as any}
    />
  );
}

function getHeaderSelect(child: IHeaderChild, props: IDialogProps) {
  const { name, data, ...restProps } = child;
  const { header, change, fetch } = props;
  if (!data) {
    throw new Error('Data lacked in the props of Select');
  }
  return (
    <Select
      data={data}
      value={header[name]}
      onChange={(_d, selected) => {
        change({ [name]: selected.value }).then(() => {
          fetch({ reset: true });
        });
      }}
      {...restProps}
    />
  );
}
