import React, { PureComponent, ReactElement, cloneElement, ReactNode } from 'react';
import { Icon, Pop } from 'zent';
// @ts-ignore
import { checkAccess } from '@youzan/sam-components';

import { IListPopupEditorProps, ListPopupEditorType, IListPopupEditorContent } from './types';
import { StrPopupEditor, NumPopupEditor, NullPopupEditor } from './content';
import './styles.scss';

const MyIcon = Icon as any;

export default class ListPopupEditor extends PureComponent<IListPopupEditorProps, any> {
  private content: any;
  state = {
    value: this.props.initialValue,
  };

  componentWillMount() {
    const { type, popupEl } = this.props;
    this.content = this.createContent(type, popupEl) as any;
  }

  componentWillReceiveProps(nextProps: { initialValue: any; }) {
    if (nextProps.initialValue !== this.props.initialValue) {
      this.setState({ value: nextProps.initialValue });
    }
  }

  public render() {
    const { content: Content } = this;
    const { children, validate, samName, width, ...restProps } = this.props;
    if (samName && !checkAccess(samName)) {
      return children;
    }
    let modifiedChildren: ReactNode = null;
    if (typeof children === 'function' || typeof children === 'object') {
      modifiedChildren = cloneElement(children, restProps);
    } else {
      modifiedChildren = children;
    }
    return (
      <>
        {modifiedChildren}
        <Pop
          trigger="click"
          content={
            <Content
              value={this.state.value}
              validate={validate}
              width={width}
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              onCancel={this.handleCancel}
            />
          }
          className="list-popup-editor-pop">
          <a className="list-popup-editor_trigger">
            <MyIcon type="edit-o" />
          </a>
        </Pop>
      </>
    );
  }

  private handleChange = (value: any) => {
    this.setState({ value });
  }

  private handleSubmit = (close: () => void) => () => {
    const res = this.props.onSubmit(this.state.value);
    if (res) {
      res.then(value => {
        this.setState({ value });
      });
    }
    close();
  }

  private handleCancel = (close: () => void) => () => {
    this.setState({ value: this.props.initialValue });
    close();
  }

  private createContent(type: ListPopupEditorType, comp?: ReactElement) {
    let content: IListPopupEditorContent;
    switch (type) {
      case ListPopupEditorType.STR:
        content = StrPopupEditor;
        break;
      case ListPopupEditorType.NUM:
        content = NumPopupEditor;
        break;
      case ListPopupEditorType.CUSTOM:
        content = comp ? this.createCustomPopupEditor(comp) : NullPopupEditor;
        break;
      default:
        content = NullPopupEditor;
        break;
    }
    // The interface of Pop.withPop is wrong
    return Pop.withPop(content as any);
  }

  private createCustomPopupEditor = (Comp: ReactElement) => ({ pop, value, onChange, onSubmit, onCancel }: any) => {
    return cloneElement(Comp, { value, pop, onChange, onSubmit, onCancel });
  }
}

export * from './types';