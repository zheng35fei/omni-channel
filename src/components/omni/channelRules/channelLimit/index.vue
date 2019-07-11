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
            <Button slot="menuLeft" @click="showModal" type="primary" icon="md-add" style="margin-bottom:10px;">添加</Button>
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
                    type:'index_paging'
                },
                {
                    title: "规则名称",
                    key: "name",
                    align: "center",
                    search: true
                },
                {
                    title: "推广模式",
                    key: "promoteWay",
                    align: "center",
                    search: true,
                    type: 'select',
                    dicData: [{label: '普通模式', value: 0}, {label: '队列模式', value: 1}],
                    render: (h, params) => {
                        return h("span", this.filter.turn("promoteWay", params.row.promoteWay));
                    }
                },
                {
                    title: "用户关联方式",
                    key: "relevanceWay",
                    align: "center",
                    render: (h, params) => {
                        return h("span", this.filter.turn("relevanceWay", params.row.relevanceWay));
                    }
                },
                {
                    title: "是否屏蔽时间",
                    key: "blockingTime",
                    align: "center",
                    render: (h, params) => {
                        return h("span", this.filter.turn("blockingTime", params.row.blockingTime));
                    }
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
                        const actions = [
                            {
                                title: "修改",
                                action: () => {
                                    this.$router.push({
                                        path: "/addChannelLimit",
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
                                        this.baseinfoApi.channelRuleDel +
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
            params: { page: 1, limit: 10, sort: "createTime", order: "desc" },
            url: this.baseinfoApi.channelRuleList,
            content: "",
            mode: "",
            sucessMsg: ""
        };
    },
    mounted() {
        // this.loadpage(this.params)
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
            this.$router.push("/addChannelLimit");
        }
    }
};
</script>
