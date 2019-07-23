<template>
    <div>
        <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url">
            <Button slot="menuLeft" type="primary" @click="showModal">添加</Button>
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
                    title: "序号",
                    align: "center",
                    type:'index_paging'
                },
                {
                    title: "名称",
                    key: "funName",
                    search: true
                },
                {
                    title: "唯一编码",
                    key: "funCode",
                    search: true
                },
                {
                    title: "URL",
                    key: "funUrl",
                    width: 250,
                    search: true
                },
                {
                    title: "所属类型",
                    key: "funType",
                    width: 150,
                    render: (h, params) => {
                        let strArr = [];
                        this.splits(params.row.funType || "").forEach(item => {
                            strArr.push(this.filter.turn("funType", item));
                        });
                        return h("span", strArr.join(" "));
                    }
                },
                {
                    title: "标识",
                    key: "optType"
                },
                {
                    title: "排序",
                    key: "sortNo",
                    sortable: true
                },
                {
                    title: "权限类型",
                    key: "functionType",
                    render: (h, params) => {
                        return h(
                            "span",
                            this.filter.turn(
                                "functionType",
                                params.row.functionType
                            )
                        );
                    }
                },
                {
                    title: "层级深度",
                    key: "hierarchy",
                    render: (h, params) => {
                        return h(
                            "span",
                            this.filter.turn("hierarchy", params.row.hierarchy)
                        );
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
                                title: "添加",
                                action: () => {
                                    this.$router.push({
                                        path: "/addMenu",
                                        query: {
                                            parentId: params.row.id,
                                            parentHierarchy:
                                                params.row.hierarchy
                                        }
                                    });
                                }
                            },
                            {
                                title: "修改",
                                action: () => {
                                    this.$router.push({
                                        path: "/addMenu",
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
                                        this.adminApi.menuDel + params.row.id
                                    );
                                }
                            }
                        ];
                        if (params.row.hierarchy === 3) {
                            actions.splice(0, 1);
                        }
                        return this.common.columnsHandle(h, actions);
                    }
                }
            ],
            data: "",
            params: { page: 1, limit: 10},
            url: this.adminApi.menuList,
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
        splits(test) {
            return test.split(",");
        },

        showModal() {
            this.$router.push("/addMenu");
        }
    }
};
</script>
