<template>
    <div>
        <Row :gutter="16" class="btn-groups">
            <Col span="2">
                <Button type="primary" @click="showModal">添加</Button>
            </Col>
        </Row>
        <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
        <confirm ref="confirmModel" :content="content" :sucessMsg="sucessMsg" :mode="mode"></confirm>
        <Modal v-model="setDialog.isShow" :title="setDialog.title" :width="setDialog.width" @on-ok="setAuthDone">
            <Tree :data="authData"></Tree>
        </Modal>
    </div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
export default {
    data() {
        return {
            authData: [],
            setDialog: {
                isShow: false,
                title: '设置',
                width: 650
            },
            columns: [
                {
                    title: "序号",
                    align: "center",
                    width: 80,
                    render: (h, params) => {
                        return h("span", params.index + 1);
                    }
                },
                {
                    title: "景区Id",
                    key: "scenicId",
                    width: 100
                },
                {
                    title: "角色名称",
                    key: "roleName",
                    width: 350
                },
                {
                    title: "备注",
                    key: "remark"
                },
                {
                    title: "操作",
                    key: "action",
                    width: 300,
                    align: "center",
                    render: (h, params) => {
                        const actions = [
                            {
                                title: "设置",
                                action: () => {
                                    this.setRoleAuth()
                                }
                            },
                            {
                                title: "修改",
                                action: () => {
                                    this.$router.push({
                                        path: "/addRole",
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
                                        this.adminApi.roleDel + params.row.id
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
            url: this.adminApi.roleList,
            content: "",
            mode: "",
            sucessMsg: ""
        };
    },
    mounted() {
        // this.loadpage(this.params)
    },
    components: { gridTable, confirm },
    methods: {
        showModal() {
            this.$router.push("/addRole");
        },
        // 设置角色权限
        setRoleAuth() {
            this.setDialog.isShow = true;
        },
        // 关闭设置界面
        setAuthDone() {
            this.setDialog.isShow = false;
        }
    }
};
</script>
