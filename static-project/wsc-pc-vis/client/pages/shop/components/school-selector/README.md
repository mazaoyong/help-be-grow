---
- title: 校区选择器（教务课程页）
- owner: 埃里克
- description: 线下课详情页页面校区
- tag:
    - 校区选择器
    - dialog
    - selector
    - 教务课程校区选择
- cover: https://b.yzcdn.cn/public_files/9800710c416acdebf3dba6854354a55e.png
---

# School Selector 

详见../school-td/README.md

### 使用截图
![](https://b.yzcdn.cn/public_files/9800710c416acdebf3dba6854354a55e.png)

### 使用说明

入参：config 读取属性传入dialog, componentConfig为组件属性，包含{Foot, Filter，...listprops}自定义组件可传(Foot, Filter为自定义头部，脚部)， dialogConfig包含zent的dialog属性，及onSubmit, onClose, onOpen三个回调接口


返回值：[] Array [open, Dialog] Dialog为包含课程选择的dialog组件，默认关闭。open为打开Dialog事件