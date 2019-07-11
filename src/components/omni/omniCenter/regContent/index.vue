<template>
    <div>
        <Row :gutter="20">
            <Col :span="7">
                <gridTable
                    ref="gridTableChannel"
                    :columns="columnsChannel"
                    :params="paramsChannel"
                    :data="dataChannel"
                    :url="urlChannel"
                    apiType="apiPostJson"
                >
                </gridTable>
            </Col>
            <Col :span="17">
                <gridTable
                    ref="gridTable"
                    :columns="columns"
                    :params="params"
                    :data="data"
                    :url="url"
                    apiType="apiPostJson"
                >
                    <Button slot="menuRight" @click="showModal" type="primary" icon="md-add" style="margin-bottom: 25px">添加</Button>
                </gridTable>
            </Col>
        </Row>

        <confirm
            ref="confirmModel"
            :content="confirmObj.content"
            :sucessMsg="confirmObj.sucessMsg"
            :mode="confirmObj.mode"
            apiType="apiGet"
            cbApiType="apiPostJson"
        ></confirm>
    </div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
export default {
    data() {
        return {
            columnsChannel: [
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
                    title: "渠道名称",
                    key: "channelName",
                    align: "center",
                    search: true
                },
            ],
            dataChannel: '',
            paramsChannel: { page: 1, limit: 10 },
            urlChannel: '',
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
                    title: "内容名称",
                    key: "name",
                    align: "center"
                },
                {
                    title: "内容类型",
                    key: "linkName",
                    align: "center",
                },
                {
                    title: "备注说明",
                    key: "linkMobile",
                    align: "center",
                },
                {
                    title: "是否必填",
                    key: "linkName",
                    align: "center"
                },
                {
                    title: "操作",
                    key: "action",
                    width: 200,
                    align: "center",
                    render: (h, params) => {
                        const actions = [
                            {
                                title: "修改",
                                action: () => {
                                    this.$router.push({
                                        path: "/addDistributor",
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
                                        this.baseinfoApi.distributorDel +
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
            url: this.baseinfoApi.distributorList,
            confirmObj: {
                content: "",
                mode: "",
                sucessMsg: ""
            }
        };
    },
    mounted() {},
    components: { gridTable, confirm },
    computed: {
        selectedIds() {
            return this.$refs.gridTable.selection.map(item => item.id);
        }
    },
    methods: {
        // 添加用户
        showModal() {
            this.$router.push("/addDistributor");
        },
        // 搜索查询
        searchTable() {
            this.params = Object.assign({}, this.params, this.searchForm);
            for (let key in this.params) {
                if (!this.params[key]) {
                    delete this.params[key];
                }
            }
            this.$store.state.list.params = this.params;
            this.$refs.gridTable.loadpage();
        },
        enabledRow(val, row) {
            const statusName = val === "T" ? "启用" : "禁用";
            this.$Modal.confirm({
                title: "确认",
                content: `确认要${statusName}吗？`,
                onOk: () => {
                    this.apiGet(
                        `${this.baseinfoApi.setDistributorEnabled}${
                            row.id
                        }?enabled=${val}`
                    ).then(res => {
                        if (res.status === 200) {
                            this.$Message.success({
                                content: "状态修改成功!"
                            });
                            this.$refs.gridTable.loadpage("apiPostJson");
                        }
                    });
                },
                onCancel: () => {
                    row.enabled = val === "T" ? "F" : "T";
                }
            });
        }
    }
};
</script>
