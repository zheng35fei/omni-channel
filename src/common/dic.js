// 数据字典
let dic = {
  //商户类型
  merchantType: [
    {label: '个人商户', value: 100},
    {label: '企业商户', value: 200}
  ],
  status: [
    {label:"不可用",value:0},
    {label:"可用",value:1},
  ],
  // channelType: [
  //   {label:"银行",value:0},
  //   {label:"支付公司",value:1},
  //   {label:"其他",value:2},
  // ],
  signStatus: [
    {label:"已解约",value:0},
    {label:"已签约",value:1},
  ],
  feeType:[
    {label:"按交易笔数（元/笔）",value:0},
    {label:"按交易金额（%）",value:1},
  ],
  funType: [
    {
      label: '系统管理员',
      value: 'superAdmin'
    },
    {
      label: '景区管理员',
      value: 'parkAdmin'
    },
    {
      label: '分销商',
      value: 'dist'
    },
    {
      label: '推广员',
      value: 'extension'
    },
  ],
  functionType: [
    {
      label: '菜单',
      value: 'menu'
    },{
      label: '栏目',
      value: 'column'
    },{
      label: '按钮',
      value: 'button'
    },
  ],
  hierarchy: [
    {
      label: '一级菜单',
      value: '0'
    },{
      label: '二级菜单',
      value: '1'
    },{
      label: '三级菜单',
      value: '2'
    },{
      label: '四级菜单',
      value: '3'
    }
  ],
  accType: [
    {
      label: '系统管理',
      value: '0'
    },
    {
      label: '企业管理员',
      value: '1'
    },
    {
      label: '分销商',
      value: '3'
    }
  ],
  userType: [
    {
      label: '操作员',
      value: 0
    },
    {
      label: '操作员',
      value: 1
    },
    {
      label: '售票员',
      value: 2
    }
  ],
  auditStatus: [
    {
      label: '待审核',
      value: 1
    },
    {
      label: '审核通过',
      value: 2
    },
    {
      label: '审核驳回',
      value: 3
    }
  ]
}
export default dic
