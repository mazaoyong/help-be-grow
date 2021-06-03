/**
 * 知识付费相关接口
 */
module.exports = [
  /**
   * Column
   */
  ['GET', '/wscvis/knowledge/getIsPaid.json', 'knowledge.ColumnController', 'getIsPaidJson'],
  ['GET', '/wscvis/knowledge/getFreeContentAndLive.json', 'knowledge.ColumnController', 'getFreeContentAndLiveJson'],
  // h5端 专栏的章节列表
  ['GET', '/wscvis/knowledge/getColumnChapters.json', 'knowledge.ColumnController', 'getColumnChaptersJson'],
  // h5端 专栏的内容列表
  ['GET', '/wscvis/knowledge/contentAndLive.json', 'knowledge.ColumnController', 'getContentAndLiveJson'],
  ['GET', '/wscvis/knowledge/nextOwl.json', 'knowledge.ColumnController', 'getNextOwlInfoJson'],

  ['GET', '/wscvis/knowledge/column.json', 'knowledge.ColumnController', 'getColumnJson'],
  ['GET', '/wscvis/knowledge/columns.json', 'knowledge.ColumnController', 'getColumnsJson'],
  ['GET', '/wscvis/knowledge/paidcolumns.json', 'knowledge.ColumnController', 'getPaidColumnsJson'],

  /**
   * Content
   */
  ['GET', '/wscvis/knowledge/contents.json', 'knowledge.ContentController', 'getContentsJson'],
  ['GET', '/wscvis/knowledge/content.json', 'knowledge.ContentController', 'getContentJson'],
  ['GET', '/wscvis/knowledge/contentsAndLives.json', 'knowledge.ContentController', 'getContentsAndLivesJson'],
  ['GET', '/wscvis/knowledge/paidcontents.json', 'knowledge.ContentController', 'getPaidContentsJson'],
  // h5端 内容列表
  ['GET', '/wscvis/knowledge/contentList.json', 'knowledge.ContentController', 'getContentListJson'],
  ['GET', '/wscvis/knowledge/contentDetail.json', 'knowledge.ContentController', 'getContentDetail'],
  // h5端 分销店铺内容详情(新增)
  ['GET', '/wscvis/knowledge/getDetailByAlias.json', 'knowledge.ContentController', 'getDetailByAlias'],

  /** 信息采集 */
  ['POST', '/wscvis/knowledge/submitCollectInfo.json', 'knowledge.ContentController', 'submitCollectInfo'],

  /**
   * Live
   */
  ['GET', '/wscvis/knowledge/getLiveNewsByPage.json', 'knowledge.LiveController', 'getLiveNewsByPage'],
  ['GET', '/wscvis/knowledge/relectorUpdateEnable.json', 'knowledge.LiveController', 'getReLectorJson'],
  ['GET', '/wscvis/knowledge/getLectorUser.json', 'knowledge.LiveController', 'getLectorUserJson'],
  ['GET', '/wscvis/knowledge/getLectorUserByWxUidV2.json', 'knowledge.LiveController', 'getLectorUserByWxUidV2'],
  ['GET', '/wscvis/knowledge/inviteLecturer.json', 'knowledge.LiveController', 'getInviteLecturerCentreJson'],
  ['GET', '/wscvis/knowledge/getInviteLecturerQr.json', 'knowledge.LiveController', 'getInviteLecturerCodeJson'],
  ['POST', '/wscvis/knowledge/updateUserInfo.json', 'knowledge.LiveController', 'updateUserInfo'],
  ['GET', '/wscvis/knowledge/live.json', 'knowledge.LiveController', 'getLiveJson'],
  ['GET', '/wscvis/knowledge/wxMediaDownLoadAsyn.json', 'knowledge.LiveController', 'getMediaUploadJson'],
  ['GET', '/wscvis/knowledge/highWxMediaDownLoadAsyn.json', 'knowledge.LiveController', 'getHighMediaUploadJson'],
  ['GET', '/wscvis/knowledge/lives.json', 'knowledge.LiveController', 'getLivesJson'],
  ['GET', '/wscvis/knowledge/getLiveLink.json', 'knowledge.LiveController', 'getLiveLink'],

  /**
   * Collect Zan
   */
  ['GET', '/wscvis/knowledge/buildZanSet.json', 'ump.CollectZanController', 'getBuildZanSetJson'],
  ['GET', '/wscvis/knowledge/zanSetDetail.json', 'ump.CollectZanController', 'getZanSetDetailJson'],
  ['GET', '/wscvis/knowledge/givingZan.json', 'ump.CollectZanController', 'getGivingZanJson'],

  /**
   * VIP Benefit
   */
  ['GET', '/wscvis/knowledge/vipBenefit.json', 'knowledge.blocks.VipBenefitController', 'getVipBenefitJson'],
  ['GET', '/wscvis/knowledge/benefitPkgColumns.json', 'knowledge.blocks.VipBenefitController', 'getBenefitPkgColumnsJson'],
  ['GET', '/wscvis/knowledge/benefitPkgContents.json', 'knowledge.blocks.VipBenefitController', 'getBenefitPkgContentsJson'],
  ['GET', '/wscvis/knowledge/subscriptionBenefitPkg.json', 'knowledge.blocks.VipBenefitController', 'getSubscriptionBenefitPkgJson'],
  ['GET', '/wscvis/knowledge/benefitPkgWithCount.json', 'knowledge.blocks.VipBenefitController', 'getBenefitPkgWithCountJson'],

  /**
   * Gift
   */
  ['GET', '/wscvis/knowledge/getGiftDetail.json', 'knowledge.blocks.GiftController', 'getGiftDetail'],
  ['GET', '/wscvis/knowledge/getGiftShareContent.json', 'knowledge.blocks.GiftController', 'getGiftShareContent'],
  ['GET', '/wscvis/knowledge/receive.json', 'knowledge.blocks.GiftController', 'receive'],
  ['GET', '/wscvis/knowledge/getGiftShareRankInfo.json', 'knowledge.blocks.GiftController', 'getGiftShareRankInfo'],
  ['GET', '/wscvis/knowledge/getShareAlias.json', 'knowledge.blocks.GiftController', 'getShareAlias'],

  /**
   * Groupon
   */
  ['GET', '/wscvis/knowledge/groupByAlias.json', 'knowledge.blocks.GrouponController', 'getGroupByAliasJson'],
  ['GET', '/wscvis/knowledge/goodsPromotion.json', 'knowledge.blocks.GrouponController', 'getGoodsPromotionJson'],

  /**
   * Activity
   */
  // 知识付费技改完成前用这个接口获取活动
  ['GET', '/wscvis/knowledge/activityInfos.json', 'knowledge.blocks.ActivityController', 'getActivityInfosJson'],
  // ['GET', '/wscvis/knowledge/getActivityInfos.json', 'knowledge.ActivityController', 'getActivityJson'],

  // 课程商品用新接口获取活动，待技改完成，全部转过来
  ['GET', '/wscvis/knowledge/newActivityInfos.json', 'knowledge.blocks.ActivityController', 'getNewActivityInfosJson'],

  /**
   * Salesman
   */
  // ['POST', '/wscvis/knowledge/distributor.json', 'knowledge.SalesmanController', 'postRegisterJson'],
  ['POST', '/wscvis/knowledge/distributor.json', 'knowledge.blocks.FxController', 'postDistributor'],
  ['POST', '/wscvis/knowledge/register.json', 'knowledge.SalesmanController', 'postRegisterJson'],

  /**
   * Comments
   */
  ['POST', '/wscvis/knowledge/comment/add.json', 'knowledge.blocks.CommentController', 'postAddJson'],
  ['POST', '/wscvis/knowledge/comment/delete.json', 'knowledge.blocks.CommentController', 'postDeleteJson'],
  ['GET', '/wscvis/knowledge/comment/list.json', 'knowledge.blocks.CommentController', 'getListJson'],
  ['GET', '/wscvis/knowledge/comment/userlist.json', 'knowledge.blocks.CommentController', 'getUserlistJson'],
  ['POST', '/wscvis/knowledge/comment/praise.json', 'knowledge.blocks.CommentController', 'postPraiseJson'],

  /**
   * goods recommends
   */
  ['GET', '/wscvis/knowledge/goodsrecommend/recommend.json', 'knowledge.blocks.GoodsRecommendController', 'findRecommend'],

  /**
  * 获取二维码
  */
  ['GET', '/wscvis/knowledge/qrcode.json', 'common.QRController', 'getQrcodeJson'],

  /**
   * 获取推荐有礼活动信息
   */
  ['GET', '/wscvis/knowledge/refferal.json', 'knowledge.blocks.RefferalController', 'getRefferalInfoJson'],
  ['GET', '/wscvis/knowledge/accountBussinessNumber.json', 'knowledge.blocks.RefferalController', 'getAccountBusinessNumberJson'],

  /**
   * 获取海报背景图
   */
  ['GET', '/wscvis/knowledge/getFindRelatedImg.json', 'knowledge.FxPosterController', 'getFindRelatedImgJson'],

  /**
   * 获取自定义海报背景图列表
   */
  ['GET', '/wscvis/knowledge/getPosterImgList.json', 'knowledge.FxPosterController', 'getPosterImgListJson'],

  /**
   * 工具接口
   */
  ['POST', '/wscvis/knowledge/utils/skynetlog.json', 'knowledge.UtilsController', 'postSkynetJson'],
  ['POST', '/wscvis/knowledge/utils/skynetErrorlog.json', 'knowledge.UtilsController', 'postSkynetErrorJson'],
  ['GET', '/wscvis/knowledge/utils/wxFollowStatus.json', 'knowledge.UtilsController', 'getWxFollowStatusJson'],

  /**
   * 我购买的课程
   */
  ['GET', '/wscvis/knowledge/mypay/checkExist.json', 'knowledge.MyPayController', 'checkExist'],

  /**
   * Index
   */
  ['GET', '/wscvis/knowledge/index', 'knowledge.IndexController', ['setUserPoints', 'getIndexHtml']], // get

  /** ********** 营销活动接口 *********** */
  /**
   * 拼团
   */
  // 获取单个团详情
  ['GET', '/wscvis/knowledge/getGrouponDetail.json', 'knowledge.blocks.GrouponController', 'getGrouponDetailJson'],
  // 获取某个团的参团成员列表
  ['GET', '/wscvis/knowledge/getGroupOnJoinRecordByPage.json', 'knowledge.blocks.GrouponController', 'getGroupOnJoinRecordByPageJson'],
  // 抽离分销员海报页面为单页面
  ['GET', '/wscvis/knowledge/invite-card', 'knowledge.IndexController', 'getInviteCardHtml'],
  // 抽离好友助力页面为单页面
  ['GET', '/wscvis/knowledge/support-invitation', 'ump.CollectZanController', 'getIndexHtml'],

  // 活动升级中间页，暂时用在好友助力活动中
  ['GET', '/wscvis/knowledge/activity-upgrading', 'knowledge.IndexController', 'getActivityUpgradingHtml'],

  // 已购专栏新接口
  ['GET', '/wscvis/knowledge/findSubsColumnList.json', 'knowledge.blocks.MyPayController', 'findSubsColumnList'],
  // 已购内容和直播新接口
  ['GET', '/wscvis/knowledge/findSubsContentAndLiveList.json', 'knowledge.blocks.MyPayController', 'findSubsContentAndLiveList'],
  // 已购会员权益
  ['GET', '/wscvis/knowledge/getVipUserAllBenefitPkg.json', 'knowledge.blocks.MyPayController', 'getVipUserAllBenefitPkg'],
  // h5端 已购内容新接口
  ['GET', '/wscvis/knowledge/user/contentList.json', 'knowledge.blocks.MyPayController', 'getContentList'],

  /**
   * Course
   * 教育商品详情页统一查询接口,内容 专栏 直播 线下课统一接口
   * TODO 过渡方案，@小瑞 重构后会替代掉此接口，完成所有详情页面及接口的统一
   */
  ['GET', '/wscvis/course/getDetail.json', 'knowledge.IndexController', 'getDetail'],
  ['GET', '/wscvis/course/getSimple.json', 'knowledge.IndexController', 'getSimple'],
];
