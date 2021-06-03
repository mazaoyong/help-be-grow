import React from 'react';
import PropTypes from 'prop-types';
import { CHANNEL_TEXT_MAPPING, CHANNEL_PRESENT_TEXT_MAPPING } from '../../constants';

export default function Channel(props) {
  const { items, active, onChange, type } = props;
  const textMapping = type === 'present' ? CHANNEL_PRESENT_TEXT_MAPPING : CHANNEL_TEXT_MAPPING;

  if (items.length === 1) {
    return null;
  }

  return (
    <div className="rc-widgets-channel">
      {items.map(key => (
        <div
          className="rc-widgets-channel__item"
          key={key}
          style={{ backgroundColor: active === key ? '#f8f8f8' : 'white' }}
          onClick={() => {
            onChange(key);
          }}
        >
          {textMapping[key]}
        </div>
      ))}
    </div>
  );
}

Channel.propTypes = {
  type: PropTypes.oneOf(['goods', 'present']),
  items: PropTypes.array,
  active: PropTypes.string,
  onChange: PropTypes.func,
};

Channel.defaultProps = {
  type: 'goods',
};
