import React, { Component } from 'react';
import PropTypes from 'prop-types';

function formatDuration(time) {
  if (!time) {
    return '--:--';
  }

  time = parseInt(time);
  let min = parseInt(time / 60);
  let sec = time % 60;
  if (min < 10) {
    min = `0${min}`;
  }
  if (sec < 10) {
    sec = `0${sec}`;
  }
  return `${min}:${sec}`;
}

const GlobalProtocol = location.protocol;
function decorateAudioSourceProtocol(src) {
  return (src || '').replace(/http(s?):/, GlobalProtocol);
}

export default class AudioPlay extends Component {
  static propTypes = {
    src: PropTypes.string, // src 为url?duration=${time} 时常的格式
  };

  state = {
    active: false,
    progress: 0,
    // 00:00作为默认展示是不合理的，--:--更能代表等待中
    totalDuration: '--:--',
    duration: '--:--',
  };

  componentDidMount() {
    this.getAudioDuration();
  }

  createAudio = () => {
    const decoratedAudioSource = decorateAudioSourceProtocol(this.props.src);
    const audioNode = new Audio(decoratedAudioSource);
    audioNode.autoplay = false;
    window.audioPlayer = audioNode;
  };

  getAudioDuration = () => {
    const _self = this;
    function audioLoadWrapper() {
      const totalDuration = formatDuration(Math.ceil(this.duration));
      _self.setState({ duration: totalDuration, totalDuration });
    }
    const audioNode = new Audio(decorateAudioSourceProtocol(this.props.src));
    audioNode.addEventListener('loadeddata', audioLoadWrapper);
  };

  handleSwitchAudio = () => {
    const _self = this;
    // 不能使用箭头函数，需要手动绑定this上下文，否则会造成React实例的混淆
    const handlePlayEnded = this.onAudioStop.bind(_self);
    const handleTimeupdate = this.onAudioTimeUpdateChange.bind(_self);
    window.disposeAudioPlayer = function() {
      // 直接摧毁audio实例
      const storeAudioPlayer = window.audioPlayer;
      if (storeAudioPlayer) {
        storeAudioPlayer.removeEventListener('ended', handlePlayEnded);
        storeAudioPlayer.removeEventListener('timeupdate', handleTimeupdate);
      }
      window.audioPlayer = null;
      _self.setState({
        active: false,
        progress: 0,
        duration: _self.state.totalDuration,
      });
    };

    // play audio
    this.createAudio();
    const currentAudio = window.audioPlayer;
    currentAudio.addEventListener('ended', handlePlayEnded);
    currentAudio.addEventListener('timeupdate', handleTimeupdate);
    currentAudio.play();
    this.setState({
      active: true,
    });
  };

  // 播放打卡语音
  onAudioPlay = () => {
    if (window.disposeAudioPlayer) {
      window.disposeAudioPlayer();
    }
    // 保证单例进行播放，每次进来都重新绑定监听事件
    this.handleSwitchAudio();
  };

  onAudioStop() {
    // 这里按照之前逻辑，其实缺少了重新设置原来的duration
    // 而且没有必要清空src
    this.setState({ active: false, progress: 0, duration: this.state.totalDuration });
  }

  onAudioPause = () => {
    const audioNode = window.audioPlayer;
    audioNode.pause();
    this.setState({
      active: false,
    });
  };

  // 进度
  onAudioTimeUpdateChange() {
    const { currentTime, duration } = window.audioPlayer;
    const progress = Math.floor((currentTime / duration) * 100);
    let min = '00';
    let sec = '00';
    if (!isNaN(currentTime) && !isNaN(duration)) {
      min = parseInt((duration - currentTime) / 60);
      sec = parseInt((duration - currentTime) % 60);
      if (min < 10) {
        min = `0${min}`;
      }
      if (sec < 10) {
        sec = `0${sec}`;
      }
    }
    this.setState({
      progress,
      duration: `${min}:${sec}`,
    });
  }

  render() {
    const { active, progress, duration } = this.state;
    return (
      <div className="pct-audio-play">
        <div className="controller">
          {active ? (
            <span className="play" onClick={this.onAudioPause} />
          ) : (
            <span className="stop" onClick={this.onAudioPlay} />
          )}
        </div>
        <div className="process">
          <div className="play-cover" style={{ width: `${progress}%` }} />
        </div>
        <div className="time">{duration}</div>
      </div>
    );
  }
}
