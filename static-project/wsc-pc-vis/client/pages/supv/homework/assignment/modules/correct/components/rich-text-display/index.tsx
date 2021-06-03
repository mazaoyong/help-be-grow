import { React, FC, createComponent } from '@youzan/tany-react';
import { RichTextPreview } from '@youzan/react-components';

interface IRichTextDisplayProps {
  content: string;
}

const RichTextDisplay: FC<IRichTextDisplayProps> = (props) => {
  const { content } = props;

  return (
    <div className="richtext-display">
      <RichTextPreview content={content} tag="section" />
    </div>
  );
};

export default createComponent(RichTextDisplay);
