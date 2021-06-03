import React, { Component } from 'react';

import SourceGroups from './components/groups';
import Sources from './components/list';
import BootPage from '../clueplugin/App';

import { createPluginWrapper } from '@ability-center/clue/plugin-framework';

import { menus } from '../common/clue-plugin-config';

class ClueSources extends Component {
  state = {
    kdtId: window._global.kdtId,
    clientHeight: 200,
    currentGroup: '',
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
    const refs = document.getElementsByClassName('clue-source');
    const clientHeight = refs && refs[0] && refs[0].clientHeight;
    if (clientHeight !== this.state.clientHeight) {
      this.setState({ clientHeight });
    }
  }

  handleSwitchGroup = group => {
    this.setState({ currentGroup: group });
  };

  handleKdtIdChange = kdtId => {
    this.setState({ kdtId });
  };

  render() {
    const { kdtId, clientHeight, currentGroup } = this.state;
    return (
      <div className="clue-source">
        <SourceGroups
          kdtId={kdtId}
          clientHeight={clientHeight}
          currentGroup={currentGroup}
          onSwitchGroup={this.handleSwitchGroup}
        />
        <Sources
          kdtId={kdtId}
          clientHeight={clientHeight}
          currentGroup={currentGroup}
          onKdtIdChange={this.handleKdtIdChange}
        />
      </div>
    );
  }
}

export default createPluginWrapper({ title: '线索管理', BootPage, menus, enabled: true })(ClueSources);
