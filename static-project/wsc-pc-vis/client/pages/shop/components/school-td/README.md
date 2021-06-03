---
- title: 校区查看弹窗
- owner: 埃里克
- description: 
- tag:
    - 校区查看
    - 证书，奖励
    - dialog
- cover: https://b.yzcdn.cn/public_files/6112399729baff496650573debd4ca38.png
---

# School TD 查看适用校区的Dialog

### 适用场景
多校区场景下，查看活动的适用校区（如学员奖励、证书）

### 使用示例
* 奖励-学员奖励-适用校区(client/pages/edu/rewards/components/rewardlist-config.js)
* 证书-学员证书-适用校区(client/pages/edu/certificate/containers/certificates/index.jsx)

### 使用截图
![](https://b.yzcdn.cn/public_files/6112399729baff496650573debd4ca38.png)

### 使用说明
#### API
name | 说明 | 默认值
-|-|-
label | Dialog标题 | 参与活动名称：
name | 学员奖励名称/证书名 | ''
designateType | 1：全部校区适用 0：非全部校区适用 | -
designatedKdtIds | 适用校区kdtId的list | []

### 注意事项
需要重构