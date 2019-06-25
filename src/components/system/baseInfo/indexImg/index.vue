<template>
    <div>
        <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url">
            <Button slot="menuLeft" type="primary" @click="showModal">添加</Button>
        </gridTable>
    </div>
</template>

<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
export default {
    components: { gridTable, confirm },
    data() {
        return {
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
                    title: "栏目名称",
                    align: "center",
                    key: "roleName",
                    search: true,
                    width: 350
                },
                {
                    title: "图片地址",
                    align: "center",
                    key: "remark"
                },
                {
                    title: "备注",
                    align: "center",
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
        }
    },
    methods: {
        showModal() {
            this.$router.push("/indexImg/add");
        },
    }
}
</script>