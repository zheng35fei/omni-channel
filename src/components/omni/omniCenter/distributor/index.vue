<template>
    <div>
        <Row>
            <Col>
                <Form :model="searchForm" rel="searchForm" inline :label-width="90">
                    <FormItem label="分销商名称：" prop="name">
                        <Input v-model="searchForm.name"/>
                    </FormItem>
                    <FormItem label="联系人：" prop="linkMan">
                        <Input v-model="searchForm.linkMan"/>
                    </FormItem>
                    <FormItem label="手机号：" prop="linkMobile">
                        <Input v-model="searchForm.linkMobile"/>
                    </FormItem>
                    <FormItem label="渠道：" prop="channelId">
                        <Select v-model="searchForm.channelId" style="width:200px">
                            <Option
                                v-for="item in channelIds"
                                :value="item.value"
                                :key="item.value"
                            >{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem :label-width="0">
                        <Button type="primary" icon="md-search" @click="searchTable">搜索</Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>
        <Row style="margin-bottom:10px;">
            <Col>
                <Button @click="showModal" type="primary" icon="md-add">添加</Button>
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
            channelIds: [{ label: "aa", value: "0" }],
            searchForm: {
                name: "",
                linkMan: "",
                linkMobile: "",
                channelId: ""
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
                    title: "分销商名称",
                    key: "name",
                    align: "center"
                },
                {
                    title: "联系人",
                    key: "linkName",
                    align: "center"
                },
                {
                    title: "手机号",
                    key: "linkMobile",
                    sortable: true,
                    align: "center"
                },
                {
                    title: "登录用户名",
                    key: "loginName",
                    align: "center"
                },
                {
                    title: "渠道规则",
                    key: "channelId",
                    sortable: true,
                    width: 110,
                    align: "center"
                },
                {
                    title: "最后登录时间",
                    key: "modifyTime",
                    align: "center"
                },
                {
                    title: "协议有效期",
                    key: "validDate",
                    sortable: true,
                    align: "center"
                },
                {
                    title: "状态",
                    key: "enabled",
                    render: (h, params) => {
                        console.log(params.row.enabled)
                        return h(
                            "i-switch",
                            {
                                props: {
                                    'value': params.row.enabled,
                                    "true-value": "T",
                                    "false-value": "F"
                                },
                                on: {
                                    "on-change": val => {
                                        this.enabledRow(val, params.row)
                                    }
                                }
                            }
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
                                title: "修改",
                                action: () => {
                                    this.$router.push({
                                        path: "/addDistributor",
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
                                        "/baseInfo/distributor/delete/" +
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
            url: "/baseinfo/baseInfo/distributor/grid",
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
            this.$router.push("/addDistributor");
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
        enabledRow(val, row) {
            const statusName = val === 'T' ? '启用' : '禁用';
            this.$Modal.confirm({
                title: "确认",
                content: `确认要${statusName}吗？`,
                onOk: () => {
                    apiGet(`/baseinfo/baseInfo/distributor/setEnabled/${row.id}?enabled=${val}`).then( res => {
                        if (res.status === 200) {
                            this.$Message.success({
                                content: "状态修改成功!"
                            });
                            this.$refs.gridTable.loadpage('apiPostJson')
                        }
                    })
                },
                onCancel: () => {
                    row.enabled = val === 'T' ? 'F' : 'T'
                }
            });
        }
    }
};
</script>
