import React from 'react';
import { Icon } from 'zent';
import cx from 'classnames';

import { IOptionProps } from '../types';

function getColorfulText(target: string) {
  return `<span class="colour-words">${target}</span>`;
}

const Option: React.FC<IOptionProps> = (props) => {
  const {
    tags,
    text,
    extra,
    disabled,
    keyword,
    isChecked,
    value,
    isGroup = false,
    isKeyboardChecked,
    handleClick,
    ...resetOptionsValues
  } = props;

  const cls = React.useMemo(
    () =>
      cx({
        'option-item': true,
        'is-group': isGroup,
        'can-select': !disabled && !isGroup,
        'set-option-disabled': disabled || isGroup,
        'is-checked': tags === false && isChecked,
        'is-keyboard-checked': isKeyboardChecked || false,
      }),
    [disabled, isChecked, isGroup, isKeyboardChecked, tags]
  );

  const COLOUR_TEXT = React.useMemo<string>(() => {
    if (keyword === undefined || disabled || isGroup) {
      return text;
    }

    const colourMatcher = new RegExp(keyword, 'g');
    return text.replace(colourMatcher, getColorfulText);
  }, [keyword, disabled, isGroup, text]);

  const invokePropClickHandler = React.useCallback(() => {
    if (!disabled && handleClick) {
      handleClick({ ...resetOptionsValues, text, value });
    }
  }, [disabled, handleClick, resetOptionsValues, text, value]);

  return (
    <li title={text} className={cls} onClick={invokePropClickHandler}>
      <div className="option-item__content">
        <span
          className="option-item__main-content"
          dangerouslySetInnerHTML={{ __html: COLOUR_TEXT }}
        />
        <div className="option-item__extra">{extra}</div>
      </div>
      {tags && (isChecked ? <Icon type="check" className="icon-checked" color="#155bd4" /> : null)}
    </li>
  );
};

export default Option;
