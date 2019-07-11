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
            <Button
                slot="menuLeft"
                @click="showModal"
                type="primary"
                icon="md-add"
                style="margin-bottom:10px;"
            >添加</Button>
        </gridTable>
        <confirm
            ref="confirmModel"
            :content="content"
            :sucessMsg="sucessMsg"
            :mode="mode"
            cbApiType="apiPostJson"
        ></confirm>
    </div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import { apiGet } from "@/fetch/api.js";
export default {
    data() {
        return {
            channelIds: [],
            columns: [
                {
                    title: "序号",
                    align: "center",
                    width: 60,
                    type: 'index_paging'
                },
                {
                    title: "分销商名称",
                    key: "distName",
                    align: "center",
                    search: true
                },
                {
                    title: "姓名",
                    key: "name",
                    align: "center",
                    search: true
                },
                {
                    title: "手机号",
                    key: "mobile",
                    align: "center",
                    search: true
                },
                {
                    title: "身份证",
                    key: "idCard",
                    align: "center",
                    search: true,
                    render: (h, params) => {
                        return [
                            h("img", {
                                attrs: {
                                    src: params.row.idCardPicUrl
                                },
                                style: {
                                    width: "50px",
                                    height: "50px"
                                }
                            })
                        ];
                    }
                },
                {
                    title: "导游证",
                    key: "touristCertPicUrl",
                    align: "center",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    padding: "10px"
                                }
                            },
                            [
                                h("img", {
                                    attrs: {
                                        src: params.row.touristCertPicUrl
                                    },
                                    style: {
                                        width: "50px",
                                        height: "50px"
                                    }
                                })
                            ]
                        );
                    }
                },
                {
                    title: "营运",
                    key: "tradeCardPicUrl",
                    align: "center",
                    render: (h, params) => {
                        return [
                            h("img", {
                                attrs: {
                                    src: params.row.tradeCardPicUrl
                                },
                                style: {
                                    width: "50px",
                                    height: "50px"
                                }
                            })
                        ];
                    }
                },
                {
                    title: '审核状态',
                    key: 'auditStatus',
                    // 审核状态（1:待审核;2:审核通过;3:审核驳回） 
                    dicData: [{
                        label: '待审核',
                        value: 1
                    },{
                        label: '审核通过',
                        value: 2
                    },{
                        label: '审核驳回',
                        value: 3
                    },]
                },
                {
                    title: "备注",
                    key: "remark",
                    align: "center"
                },
                {
                    title: "操作",
                    key: "action",
                    width: 280,
                    align: "center",
                    render: (h, params) => {
                        let actions = [
                            {
                                title: "查看详情",
                                action: () => {
                                    this.$router.push({
                                        path: "/addPromoter",
                                        query: { id: params.row.id }
                                    });
                                }
                            },
                            {
                                title: "删除",
                                action: () => {
                                    this.content = "确定删除？";
                                    this.mode = "done";
                                    this.sucessMsg = "删除成功！";
                                    this.$refs.confirmModel.confirm(
                                        this.baseinfoApi.promoterDel +
                                            params.row.id
                                    );
                                }
                            }
                        ];
                        
                        if(params.row.auditStatus < 2) {
                            actions = [{
                                title: "通过",
                                action: () => {
                                    this.actionPromoter("pass", params.row.id);
                                }
                            },
                            {
                                title: "驳回",
                                action: () => {
                                    this.actionPromoter(
                                        "denies",
                                        params.row.id
                                    );
                                }
                            }, ...actions]
                        }
                        return this.common.columnsHandle(h, actions);
                    }
                },
                {
                    title: "全部渠道",
                    key: "channelId",
                    type: 'select',
                    hide: true,
                    search: true,
                    dicUrl: this.baseinfoApi.channelList,
                    dicMethod: 'apiPostJson'
                },
            ],
            data: "",
            params: { page: 1, limit: 10},
            url: this.baseinfoApi.promoterList,
            content: "",
            mode: "",
            sucessMsg: ""
        };
    },
    mounted() {
        
    },
    components: { gridTable, confirm },
    computed: {
        selectedIds() {
            return this.$refs.gridTable.selection.map(item => item.id);
        }
    },
    methods: {
        // 添加推广员
        showModal() {
            this.$router.push("/addPromoter");
        },
        // 审核推广员
        actionPromoter(type, id) {
            const typeCode = type === "pass" ? 2 : 3;
            const typeText = type === "pass" ? "通过" : "驳回";
            this.$Modal.confirm({
                title: "确认",
                content: `确认要${typeText}吗？`,
                onOk: () => {
                    // 	2:审核通过;3:审核驳回
                    this.apiGet(
                        `${this.baseinfoApi.setPromoterStatus}${id}/${typeCode}`
                    )
                        .then(res => {
                            if (res.status === 200) {
                                this.$Message.success(res.message);
                                this.$refs.gridTable.loadpage("apiPostJson");
                            }
                        })
                        .catch(err => {
                            this.$Message.error(res.message);
                        });
                }
            });
        }
    }
};
</script>
