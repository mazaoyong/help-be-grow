import React from 'react';
import cx from 'classnames';

import './styles.scss';

interface IWatermarkSetting {
  content: string;
  animation?: 'left2right' | 'right2left' | 'top2bottom' | 'bottom2top';
  duration?: number; // 动画持续时间
  contentStyle?: React.CSSProperties;
  repeatTime?: number; // 0 表示无限循环
}
interface IPreviewVideoWithWatermarkProps {
  videoSource: string;
  previewId?: string;
  noWatermark?: boolean;
  watermarkSetting?: IWatermarkSetting;
}

const INIT_WATERMARK_SETTINGS = {
  content: '',
  animation: 'right2left',
  duration: 6,
  repeatTime: 0,
  contentStyle: {},
};
// TODO: 后续考虑m3u8的支持，因为目前只有mp4类型的视频
const PreviewVideoWithWatermark: React.FC<IPreviewVideoWithWatermarkProps> = (props) => {
  const VideoRef = React.useRef<HTMLVideoElement | null>(null);
  const { watermarkSetting, noWatermark, videoSource, previewId = 'watermarkAni' } = props;
  const { content, animation, duration, repeatTime, contentStyle } = React.useMemo(
    () => Object.assign({}, INIT_WATERMARK_SETTINGS, watermarkSetting),
    [watermarkSetting],
  );

  const [fontSizeNumber, offset] = React.useMemo(() => {
    const fontSizeMatch = String(contentStyle.fontSize).match(/(\d+)/);
    const fontSizeNumber = Number(fontSizeMatch && fontSizeMatch[1]) || 20;
    return [fontSizeNumber, fontSizeNumber * content.length];
  }, [content.length, contentStyle.fontSize]);

  const watermarkOffset = React.useMemo(() => {
    if (noWatermark) return {};
    return (
      ({
        left2right: {
          left: 0,
          transform: `translateX(${-offset + 'px'})`,
        },
        right2left: {
          right: 0,
          transform: `translateX(${offset + 'px'})`,
        },
        top2bottom: {
          top: 0,
          transform: `translateY(${-fontSizeNumber + 'px'})`,
        },
        bottom2top: {
          bottom: 0,
          transform: `translateY(${fontSizeNumber + 'px'})`,
        },
      } as Record<Required<IWatermarkSetting>['animation'], React.CSSProperties>)[animation] || {}
    );
  }, [animation, fontSizeNumber, noWatermark, offset]);

  const watermarkStyles = React.useMemo(
    (): React.CSSProperties =>
      Object.assign({}, contentStyle, watermarkOffset, {
        animationName: animation,
        animationDuration: duration + 's',
        animationIterationCount: repeatTime || 'infinite',
      }),
    [animation, contentStyle, duration, repeatTime, watermarkOffset],
  );

  React.useLayoutEffect(() => {
    if (!noWatermark && Object.keys(watermarkOffset).length) {
      const { transform } = watermarkOffset;
      const translatePrefixMatcher = animation.match(/^(\w+)2/);
      const translatePrefixSign = translatePrefixMatcher && translatePrefixMatcher[1];
      const translatePrefix =
        translatePrefixSign === 'left' || translatePrefixSign === 'right'
          ? 'translateX'
          : 'translateY';
      const animationEndOffset = translatePrefix === 'translateX' ? 692 : fontSizeNumber;
      const animationTemplate = `
      @keyframes ${animation} {
        from {
          transform: ${transform}
        }
        to {
          transform: ${translatePrefix}(${
  translatePrefixSign === 'left' || translatePrefixSign === 'top'
    ? animationEndOffset
    : -animationEndOffset
}px)
        }
      }
    `;
      const overdueStyleNode = document.head.querySelector(`style[data-uid="${previewId}"]`);
      if (overdueStyleNode) document.head.removeChild(overdueStyleNode);
      const animationStyle = document.createElement('style');
      animationStyle.dataset.uid = previewId;
      animationStyle.type = 'text/css';
      animationStyle.appendChild(document.createTextNode(animationTemplate));
      document.head.append(animationStyle);
    }
  }, [animation, fontSizeNumber, noWatermark, offset, previewId, watermarkOffset]);

  return (
    <div className="video-preview__container">
      <video
        controls
        ref={VideoRef}
        src={videoSource || 'https://img.yzcdn.cn/video/youzaneduintroductionvideo_smart.mp4'}
      />
      {!noWatermark && (
        <div className={cx('watermark', animation)} style={watermarkStyles}>
          <div>{content}</div>
        </div>
      )}
    </div>
  );
};

export default PreviewVideoWithWatermark;
