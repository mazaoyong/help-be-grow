import React from 'react';
import cx from 'classnames';
import { Tag, Pop } from 'zent';
import { IEbizTagListProps, IOption } from '../types';

const EbizTagList: React.FC<IEbizTagListProps> = (props) => {
  const { options = [], displayNum, className, handleClose, disabled } = props;
  const sliceNum = React.useMemo(() => (displayNum > 0 ? displayNum : options.length), [
    displayNum,
    options.length,
  ]);
  const tagsCls = React.useMemo(
    () =>
      cx({
        'multi-select-tag': true,
        'multi-select-tag__disabled': disabled,
      }),
    [disabled]
  );
  const displayTags = React.useMemo(() => options.slice(0, sliceNum), [options, sliceNum]);
  const collapseTags = React.useMemo(() => options.slice(sliceNum), [options, sliceNum]);
  const renderTags = React.useCallback(
    (options: IOption[]) => {
      if (options.length) {
        return options.map((opt, index) => (
          <Tag
            outline
            key={index}
            theme="grey"
            className={tagsCls}
            closable={!disabled && !opt.disabled}
            onClose={(evt) => {
              evt.stopPropagation();
              handleClose(opt);
            }}
          >
            {opt.text}
          </Tag>
        ));
      }
      return null;
    },
    [disabled, handleClose, tagsCls]
  );

  const DisplayTags = React.useMemo(() => renderTags(displayTags), [displayTags, renderTags]);
  const CollapseTags = React.useMemo(() => {
    if (collapseTags.length) {
      return (
        <Pop
          cushion={14}
          trigger="hover"
          wrapperClassName="multi-select-tag__pop"
          content={collapseTags.map((tag) => tag.text).join('、')}
        >
          <span className="multi-select-tag multi-select-tag__collapse">
            +{collapseTags.length}
          </span>
        </Pop>
      );
    }
    return null;
  }, [collapseTags]);

  return (
    <div className={cx('ebiz-tag-list', className)}>
      {DisplayTags}
      {CollapseTags}
    </div>
  );
};

export default EbizTagList;
