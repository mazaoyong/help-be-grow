/**
 * 新版富文本编辑器工具栏配置
 * copied from https://doc.qima-inc.com/pages/viewpage.action?pageId=263394365
 * 视觉文档 https://doc.qima-inc.com/pages/viewpage.action?pageId=263396603
 *
 * 使用示例
 * editorConfig={{
 *   toolbars: UEDITOR_TOOLBARS_M,
 *   initialFrameWidth: 680, // 编辑器宽度，旧编辑器默认配置是640，使用M码需调整到680以上
 * }}
 *
 * 注：宽度小于390px的编辑器建议增加宽度
 */

/** M码编辑器工具栏，两行按钮，适用于宽度>=680px的编辑器 */
export const UEDITOR_TOOLBARS_M = [
  [
    'undo', // 撤销
    'fontsize', // 字号
    'paragraph', // 段落格式
    '|',
    'bold', // 加粗
    'italic', // 斜体
    'underline', // 下划线
    'strikethrough', // 删除线
    'forecolor', // 字体颜色
    'backcolor', // 背景色
    '|',
    'justifyleft', // 居左对齐
    'justifycenter', // 居中对齐
    'justifyright', // 居右对齐
    'insertorderedlist', // 有序列表
    'insertunorderedlist', // 无序列表
    'blockquote', // 引用
    '|',
    'rowspacingtop', // 段前距
    'rowspacingbottom', // 段后距
    'lineheight', // 行间距
  ],
  [
    'emotion', // 表情
    'uploadimage', // 图片
    'insertvideo', // 视频
    'link', // 超链接
    'removeformat', // 清除格式
    '|',
    'inserttable', // 插入表格
    'deletetable', // 删除表格
    'insertrow', // 前插入行
    'deletecol', // 删除列
    'insertcol', // 前插入列
    'deleterow', // 删除行
    'mergecells', // 合并多个单元格
    'mergeright', // 右合并单元格
    'mergedown', // 下合并单元格
    'splittocells', // 完全拆分单元格
    'splittorows', // 拆分成行
    'splittocols', // 拆分成列
  ],
];

/** S码编辑器工具栏，三行按钮，适用于390px<宽度<680px的编辑器 */
export const UEDITOR_TOOLBARS_S = [
  [
    'undo', // 撤销
    'fontsize', // 字号
    'paragraph', // 段落格式
    '|',
    'bold', // 加粗
    'italic', // 斜体
    'underline', // 下划线
    'strikethrough', // 删除线
    'forecolor', // 字体颜色
    'backcolor', // 背景色
    'justifyleft', // 居左对齐
    'justifycenter', // 居中对齐
    'justifyright', // 居右对齐
  ],
  [
    'insertorderedlist', // 有序列表
    'insertunorderedlist', // 无序列表
    'blockquote', // 引用
    '|',
    'rowspacingtop', // 段前距
    'rowspacingbottom', // 段后距
    'lineheight', // 行间距
    '|',
    'emotion', // 表情
    'uploadimage', // 图片
    'insertvideo', // 视频
    'link', // 超链接
    'removeformat', // 清除格式
  ],
  [
    'inserttable', // 插入表格
    'deletetable', // 删除表格
    'insertrow', // 前插入行
    'deletecol', // 删除列
    'insertcol', // 前插入列
    'deleterow', // 删除行
    'mergecells', // 合并多个单元格
    'mergeright', // 右合并单元格
    'mergedown', // 下合并单元格
    'splittocells', // 完全拆分单元格
    'splittorows', // 拆分成行
    'splittocols', // 拆分成列
  ],
];
