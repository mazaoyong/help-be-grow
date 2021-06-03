import { Pop } from '@zent/compat';
import React, { useState, useEffect } from 'react';
import { Button } from 'zent';
import YZLocalStorage from 'zan-utils/local_storage';

const MaskTip = Pop.withPop(function({ onHide }) {
  return (
    <div className="course-group-field__mask__tip">
      <div>
        店铺内显示或隐藏功能，放到了课程分组里
        <br />
        如果希望课程只能通过链接访问，可以放到“店铺中隐藏”的分组
      </div>
      <Button type="primary" size="small" onClick={onHide}>
        我知道了
      </Button>
    </div>
  );
});

const focusHeight = 53;
const focusOffsetLeft = 100;
const focusOffetTop = 10;

export default function CourseGroupFieldMask({ fieldRef }) {
  const [showTip, setShowTip] = useState(false);
  const [style, setStyle] = useState(null);
  const [diffHeight, setDiffHeight] = useState(0);

  const toggleBodyStyle = flag => {
    const body = window.document.body;
    flag ? (body.style.overflow = 'hidden') : (body.style.overflow = 'visible');
  };

  const onMaskClose = () => {
    toggleBodyStyle(false);
    setShowTip(false);
  };

  useEffect(() => {
    const flag = YZLocalStorage.getItem('course_goods_upgrade');
    YZLocalStorage.setItem('course_goods_upgrade', true);
    if (!flag && fieldRef) {
      const { x, y, width: fieldWidth } = fieldRef.current.getBoundingClientRect();
      const { innerWidth, innerHeight } = window;
      const focusWidth = fieldWidth + 130;
      const borderLeft = x - focusOffsetLeft;
      const borderRight = innerWidth - borderLeft - focusWidth;
      let borderTop = y - focusOffetTop;
      let borderBottom = innerHeight - borderTop - focusHeight;

      const viewHeight = innerHeight - 52;
      const diffHeight = (borderTop + focusHeight) - viewHeight;
      if (diffHeight > 0) {
        borderTop = borderTop - diffHeight;
        borderBottom = borderBottom + diffHeight;
        setDiffHeight(diffHeight);
      }
      setShowTip(true);
      setStyle({
        borderWidth: `${borderTop}px ${borderRight}px ${borderBottom}px ${borderLeft}px`,
        width: `${focusWidth}px`,
        height: `${focusHeight}px`,
      });
      toggleBodyStyle(true);
    }
  }, []);

  useEffect(() => {
    if (diffHeight > 0) {
      document.body.scrollTop = diffHeight;
      document.documentElement.scrollTop = diffHeight;
    }
  }, [diffHeight]);

  return showTip ? (
    <div className="course-group-field__mask" style={style}>
      <Pop
        content={<MaskTip onHide={onMaskClose}/>}
        position="top-left"
        visible={true}
        className="course-group-field__mask__pop"
      >
        <div />
      </Pop>
    </div>
  ) : null;
}
