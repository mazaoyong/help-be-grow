import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import { ShowcaseAudio } from '@youzan/captain-showcase';
import fullfillImage from 'zan-utils/lib/fullfillImage';

import unify from 'components/vue-preview/unify';
import VuePreview from 'components/vue-preview';

const VueAudio = unify(
  ShowcaseAudio,
  () => ({}),
  (value, globalConfig) => {
    const { style, title, avatar, bubble } = value;

    return {
      title,
      bubble,
      audioStyle: style,
      logo: fullfillImage(
        avatar || (globalConfig.mp_data && globalConfig.mp_data.logo),
        '!80x80.jpg',
        globalConfig.url
      ),
    };
  }
);

export default class AudioPreview extends (PureComponent || Component) {
  static propTypes = {
    value: PropTypes.object,

    // 用来和 Design 交互
    design: PropTypes.object,
  };

  render() {
    const { value, globalConfig } = this.props;

    return (
      <VuePreview
        vueComponent={VueAudio}
        value={value}
        globalConfig={globalConfig}
        className="rc-design-component-audio-preview"
      />
    );
  }
}
