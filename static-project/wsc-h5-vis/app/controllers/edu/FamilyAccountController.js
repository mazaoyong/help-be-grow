const EduBaseController = require('./EduBaseController');
const FamilyAccountService = require('../../services/owl/client/edu/family/FamilyAccountFacade');
const StudentService = require('../../services/owl/client/edu/student/StudentFacade');
const ShopFacade = require('../../services/owl/pc/shop/ShopFacade');

// 家庭账号
class FamilyAccountController extends EduBaseController {
  // 家庭账号主页
  async getFamilyAccountIndex(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    await ctx.render('edu/family-account.html');
  }

  // 邀请主页
  async getFamilyAccountInviteIndex(ctx) {
    await this.initGlobalTheme();
    await ctx.render('edu/family-account-invite.html');
  }

  // 接受邀请
  async confirm(ctx) {
    // invitedUserId被邀请者的userid
    const { kdtId = 0, buyerId: invitedUserId = 0 } = ctx;
    // userId是邀请者的userid
    const { inviteCode = '', userId = 0 } = ctx.getPostData();
    const result = await new FamilyAccountService(ctx).confirm(
      kdtId,
      {
        invitedUserId,
        inviteCode,
        userId,
      }
    );
    ctx.json(0, 'ok', result);
  }

  // 获取学员列表
  async findSimpleByUserId(ctx) {
    const { kdtId = 0 } = ctx;
    // userId是邀请者的id, size为空默认获取全部
    const { size, userId = 0 } = ctx.query;
    const result = await new StudentService(ctx).findSimpleByUserId(
      kdtId,
      {
        size,
        userId,
      }
    );
    ctx.json(0, 'ok', result);
  }

  // 发起邀请
  async invite(ctx) {
    const { kdtId = 0, buyerId: userId = 0 } = ctx;
    const { invitedMember = {}, role } = ctx.getPostData();
    const result = await new FamilyAccountService(ctx).invite(
      kdtId,
      {
        invitedMember,
        role,
        userId,
      },
    );
    ctx.json(0, 'ok', result);
  }

  // 邀请主页信息
  async getInvitationInfo(ctx) {
    const { kdtId = 0 } = ctx;
    // studentSize为空默认获取全部
    const { inviteCode = '', studentSize, userId = 0 } = ctx.query;
    const result = await new FamilyAccountService(ctx).getInvitationInfo(
      kdtId,
      {
        inviteCode,
        studentSize,
        userId,
      }
    );
    ctx.json(0, 'ok', result);
  }

  // 获取公众号信息
  async getMpAccountV2(ctx) {
    const { kdtId = 0, buyerId: userId = 0 } = ctx;
    // userId是被邀请者的id
    const { inviteCode = '' } = ctx.query;
    const result = await new FamilyAccountService(ctx).getMpAccount(
      kdtId,
      {
        userId,
        inviteCode,
      }
    );
    ctx.json(0, 'ok', result);
  }

  // 获取邀请链接倒计时
  async getInvitationByCode(ctx) {
    const { kdtId = 0 } = ctx;
    const { code = '' } = ctx.query;
    const result = await new FamilyAccountService(ctx).getInvitationByCode(
      kdtId,
      code,
    );
    ctx.json(0, 'ok', result);
  }

  // 查询当前用户的家庭账号信息
  async getAccount(ctx) {
    const { kdtId = 0, buyerId: userId = 0 } = ctx;
    const result = await new FamilyAccountService(ctx).getAccount(
      kdtId,
      {
        userId,
      }
    );
    ctx.json(0, 'ok', result);
  }

  // 取消邀请家庭成员
  async cancel(ctx) {
    const { kdtId, buyerId: userId } = ctx;
    const { inviteCode } = ctx.getPostData();
    const result = await new FamilyAccountService(ctx).cancel(
      kdtId,
      {
        inviteCode,
        userId,
      }
    );
    ctx.json(0, 'ok', result);
  }

  // 移除家庭成员
  async remove(ctx) {
    const { kdtId, buyerId: userId } = ctx;
    const { removeUserId, role } = ctx.getPostData();
    const result = await new FamilyAccountService(ctx).remove(
      kdtId,
      {
        removeUserId,
        role,
        userId,
      }
    );
    ctx.json(0, 'ok', result);
  }

  // 获取店铺名称
  async getShopName(ctx) {
    const { kdtId = 0 } = ctx;
    const result = await new ShopFacade(ctx).getShopName(
      kdtId,
    );
    ctx.json(0, 'ok', result);
  }

  // 获取邀请状态信息
  async getInviteState(ctx) {
    const { kdtId = 0, buyerId: userId } = ctx;
    const { inviteCode = '' } = ctx.query;
    const result = await new FamilyAccountService(ctx).getInviteState(
      kdtId,
      userId,
      inviteCode,
    );
    ctx.json(0, 'ok', result);
  }
}

module.exports = FamilyAccountController;
