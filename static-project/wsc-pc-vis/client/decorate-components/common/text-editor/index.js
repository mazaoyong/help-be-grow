import React, { PureComponent, Component } from 'react';
import concat from 'lodash/concat';
import assign from 'lodash/assign';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import EditorCard from '../editor-card';
import TextNavItem from './TextNavItem';

export default class TextNavEditor extends (PureComponent || Component) {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = { data };
  }

  onChange = data => {
    this.setState({
      data,
    });
  };

  onAdd = () => {
    const { data } = this.state;

    this.setState({
      data: concat(data, [{}]),
    });
  };

  onItemChange = (value, index) => {
    const { data } = this.state;
    const target = assign({}, data[index], value);
    const newData = cloneDeep(data);

    newData.splice(index, 1, target);

    this.setState({
      data: newData,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.data, this.state.data)) {
      this.props.onChange(cloneDeep(this.state.data));
    }
  }

  render() {
    const { data } = this.state;
    const {
      canAdd = false,
      canDelete = true,
      showError,
      error,
      globalConfig,
      settings,
      linkMenuItems,
    } = this.props;

    return (
      <EditorCard
        list={data}
        canAdd={canAdd}
        onAdd={this.onAdd}
        addText="添加一个文本导航"
        onChange={this.onChange}
        canDelete={canDelete}
      >
        {data.map((item, index) => {
          return (
            <TextNavItem
              linkMenuItems={linkMenuItems}
              globalConfig={globalConfig}
              settings={settings}
              showError={showError}
              error={isArray(error) ? error[index] : undefined}
              key={index}
              index={index}
              onItemChange={this.onItemChange}
              itemData={item}
              {...item}
            />
          );
        })}
      </EditorCard>
    );
  }
}
