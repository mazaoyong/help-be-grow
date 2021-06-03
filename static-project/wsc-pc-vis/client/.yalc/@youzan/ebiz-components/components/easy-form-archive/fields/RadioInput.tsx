import React, { Component, ReactNode, ChangeEvent } from 'react';
import {
  IInputProps,
  RadioGroup,
  Radio,
  Input,
  IRadioEvent,
  IInputChangeEvent,
  INumberInputProps,
  NumberInput,
} from 'zent';
import cx from 'classnames';
import './RadioInput.scss';

interface IRadioInputDataBase {
  value: number | string;
  label: ReactNode | ReactNode[];
  desc?: ReactNode;
}

interface IRadioInputData extends IRadioInputDataBase {
  type: 'number';
  inputProps?: IInputProps;
}

interface IRadioInputNumberData extends IRadioInputDataBase {
  type: 'number-input';
  inputProps?: INumberInputProps;
}

interface IRadioInputValue {
  type: string | number;
  input: string;
}

interface IProps {
  className: string;
  layout: 'row' | 'column';
  data: (IRadioInputData | IRadioInputNumberData)[];
  value: IRadioInputValue;
  disabled?: boolean;
  onChange: (data: IRadioInputValue) => void;
}

class RadioInput extends Component<IProps> {
  onRadioChange = (e: IRadioEvent<string | number>) => {
    const { value, onChange } = this.props;
    onChange({
      ...value,
      type: e.target.value as string | number,
    });
  };
  onInputChange = (e: ChangeEvent<HTMLTextAreaElement> | IInputChangeEvent) => {
    const { value, onChange } = this.props;
    onChange({
      ...value,
      input: e.target.value,
    });
  };
  onNumberInputChange = (value: any) => {
    const { value: formData, onChange } = this.props;
    onChange({
      ...formData,
      input: value,
    });
  };
  render() {
    const { layout = 'column', className = '', value, data, disabled = false } = this.props;
    return (
      <RadioGroup
        className={cx(className, 'ebiz-radio-input-field', {
          'ebiz-radio-input-field--row': layout === 'row',
        })}
        disabled={disabled}
        onChange={this.onRadioChange}
        value={value.type}
      >
        {data.map((one) => {
          const { label, inputProps, desc, type = 'number' } = one;
          let slot: ReactNode = '';
          if (Array.isArray(label)) {
            const [before = '', after = ''] = label;
            slot = (
              <>
                <span>{before}</span>
                {type === 'number-input' ? (
                  <NumberInput
                    className="ebiz-radio-input-field__input"
                    disabled={value.type !== one.value || disabled}
                    {...(inputProps as INumberInputProps)}
                    onChange={this.onNumberInputChange}
                    value={Number(value.input)}
                  />
                ) : (
                  <Input
                    className="ebiz-radio-input-field__input"
                    disabled={value.type !== one.value || disabled}
                    {...(inputProps as IInputProps)}
                    onChange={this.onInputChange}
                    value={value.input}
                  />
                )}
                <span>{after}</span>
              </>
            );
          } else {
            slot = one.label;
          }
          return (
            <>
              <Radio value={one.value}>{slot}</Radio>
              {desc ? <p className="ebiz-radio-input-field__desc">{desc}</p> : null}
            </>
          );
        })}
      </RadioGroup>
    );
  }
}

export default RadioInput;
