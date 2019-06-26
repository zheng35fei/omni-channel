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
                    render: (h, params) => {
                        return h("span", params.index + 1);
                    }
                },
                {
                    title: "内容名称",
                    key: "distName",
                    align: "center",
                    search: true
                },
                {
                    title: "内容类型",
                    key: "name",
                    align: "center"
                },
                {
                    title: "是否必填",
                    key: "mobile",
                    align: "center"
                },
                {
                    title: "备注",
                    key: "mobile",
                    align: "center"
                },
                {
                    title: "操作",
                    key: "action",
                    width: 280,
                    align: "center",
                    render: (h, params) => {
                        const actions = [
                            {
                                title: "修改",
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
