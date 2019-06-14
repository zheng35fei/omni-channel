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
import productList from "./productList.vue";
export default {
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
                    title: "产品名称",
                    key: "proName",
                    align: "center",
                },
                {
                    title: "渠道编码",
                    key: "modelCode",
                    align: "center",
                },
                {
                    title: "产品编码",
                    key: "proCode",
                    align: "center",
                },
                {
                    title: "状态",
                    key: "enabled",
                    align: "center",
                },
                {
                    title: "产品类型",
                    key: "proType",
                    align: "center",
                },
                {
                    title: "当日价格",
                    key: "price",
                    align: "center",
                },
            ],
            data: "",
            params: { page: 1, limit: 10 },
            url: this.baseinfoApi.productList,
            content: "",
            mode: "",
            sucessMsg: ""
        };
    },
    components: { gridTable },
    computed: {
        selectedIds() {
            return this.$refs.gridTable.selection.map(item => item.id);
        }
    },
    methods: {
        
    }
};
</script>
