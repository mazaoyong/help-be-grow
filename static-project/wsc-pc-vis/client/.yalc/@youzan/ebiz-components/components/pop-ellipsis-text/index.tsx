import React from 'react';
import { Pop } from 'zent';
import cx from 'classnames';
import isNil from 'lodash/isNil';
import { PopEllipsisTextProps } from './types';
import './style.scss';
import {
  genericSSRWrapper,
  alwaysFalsyInSSR,
  useCallback,
  useLayoutEffect,
} from '../utils/use-ssr-hooks';

const PopEllipsisText: React.FC<PopEllipsisTextProps> = (props) => {
  const {
    text,
    count,
    width,
    style,
    tagName,
    nowarp = true,
    selector = '',
    defaultText = '',
    renderVirtualNode,
    deferEllipsis = false,
    position = 'top-center',
  } = props;
  const [isOverflow, setOverflow] = React.useState(false);
  const [genVNode, setGenState] = React.useState(false);
  const [selectorWidth, setSelectorWidth] = React.useState<React.CSSProperties['width']>();
  const idRef = React.useRef<number>(uniqId.id);

  const innerText = React.useMemo(
    () => (renderVirtualNode || selector ? text : `${text.slice(0, count)}...`),
    [count, renderVirtualNode, selector, text]
  );

  const widthLimitation = React.useMemo(() => {
    if (renderVirtualNode) {
      return width || 0;
    }
    return String(selectorWidth).replace('px', '') || 0;
  }, [renderVirtualNode, selectorWidth, width]);

  const handleSelector = useCallback(() => {
    // 如果有选择器，就向上查找父节点，找到符合条件的父节点
    const alternativeParentNode = document.querySelectorAll(selector);
    const targetNode = document.querySelector(
      `.pop-ellipsis-wrapper[data-id=pop-text-${idRef.current}]`
    );
    if (alternativeParentNode.length && targetNode) {
      let foundNode: Node | undefined;
      let targetParentNode: Node | undefined;
      alternativeParentNode.forEach((node) => {
        if (foundNode) return;
        else {
          foundNode = findTargetNode(node, targetNode);
          if (foundNode) targetParentNode = node;
        }
      });

      if (foundNode && targetParentNode) {
        setSelectorWidth(getComputedStyle(targetParentNode as Element).width);
      }
    }
  }, [selector]);

  const handleVirtualNode = useCallback(() => {
    const TAG_NAME = tagName || 'span';
    let vNode: HTMLElement | null = document.getElementById('popVNode');
    if (!vNode) {
      const newNode = document.createElement(TAG_NAME);
      newNode.id = 'popVNode';
      newNode.dataset.name = 'popVNode';
      newNode.style.position = 'fixed';
      newNode.style.display = 'inline-block';
      newNode.style.left = '-1000px';
      newNode.style.bottom = '-1000px';
      newNode.style.visibility = 'hidden';
      document.body.appendChild(newNode);
      vNode = newNode;
    }
    vNode.innerText = innerText;
    // 标记删除
    removeVNode.register2remove();
    setGenState(true);
    if (vNode.clientWidth >= widthLimitation) {
      setOverflow(true);
    }
  }, [innerText, tagName, widthLimitation]);

  // 如果需要依据虚拟dom判断
  useLayoutEffect(() => {
    if (selector) {
      if (!selectorWidth) handleSelector();
      handleVirtualNode();
    } else if (renderVirtualNode && !genVNode) {
      handleVirtualNode();
    }
  }, [genVNode, handleSelector, handleVirtualNode, renderVirtualNode, selector, selectorWidth]);

  const classnames = React.useMemo(() => {
    const showEllipsis = !deferEllipsis || selectorWidth || width;
    return cx({
      'pop-ellipsis-text': showEllipsis,
      'pop-ellipsis-nowrap': showEllipsis && nowarp,
      'pop-ellipsis-wrapper': true,
      'pop-ellipsis-fixed-height': !showEllipsis,
    });
  }, [deferEllipsis, nowarp, selectorWidth, width]);

  const renderPopover = React.useMemo(
    () => alwaysFalsyInSSR((!isNil(count) && text.length > count) || isOverflow),
    [count, isOverflow, text.length]
  );

  if (renderPopover) {
    return (
      <Pop
        block
        trigger="hover"
        className="pop-ellipsis-popover"
        content={text}
        position={position}
      >
        {React.createElement(
          tagName || 'span',
          {
            className: classnames,
            style: Object.assign({}, style, { width: selectorWidth || width || 'auto' }),
            'data-id': `pop-text-${idRef.current}`,
          },
          innerText
        )}
      </Pop>
    );
  }
  return React.createElement(
    tagName || 'span',
    {
      className: classnames,
      style: Object.assign({}, style, { width: selectorWidth || width || 'auto' }),
      'data-id': `pop-text-${idRef.current}`,
    },
    text || defaultText
  );
};

export default PopEllipsisText;
export * from './types';

function findTargetNode(ele: Node, targetNode: Node): Node | undefined {
  let legallyNode: Node | undefined;
  if (ele === targetNode) {
    return ele;
  }
  if (ele.childNodes.length) {
    ele.childNodes.forEach((child) => {
      if (legallyNode) return;

      if (child === targetNode) {
        legallyNode = child;
      } else {
        legallyNode = findTargetNode(child, targetNode);
      }
    });
  }
  return legallyNode;
}

const uniqId = {
  __value: 0,
  get id() {
    const curValue = this.__value;
    this.__value += 1;
    return curValue;
  },
};

const removeVNode = {
  __timer: undefined,
  __remove: genericSSRWrapper(function () {
    const targetNode = document.getElementById('popVNode');
    if (targetNode) {
      document.body.removeChild(targetNode);
      this.__timer = undefined;
    }
  }),
  register2remove() {
    if (this.__timer !== undefined) {
      clearTimeout(this.__timer);
    }
    this.__timer = setTimeout(this.__remove, 0);
  },
};
