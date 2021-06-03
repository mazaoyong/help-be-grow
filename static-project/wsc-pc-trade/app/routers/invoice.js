const urlPrefix = '/v4/trade/invoice';
const urlApiPrefix = '/v4/trade/invoice/api';

module.exports = [
  // IndexController
  [
    'POST',
    `${urlApiPrefix}/pictureUploadToken.json`,
    'invoice.IndexController',
    'pictureUploadToken',
  ],
  ['POST', `${urlApiPrefix}/fileUploadToken.json`, 'invoice.IndexController', 'fileUploadToken'],
  [
    'POST',
    `${urlApiPrefix}/openInvoiceService.json`,
    'invoice.IndexController',
    'openInvoiceService',
  ],
  [
    'POST',
    `${urlApiPrefix}/closeInvoiceService.json`,
    'invoice.IndexController',
    'closeInvoiceService',
  ],
  ['POST', `${urlApiPrefix}/checkCodeForNew.json`, 'invoice.IndexController', 'checkCodeForNew'],
  [
    'GET',
    `${urlApiPrefix}/isInvoiceServiceOpening.json`,
    'invoice.IndexController',
    'isInvoiceServiceOpening',
  ],
  ['GET', `${urlApiPrefix}/kdtList.json`, 'invoice.IndexController', 'kdtList'],

  // SetupController
  [
    'POST',
    `${urlApiPrefix}/applyTripartiteCertificate.json`,
    'invoice.SetupController',
    'applyTripartiteCertificate',
  ],
  [
    'POST',
    `${urlApiPrefix}/configuredTaxClassCode.json`,
    'invoice.SetupController',
    'configuredTaxClassCode',
  ],
  // 提交企业信息
  [
    'POST',
    `${urlApiPrefix}/applyEnterpriseInfo.json`,
    'invoice.SetupController',
    'applyEnterpriseInfo',
  ],
  // 修改企业信息 - 通过审核前
  [
    'POST',
    `${urlApiPrefix}/reSubmitEnterpriseInfo.json`,
    'invoice.SetupController',
    'reSubmitEnterpriseInfo',
  ],
  // 修改开票主体信息 - 通过审核后
  [
    'POST',
    `${urlApiPrefix}/re-certificate.json`,
    'invoice.SettingController',
    'modifyInvoiceSetting',
  ],
  [
    'POST',
    `${urlApiPrefix}/confirmInvoiceAccount.json`,
    'invoice.SetupController',
    'confirmInvoiceAccount',
  ],

  // TaxController
  [
    'GET',
    `${urlApiPrefix}/getTaxClassRootNodes.json`,
    'invoice.TaxController',
    'getTaxClassRootNodes',
  ],
  [
    'GET',
    `${urlApiPrefix}/taxClassLeafNodesByParentCode.json`,
    'invoice.TaxController',
    'getTaxClassLeafNodesByParentCode',
  ],
  [
    'GET',
    `${urlApiPrefix}/taxClassLeafByKeyword.json`,
    'invoice.TaxController',
    'getTaxClassLeafByKeywordJson',
  ],
  [
    'GET',
    `${urlApiPrefix}/taxClassLeafByCode.json`,
    'invoice.TaxController',
    'getTaxClassLeafByCodeJson',
  ],
  [
    'GET',
    `${urlApiPrefix}/sellerTaxClassByPage.json`,
    'invoice.TaxController',
    'getSellerTaxClassByPageJson',
  ],
  [
    'GET',
    `${urlApiPrefix}/nodesByPrefixClsCode.json`,
    'invoice.TaxController',
    'getNodesByPrefixClsCodeJson',
  ],
  [
    'GET',
    `${urlApiPrefix}/sellerTaxClassByCode.json`,
    'invoice.TaxController',
    'getSellerTaxClassByCodeJson',
  ],
  [
    'POST',
    `${urlApiPrefix}/sellerTaxClassInfo.json`,
    'invoice.TaxController',
    'postSellerTaxClassInfoJson',
  ],
  [
    'PUT',
    `${urlApiPrefix}/sellerTaxClassInfo.json`,
    'invoice.TaxController',
    'putSellerTaxClassInfoJson',
  ],
  [
    'DELETE',
    `${urlApiPrefix}/sellerTaxClassInfo.json`,
    'invoice.TaxController',
    'deleteSellerTaxClassInfoJson',
  ],
  [
    'POST',
    `${urlApiPrefix}/updateGoodsTaxClassCode.json`,
    'invoice.TaxController',
    'postUpdateGoodsTaxClassCodeJson',
  ],
  ['GET', `${urlApiPrefix}/getFreightTax.json`, 'invoice.TaxController', 'getFreightTax'],
  ['POST', `${urlApiPrefix}/addFreightTax.json`, 'invoice.TaxController', 'addFreightTax'],
  ['PUT', `${urlApiPrefix}/updateFreightTax.json`, 'invoice.TaxController', 'updateFreightTax'],

  // ChargeController
  ['GET', `${urlApiPrefix}/chargeList.json`, 'invoice.ChargeController', 'chargeList'],

  // GoodsController
  ['GET', `${urlApiPrefix}/goodsGroup.json`, 'invoice.GoodsController', 'goodsGroup'],
  ['GET', `${urlApiPrefix}/searchGoods.json`, 'invoice.GoodsController', 'searchGoods'],
  [
    'GET',
    `${urlApiPrefix}/noTaxClassGoodsCount.json`,
    'invoice.GoodsController',
    'getNoTaxClassGoodsCountJson',
  ],
  [
    'GET',
    `${urlApiPrefix}/taxClassGoodsList.json`,
    'invoice.GoodsController',
    'getTaxClassGoodsListJson',
  ],

  // 获取商品列表
  ['GET', '/v4/trade/gs2/api/fetch-goods', 'invoice.GoodsController', 'fetchGoods'],
  // 获取商品分组信息
  ['GET', '/v4/trade/gs2/api/fetch-filter-groups', 'invoice.GoodsController', 'fetchFilterGroups'],
  // 获取上传token
  ['POST', '/v4/trade/gs2/api/postToken', 'invoice.GoodsController', 'postToken'],
  // 查询已导入商品列表
  ['GET', '/v4/trade/gs2/api/imported-list', 'invoice.GoodsController', 'getImportedList'],
  // 开始导入商品
  ['GET', '/v4/trade/gs2/api/import-goods', 'invoice.GoodsController', 'doImportGoods'],
  // 查询商品导入状态
  ['GET', '/v4/trade/gs2/api/import-status', 'invoice.GoodsController', 'checkImportStatus'],
  // 根据商品 ids 获取 商品详情，给商品导入使用
  [
    'POST',
    '/v4/trade/gs2/api/imported-goods-details',
    'invoice.GoodsController',
    'fetchImportedGoodsDetailByIds',
  ],
  // 取消导入
  ['GET', '/v4/trade/gs2/api/cancel-import', 'invoice.GoodsController', 'cancelImport'],
  // 确认导入
  ['GET', '/v4/trade/gs2/api/sure-import', 'invoice.GoodsController', 'sureImport'],

  // RecordController
  ['GET', `${urlApiPrefix}/invoiceList.json`, 'invoice.RecordController', 'invoiceList'],
  ['POST', `${urlApiPrefix}/redInvoiceApply.json`, 'invoice.RecordController', 'redInvoiceApply'],
  [
    'POST',
    `${urlApiPrefix}/retryInvoiceApply.json`,
    'invoice.RecordController',
    'retryInvoiceApply',
  ],
  ['POST', `${urlApiPrefix}/invoiceDownload.json`, 'invoice.RecordController', 'invoiceDownload'],

  // HandworkController
  [
    'GET',
    `${urlApiPrefix}/handworkGoodsList.json`,
    'invoice.HandworkController',
    'handworkGoodsList',
  ],
  [
    'GET',
    `${urlApiPrefix}/handworkOrderDetail.json`,
    'invoice.HandworkController',
    'handworkOrderDetail',
  ],
  [
    'POST',
    `${urlApiPrefix}/createManualInvoice.json`,
    'invoice.HandworkController',
    'createManualInvoice',
  ],

  // SettingController
  [
    'POST',
    `${urlApiPrefix}/modifyTaxOfficerInfoAndSetting.json`,
    'invoice.SettingController',
    'modifyTaxOfficerInfoAndSetting',
  ],
  [
    'GET',
    `${urlApiPrefix}/getAuthorizedRelation.json`,
    'invoice.SettingController',
    'getAuthorizedRelation',
  ],
  [
    'GET',
    `${urlApiPrefix}/getInvoiceAuthorizer.json`,
    'invoice.SettingController',
    'getInvoiceAuthorizer',
  ],
  [
    'POST',
    `${urlApiPrefix}/authInvoiceByKdtId.json`,
    'invoice.SettingController',
    'authInvoiceByKdtId',
  ],
  [
    'POST',
    `${urlApiPrefix}/deleteInvoiceAuthByKdtId.json`,
    'invoice.SettingController',
    'deleteInvoiceAuthByKdtId',
  ],
  [
    'GET',
    `${urlApiPrefix}/getInvoicedTicketNum.json`,
    'invoice.SettingController',
    'getInvoicedTicketNum',
  ],
  [
    'POST',
    `${urlApiPrefix}/invoiceAuthorization.json`,
    'invoice.SettingController',
    'invoiceAuthorization',
  ],
  [
    'POST',
    `${urlApiPrefix}/relieveOneRelation.json`,
    'invoice.SettingController',
    'relieveOneRelation',
  ],

  // home page
  ['GET', [`${urlPrefix}`, `${urlPrefix}/*`], 'invoice.IndexController', 'getIndexHtml'],
];
