const { pick, set, get } = require('lodash');

/**
 * 老版本转换权限树的逻辑
 *
 * @deprecated 已经废弃
 * @param {Array} menu - SAM 返回的菜单结构
 * @return {Object} 处理好的权限树
 */
const filter = (menu = []) => {
  let permission = {};
  /**
  * menu为四层结构，此处定义的
  * firstLevel 对应为第一层导航
  * secondLevel 对应为第二层导航
  * thirdLevel 对应为第三层导航或查看权限点
  * fourthLevel 对应的具体权限点，比如编辑
  */

  // 这里要不断维护，如果有新增的权限点，需要在这里面加，目前小程序用到的权限点有
  // Permission: {}
  // 课表权限 - 排课查看权限 教务 -> 排课 -> 排课 schedule: { watch: true }
  // 签到权限 - 排课编辑权限 教务 -> 排课 -> 排课 -> 编辑 schedule: { edit: true }

  // 工作台 - 我的线索查看权限 招生 -> 我的线索 -> 查看【不设权限】
  // 查看课表 - 班级查看权限 教务 -> 排课 -> 排课 schedule: { watch: true }
  // 办理试听 - 预约管理编辑权限 教务 -> 预约管理 -> 预约管理 -> 编辑 appointment: { edit: true }
  // 创建线索 - 我的线索编辑权限 招生 -> 我的线索 -> 查看 -> 编辑 clue: { edit: true }
  // 线索列表- 我的线索查看权限 招生 -> 我的线索 -> 查看 clue: { watch: true }
  // 转让 - 我的线索转让权限 招生 -> 我的线索 -> 查看 -> 转让 clue: { transfer: true }
  // 放弃 - 我的线索放弃权限 招生 -> 我的线索 -> 查看 -> 放弃 clue: { giveup: true }

  set(permission, 'schedule.watch', hasPermission(menu, ['教务', '课程表', '排课'])); // 是否具备排课查看权限
  set(permission, 'schedule.edit', hasPermission(menu, ['教务', '课程表', '排课', '编辑'])); // 是否具备排课编辑权限
  set(permission, 'appointment.enrollment', hasPermission(menu, ['教务', '预约', '预约管理', '预约管理/办理报名'])); // 是否具备预约管理编辑权限
  set(permission, 'appointment.cancel', hasPermission(menu, ['教务', '预约', '预约管理', '取消预约'])); // 是否具备预约管理编辑权限
  set(permission, 'appointment.confirm', hasPermission(menu, ['教务', '预约', '预约管理', '新建、修改、确认预约'])); // 是否具备预约管理编辑权限
  set(permission, 'clue.edit', hasPermission(menu, ['学员', '我的线索', '查看', '编辑'])); // 是否具备我的线索编辑权限
  set(permission, 'clue.watch', hasPermission(menu, ['学员', '我的线索', '查看'])); // 是否具备我的线索查看权限
  set(permission, 'clue.transfer', hasPermission(menu, ['学员', '我的线索', '查看', '转让'])); // 是否具备我的线索转让权限
  set(permission, 'clue.giveup', hasPermission(menu, ['学员', '我的线索', '查看', '放弃'])); // 是否具备我的线索放弃权限

  return permission;
};

const hasPermission = (menu = [], permissionPointList = []) => {
  let bool = false;
  menu.map(firstLevel => {
    if (firstLevel.name === permissionPointList[0]) {
      firstLevel.subMenusTreeVOs.map(secondLevel => {
        if (secondLevel.name === permissionPointList[1]) {
          secondLevel.subMenusTreeVOs.map(thirdLevel => {
            if (thirdLevel.name === permissionPointList[2]) {
              if (permissionPointList.length === 3) { // 如果只需要校验第三级，比如查看权限
                bool = thirdLevel.accessible;
                return bool;
              } else if (permissionPointList.length === 4) { // 如果需要校验第四级，比如编辑权限
                thirdLevel.subMenusTreeVOs.map(fourthLevel => {
                  if (fourthLevel.name === permissionPointList[3]) {
                    bool = fourthLevel.accessible;
                    return bool;
                  }
                });
              }
            }
          });
        }
      });
    }
  });

  return bool;
};

const rigAdapterHelper = (menu = []) => {
  if (!Array.isArray(menu) || menu.length === 0) {
    return null;
  }

  return menu.reduce((table, menuItem) => {
    const { name = '', children = [] } = menuItem;
    menuItem.children = rigAdapterHelper(children);
    table[name] = pick(menuItem, 'name', 'accessible', 'children');
    return table;
  },
  {}
  );
};

/** 将 rig 菜单结构转成方便 C 端读取的结构
 * 由原来的平铺结构 [ { name: 'menuA', children: [ { name: 'menuB', children: [] } ] } ]
 * 转成嵌套结构 { name: 'menuA', children: { menuB: { { name: 'menuB', children: null} }  } }
 *
 * @param {Array} menu - 原始 rig 返回的数组
 * @return {Object} 处理好的对象
 */
const rigAdapter = (menu = []) => {
  return {
    name: 'eduWeappPermissions',
    children: rigAdapterHelper(menu)
  };
};

/**
 * 老逻辑适配新的结构
 * 目前处理的比较恶心，在 Rig 全量后后会立即下掉
 *
 * @param {Array} menu - SAM 返回的菜单结构
 * @return {Object} 处理好的权限树
 */
const samAdapter = (menu = []) => {
  const permission = filter(menu);
  return {
    'name': 'eduWeappPermissions',
    'children': {
      '线索-我的线索': {
        'name': '线索-我的线索',
        'accessible': true,
        'children': {
          '查看': {
            'name': '查看',
            'accessible': get(permission, 'clue.watch', false),
            'children': null
          },
          '编辑': {
            'name': '编辑',
            'accessible': get(permission, 'clue.edit', false),
            'children': null
          },
          '转让': {
            'name': '转让',
            'accessible': get(permission, 'clue.transfer', false),
            'children': null
          },
          '放弃': {
            'name': '放弃',
            'accessible': get(permission, 'clue.giveup', false),
            'children': null
          }
        }
      },
      '教务-排课': {
        'name': '教务-排课',
        'accessible': true,
        'children': {
          '查看': {
            'name': '查看',
            'accessible': get(permission, 'schedule.watch', false),
            'children': null
          },
          '编辑': {
            'name': '编辑',
            'accessible': get(permission, 'schedule.edit', false),
            'children': null
          }
        }
      },
      '教务-预约管理': {
        'name': '教务-预约管理',
        'accessible': true,
        'children': {
          '查看': {
            'name': '查看',
            'accessible': get(permission, 'appointment.enrollment', false),
            'children': null
          },
          '取消预约': {
            'name': '取消预约',
            'accessible': get(permission, 'appointment.cancel', false),
            'children': null
          },
          '新建、修改、确认预约': {
            'name': '新建、修改、确认预约',
            'accessible': get(permission, 'appointment.confirm', false),
            'children': null
          }
        }
      }
    }
  };
};

module.exports = {
  samAdapter,
  rigAdapter,
};
