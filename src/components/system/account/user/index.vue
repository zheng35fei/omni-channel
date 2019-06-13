<template>
    <div>
        <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url">
            <Row slot="menuLeft">
                <Col>
                    <Button
                        @click="showModal"
                        type="primary"
                        icon="md-add"
                        style="margin-right:10px;"
                    >添加</Button>

                    <ButtonGroup>
                        <Button icon="md-play" type="primary" @click="setAccStatus('T')">启用</Button>
                        <Button icon="md-square" type="primary" @click="setAccStatus('F')">停用</Button>
                        <Button icon="md-trash" type="primary" @click="deleteRow">删除</Button>
                        <Button icon="md-refresh" type="primary" @click="resetPwd">密码重置</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </gridTable>
        <confirm ref="confirmModel" :content="content" :sucessMsg="sucessMsg" :mode="mode"></confirm>
    </div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import { apiGet, apiPost } from "@/fetch/api.js";
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
                    },
                    fixed: "left"
                },
                {
                    title: "登录用户名",
                    key: "accName",
                    align: "center",
                    search: true,
                    width: 100
                },
                {
                    title: "登录密码",
                    key: "accPass",
                    align: "center",
                    width: 180
                },
                {
                    title: "用户编号",
                    key: "accNo",
                    sortable: true,
                    align: "center",
                    width: 110
                },
                {
                    title: "真实姓名",
                    key: "realName",
                    align: "center",
                    search: true,
                    width: 100
                },
                {
                    title: "用户类型",
                    key: "accType",
                    sortable: true,
                    width: 110,
                    align: "center",
                    search: true,
                    type: 'select',
                    dicUrl: this.adminApi.roleList,
                    props: {
                        label: "roleName",
                        value: "id"
                    }
                },
                {
                    title: "用户状态",
                    key: "accStatus",
                    width: 90,
                    align: "center",
                    render: (h, params) => {
                        return h(
                            "span",
                            params.row.accStatus === "T" ? "正常" : "锁定"
                        );
                    }
                },
                {
                    title: "是否管理员",
                    key: "ifAdmin",
                    sortable: true,
                    width: 120,
                    align: "center",
                    render: (h, params) => {
                        return h(
                            "span",
                            params.row.ifAdmin === "T" ? "是" : "否"
                        );
                    }
                },
                {
                    title: "企业编码",
                    key: "corpCode",
                    width: 100
                },
                {
                    title: "登录时间",
                    key: "loginDate",
                    sortable: true,
                    width: 140
                },
                {
                    title: "角色类型",
                    key: "userType",
                    width: 120,
                    align: "center",
                    render: (h, params) => {
                        return h(
                            "span",
                            this.filter.turn("userType", params.row.userType)
                        );
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    width: 200,
                    align: "center",
                    fixed: "right",
                    render: (h, params) => {
                        const actions = [
                            {
                                title: "修改",
                                action: () => {
                                    this.$router.push({
                                        path: "/addUser",
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
                                        this.adminApi.userDel + params.row.id
                                    );
                                }
                            }
                        ];
                        return this.common.columnsHandle(h, actions);
                    }
                }
            ],
            data: "",
            params: { page: 1, limit: 10, sort: "createTime", order: "desc" },
            url: this.adminApi.userList,
            content: "",
            mode: "",
            sucessMsg: ""
        };
    },
    created() {
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
            this.$router.push("/addUser");
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
        // 开启 停用
        setAccStatus(status) {
            const statusName = status === "T" ? "启用" : "停用";
            if (
                !Array.isArray(this.selectedIds) ||
                this.selectedIds.length <= 0
            ) {
                this.$Message.warning({
                    content: `请选择${statusName}用户`
                });
                return;
            }
            this.$Modal.confirm({
                title: "确认",
                content: `确认要${statusName}${this.selectedIds}用户吗？`,
                onOk: () => {
                    apiGet(
                        `${this.adminApi.setAccStatus}${this.selectedIds.join(
                            ","
                        )}?accStatus=${status}`
                    ).then(res => {
                        if (res.success) {
                            this.$refs.gridTable.loadpage();
                            this.$Message.success({
                                content: "状态修改成功!"
                            });
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    });
                }
            });
        },
        // 删除
        deleteRow() {
            if (
                !Array.isArray(this.selectedIds) ||
                this.selectedIds.length <= 0
            ) {
                this.$Message.warning({
                    content: `请选择要删除的用户`
                });
                return;
            }
            this.$Modal.confirm({
                title: "确认",
                content: `确认要删除${this.selectedIds}用户吗？`,
                onOk: () => {
                    apiGet(
                        `${this.adminApi.userDel}${this.selectedIds.join(",")}`
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
        },
        // 重置密码
        resetPwd() {},
    }
};
</script>
