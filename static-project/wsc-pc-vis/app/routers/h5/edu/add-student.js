module.exports = [
  ['GET', '/v4/vis/h5/edu/add-student', 'h5.add-student.IndexController', 'getIndexHtml'],
  ['GET', '/v4/vis/h5/edu/getPureStudentList.json', 'h5.add-student.IndexController', 'getStudentList'],
  ['POST', '/v4/vis/h5/edu/addStudents.json', 'h5.add-student.IndexController', 'addStudents'],
  ['GET', '/v4/vis/h5/edu/conflict.json', 'h5.add-student.IndexController', 'detectDateRange'],
];
