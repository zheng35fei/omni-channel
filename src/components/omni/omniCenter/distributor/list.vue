<template>
<div>
    <gridTable
        ref="gridTable"
        :columns="columns"
        :params="params"
        :data="data"
        :url="url"
        apiType="apiPostJson"
    ></gridTable>
</div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
export default {
    props: {
        channelId: {
            requied: true,
            type: [String, Number]
        }
    },
    data() {
        return {
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
                    title: "用户名",
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
                }
            ],
            data: "",
            params: { page: 1, limit: 10, sort: "createTime", order: "desc", channelId: this.channelId},
            url: this.baseinfoApi.distributorList,
            content: "",
            mode: "",
            sucessMsg: ""
        };
    },
    mounted() {},
    components: { gridTable, confirm },
    computed: {
        selectedIds() {
            return this.$refs.gridTable.selection.map(item => item.id);
        }
    },
    methods: {
        
    }
};
</script>
