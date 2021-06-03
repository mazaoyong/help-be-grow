---
- title: Present selector 赠品选择器
- owner:
    - 梅景
- description: Present selector 赠品选择器
- cover: https://img.yzcdn.cn/upload_files/2020/12/01/FjL79axJYZfBxRmYLp44pskO7cqo.png
- tag:
    - Present selector
    - 赠品选择
---

# Present selector 赠品选择Field

### 适用场景
营销活动中有赠品选择的场景

### 使用示例
* 推荐有奖新建/编辑页(client/pages/ump/referral/edit/components/phased-reward-item/index.tsx)

### 使用截图
![](https://img.yzcdn.cn/upload_files/2020/12/01/FvCGaVMsdX6nR5y8qOx5dENhARUK.png)

![](https://img.yzcdn.cn/upload_files/2020/12/01/FjL79axJYZfBxRmYLp44pskO7cqo.png)

### 使用说明
#### API
name |类型 | 说明 | 是否必填 | 默认值
-|-|-|-|-
disabled |`boolean` | 是否禁用 |  |
helpDesc |`string` | 提示信息 |  |
triggerText |`string` | 添加赠品按钮的文案 |  | 选择赠品
value |`Array<IPresentListItem>` | 选择的赠品信息 | 是 |
onChange |`(value: IPresentListItem[]): void` | 添加赠品的回调 | 是 |
maxNumLimit |`number` | 最大选择赠品数量（目前组件不支持，指定该字段只会弹Toast错误提示） |  |
multiple |`boolean` | 是否支持多选 |  |
multiPieces |`boolean` | 是否支持单品多件 |  |
partialMultiPieces |`boolean` | 是否支持部分单品多件（若 fetchApi 返回的某件赠品的 multiPieces 为 true 则该赠品单独支持选择多件） |  |

### onChange 的 value 示例

```json
[{
    "alias": "2xcxgonkb9pae",
    "channel": 1,
    "goodsId": 394543488,
    "id": 487581,
    "multiPieces": false,
    "picture": {
        "url": "https://img.yzcdn.cn/upload_files/2020/07/31/FhSjrRaMqwHptuc1ZJ6reRkO6kEm.gif"
    },
    "presentLimit": 0,
    "title": "赠品测试111",
    "isAvailable": true,
    "unAvailableReason": "",
    "stock": "不限库存",
    "pieces": 6
}]
```

### 注意事项

目前暂不支持设置最大可选赠品数量

### Changelog
