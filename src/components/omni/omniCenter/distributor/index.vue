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
            <Button slot="menuLeft" @click="showModal" type="primary" icon="md-add">添加</Button>
        </gridTable>
        <confirm
            ref="confirmModel"
            :content="content"
            :sucessMsg="sucessMsg"
            :mode="mode"
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
            channelIds: [],
            searchForm: {
                name: "",
                linkMan: "",
                linkMobile: "",
                channelId: ""
            },
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
                    title: "分销商名称",
                    key: "name",
                    align: "center",
                    search: true
                },
                {
                    title: "联系人",
                    key: "linkName",
                    align: "center",
                    search: true
                },
                {
                    title: "手机号",
                    key: "linkMobile",
                    sortable: true,
                    align: "center",
                    search: true,
                    rules: [{ type: 'number', required: true, message: "请输入正确的手机号", trigger: "blur" }]
                },
                {
                    title: "登录用户名",
                    key: "accName",
                    align: "center"
                },
                {
                    title: "渠道规则",
                    key: "channelId",
                    sortable: true,
                    width: 110,
                    align: "center",
                    search: true,
                    type: "select",
                    dicUrl: this.baseinfoApi.channelList,
                    dicMethod: "apiPostJson",
                    rules: [{ type: 'number', required: true, message: "请输入正确的手机号", trigger: "blur" }]
                },
                {
                    title: "最后登录时间",
                    key: "modifyTime",
                    align: "center"
                },
                {
                    title: "协议有效期",
                    key: "validDate",
                    sortable: true,
                    align: "center"
                },
                {
                    title: "状态",
                    key: "enabled",
                    render: (h, params) => {
                        return h("i-switch", {
                            props: {
                                value: params.row.enabled,
                                "true-value": "T",
                                "false-value": "F"
                            },
                            on: {
                                "on-change": val => {
                                    this.enabledRow(val, params.row);
                                }
                            }
                        });
                    }
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
            content: "",
            mode: "",
            sucessMsg: ""
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
