import { Pop } from '@zent/compat';
import React, { ComponentType, FC } from 'react';
import { Icon } from 'zent';
import ShortcutPop from '../../course-manage/components/course-table/components/shortcut-pop';

interface IQuickUpdateInfoProps {
  quickUpdateCallback(...args: any): void;
  rowData: Record<string, any>;
  row: number;
  type: string;
  width?: string | number;
  inputType?: string;
  validate?: (userInput: string) => boolean
}

interface IShortcutPopProps extends Record<string, any>{
  onOk?(...args: any): void;
  onCancel?(...args: any): void;
  onShow?(...args: any): void;
  onClose?(...args: any): void;
  defaultValue: string;
  width: string | number;
  type: string;
  name: string;
  index?: number;
  productAlias?: string;
  // 是否是多规格的信息
  useSku?: boolean;
  // 有多少sku，这个在quick-edit-sku组件中作为一个数据处理的依据
  skuSize?: number;
  // 是否是必填，在onChange阶段检验
  required?: boolean;
}
const AnymousShortcutPop: ComponentType<IShortcutPopProps> = ShortcutPop as any;

const quickUpdateInfoComp: FC<IQuickUpdateInfoProps> = (props) => {
  const { quickUpdateCallback, rowData = {}, row, type, width = 400, inputType = '', validate = () => true } = props;
  return (
    <Pop
      trigger="click"
      position="bottom-center"
      wrapperClassName="shortcut-pop"
      centerArrow
      content={
        <AnymousShortcutPop
          name={type}
          defaultValue={type === 'price' ? rowData[type] / 100 : rowData[type]}
          validate={validate}
          width={width}
          type={inputType}
          index={row}
          required
          onOk={
            (name, index, value, useSku = false) => {
              quickUpdateCallback(name, index, value, useSku, rowData['alias']);
            }
          }
          maxLength={40}
        />
      }
    >
      <div
        className="hover-visibleBtn"
        // ref={icon => (ctx[`title${row}`] = icon)}
      >
        <Icon type="edit-o" style={{ color: '#c3c3c3' }} />
      </div>
    </Pop>
  );
};

export default quickUpdateInfoComp;
