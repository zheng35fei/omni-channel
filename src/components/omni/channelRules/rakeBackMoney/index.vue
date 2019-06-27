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
                    @click="showModal"
                    type="primary"
                    icon="md-add"
                    style="margin-bottom:10px;"
                >添加</Button>
                <Button
                    @click="delSelect"
                    type="primary"
                    icon="md-delete"
                    style="margin-bottom:10px;"
                >批量删除</Button>
            </template>
        </gridTable>
        <confirm
            ref="confirmModel"
            :content="content"
            :sucessMsg="sucessMsg"
            :mode="mode"
            cbApiType="apiPostJson"
        ></confirm>

        <Modal
            v-model="modal.isShowProduct"
            :title="modal.title"
            :width="modal.width"
            @on-ok="checkProList"
        >
            <product-list ref="proList" v-if="modal.isShowProduct"></product-list>
        </Modal>
    </div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import productList from "./productList.vue";
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
                    type: "select",
                    dicData: [
                        {
                            label: "全部",
                            value: ""
                        },
                        {
                            label: "启用",
                            value: "T"
                        },
                        {
                            label: "禁用",
                            value: "F"
                        }
                    ]
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
                        return h("Input", {
                            props: {
                                prefix: "logo-yen",
                                icon: "md-checkmark"
                            },
                            attrs: {
                                value: params.row.brokerageSum
                            },
                            on: {
                                "on-click": dom => {
                                    const val =
                                        dom.target.parentNode.childNodes[6]
                                            .value;
                                    this.setRebackMoney(val, params.row.id);
                                }
                            }
                        });
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
                                title: "禁用",
                                action: () => {
                                    this.content = "确定禁用？";
                                    this.mode = "done";
                                    this.sucessMsg = "已禁用！";
                                    this.$refs.confirmModel.confirm(
                                        this.baseinfoApi.brokerageRuleListDel +
                                            params.row.id
                                    );
                                }
                            },
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
            sucessMsg: "",
            modal: {
                isShowProduct: false,
                title: "添加",
                width: 1000
            }
        };
    },
    components: { gridTable, confirm, productList },
    computed: {
        selectedIds() {
            return this.$refs.gridTable.selection.map(item => item.id);
        },
        rebackId() {
            return this.$route.query && this.$route.query.brokerageRuleId;
        }
    },
    created() {
        this.$store.state.list.searchParams = this.$route.query;
    },
    methods: {
        // 添加
        showModal() {
            this.modal.isShowProduct = true;
        },
        // 批量删除
        delSelect() {
            if(!this.selectedIds || this.selectedIds.length <= 0){
                this.$Message.warning('请选择删除产品')
                return
            }
            this.$Modal.confirm({
                title: "确认",
                content: `确认要删除所选商品吗？`,
                onOk: () => {
                    this.apiGet(
                        `${
                            this.baseinfoApi.brokerageRuleListDel
                        }${this.selectedIds.join(",")}`
                    )
                        .then(res => {
                            if (res.status === 200 || res.success) {
                                this.$Notice.success({
                                    desc: "删除成功!"
                                });
                                this.$refs.gridTable.loadpage("apiPostJson");
                            }
                        })
                        .catch(err => {
                            this.$Notice.error({
                                desc: err.response.data.message
                            });
                        });
                }
            });
        },
        // 添加选中产品
        checkProList() {
            console.log(this.$refs.proList.$refs.gridTable.selection);
            const ids = this.$refs.proList.$refs.gridTable.selection.map(
                t => t.id
            );
            const url =
                this.baseinfoApi.brokerageRuleListSave +
                this.rebackId +
                "/" +
                ids;
            this.apiPost(url).then(res => {
                console.log(res);
                this.$store.state.list.url = this.url;
                this.$refs.gridTable.loadpage("apiPostJson");
            });
        },
        // 设置返佣金额
        setRebackMoney(price, id) {
            const url = this.baseinfoApi.brokerageSumtUpdate + id + "/" + price;
            this.apiGet(url)
                .then(res => {
                    if (res.status === 200 || res.success) {
                        this.$Notice.success({
                            desc: "设置返佣金额成功"
                        });
                    } else {
                        this.$Notice.error({
                            desc: res.message
                        });
                    }
                })
                .catch(err => {
                    this.$Notice.error({
                        desc: err.message
                    });
                });
        }
    }
};
</script>
