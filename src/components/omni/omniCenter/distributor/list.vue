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
                    title: "序号",
                    align: "center",
                    width: 60,
                    type: 'index_paging'
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
                    key: "accName",
                    align: "center"
                },
                {
                    title: "渠道规则",
                    key: "channelRuleName",
                    sortable: true,
                    width: 110,
                    align: "center"
                },
                {
                    title: "最后登录时间",
                    key: "lastLoginTime",
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
            params: { page: 1, limit: 10, sort: "createTime", order: "desc"},
            url: this.baseinfoApi.distributorList,
            content: "",
            mode: "",
            sucessMsg: ""
        };
    },
    components: { gridTable },
    created() {
        this.$store.state.list.searchParams = {channelId: this.channelId}
    }
};
</script>
