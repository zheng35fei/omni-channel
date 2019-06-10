<template>
    <div>
        <Form :model="searchForm" rel="searchForm" inline :label-width="80">
            <Row>
                <Col :span="20">
                    <FormItem label="产品名称：" prop="productName">
                        <Input v-model="searchForm.productName"/>
                    </FormItem>
                    <FormItem label="渠道编码：" prop="channelCode">
                        <Input v-model="searchForm.channelCode"/>
                    </FormItem>
                    <FormItem label="门票编码：" prop="ticketCode">
                        <Input v-model="searchForm.ticketCode"/>
                    </FormItem>
                    <FormItem label="状态：" prop="status">
                        <Select v-model="searchForm.status">
                            <!-- <Option :value=""></Option> -->
                        </Select>
                    </FormItem>
                    <FormItem :label-width="0">
                        <Button type="primary" icon="md-search" @click="searchTable">搜索</Button>
                    </FormItem>
                </Col>
                <Col :span="4" align="right">
                <Button
                        @click="delSelect"
                        type="primary"
                        icon="md-add"
                        style="margin-bottom:10px;"
                    >批量删除</Button>
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
export default {
    data() {
        return {
            channelIds:[],
            searchForm: {
                name: ""
            },
            columns: [
                {
                    type: "selection",
                    title: "序号",
                    align: "center",
                    width: 60,
                    render: (h, params) => {
                        return h("span", params.index + 1);
                    }
                },
                {
                    title: "产品名称",
                    key: "productName",
                    align: "center"
                },
                {
                    title: "渠道编码",
                    key: "channelCode",
                    align: "center"
                },
                {
                    title: "门票编码",
                    key: "ticketCode",
                    align: "center"
                },
                {
                    title: "状态",
                    key: "productNum",
                    align: "center"
                },
                {
                    title: "当日价格",
                    key: "productNum",
                    align: "center"
                },
                {
                    title: "返佣金额",
                    key: "brokerageSum",
                    align: "center",
                    render: (h, params) => {
                        return h('Input', {
                            
                        }, params.row.brokerageSum)
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    width: 280,
                    align: "center",
                    render: (h, params) => {
                        const actions = [
                            {
                                title: "删除",
                                action: () => {
                                    this.content = "确定删除？";
                                    this.mode = "done";
                                    this.sucessMsg = "删除成功！";
                                    this.$refs.confirmModel.confirm(
                                        this.baseinfoApi.brokerageRuleListDel +
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
            url: this.baseinfoApi.brokerageRuleProductList,
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
        // 添加
        showModal() {
            
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
        // 批量删除
        delSelect() {
            console.log(

                this.$refs.gridTable.selection.map( item => item.id).join(',')
            )

            this.$Modal.confirm({
                title: "确认",
                content: `确认要删除所选商品吗？`,
                onOk: () => {
                    apiGet(
                        `${this.baseinfoApi.brokerageRuleListDel}${this.selectedIds.join(",")}`
                    ).then(res => {
                        if (res.success) {
                            this.$Notice.success({
                                content: "删除成功!"
                            });
                            this.$refs.gridTable.loadpage();
                        } else {
                            this.$Notice.error({
                                content: res.message
                            });
                        }
                    });
                }
            });
        }
    }
};
</script>
