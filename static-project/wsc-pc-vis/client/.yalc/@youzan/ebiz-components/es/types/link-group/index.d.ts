import { PureComponent } from 'react';
import './styles.scss';
export default class LinkGroup extends PureComponent<{
    data: any;
}> {
    render(): JSX.Element;
    renderChildren: (data: any[]) => any[];
}
