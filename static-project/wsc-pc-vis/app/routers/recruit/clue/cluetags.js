module.exports = [
  [
    // 线索标签页面
    'GET',
    '/v4/vis/edu/page/clue/tags',
    'recruit.clue.ClueTagsController',
    'getIndexHTML',
  ],
  [
    // 获取线索标签分组
    'GET',
    '/v4/vis/edu/clue/getTagGroups.json',
    'recruit.clue.ClueTagsController',
    'getTagGroupsJson',
  ],
  [
    // 新建线索标签分组
    'POST',
    '/v4/vis/edu/clue/createTagGroup.json',
    'recruit.clue.ClueTagsController',
    'createTagGroupJson',
  ],
  [
    // 编辑线索标签分组
    'PUT',
    '/v4/vis/edu/clue/updateTagGroup.json',
    'recruit.clue.ClueTagsController',
    'updateTagGroupJson',
  ],
  [
    // 删除线索标签分组
    'DELETE',
    '/v4/vis/edu/clue/deleteTagGroup.json',
    'recruit.clue.ClueTagsController',
    'deleteTagGroupJson',
  ],
  [
    // 获取线索标签分页
    'GET',
    '/v4/vis/edu/clue/getTagList.json',
    'recruit.clue.ClueTagsController',
    'getTagListJson',
  ],
  [
    // 创建线索标签
    'POST',
    '/v4/vis/edu/clue/createTag.json',
    'recruit.clue.ClueTagsController',
    'craeteTagJson',
  ],
  [
    // 更新标签
    'PUT',
    '/v4/vis/edu/clue/updateTag.json',
    'recruit.clue.ClueTagsController',
    'updateTagJson',
  ],
  [
    // 删除线索标签
    'DELETE',
    '/v4/vis/edu/clue/deleteTag.json',
    'recruit.clue.ClueTagsController',
    'deleteTagJson',
  ],
  [
    // 批量删除线索标签
    'DELETE',
    '/v4/vis/edu/clue/deleteTags.json',
    'recruit.clue.ClueTagsController',
    'deleteTagsJson',
  ],
  [
    // 批量更换线索标签分组
    'POST',
    '/v4/vis/edu/clue/transTagGroup.json',
    'recruit.clue.ClueTagsController',
    'transTagGroupJson',
  ],
];
