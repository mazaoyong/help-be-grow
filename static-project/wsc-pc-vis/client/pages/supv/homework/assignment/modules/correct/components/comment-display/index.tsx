import { React, FC, createComponent } from '@youzan/tany-react';
import { BlockLoading } from 'zent';
import { ICorrectForm } from '../../types';
import { renderMediaByType } from '../../utils';
import './styles.scss';

interface ICommentDisplayProps {
  data: ICorrectForm;
}

const CommentDisplay: FC<ICommentDisplayProps> = (props) => {
  const data = props?.data;
  const { media = {}, comment = '' } = data || {};

  const { image = [], audio = [], video = [] } = media;

  return (
    <div className="comment-display">
      <h2>评语</h2>
      <div className="comment-detail">
        {data
          ? <>
            <pre className="text">{comment}</pre>
            {renderMediaByType({ image, video, audio, scene: 'comment' })}
          </>
          : <BlockLoading loading={true} height={300} />
        }
      </div>
    </div>
  );
};

export default createComponent(CommentDisplay);
