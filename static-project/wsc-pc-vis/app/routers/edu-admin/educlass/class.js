module.exports = [
  [
    // 班级列表
    'GET',
    ['/v4/vis/edu/educlass/classes.json'],
    'edu-admin.educlass.EduClassController',
    'getClassesJson',
  ],
  [
    // 新建班级
    'POST',
    ['/v4/vis/edu/educlass/class.json'],
    'edu-admin.educlass.EduClassController',
    'postClassJson',
  ],
  [
    // 更新班级
    'PUT',
    ['/v4/vis/edu/educlass/class.json'],
    'edu-admin.educlass.EduClassController',
    'putClassJson',
  ],
  [
    // 删除班级
    'DELETE',
    ['/v4/vis/edu/educlass/class.json'],
    'edu-admin.educlass.EduClassController',
    'deleteClassJson',
  ],
  [
    // 查询班级
    'GET',
    ['/v4/vis/edu/educlass/class.json'],
    'edu-admin.educlass.EduClassController',
    'getClassJson',
  ],
  [
    // 查询班级 详细版本
    'GET',
    ['/v4/vis/edu/educlass/classDetail.json'],
    'edu-admin.educlass.EduClassController',
    'getClassDetailJson',
  ],
  [
    // 通过No查询班级
    'GET',
    ['/v4/vis/edu/educlass/classDetailByNo.json'],
    'edu-admin.educlass.EduClassController',
    'getClassDetailJsonByNo',
  ],
  [
    // 添加学员
    'POST',
    ['/v4/vis/edu/educlass/addStudent.json'],
    'edu-admin.educlass.EduClassController',
    'addStudentJson',
  ],
  [
    // 调班
    'POST',
    ['/v4/vis/edu/educlass/changeStudent.json'],
    'edu-admin.educlass.EduClassController',
    'changeStudentJson',
  ],
  [
    // 删除班级下学员
    'DELETE',
    '/v4/vis/edu/educlass/removeClassStu.json',
    'edu-admin.educlass.EduClassController',
    'removeClassStu',
  ],
  [
    'GET',
    '/v4/vis/edu/educlass/getEduClassBySkuIdAndGoodsId.json',
    'edu-admin.educlass.EduClassController',
    'getEduClassBySkuIdAndGoodsId',
  ],
  // 根据课程名查询班级
  [
    'GET',
    '/v4/vis/edu/educlass/findPageByName.json',
    'edu-admin.educlass.EduClassController',
    'findPageByName',
  ],
];
