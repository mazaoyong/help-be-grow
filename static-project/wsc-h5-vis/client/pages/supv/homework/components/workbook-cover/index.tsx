import { createComponent, ModelOf, Ref } from "@youzan/tany-vue";
import './style.scss';
import get from 'lodash/get';

export interface IWorkbookCoverProps {
  title: string;
  name?: string;
  size?: 'main' | 'list' | 'grid';
  className?: string;
}

const THEME_COVER_MAP = {
  0: 'https://b.yzcdn.cn/public_files/119a861a1f191470e79388ee10e0dfe0.png',
  1: 'https://b.yzcdn.cn/public_files/70f051a3562bdff45f1eb3f5d479c883.png',
  2: 'https://b.yzcdn.cn/public_files/f0192a12f77f005bb06f417fe2083564.png',
  3: 'https://b.yzcdn.cn/public_files/119a861a1f191470e79388ee10e0dfe0.png',
  4: 'https://b.yzcdn.cn/public_files/1549aaadfc1b975304a6f9bcbfdaa7f1.png',
  5: 'https://b.yzcdn.cn/public_files/0728ede001842759e709f04245104470.png',
  6: 'https://b.yzcdn.cn/public_files/553fa2ec73fdf346e68652cf4e84084f.png',
  7: 'https://b.yzcdn.cn/public_files/08655a98bf09ca5bf168dd0b07b298e0.png',
  8: 'https://b.yzcdn.cn/public_files/2d2561f2c6aea61d37254e7a2e54a8a8.png',
  9: 'https://b.yzcdn.cn/public_files/c0d1edd4d649f923e3cc63d5841a8676.png',
  10: 'https://b.yzcdn.cn/public_files/01e218350f31cd1dedd028c886f8b65e.png',
  // 教育没有这个配色，走默认值
  11: 'https://b.yzcdn.cn/public_files/0728ede001842759e709f04245104470.png',
  12: 'https://b.yzcdn.cn/public_files/65d2b6acf7718b6a2958286889c6cba0.png',
  13: 'https://b.yzcdn.cn/public_files/c3d8913ce046dfe0456a6f7355023a78.png',
} as Record<number, string>;

const themeType: number = get(window, '_global.themeType', 0);
const cover =  THEME_COVER_MAP[themeType];

/** 作业本封面 */
function WorkbookCover(props: IWorkbookCoverProps) {
  const { title, name, size, className } = props;

  return (
    <div class={['workbook-cover', `workbook-cover--${size}`, className]}>
      <img class="workbook-cover__img" src={cover}/>
      <span class={['workbook-cover__title', `workbook-cover__title--${size}`]}>{ title }</span>
      { 
        size === 'grid'
        ? (
            <div class={['workbook-cover__name', `workbook-cover__name--${size}`]}>
              <div class="workbook-cover__name__content">{ name }</div>
            </div>
          ) 
        : null 
      }
    </div>
  )
}

export default createComponent(WorkbookCover, {
  initialState: {
    title: '',
    name: '',
    size: 'main',
    className: '',
  },
});
