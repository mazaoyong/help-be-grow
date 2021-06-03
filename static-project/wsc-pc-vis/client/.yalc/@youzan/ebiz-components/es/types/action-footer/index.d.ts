import { Component } from 'react';
import PropTypes from 'prop-types';
import { IActionFooterProps } from './types';
import './style.scss';
declare class ActionFooter extends Component<IActionFooterProps> {
    static propTypes: {
        mainText: PropTypes.Requireable<string>;
        mainSamName: PropTypes.Requireable<string>;
        subText: PropTypes.Requireable<string>;
        mainDisabled: PropTypes.Requireable<boolean>;
        subDisabled: PropTypes.Requireable<boolean>;
        onMainClick: PropTypes.Requireable<(...args: any[]) => any>;
        onSubClick: PropTypes.Requireable<(...args: any[]) => any>;
        className: PropTypes.Requireable<string>;
        mainOptions: PropTypes.Requireable<object>;
        subOptions: PropTypes.Requireable<object>;
    };
    static defaultProps: {
        mainText: string;
        subText: string;
        mainDisabled: boolean;
        subDisabled: boolean;
        onMainClick: () => void;
        onSubClick: () => void;
        className: string;
        mainOptions: {};
        subOptions: {};
    };
    componentDidMount(): void;
    render(): JSX.Element;
}
export default ActionFooter;
