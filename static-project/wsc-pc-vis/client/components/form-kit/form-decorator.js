import React from 'react';
import Validation from './validation';

const getValueFromEvent = e => {
  if (e && e.target) {
    return e.target.type.toLowerCase() === 'checkbox' ? e.target.checked : e.target.value;
  }
  return e;
};

export default (formOnChange, formState, validation) => {
  if (!formState) {
    formState = {};
    console.warn('form need state props');
  }

  if (validation) {
    validation.bind(formState);
  }

  return (elem, options = { blurValid: true }) => {
    const state = options.state || formState;
    const onChange = options.onChange || formOnChange || (() => {});
    const name = elem.props.name;
    const value = options.value || state[name];
    const valueProp = options.valueProp || 'value';
    let handledElement;

    if (!name) {
      console.warn(`${elem.type.name} -- name shouldn't be empty`);
    }
    if (!{}.hasOwnProperty.call(state, name) && value === undefined) {
      console.warn(`state doesn\`t has '${name}' key`);
    }

    const targetProps = {
      onChange(e) {
        const inputValue = getValueFromEvent(e);

        if (validation) {
          validation.markChanged(name);
          validation.run(name, inputValue, state);
        }
        onChange(name, inputValue, e);
        if (elem.props.onChange) {
          return elem.props.onChange(e);
        }
      },
      key: name,
      ref: ins => {
        if (ins) {
          if (ins.validation instanceof Validation) {
            validation && validation.merge(name, ins.validation);
          }
        } else {
          validation && validation.remove(name);
        }
        if (handledElement.props.instance) {
          handledElement.props.instance(ins);
        }
      },
      [valueProp]: value,
    };

    if (options.blurValid && validation) {
      Object.assign(targetProps, {
        onFocus() {
          validation.markChanged(name);
        },
        onBlur(e) {
          validation.run(name, getValueFromEvent(e), state);
          validation.host.forceUpdate();
        },
      });
    }

    handledElement = React.cloneElement(elem, targetProps);

    if (options.wrapper === false) {
      return handledElement;
    }

    if (validation) {
      const validationResult = validation.getResult()[name];
      if (validationResult !== undefined) {
        if (typeof validationResult === 'string') {
          return (
            <div className="widget-form__group-row widget-form__group--error">
              {handledElement}
              <p className="widget-form__error-desc" key={`error-${name}`}>
                {validationResult}
              </p>
            </div>
          );
        } else if (validationResult !== true) {
          console.warn(`${name} of validation should return string value`);
        }
      }
    }

    return <div className="widget-form__group-row">{handledElement}</div>;
  };
};
