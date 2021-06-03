import React, { PureComponent } from 'react';
export default class NumberInput extends PureComponent<any, any> {
    static getDerivedStateFromProps(nextProps: any, prevState: any): {
        preValue: any;
        value: string;
    } | null;
    state: {
        value: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: () => void;
    render(): JSX.Element;
}
