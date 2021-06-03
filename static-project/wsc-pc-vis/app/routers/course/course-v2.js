/**
 * 线下课改造项目 使用的新接口
 * 后期下掉旧接口，会合到course.js里
 */

module.exports = [
  [
    'GET',
    '/v4/vis/edu/course-product/list-page.json',
    'course.course.CourseProductV2Controller',
    'findPageByCondition',
  ],
  [
    'GET',
    '/v4/vis/edu/course-product/find-skus.json',
    'course.course.CourseProductV2Controller',
    'findProductSkus',
  ],
  [
    'GET',
    '/v4/vis/edu/course-product/list-page-by-sold-status.json',
    'course.course.CourseProductV2Controller',
    'findPageBySoldStatus',
  ],
  [
    'GET',
    '/v4/vis/edu/course-product/find-campus-product.json',
    'course.course.CourseProductV2Controller',
    'findPageCampusProduct',
  ],
  [
    'POST',
    '/v4/vis/edu/course-product/quick-update.json',
    'course.course.CourseProductV2Controller',
    'quickUpdateProductByAlias',
  ],
  [
    'POST',
    '/v4/vis/edu/course-product/quick-update-sku.json',
    'course.course.CourseProductV2Controller',
    'quickUpdateProductSkuByAlias',
  ],
  [
    'GET',
    '/v4/vis/edu/teacher/find-teachers.json',
    'course.course.TeacherController',
    'findTeachers',
  ],
  ['GET', '/v4/vis/edu/store/find-stores.json', 'course.course.StoreController', 'findStore'],
  [
    'GET',
    '/v4/vis/edu/course-product/find-sku-names.json',
    'course.course.CourseProductV2Controller',
    'findSkuPropNames',
  ],
  [
    'GET',
    '/v4/vis/edu/course-product/find-sku-values.json',
    'course.course.CourseProductV2Controller',
    'findSkuPropValues',
  ],
  [
    'GET',
    '/v4/vis/edu/course-product/find-tags.json',
    'course.course.CourseProductV2Controller',
    'findCourseTag',
  ],
  [
    'GET',
    '/v4/vis/edu/course-product/find-tags-by-alias.json',
    'course.course.CourseProductV2Controller',
    'findCourseTagsByAlias',
  ],
  [
    'POST',
    '/v4/vis/edu/course-product/create-sku-name.json',
    'course.course.CourseProductV2Controller',
    'createSkuPropName',
  ],
  [
    'POST',
    '/v4/vis/edu/course-product/create-sku-value.json',
    'course.course.CourseProductV2Controller',
    'createSkuPropVal',
  ],
  [
    'GET',
    '/v4/vis/edu/course-product/get-pc-detail.json',
    'course.course.CourseProductV2Controller',
    'getCoursePCDetail',
  ],
  [
    'POST',
    '/v4/vis/edu/course-product/batch-delete.json',
    'course.course.CourseProductV2Controller',
    'batchDelete',
  ],
  [
    'POST',
    '/v4/vis/edu/course-product/batch-set-sell-status.json',
    'course.course.CourseProductV2Controller',
    'batchSetSellStatus',
  ],
  [
    'POST',
    '/v4/vis/edu/course-product/batch-set-discount.json',
    'course.course.CourseProductV2Controller',
    'batchSetVipDiscount',
  ],
  [
    'POST',
    '/v4/vis/edu/course-product/_textarea_/create-course.json',
    'course.course.CourseProductV2Controller',
    'createCourse',
  ],
  [
    'PUT',
    '/v4/vis/edu/course-product/_textarea_/update-course.json',
    'course.course.CourseProductV2Controller',
    'updateCourse',
  ],
];
