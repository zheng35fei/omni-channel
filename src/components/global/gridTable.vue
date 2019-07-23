<template>
    <div class="grids">
        <search-form
            v-if="search || (searchData && searchData.length > 0)"
            :DIC="DIC"
            :searchData="searchData"
            :apiType="apiType"
            :rules="formRules"
            @search-submit="searchSubmit"
            @reset-search="resetSearch"
        >
            <template v-slot:searchFormItem="{ searchForm }">
                <slot name="searchFormItem" v-bind:searchForm="searchForm"></slot>
            </template>
        </search-form>
        <Row type="flex" justify="space-between" style="margin-bottom:10px;">
            <Col>
                <slot name="menuLeft"></slot>
            </Col>
            <Col>
                <slot name="menuRight"></slot>
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
import * as fetch from '../../fetch/api'
import qs from 'qs';
import searchForm from "@/components/global/searchForm";
export default {
    data() {
        return {
            DIC: {},
            res: {},
            loading: true,
            padding: "30px",
            data: "",
            // params: Object.assign({page: 1, limit: 10, sort: 'createTime', order: 'desc'},this.$route.params),
            selection: [],
            searchParams: this.customParams
        };
    },
    components: { searchForm },
    props: {
        // 列表列配置参数
        columns: {
            type: Array,
            default: []
        },
        // 列表接口地址
        url: {
            type: String
        },
        // 列表查询参数 如分页
        params: {
            type: Object
        },
        // 自定义请求方式
        apiType: {
            type: String
        },
        // 页面列表自定义查询参数
        customParams: {
            default: () => { return {}},
            type: Object
        },
        search: {
            default: false,
            type: Boolean
        }
    },
    created() {
        var agent = navigator.userAgent.toLowerCase();
        if (agent.indexOf("firefox") > 0) {
            this.padding = "50px";
        }
    },
    created() {
        this.getDicData();
        this.loadpage();
    },
    computed: {
        // 筛选需要搜索字段
        searchData() {
            return this.columns.filter(item => item.search);
        },
        // 筛选表格cloums
        columnsFilter() {
            return this.columns
                .filter(item => !Boolean(item.hide)) // 隐藏栏目
                .map(item => this.renderTd(item));  // 渲染静态字典
        },
        // 生成表单验证规则列表
        formRules() {
            let rules = {};
            this.columns.forEach(item => {
                if (item.rules) {
                    rules[item.key] = item.rules;
                }
            });
            return rules;
        }
    },
    methods: {
        // 静态数据字典渲染
        renderTd(item) {
            if(item.type === 'index_paging') {
                item.render = (h, params) => {
                    return h("span", (this.params.page - 1) * this.params.limit + params.index + 1);
                }
            }
            if (item.dicData) {
                item.render = (h, params) => {
                    let arr = [];
                    arr = item.dicData
                        .map(t => t.value === params.row[item.key] && t.label)
                        .filter(t => !!t);
                    return h("div", arr.join(" "));
                };
            }
            return item;
        },
        // 动态数据字典渲染
        renderTdUrl(item) {
            return (h, params) => {
                let arr = [];
                arr =
                    this.DIC &&
                    Object.entries(this.DIC[item.key]).map(t => {
                        if ("" + t[1].value == params.row[item.key]) {
                            return t[1].label;
                        }
                    });
                if(arr.filter(item => Boolean(item)).length) {
                    return h("div", arr.join(" "));
                }else {
                    return h("div", params.row[item.key]);
                }
            };
        },
        changepage(num) {
            this.params.page = num;
            this.loadpage();
        },
        changesize(num) {
            this.params.limit = num;
            this.loadpage();
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
        loadpage() {
            this.loading = true;
            const url = this.url + '?' + qs.stringify(this.params)
            fetch[this.apiType || 'apiPostJson'](url, this.searchParams).then( res => {
                if (res.status != 200) {
                    this.$Message.warning(res.message);
                    return
                }
                this.res = res.data || res;
            }).catch( err => {
                this.$Message.error(err)
            }).then( () => {
                this.loading = false;
            })
        },
        // 传递搜索数据
        searchSubmit(searchForm) {
            this.searchParams = Object.assign({}, this.customParams, searchForm)
            this.loadpage()
        },
        resetSearch() {
            this.searchParams = Object.assign({}, this.customParams);
            this.loadpage()
        },
        // 获取动态数据字典
        getDicData() {
            this.columns.forEach((item, index) => {
                if (!item.dicUrl) return;
                this[item.dicMethod || "apiPost"](
                    item.dicUrl,
                    item.dicParams || {}
                ).then(res => {
                    if (res.status === 200) {
                        this.DIC[item.key] = res.data.rows.map(t => ({
                            label: item.props ? t[item.props.label] : t["name"],
                            value: item.props ? t[item.props.value] : t["id"]
                        }));
                        this.$set(item, "render", this.renderTdUrl(item));
                    }
                });
            });
        }
    }
};
</script>

<style>
</style>


