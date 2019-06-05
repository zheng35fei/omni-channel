<template>
    <div>
        <Row>
            <Col :span="12" align="left">
                <Form :model="searchForm" rel="searchForm" inline :label-width="80">
                    <FormItem label="渠道名称：" prop="accName">
                        <Input v-model="searchForm.name"/>
                    </FormItem>
                    <FormItem :label-width="0">
                        <Button type="primary" icon="md-search" @click="searchTable">搜索</Button>
                    </FormItem>
                </Form>
            </Col>
            <Col :span="12" align="right">
                <Button @click="showModal" type="primary" icon="md-add" style="margin-right:10px;">添加</Button>
            </Col>
        </Row>
        <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url" apiType="apiPostJson"></gridTable>
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
            searchForm: {
                accName: "",
                realName: ""
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
                    title: "渠道名称",
                    key: "name",
                    align: 'center',
                },
                {
                    title: "分销商数量",
                    key: "distAmount",
                    align: 'center',
                    width: 100
                },
                {
                    title: "备注",
                    key: "remark",
                    align: 'center'
                },
                {
                    title: "操作",
                    key: "action",
                    width: 400,
                    align: "center",
                    render: (h, params) => {
                        const actions = [
                            {
                                title: "添加渠道商",
                                action: () => {
                                    this.channelList('add', params.row.id);
                                }
                            },
                            {
                                title: "查看渠道商",
                                action: () => {
                                    this.channelList('view', params.row.id);
                                }
                            },
                            {
                                title: "修改",
                                action: () => {
                                    this.$router.push({
                                        path: "/addChannel",
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
                                        "/baseinfo/baseInfo/channel/delete/" + params.row.id
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
            url: "/baseinfo/baseInfo/channel/grid",
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
            return this.$refs.gridTable.selection.map( item => item.id)
        }
    },
    methods: {
        // 添加用户
        showModal() {
            this.$router.push("/addChannel");
        },
        // 搜索查询
        searchTable() {
            this.params = Object.assign({}, this.params, this.searchForm);
            for(let key in this.params) {
                if(!this.params[key]) {
                    delete this.params[key]
                }
            }
            this.$store.state.list.params = this.params;
            this.$refs.gridTable.loadpage()
        },
        
        // 重置密码
        resetPwd() {

        }
    }
};
</script>
