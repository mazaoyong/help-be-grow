import { PureComponent } from 'react';
import { IListPopupEditorProps } from './types';
import './styles.scss';
export default class ListPopupEditor extends PureComponent<IListPopupEditorProps, any> {
    private content;
    state: {
        value: any;
    };
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: {
        initialValue: any;
    }): void;
    render(): JSX.Element;
    private handleChange;
    private handleSubmit;
    private handleCancel;
    private createContent;
    private createCustomPopupEditor;
}
export * from './types';
