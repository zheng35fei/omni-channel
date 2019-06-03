<template>
    <div>
        <Row :gutter="16" class="btn-groups">
            <Col span="2">
                <Button type="primary" @click="showModal">添加</Button>
            </Col>
        </Row>
        <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
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
                    render: (h, params) => {
                        return h("span", params.index + 1);
                    }
                },
                {
                    title: "景区名称",
                    key: "name"
                },
                {
                    title: "景区编码",
                    key: "scenicCode"
                },
                {
                    title: "联系人",
                    key: "linkName",
                    width: 250
                },
                {
                    title: "联系人电话",
                    key: "linkMobile"
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
                                        path: "/addScenic",
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
                                        "/apiBaseInfo/baseInfo/scenicInfo/delete/" + params.row.id
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
            params: { page: 1, limit: 10, sort: "createTime", order: "desc" },
            url: "/apiBaseInfo/baseInfo/scenicInfo/grid",
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
            this.$router.push("/addScenic");
        }
    }
};
</script>
