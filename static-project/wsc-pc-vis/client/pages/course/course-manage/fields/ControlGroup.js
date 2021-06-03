import React, { PureComponent } from 'react';
import cx from 'classnames';

export default Control => {
  return class ControlGroup extends PureComponent {
    getControlInstance = () => {
      return this.control;
    };

    isFunctional = Component => {
      return typeof Component !== 'string' && typeof Component.prototype.render !== 'function';
    };

    render() {
      const { notice = '', displayError, ...props } = this.props;

      const showError =
        displayError === undefined ? props.isDirty && props.error !== null : displayError;
      const groupClassName = cx({
        'zent-form__control-group': true,
        'zent-form__control-group--active': props.isActive,
        'has-error': showError,
      });

      const controlRef = this.isFunctional(Control)
        ? {}
        : {
          ref: instance => {
            this.control = instance;
          },
        };

      return (
        <div className={groupClassName}>
          <div className="zent-form__controls">
            <Control {...props} {...controlRef} />
            {showError && <p className="zent-form__error-desc">{props.error}</p>}
            {notice && <p className="zent-form__notice-desc">{notice}</p>}
          </div>
        </div>
      );
    }
  };
};
