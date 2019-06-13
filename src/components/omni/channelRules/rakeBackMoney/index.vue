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
            <template slot="menuLeft">
                <Button
                        @click="delSelect"
                        type="primary"
                        icon="md-add"
                        style="margin-bottom:10px;"
                    >批量删除</Button>
                    <Button
                        @click="showModal"
                        type="primary"
                        icon="md-add"
                        style="margin-bottom:10px;"
                    >添加</Button>
            </template>
        </gridTable>
        <confirm ref="confirmModel" :content="content" :sucessMsg="sucessMsg" :mode="mode"></confirm>
    </div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
export default {
    data() {
        return {
            columns: [
                {
                    type: "selection",
                    title: "序号",
                    align: "center",
                    width: 60,
                    render: (h, params) => {
                        return h("span", params.index + 1);
                    }
                },
                {
                    title: "产品名称",
                    key: "productName",
                    align: "center",
                    search: true
                },
                {
                    title: "渠道编码",
                    key: "channelCode",
                    align: "center",
                    search: true
                },
                {
                    title: "产品编码",
                    key: "proCode",
                    align: "center",
                    search: true
                },
                {
                    title: "状态",
                    key: "proEnabled",
                    align: "center",
                    search: true,
                    type: 'select',
                    dicData: [{
                        label: '全部',
                        value: ''
                    },{
                        label: '启用',
                        value: 'T'
                    },{
                        label: '禁用',
                        value: 'F'
                    }]
                },
                {
                    title: "当日价格",
                    key: "proPrice",
                    align: "center"
                },
                {
                    title: "返佣金额",
                    key: "brokerageSum",
                    align: "center",
                    render: (h, params) => {
                        return h('Input', {
                            props: {
                                prefix:"logo-yen"
                            },
                            attrs: {
                                value: params.row.brokerageSum
                            }
                        })
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    width: 280,
                    align: "center",
                    render: (h, params) => {
                        const actions = [
                            {
                                title: "删除",
                                action: () => {
                                    this.content = "确定删除？";
                                    this.mode = "done";
                                    this.sucessMsg = "删除成功！";
                                    this.$refs.confirmModel.confirm(
                                        this.baseinfoApi.brokerageRuleListDel +
                                            params.row.id
                                    );
                                }
                            }
                        ];
                        return this.common.columnsHandle(h, actions);
                    }
                }
            ],
            data: "",
            params: { page: 1, limit: 10 },
            url: this.baseinfoApi.brokerageRuleProductList,
            content: "",
            mode: "",
            sucessMsg: ""
        };
    },
    components: { gridTable, confirm },
    computed: {
        selectedIds() {
            return this.$refs.gridTable.selection.map(item => item.id);
        }
    },
    methods: {
        // 添加
        showModal() {
            
        },
        // 批量删除
        delSelect() {
            console.log(

                this.$refs.gridTable.selection.map( item => item.id).join(',')
            )

            this.$Modal.confirm({
                title: "确认",
                content: `确认要删除所选商品吗？`,
                onOk: () => {
                    apiGet(
                        `${this.baseinfoApi.brokerageRuleListDel}${this.selectedIds.join(",")}`
                    ).then(res => {
                        if (res.success) {
                            this.$Notice.success({
                                content: "删除成功!"
                            });
                            this.$refs.gridTable.loadpage();
                        } else {
                            this.$Notice.error({
                                content: res.message
                            });
                        }
                    });
                }
            });
        }
    }
};
</script>
