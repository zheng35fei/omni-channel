const prefix = '/manage/admin'
export default {
    login: prefix + '/login',
    checkCode: prefix + '/api/checkCode',
    // 菜单管理
    sysMenuList: prefix + '/sysMenu/getSysMenuList',
    menuList: prefix + '/sysMenu/grid',
    menuDel: prefix + '/sysMenu/delete/',
    menuToEdit: prefix + '/sysMenu/toEdit/',
    menuUpdate: prefix + '/sysMenu/update',
    menuSave: prefix + '/sysMenu/save',
    // 角色管理
    roleList: prefix + '/sysRole/grid',
    roleDel: prefix + '/sysRole/delete/',
    roleToEdit: prefix + '/sysRole/toEdit/',
    roleUpdate: prefix + '/sysRole/update',
    roleSave: prefix + '/sysRole/save',
    // 景区管理
    scenicList: prefix + '/scenicInfo/grid',
    scenicDel: prefix + '/scenicInfo/delete/',
    scenicToEdit: prefix + '/scenicInfo/toEdit/',
    scenicUpdate: prefix + '/scenicInfo/update/',
    scenicSave: prefix + '/scenicInfo/save/',
    scenicDetail: prefix + '/scenicInfo/getScenicDetail/',
    getAllScenicList: prefix + '/scenicInfo/getAllScenicList',
    // 用户管理
    userList: prefix + '/userInfo/grid',
    userDel: prefix + '/userInfo/delete/',
    userToEdit: prefix + '/userInfo/toEdit/',
    userUpdate: prefix + '/userInfo/update',
    userSave: prefix + '/userInfo/save',
    // 用户信息-重置密码
    resetUserPwd: prefix + '/userInfo/resetAccPass/',
    // 用户信息-启禁用设置
    setAccStatus: prefix + '/userInfo/setAccStatus',
    // 用户获取菜单列表树型
    getMenuTreeData: prefix + '/sysRole/getSysMenuTree/',
    getRolePlugs: prefix + '/sysRole/getSysRoleplugs/',
    setMenuToRole: prefix + '/sysRole/addSysMenuToRole/',
    // 图片上传
    imgUpload: prefix + '/SysPictureLib/save'
}