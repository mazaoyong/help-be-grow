import { React, FC, useCallback } from '@youzan/tany-react';
import { url, fullfillImage } from '@youzan/utils';
import usePromotionDialog from 'hooks/use-promotion-dialog';
import './styles.scss';

interface IWorkbookPromotionProps {
  id: number;
  alias: string;
  kdtId?: number;
  title: string;
  text: string;
  source: 'workbook' | 'homework',
  disabled?: boolean;
}

const WorkbookPromotion: FC<IWorkbookPromotionProps> = (props) => {
  const { alias, title, text, source, disabled, kdtId } = props;

  const createPoster = useCallback(({ codeImg }) => (
    <div
      className="poster-container"
      style={{
        background: `url("${
          fullfillImage('/public_files/fb9cb3766855d86260fa7ee85830e0af.png', 'origin', { imgcdn: 'https://b.yzcdn.cn' })
        }")`,
        backgroundSize: 'cover',
        width: 300,
        height: 418,
        borderRadius: 6.5,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <span className="title">{title}</span>
      <img className="qrcode" src={codeImg} style={{ width: 160, height: 160 }} />
      <div className="bottom">
        <div className="tips-container">
          <span className="tips">{text}</span>
        </div>
        <div className="source">
          <span className="source-prefix">分享自 有赞教育</span>
        </div>
      </div>
    </div>
  ), [title, text]);

  const { open } = usePromotionDialog({
    createPoster,
    targetUrl: url.buildUrl(`/wscvis/supv/homework/${source === 'workbook' ? 'workbook' : 'detail'}?kdt_id=${kdtId || _global.kdtId}&alias=${alias}`, 'h5'),
  });
  return disabled ? (
    <span className="disabled">推广</span>
  ) : (
    <span
      className="operation"
      onClick={open}
    >
      推广
    </span>
  );
};

export default WorkbookPromotion;
