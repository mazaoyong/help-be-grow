import React from 'react';
import { Form } from '@zent/compat';
import { getDefaultExpressId } from '../utils';
import { getExpressData } from 'fns/fetch-express-info';
import ExpressSelection from './ExpressSelection';
import PackNumberField from '../fields/PackNumberField';
import { IItemPack } from '../type';

const { Field } = Form;

interface IProps {
  packItems: IItemPack[];
  onCleanPackList: (param?: IItemPack) => void;
  onChange: (param: IItemPack[]) => void;
}

class SingleGoodsMultiExpress extends React.Component<IProps> {
  optimizedExpressData: Array<{
    value: number;
    text: string;
  }>;

  static defaultProps = {
    packItems: [],
  };

  constructor(props) {
    super(props);
    this.optimizedExpressData = getExpressData();
  }

  handleChange(packItems: IItemPack[]) {
    const { onChange } = this.props;
    onChange && onChange([...packItems]);
  }

  handlePickItemChange(val: Partial<IItemPack>, index: number) {
    const { packItems } = this.props;
    const item = {
      ...packItems[index],
      ...val,
    };
    packItems[index] = item;
    this.handleChange(packItems);
  }

  // 单品多运：新增包裹
  handleAddPack = () => {
    const { packItems } = this.props;
    packItems.push({
      express: {
        expressId: getDefaultExpressId(),
        expressNo: '',
        expressName: '',
      },
      num: 1,
    });
    this.handleChange(packItems);
  };

  // 单品多运：删除包裹
  handleDeletePack = index => {
    const { packItems, onCleanPackList } = this.props;
    packItems.splice(index, 1);
    if (packItems.length === 1) {
      onCleanPackList && onCleanPackList(packItems[0]);
    } else {
      this.handleChange(packItems);
    }
  };

  handleClean = () => {
    const { onCleanPackList } = this.props;
    onCleanPackList && onCleanPackList();
  };

  renderExpress(item, index) {
    const { express } = item;
    const { expressId, expressName, expressNo } = express;
    return (
      <div className="pack-item" key={index}>
        <ExpressSelection
          expressId={expressId}
          expressName={expressName}
          expressNo={expressNo}
          onChange={(key, val) => {
            this.handlePickItemChange(
              {
                express: {
                  ...express,
                  [key]: val,
                },
              },
              index,
            );
          }}
        />
        <Field
          name="num"
          component={PackNumberField}
          label={`包裹${index + 1}：`}
          onDelete={() => this.handleDeletePack(index)}
          onChange={val => {
            this.handlePickItemChange(
              {
                num: val,
              },
              index,
            );
          }}
          value={item.num}
          validations={{
            required: true,
          }}
          validationErrors={{
            required: '请选择物流公司',
          }}
        />
      </div>
    );
  }

  renderExpresses() {
    const { packItems } = this.props;
    return packItems.map((packItem, index) => this.renderExpress(packItem, index));
  }

  render() {
    return (
      <div className="delivery-content">
        {this.renderExpresses()}
        <div>
          <a className="control-item" onClick={() => this.handleClean()}>
            全部清空
          </a>
          <a className="control-item" onClick={this.handleAddPack}>
            继续新增
          </a>
        </div>
        <div>每个包裹必须填写商品数量且包裹数量总和等于该商品总数量才可发货</div>
      </div>
    );
  }
}

export default SingleGoodsMultiExpress;
