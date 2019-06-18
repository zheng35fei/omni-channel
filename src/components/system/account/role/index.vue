<template>
    <div>
        <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url">
            <Button slot="menuLeft" type="primary" @click="showModal">添加</Button>
        </gridTable>
        <confirm ref="confirmModel" :content="content" :sucessMsg="sucessMsg" :mode="mode"></confirm>
        <Modal v-model="setDialog.isShow" :title="setDialog.title" :width="setDialog.width" @on-ok="setAuthDone">
            <Tree ref="menuTree" :data="authTreeData" show-checkbox multiple children-key="childList"></Tree>
        </Modal>
    </div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import { mapState } from 'vuex';
export default {
    data() {
        return {
            authData: [],
            setDialog: {
                isShow: false,
                title: '设置',
                width: 650
            },
            columns: [
                {
                    title: "序号",
                    align: "center",
                    width: 80,
                    render: (h, params) => {
                        return h("span", params.index + 1);
                    }
                },
                {
                    title: "角色名称",
                    align: "center",
                    key: "roleName",
                    search: true,
                    width: 350
                },
                {
                    title: "备注",
                    align: "center",
                    key: "remark"
                },
                {
                    title: "操作",
                    key: "action",
                    width: 300,
                    align: "center",
                    render: (h, params) => {
                        const actions = [
                            {
                                title: "设置",
                                action: () => {
                                    this.setRoleAuth(params.row.id)
                                }
                            },
                            {
                                title: "修改",
                                action: () => {
                                    this.$router.push({
                                        path: "/addRole",
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
                                        this.adminApi.roleDel + params.row.id
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
            url: this.adminApi.roleList,
            content: "",
            mode: "",
            sucessMsg: ""
        };
    },
    mounted() {},
    computed: {
        authTreeData() {
            this.modifyTree(this.authData)
            return this.authData
        },
        ...mapState({
            userId: 'userId'
        })
    },
    components: { gridTable, confirm },
    methods: {
        modifyTree(data) {
            data.forEach( item => {
                item.title = item.funName
                item.expand = true
                if(item.childList && item.childList.length > 0) {
                    // tree组件, checked会选中下面的所有子节点
                    item.checked = false
                    this.modifyTree(item.childList)
                }
            })
        },
        showModal() {
            this.$router.push("/addRole");
        },
        // 设置角色权限
        setRoleAuth(id) {
            this.setRowId = id;
            const url = this.adminApi.getMenuTreeData + id
            this.apiGet(url).then( res => {
                if(res.status === 200) {
                    this.authData = res.data
                }
            })
            this.setDialog.isShow = true;
        },
        // 保存权限设置
        setAuthDone() {
            const checkIds = this.$refs.menuTree.getCheckedAndIndeterminateNodes().map( item => {
                return item.id
            }).join(',')
            
            const url = this.adminApi.setMenuToRole + this.setRowId + '/' + checkIds;
            this.apiPostJson(url).then( res => {
                console.log(res)
                this.$Message.success({
                    title: '成功',
                    content: res.message
                })
            })
            this.setDialog.isShow = false;
        }
    }
};
</script>
