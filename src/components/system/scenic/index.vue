<template>
    <div>
        <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url">
            <Button v-if="permission" slot="menuLeft" type="primary" @click="showModal">添加</Button>
        </gridTable>
        <confirm ref="confirmModel" :content="content" :sucessMsg="sucessMsg" :mode="mode"></confirm>
        <Modal
            v-model="setDialog.isShow"
            :title="setDialog.title"
            :width="setDialog.width"
            @on-ok="setDialogDone"
        >
            <div class="scenicDetail">
                <div style="width: 170px; height: 170px; margin:0 auto;">
                    <qr-code ref="qrCode" :value="scenicObj.wapUrl" :options="{ size: 170 }"></qr-code>
                </div>
                <div class="scenicAddr">
                    <p>地址: {{scenicObj.wapUrl}}
                    <Button type="text" v-clipboard:copy="scenicObj.wapUrl" v-clipboard:success="onCopy">复制地址</Button>
                    <a :href="codeUrl" :download="scenicObj.name">下载二维码</a></p> 
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import qrCode from "@xkeshi/vue-qrcode";
export default {
    data() {
        return {
            scenicObj: {},
            setDialog: {
                isShow: false,
                title: "查看景区信息",
                width: 650
            },
            columns: [
                {
                    title: "序号",
                    align: "center",
                    type:'index_paging',
                    width: 80
                },
                {
                    title: "景区名称",
                    key: "name",
                    search: true,
                    width: 160
                },
                {
                    title: "景区编码",
                    key: "scenicCode",
                    search: true,
                    width: 120
                },
                {
                    title: 'wap登录地址',
                    key: 'wapUrl',
                    width: 420
                },
                {
                    title: "联系人",
                    key: "linkName",
                    width: 100,
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
                                    this.viewScenic(params.row.id);
                                }
                            },
                            {
                                title: "用户管理",
                                action: () => {
                                    this.$router.push({
                                        path: "/user-list",
                                        query: { 
                                            id: params.row.id,
                                            scenicCode: params.row.scenicCode
                                        }
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
            params: { page: 1, limit: 10 },
            url: this.adminApi.scenicList,
            content: "",
            mode: "",
            sucessMsg: "",
            codeUrl: ""
        };
    },
    computed: {
        permission() {
            return this.$store.state.user.accType == '0'
        }
    },
    components: { gridTable, confirm, qrCode },
    methods: {
        showModal() {
            this.$router.push("/addScenic");
        },
        // 查看景区信息
        viewScenic(id) {
            this.setDialog.isShow = true;
            const url = `${this.adminApi.scenicDetail}${id}`;
            this.apiGet(url).then(res => {
                if (res.status === 200) {
                    this.scenicObj = res.data;
                    const canvasData = this.$refs.qrCode.$el;
                    this.codeUrl = canvasData.toDataURL() || '';
                } else {
                    this.$Notice.error({
                        desc: res.message
                    });
                }
            });
        },
        // 关闭弹窗
        setDialogDone() {},
        onCopy() {
            this.$Message.success("复制成功！");
        },
        onError() {
            this.$Message.error("复制失败！");
        },
    }
};
</script>
<style scoped>
.scenicQrCode {
    display: block;
    width: 140px;
    height: 140px;
    margin: 0 auto 15px;
}
.scenicAddr {
    margin: 15px 20px 0;
    font-size: 16px;
    text-align: center;
}
.scenicAddr p {
    font-size: 14px;
    text-align: center;
}
</style>
