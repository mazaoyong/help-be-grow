import React, { FC, useState, useMemo, ReactNode, useEffect, useCallback } from 'react';
import { Affix } from 'zent';

const titles: string[] = ['基本信息', '价格及售卖信息', '线下课详情', '其他设置'];

const LiftNav: FC<{ event: EventEmitter }> = props => {
  const { event } = props;
  const [titleIndex, setTitleIndex] = useState<number>(0);
  const [showTop, setShowTop] = useState<boolean>(false);

  const liftPageScroll = useCallback(
    index => {
      if (index !== titleIndex) {
        setTitleIndex(index);
      }
    },
    [titleIndex],
  );

  useEffect(() => {
    event.on('liftPageScroll', liftPageScroll);
    return () => {
      event.off('liftPageScroll', liftPageScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleIndex]);

  const titleLayouts = useMemo<ReactNode>(() => {
    return (
      <>
        {titles.map((title, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                if (index !== titleIndex) {
                  setTitleIndex(index);
                }
                if (event) {
                  event.emit('onLiftNavSelected', index);
                }
              }}
              className={`course-list-nav-subtitle ${
                index === titleIndex ? 'course-list-nav-highlight' : ''
              }`}
            >
              {title}
            </div>
          );
        })}
      </>
    );
  }, [titleIndex]);

  return (
    <>
      <Affix offsetTop={0} onPin={() => setShowTop(true)} onUnpin={() => setShowTop(false)}>
        <div className={`course-list-nav__top ${showTop ? 'course-list-nav__show' : ''}`} />
        <div className="course-list-nav">{titleLayouts}</div>
        <div className="course-list-nav__bottom" />
      </Affix>
    </>
  );
};

export default LiftNav;
