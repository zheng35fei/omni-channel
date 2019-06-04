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
            channelIds: [{label: 'aa', value: '0'}],
            searchForm: {
                name: "",
                linkMan: "",
                linkMobile: "",
                channelId: ""
            },
            columns: [
                {
                    type: 'selection',
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
                    align: 'center',
                },
                {
                    title: "联系人",
                    key: "linkName",
                    align: 'center',
                },
                {
                    title: "手机号",
                    key: "linkMobile",
                    sortable: true,
                    align: 'center',
                },
                {
                    title: "用户名",
                    key: "userName",
                    align: 'center',
                },
                {
                    title: "渠道规则",
                    key: "channelId",
                    sortable: true,
                    width: 110,
                    align: 'center'
                },
                {
                    title: "最后登录时间",
                    key: "modifyTime",
                    align: 'center'
                },
                {
                    title: "协议有效期",
                    key: "createTime",
                    sortable: true,
                    align: 'center'
                },
                {
                    title: "状态",
                    key: "corpCode",
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
                                        path: "/addUser",
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
                                        "/userInfo/delete/" + params.row.id
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
            url: "/baseInfo/distributor/grid",
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
            this.$router.push("/addUser");
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
        // 开启 停用
        setAccStatus(status) {
            const statusName = status === 'T' ? '启用' : '停用';
            if(!Array.isArray(this.selectedIds) || this.selectedIds.length <= 0) {
                this.$Message.warning({
                    content: `请选择${statusName}用户`
                })
                return 
            }
            this.$Modal.confirm({
                title: '确认',
                content: `确认要${statusName}${this.selectedIds}用户吗？`,
                onOk: () => {
                    apiGet(`/userInfo/setAccStatus/${this.selectedIds.join(',')}?accStatus=${status}`).then( res => {
                        if(res.success) {
                            this.$refs.gridTable.loadpage()
                            this.$Message.success({
                                content: '状态修改成功!'
                            })
                        }else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
                }
            })
        },
        // 删除
        deleteRow() {
            if(!Array.isArray(this.selectedIds) || this.selectedIds.length <= 0) {
                this.$Message.warning({
                    content: `请选择要删除的用户`
                })
                return 
            }
            this.$Modal.confirm({
                title: '确认',
                content: `确认要删除${this.selectedIds}用户吗？`,
                onOk: () => {
                    apiGet(`/userInfo/delete/${this.selectedIds.join(',')}`).then( res => {
                        if(res.success) {
                            this.$Notice.success({
                                content: '删除成功!'
                            })
                            this.$refs.gridTable.loadpage()
                        }else {
                            this.$Notice.error({
                                content: res.message
                            })
                        }
                    })
                }
            })
        },
        // 重置密码
        resetPwd() {

        }
    }
};
</script>
