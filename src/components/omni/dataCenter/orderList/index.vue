<template>
    <div>
        <gridTable
            ref="gridTable"
            :columns="columns"
            :params="params"
            :data="data"
            :url="url"
            apiType="apiPostJson"
        >
        </gridTable>
    </div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
export default {
    data() {
        return {
            showDisList: false,
            channelId: "",
            columns: [
                {
                    title: "序号",
                    align: "center",
                    width: 60,
                    fixed: 'left',
                    type:'index_paging'
                },
                {
                    title: "订单信息",
                    key: "proName",
                    align: "center",
                    width: 160
                },
                {
                    title: "所属渠道",
                    key: "channelName",
                    align: "center",
                    search: true,
                    type: 'select',
                    dicUrl: this.baseinfoApi.channelList,
                    dicMethod: 'apiPostJson',
                    width: 120
                },
                {
                    title: "分销商",
                    key: "distName",
                    align: "center",
                    search: true,
                    width: 150
                },
                {
                    title: "推广员",
                    key: "promoterName",
                    align: "center",
                    search: true,
                    width: 100
                },
                {
                    title: "订单类型",
                    key: "orderType",
                    align: "center",
                    width: 100,
                    type: 'select',
                    search: true,
                        // 1:门票.2:酒店 3:餐饮,4:套票 
                    dicData: [{
                        label: '全部',
                        value: ''
                    },{
                        label: '门票',
                        value: 1
                    },{
                        label: '酒店',
                        value: 2
                    },{
                        label: '餐饮',
                        value: 3
                    },{
                        label: '套票',
                        value: 4
                    }]
                },
                {
                    title: "订单号",
                    key: "orderNo",
                    align: "center",
                    width: 150
                },
                {
                    title: "订单金额",
                    key: "orderSum",
                    align: "center",
                    width: 100
                },
                {
                    title: "下单数量",
                    key: "proAmount",
                    align: "center",
                    width: 100
                },
                {
                    title: "有效数量",
                    key: "checkAmount",
                    align: "center",
                    width: 100
                },
                {
                    title: "检票状态",
                    key: "checkStatus",
                    align: "center",
                    width: 100,
                    // 1：未检，2：部分检，3：全检，4：过期
                    dicData: [{
                        label: '全部',
                        value: ''
                    },{
                        label: '未检',
                        value: '1'
                    },
                    {
                        label: '部分检',
                        value: '2'
                    },
                    {
                        label: '全检',
                        value: '3'
                    },{
                        label: '过期',
                        value: '4'
                    }]
                },
                {
                    title: "有效佣金",
                    key: "brokerageSum",
                    align: "center",
                    width: 100
                },
                {
                    title: "推广状态",
                    key: "promoteStatus",
                    align: "center",
                    width: 100,
                    search: true,
                    type: 'select',
                    // 1：待生效；2：已生效；3：已失效
                    dicData: [{
                        label: '全部',
                        value: ''
                    },{
                        label: '待生效',
                        value: 1
                    },
                    {
                        label: '已生效',
                        value: 2
                    },
                    {
                        label: '已失效',
                        value: 3
                    }]
                },
                {
                    title: "订单状态",
                    key: "orderStatus",
                    align: "center",
                    width: 100,
                    dicData: [{
                        label: '成功',
                        value: 1
                    }, {
                        label: '已退单',
                        value: 2
                    }],
                    fixed: 'right'
                },
                {
                    title: "下单时间",
                    key: "thirdPartyCreateTime",
                    align: "center",
                    search: true,
                    type: 'daterange',
                    format: 'yyyy-MM-dd HH:mm:ss',
                    // 搜索时用'beginDate', 'endDate'来替换key
                    searchParams: ['beginDate', 'endDate'],
                    width: 150
                }
            ],
            data: "",
            params: { page: 1, limit: 10 },
            url: this.orderApi.orderList,
            confirmObj: {
                content: "",
                mode: "",
                sucessMsg: "",
                apiType: "",
                method: "",
                cbApiType: ""
            }
        };
    },
    mounted() {
        
    },
    components: { gridTable },
    computed: {
        
    },
    methods: {
        
    }
};
</script>
