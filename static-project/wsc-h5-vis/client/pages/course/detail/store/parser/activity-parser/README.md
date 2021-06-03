## 返回值格式

- `index.js` 中已经处理了 *商品状态校验* 和 *商品限购校验* ，在活动规则中不需要考虑商品状态和商品限购（若活动本身还有限购，需要自行处理）

- 若不返回 `skuButtons`，则打开 `sku` 弹窗时使用 `default` 中的 `skuButtons` 配置，此时点击按钮下单不会带任何营销活动信息

``` typescript
/**
 * 营销活动抛出函数返回值格式
 * @map 会在 store 中生成对应字段的 map 数据，如 activityData 会在 store 中生成 activityDataMap: { [activityType]: [activityData] }
 * @merge 不会生成 map，会在 store 中生成同名字段，但内容会将所有活动的返回值进行合并，根据活动优先级进行覆盖
 */
interface ReturnValue {
  /**
   * 当前营销活动解析后数据
   * @map
   */
  activityData: {

    /**
     * 是否有营销活动条
     */
    hasUmpBlock: boolean;

    /**
     * 活动通用状态
     */
    status: ACTIVITY_STATUS;

    /**
     * 价格标签
     * 控制页面价格展示区域和 sku 弹窗中的标签
     */
    priceTag: string;

    /**
     * 活动 sku 数据
     */
    sku: {
      /**
       * 活动 sku 最低价格
       * 控制页面价格展示和 sku 弹窗中未选中 sku 时的价格展示
       */
      minPrice: number;

      /**
       * 活动 sku 最高价格
       * 控制页面价格展示和 sku 弹窗中未选中 sku 时的价格展示
       */
      maxPrice: number;

      /**
       * 活动当前库存
       * 控制 sku 弹窗中未选中 sku 时的库存展示
       */
      stockNum: number;

      /**
       * 活动总库存
       * 控制营销活动条的剩余名额进度条展示
       */
      originStock: number;

      /**
       * 活动 sku 详细配置
       * 控制 sku 弹窗中选中 sku 时的展示
       * {
       *   [skuid]: {
       *     price: [price],
       *     stockNum: [stock],
       *   },
       *   ...
       * }
       */
      map: {
        [props as number]: {
          price: number;
          stockNum: number;
          // 其他 sku 级商品数据
          [props as string]: any;
        }
      }

      // 其他页面级 sku 数据
      [props as string]: any;
    } | null;

    // 其他活动信息
    [props as string]: any;
  }

  /**
   * 底部小黄条内容
   * @merge
   */
  message?: string;

  /**
   * 底部按钮列表
   * @merge
   */
  buttons?: Button[];

  /**
   * 当前营销活动对应 sku 弹窗中按钮列表
   * @map
   */
  skuButtons?: Button[];
}

interface Button {
  // 按钮文案，为字符串数组时会展示为两行的样式
  text: string | [string, string];

  // 点击跳转链接，可以不传
  url?: string;

  // 点击执行的事件
  // @params payload: 执行 pay 或者 openSkuPopup 时带入的 payload 会透传回来
  // (payload) => void;
  action?: function;
}
```
