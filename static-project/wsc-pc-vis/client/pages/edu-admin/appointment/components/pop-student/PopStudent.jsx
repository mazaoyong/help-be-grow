import React, { Component } from 'react';
import classNames from 'classnames';

export default class PopNoTrigger extends Component {
  handleSelectChange = e => {
    this.selectChange('global');
  };

  selectChange = data => {
    this.props.onSelectChange(data);
  };

  selectItme = (alias, e) => {
    e.nativeEvent.stopPropagation();
    this.selectChange(alias);
  };

  componentDidMount() {
    window.addEventListener('click', this.handleSelectChange);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleSelectChange);
  }

  render() {
    const { popData = [], action, value } = this.props;
    const popClass = classNames({
      'pop-no-trigger': true,
      // 'pop-hidden': !(popData.length || action),
    });
    return (
      <div className={popClass}>
        <div className="pop-no-trigger__content">
          {popData.map((item, index) => {
            const itemClass = classNames({
              'pop-no-trigger__item': true,
              'pop-no-trigger__item-active': item.alias === value,
            });
            if (!item.name) return null;
            return (
              <div key={index} className={itemClass} onClick={e => this.selectItme(item.alias, e)}>
                {item.name}
              </div>
            );
          })}
        </div>
        {action && (
          <div className="pop-no-trigger__action" onClick={action.fn}>
            {action.text}
          </div>
        )}
      </div>
    );
  }
}
