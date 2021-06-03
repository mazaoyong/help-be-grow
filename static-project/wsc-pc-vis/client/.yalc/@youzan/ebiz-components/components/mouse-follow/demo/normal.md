---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的相关描述

```jsx
import { MouseFollow } from '@youzan/ebiz-components';
import './usage.scss';

const PopContent = ({ text }) => {
  return <div className="pop__content">{text}</div>;
};

const positions = [
  [
    {
      position: 'TopLeft',
      cursion: { top: -10 }
    },
    {
      position: 'TopCenter',
      cursion: { top: -20 }
    },
    {
      position: 'TopRight',
      cursion: { top: -10 }
    }
  ],
  [
    {
      position: 'LeftCenter',
      cursion: { left: -10 }
    },
    '',
    {
      position: 'RightCenter',
      cursion: { left: 15 }
    }
  ],
  [
    {
      position: 'BottomLeft',
      cursion: { left: -10, top: 20 }
    },
    {
      position: 'BottomCenter',
      cursion: { top: 20 }
    },
    {
      position: 'BottomRight',
      cursion: { top: 20, left: 20 }
    }
  ]
];

const BasicDemo = () => {
  return (
    <div className="mousefollow__demo">
      {positions.map((row, i) => {
        return (
          <div key={i} className="mousefollow__row">
            {row.map(p => {
              if (p === '') {
                return <div className="empty" />;
              }

              return (
                <MouseFollow
                  key={p.position}
                  popContent={<PopContent text={p.position} />}
                  position={p.position}
                  cushion={p.cursion}
                >
                  <section className="mousefollow__content">
                    <div className="noopop">{p.position}</div>
                  </section>
                </MouseFollow>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

ReactDOM.render(<BasicDemo />, mountNode);
```