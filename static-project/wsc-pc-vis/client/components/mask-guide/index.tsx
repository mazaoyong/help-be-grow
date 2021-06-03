import { Pop, IPopoverContext } from '@zent/compat';
import React, { useState, useEffect, FC, MutableRefObject, CSSProperties } from 'react';
import { Button } from 'zent';
import YZLocalStorage from 'zan-utils/local_storage';
import './style.scss';

interface MaskProps {
  storageKey: string;
  fieldRef: MutableRefObject<any>;
  styles?: CSSProperties;
  popClassName?: string;
}

type ContentPop = IPopoverContext & {
  onHide: () => void
};

const MentionDiv: FC<ContentPop> = (props) => {
  const { onHide } = props;
  return (
    <div className="mask-tip">
      <div>
       点击选择网店，查看网店的数据
      </div>
      <span className='mask-tip__btn'>
        <Button type="primary" size="small" onClick={onHide}>
          我知道了
        </Button>
      </span>
    </div>
  );
};

const MaskTip = Pop.withPop(MentionDiv);

const focusHeight = 53;
const focusOffsetLeft = 100;
const focusOffetTop = 10;

const Mask: FC<MaskProps> = (props) => {
  const { fieldRef, styles = {}, popClassName = '', storageKey } = props;
  const [showTip, setShowTip] = useState(false);
  const [style, setStyle] = useState<CSSProperties | undefined>();
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
    const flag = YZLocalStorage.getItem(storageKey);
    YZLocalStorage.setItem(storageKey, true);
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
        ...styles,
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
    <div style={style} className='mask-guide'>
      <Pop
        content={<MaskTip onHide={onMaskClose}/>}
        position="bottom-right"
        visible={true}
        className={`mask-guide__pop ${popClassName}`}
      >
        <div />
      </Pop>
    </div>
  ) : null;
};

export default Mask;
