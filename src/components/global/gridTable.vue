<template>
    <div class="grids" :style="{'padding-bottom':padding}">
        <search-form
            v-if="searchData && searchData.length > 0"
            :DIC="DIC"
            :searchData="searchData"
            :apiType="apiType"
            :rules="formRules"
            @search-submit="searchSubmit"
        >
            <slot name="searchFormItem" slot="searchFormItem"></slot>
        </search-form>
        <Row>
            <Col style="margin-bottom:10px;">
                <slot name="menuLeft"></slot>
            </Col>
        </Row>
        <Table
            stripe
            :columns="columnsFilter"
            :data="res.rows"
            :url="url"
            :loading="loading"
            @on-selection-change="changeSelection"
        ></Table>
        <Page
            v-if="params.limit!=-1"
            :total="res.total"
            class-name="pages"
            @on-change="changepage"
            @on-page-size-change="changesize"
            show-elevator
            show-sizer
        ></Page>
    </div>
</template>
<script>
import searchForm from "@/components/global/searchForm";
export default {
    data() {
        return {
            DIC: { },
            res: {},
            loading: true,
            padding: "30px",
            data: "",
            // params: Object.assign({page: 1, limit: 10, sort: 'createTime', order: 'desc'},this.$route.params),
            selection: []
        };
    },
    components: { searchForm },
    props: ["columns", "url", "params", "apiType"],
    created() {
        var agent = navigator.userAgent.toLowerCase();
        if (agent.indexOf("firefox") > 0) {
            this.padding = "50px";
        }
    },
    created() {
        this.getDicData();
    },
    mounted() {
        this.$store.state.list.url = this.url;
        this.$store.state.list.params = this.params;
        this.loadpage(this.apiType);
    },
    computed: {
        // 筛选需要搜索字段
        searchData() {
            return this.columns.filter(item => item.search);
        },
        // 筛选表格cloums
        columnsFilter() {
            return this.columns.filter(item => !Boolean(item.hide));
        },
        // 生成表单验证规则列表
        formRules() {
            let rules = {}
            this.columns.forEach( item => {
                if(item.rules) {
                    rules[item.key] = item.rules
                }
            });
            return rules 
        }
    },
    methods: {
        changepage(num) {
            this.$store.state.list.params.page = num;
            this.loadpage(this.apiType);
        },
        changesize(num) {
            this.$store.state.list.params.limit = num;
            this.loadpage(this.apiType);
        },
        changeSelection(selection) {
            this.selection = selection;
        },
        columnsHandle(h, actions) {
            let array = [];
            actions.forEach(element => {
                let obj = h(
                    "Button",
                    {
                        props: {
                            type: "text",
                            size: "small"
                        },
                        style: {
                            marginRight: "5px"
                        },
                        on: {
                            click: () => {
                                element.action();
                            }
                        }
                    },
                    element.title
                );
                array.push(obj);
            });
            return array;
        },
        async loadpage(apiType) {
            this.loading = true;
            let res = await this.$store.dispatch("postApi", apiType);
            if (res.status != 200) {
                this.$Message.warning(res.message);
            }
            this.res = res.data || res;
            this.loading = false;
        },
        // 传递搜索数据
        searchSubmit(searchForm) {
            this.$emit("search-submit", searchForm);
        },
        // 获取动态数据字典
        getDicData() {
            const dicList = this.columns.filter(item => item.dicUrl);
            dicList.forEach(item => {
                this[item.dicMethod || "apiPost"](item.dicUrl).then(res => {
                    if (res.status === 200) {
                        this.DIC[item.key] = res.data.rows.map( t => ({label: item.props ? t[item.props.label] : t['name'], value: item.props ? t[item.props.value] : t['id']}));
                    }
                });
            });
        }
    }
};
</script>

<style>
</style>


