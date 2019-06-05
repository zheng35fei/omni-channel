<template>
    <div>
        <Form :model="searchForm" rel="searchForm" inline :label-width="100">
            <Row>
                <Col :span="20">
                    <FormItem label="分销商名称：" prop="accName">
                        <Input v-model="searchForm.name"/>
                    </FormItem>
                    <FormItem label="姓名：" prop="accName">
                        <Input v-model="searchForm.name"/>
                    </FormItem>
                    <FormItem label="身份证：" prop="accName">
                        <Input v-model="searchForm.name"/>
                    </FormItem>
                    <FormItem label="手机号：" prop="accName">
                        <Input v-model="searchForm.name"/>
                    </FormItem>
                    <FormItem label="全部渠道：" prop="accName">
                        <Select v-model="searchForm.name" style="width:160px"/>
                    </FormItem>
                </Col>
                <Col :span="4">
                    <FormItem :label-width="0">
                        <Button type="primary" icon="md-search" @click="searchTable">搜索</Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <Row>
            <Col>
                <Button
                    @click="showModal"
                    type="primary"
                    icon="md-add"
                    style="margin-bottom:10px;"
                >添加</Button>
            </Col>
        </Row>
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
                    title: "分销商名称",
                    key: "distName",
                    align: "center"
                },
                {
                    title: "姓名",
                    key: "name",
                    align: "center"
                },
                {
                    title: "手机号",
                    key: "mobile",
                    align: "center"
                },
                {
                    title: "身份证",
                    key: "idCard",
                    align: "center"
                },
                {
                    title: "导游证",
                    key: "touristCertPicUrl",
                    align: "center"
                },
                {
                    title: "营运",
                    key: "tradeCardPicUrl",
                    align: "center"
                },
                {
                    title: "审核状态",
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
                                title: "通过",
                                action: () => {
                                    this.channelList("add", params.row.id);
                                }
                            },
                            {
                                title: "驳回",
                                action: () => {
                                    this.channelList("view", params.row.id);
                                }
                            },
                            {
                                title: "查看详情",
                                action: () => {
                                    this.$router.push({
                                        path: "/viewPromoter",
                                        query: { id: params.row.id }
                                    });
                                }
                            }
                        ];
                        return this.common.columnsHandle(h, actions);
                    }
                }
            ],
            data: "",
            params: { page: 1, limit: 10, sort: "createTime", order: "desc" },
            url: "/baseinfo/baseInfo/promoter/grid",
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
        // 添加用户
        showModal() {
            this.$router.push("/addChannel");
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

        // 重置密码
        resetPwd() {}
    }
};
</script>
