<template>
    <div>
        <Form :model="searchForm" rel="searchForm" inline :label-width="80">
            <Row>
                <Col :span="20">
                    <FormItem label="规则名称：" prop="name">
                        <Input v-model="searchForm.name"/>
                    </FormItem>
                    <FormItem :label-width="0">
                        <Button type="primary" icon="md-search" @click="searchTable">搜索</Button>
                    </FormItem>
                </Col>
                <Col :span="4" align="right">
                    <Button
                        @click="showModal"
                        type="primary"
                        icon="md-add"
                        style="margin-bottom:10px;"
                    >添加</Button>
                </Col>
            </Row>
        </Form>
        <gridTable
            ref="gridTable"
            :columns="columns"
            :params="params"
            :data="data"
            :url="url"
            apiType="apiPostJson"
        ></gridTable>
        <confirm ref="confirmModel" :content="content" :sucessMsg="sucessMsg" :mode="mode"></confirm>
    </div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import { apiGet } from "@/fetch/api.js";
export default {
    data() {
        return {
            channelIds:[],
            searchForm: {
                name: ""
            },
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
                    title: "规则名称",
                    key: "name",
                    align: "center"
                },
                {
                    title: "推广模式",
                    key: "promoteWay",
                    align: "center"
                },
                {
                    title: "用户关联方式",
                    key: "relevanceWay",
                    align: "center"
                },
                {
                    title: "屏蔽时间",
                    key: "blockingTime",
                    align: "center"
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
    }
};
</script>
