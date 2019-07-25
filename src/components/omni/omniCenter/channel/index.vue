<template>
    <div>
        <gridTable
            ref="gridTable"
            :columns="columns"
            :params="params"
            :data="data"
            :url="url"
            apiType="apiPostJson"
        >
            <Button
                slot="menuLeft"
                @click="showModal"
                type="primary"
                icon="md-add"
                style="margin-right:10px;"
            >添加</Button>
        </gridTable>

        <confirm
            ref="confirmModel"
            :content="confirmObj.content"
            :sucessMsg="confirmObj.sucessMsg"
            :mode="confirmObj.mode"
            :apiType="confirmObj.apiType"
            :method="confirmObj.method"
            :cbApiType="confirmObj.cbApiType"
        ></confirm>

        <Modal title="分销商" v-model="showDisList" scrollable width="960px" @on-ok="selectDone">
            <distributor-list v-if="showDisList" ref="distributorTable" :channelId="channelId"></distributor-list>
        </Modal>
    </div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import distributorList from "./../distributor/list";
export default {
    data() {
        return {
            showDisList: false,
            channelId: "",
            columns: [
                {
                    title: "序号",
                    align: "center",
                    width: 60,
                    type: 'index_paging'
                },
                {
                    title: "渠道名称",
                    key: "name",
                    align: "center",
                    search: true
                },
                {
                    title: "分销商数量",
                    key: "distAmount",
                    align: "center",
                    width: 100
                },
                {
                    title: "备注",
                    key: "remark",
                    align: "center"
                },
                {
                    title: "操作",
                    key: "action",
                    width: 400,
                    align: "center",
                    render: (h, params) => {
                        const actions = [
                            {
                                title: "查看分销商",
                                action: () => {
                                    this.showChannelList("view", params.row.id);
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
                                    this.confirmObj.content = "确定删除？";
                                    this.confirmObj.mode = "done";
                                    this.confirmObj.sucessMsg = "删除成功！";
                                    this.confirmObj.apiType = "apiConfig";
                                    this.confirmObj.method = "put";
                                    this.confirmObj.cbApiType = "apiPostJson";
                                    this.$refs.confirmModel.confirm(
                                        this.baseinfoApi.channelDel +
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
            url: this.baseinfoApi.channelList,
            confirmObj: {
                content: "",
                mode: "",
                sucessMsg: "",
                apiType: "",
                method: "",
                cbApiType: ""
            }
        };
    },
    mounted() {
        // this.loadpage(this.params)
    },
    watch: {
        showDisList: function(val) {
            if(!val) {
                this.$store.state.list.searchParams = {}
            }
        }
    },
    components: { gridTable, confirm, distributorList },
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
        // 查看、添加渠道商
        showChannelList(status, id) {
            this.showDisList = true;
            this.channelId = id;
        },
        // 选择分销商
        selectDone() {
            const ids = this.$refs.distributorTable.selectedIds;
            this.showDisList = false;
        }
    }
};
</script>
