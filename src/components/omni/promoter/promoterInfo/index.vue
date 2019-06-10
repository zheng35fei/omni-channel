<template>
    <div>
        <Form :model="searchForm" rel="searchForm" inline :label-width="100">
            <Row>
                <Col :span="20">
                    <FormItem label="分销商名称：" prop="distName">
                        <Input v-model="searchForm.distName"/>
                    </FormItem>
                    <FormItem label="姓名：" prop="name">
                        <Input v-model="searchForm.name"/>
                    </FormItem>
                    <FormItem label="身份证：" prop="idCard">
                        <Input v-model="searchForm.idCard"/>
                    </FormItem>
                    <FormItem label="手机号：" prop="mobile">
                        <Input v-model="searchForm.mobile"/>
                    </FormItem>
                    <FormItem label="全部渠道：" prop="channelId">
                        <Select v-model="searchForm.channelId" style="width:160px">
                            <Option
                                v-for="item in channelIds"
                                :key="item.id"
                                :value="item.id"
                            >{{item.name}}</Option>
                        </Select>
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
        <confirm ref="confirmModel" :content="content" :sucessMsg="sucessMsg" :mode="mode" apiType="apiPostJson"></confirm>
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
                    align: "center",
                    render: (h, params) => {
                        return [
                            h("img", {
                                attrs: {
                                    src: params.row.idCardPicUrl
                                },
                                style: {
                                    width: "50px",
                                    height: "50px"
                                }
                            })
                        ];
                    }
                },
                {
                    title: "导游证",
                    key: "touristCertPicUrl",
                    align: "center",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    padding: "10px"
                                }
                            },
                            [
                                h("img", {
                                    attrs: {
                                        src: params.row.touristCertPicUrl
                                    },
                                    style: {
                                        width: "50px",
                                        height: "50px"
                                    }
                                })
                            ]
                        );
                    }
                },
                {
                    title: "营运",
                    key: "tradeCardPicUrl",
                    align: "center",
                    render: (h, params) => {
                        return [
                            h("img", {
                                attrs: {
                                    src: params.row.tradeCardPicUrl
                                },
                                style: {
                                    width: "50px",
                                    height: "50px"
                                }
                            })
                        ];
                    }
                },
                {
                    title: "审核状态",
                    key: "auditStatus",
                    align: "center",
                    render: (h, params) => {
                        return h(
                            "span",
                            this.filter.turn(
                                "auditStatus",
                                params.row.auditStatus
                            )
                        );
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
                                title: "通过",
                                action: () => {
                                    this.actionPromoter("pass", params.row.id);
                                }
                            },
                            {
                                title: "驳回",
                                action: () => {
                                    this.actionPromoter(
                                        "denies",
                                        params.row.id
                                    );
                                }
                            },
                            {
                                title: "查看详情",
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
                }
            ],
            data: "",
            params: { page: 1, limit: 10, sort: "createTime", order: "desc" },
            url: this.baseinfoApi.promoterList,
            content: "",
            mode: "",
            sucessMsg: ""
        };
    },
    mounted() {
        // 获取渠道列表
        this.getDistributorList();
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
        // 搜索查询
        searchTable() {
            this.params = Object.assign({}, this.params, this.searchForm);
            for (let key in this.params) {
                if (!this.params[key]) {
                    delete this.params[key];
                }
            }
            this.$store.state.list.params = this.params;
            this.$refs.gridTable.loadpage("apiPostJson");
        },
        getDistributorList() {
            const url = this.baseinfoApi.channelList;
            this.apiPost(url).then(res => {
                if (res.status === 200) {
                    this.channelIds = res.data.rows;
                }
            });
        },
        actionPromoter(type, id) {
            const typeCode = type === "pass" ? 2 : 3;
            const typeText = type === "pass" ? '通过' : '驳回';
            this.$Modal.confirm({
                title: "确认",
                content: `确认要${typeText}吗？`,
                onOk: () => {
                    // 	2:审核通过;3:审核驳回
                    this.apiGet(`${this.baseinfoApi.setPromoterStatus}${id}/${typeCode}`).then(res => {
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
