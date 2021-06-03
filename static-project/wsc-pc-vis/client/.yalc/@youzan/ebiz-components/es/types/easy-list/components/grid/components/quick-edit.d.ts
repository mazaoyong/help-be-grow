import { IGridColumnBodyRenderFunc } from 'zent';
import { IQuickEditConfig, IBodyRenderFunc } from '../../../types/grid';
declare function quickEdit(NodeRender: IBodyRenderFunc | string, quickEditOpts: IQuickEditConfig): IGridColumnBodyRenderFunc<any>;
export default quickEdit;
