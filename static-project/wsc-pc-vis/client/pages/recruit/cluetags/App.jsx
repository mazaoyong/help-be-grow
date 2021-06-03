import React, { Component } from 'react';
import { isEduShop } from '@youzan/utils-shop';

import { createPluginWrapper } from '@ability-center/clue/plugin-framework';
import BootPage from '../clueplugin/App';

import { menus } from '../common/clue-plugin-config';
import TagGroups from './components/groups';
import TagList from './components/list';

class ClueTags extends Component {
  state = {
    currentGroup: '',
    clientHeight: 200,
  };

  // control styles
  componentDidMount() {
    this.resetStyle();
    window.addEventListener('resize', this.resetStyle);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resetStyle);
  }

  resetStyle = () => {
    const refs = document.getElementsByClassName('clue-tags');
    const clientHeight = refs && refs[0] && refs[0].clientHeight;
    if (clientHeight !== this.state.clientHeight) {
      this.setState({ clientHeight });
    }
  };

  // 切换标签分组
  handleSwitchGroup = group => this.setState({ currentGroup: group });

  render() {
    const { clientHeight, currentGroup } = this.state;
    return (
      <div className="clue-tags">
        <TagGroups clientHeight={clientHeight} currentGroup={currentGroup} onSwitchGroup={this.handleSwitchGroup} />
        <TagList clientHeight={clientHeight} currentGroup={currentGroup} />
      </div>
    );
  }
}

export default createPluginWrapper({ title: '线索管理', BootPage, menus, enabled: !isEduShop })(ClueTags);
