const prefix = '/manage/baseinfo';
export default {
    // 分销商管理
    distributorList: prefix + '/distributor/grid',
    distributorSave: prefix + '/distributor/save',
    distributorUpdate: prefix + '/distributor/update',
    distributorDel: prefix + '/distributor/delete/',
    distributorToEdit: prefix + '/distributor/toEdit/',
    distributorDetail: prefix + '/distributor/getDistributorDetail/',
    distributorAllList: prefix + '/distributor/getDistributorList',
    setDistributorEnabled: prefix + '/distributor/setEnabled/',
    // 渠道管理
    channelList: prefix + '/channel/grid',
    channelSave: prefix + '/channel/save',
    channelUpdate: prefix + '/channel/update',
    channelDel: prefix + '/channel/delete/',
    channelToEdit: prefix + '/channel/toEdit/',
    channelDetail: prefix + '/channel/getChannelDetail/',
    channelAllList: prefix + '/channel/getDistributorList/',
    // 推广员
    promoterList: prefix + '/promoter/grid',
    promoterSave: prefix + '/promoter/save',
    promoterUpdate: prefix + '/promoter/update',
    promoterDel: prefix + '/promoter/delete/',
    promoterToEdit: prefix + '/promoter/toEdit/',
    // /{id}/{auditStatus} id:推广员ID, auditStatus: 审核结果
    setPromoterStatus: prefix + '/promoter/audit/',
    // 当前景区下所有渠道
    getChannel: prefix + '/promoter/getChannel',
    // 渠道限制规则
    channelRuleList: prefix + '/channelRule/grid',
    channelRuleSave: prefix + '/channelRule/save',
    channelRuleUpdate: prefix + '/channelRule/update',
    channelRuleDel: prefix + '/channelRule/delete/',
    channelRuleToEdit: prefix + '/channelRule/toEdit/',
    // 渠道返佣规则
    brokerageRuleList: prefix + '/brokerageRule/grid',
    brokerageRuleSave: prefix + '/brokerageRule/save',
    brokerageRuleUpdate: prefix + '/brokerageRule/update',
    brokerageRuleDel: prefix + '/brokerageRule/delete/',
    brokerageRuleToEdit: prefix + '/brokerageRule/toEdit/',
    // brokerage-rule-list-controller : 渠道返佣规则明细:返佣规则下属产品的返佣设置
    brokerageRuleProductList: prefix + '/brokerageRuleList/grid',
    brokerageRuleListDel: prefix + '/brokerageRuleList/delete/',
    // POST /brokerageRuleList/save/{brokerageRuleId}/{productIds}
    brokerageRuleListSave: prefix + '/brokerageRuleList/save/',
    // GET /brokerageRuleList/updateBrokerageSum/{id}/{brokerageSum}
    brokerageSumtUpdate: prefix + '/brokerageRuleList/updateBrokerageSum/',
    // GET /brokerageRuleList/enable/{id}/{enable}
    brokerageEnable: prefix + '/brokerageRuleList/enable/',
    // 产品列表
    productList: prefix + '/productInfo/grid'
}