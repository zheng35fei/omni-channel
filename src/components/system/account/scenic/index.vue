<template>
    <div>
        <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url">
            <Button slot="menuLeft" type="primary" @click="showModal">添加</Button>
        </gridTable>
        <confirm ref="confirmModel" :content="content" :sucessMsg="sucessMsg" :mode="mode"></confirm>
        <Modal v-model="setDialog.isShow" :title="setDialog.title" :width="setDialog.width" @on-ok="setDialogDone">
            <Form v-model="scenicObj"></Form>
        </Modal>
    </div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import { apiGet } from "@/fetch/api.js"
export default {
    data() {
        return {
            scenicObj: {},
            setDialog: {
                isShow: false,
                title: '查看景区信息',
                width: 650
            },
            columns: [
                {
                    title: "序号",
                    align: "center",
                    render: (h, params) => {
                        return h("span", params.index + 1);
                    }
                },
                {
                    title: "景区名称",
                    key: "name",
                    search: true
                },
                {
                    title: "景区编码",
                    key: "scenicCode",
                    search: true
                },
                {
                    title: "联系人",
                    key: "linkName",
                    width: 250,
                    search: true
                },
                {
                    title: "联系人电话",
                    key: "linkMobile",
                    search: true
                },
                {
                    title: "操作",
                    key: "action",
                    width: 320,
                    align: "center",
                    render: (h, params) => {
                        const actions = [
                            {
                                title: "查看",
                                action: () => {
                                    this.viewScenic(params.row.id)
                                }
                            },
                            {
                                title: "用户管理",
                                action: () => {
                                    this.$router.push({
                                        path: "/user-list",
                                        query: { id: params.row.id }
                                    });
                                }
                            },
                            {
                                title: "修改",
                                action: () => {
                                    this.$router.push({
                                        path: "/addScenic",
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
                                        this.adminApi.scenicDel + params.row.id
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
            url: this.adminApi.scenicList,
            content: "",
            mode: "",
            sucessMsg: ""
        };
    },
    mounted() {
        // this.loadpage(this.params)
    },
    components: { gridTable, confirm },
    methods: {
        showModal() {
            this.$router.push("/addScenic");
        },
        // 查看景区信息
        viewScenic(id) {
            this.setDialog.isShow = true
            const url = `${this.adminApi.scenicDetail}${id}`;
            apiGet(url).then( res => {
                if(res.status === 200) {
                    this.scenicObj = res.data
                }else {
                    this.$Notice.error({
                        desc: res.message
                    })
                }
            })
        },
        // 关闭弹窗
        setDialogDone() {

        }
    }
};
</script>
