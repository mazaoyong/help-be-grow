import React, { useEffect, useCallback, useRef, useState } from 'react';

export default function Affix({ scrollClassName, children, loading }) {
  const dom = useRef(null);

  const childrenDom = useRef(null);

  const [fixed, setFixed] = useState(false);

  const [width, setWidth] = useState(0);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    const offsetWidth = dom.current && dom.current.offsetWidth;
    const offsetHeight = dom.current && dom.current.offsetHeight;
    setWidth(offsetWidth);
    setHeight(offsetHeight);
  }, []);

  const updatePin = useCallback(() => {
    if (loading) {
      setFixed(false);
      return;
    }
    const offsetY = dom.current && dom.current.getBoundingClientRect().top;
    const offsetHeight = childrenDom.current && childrenDom.current.offsetHeight;
    const deltaY = window.innerHeight - offsetHeight - offsetY - 56;
    if (deltaY < 0) {
      setFixed(true);
    } else {
      setFixed(false);
    }
  }, [loading]);

  useEffect(() => {
    const _doms = document.getElementsByClassName(scrollClassName);
    if (_doms && _doms[0]) {
      _doms[0].addEventListener('scroll', updatePin);
    }
    return () => {
      if (_doms && _doms[0]) {
        _doms[0].removeEventListener('scroll', updatePin);
      }
    };
  }, [updatePin, scrollClassName]);

  useEffect(() => {
    window.addEventListener('resize', updatePin);
    return () => {
      window.removeEventListener('resize', updatePin);
    };
  }, [updatePin]);

  useEffect(() => {
    updatePin();
  }, [updatePin]);

  const style = fixed ? {
    position: 'fixed',
    bottom: '56px',
    width,
  } : {};

  return (
    <div ref={dom}>
      {fixed ? (
        <div
          style={
            {
              width,
              height,
            }
          }
        />
      ) : null}
      <div ref={childrenDom} style={{ width, ...style }}>
        {children}
      </div>
    </div>
  );
}
