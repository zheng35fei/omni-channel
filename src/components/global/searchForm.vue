<template>
    <Form ref="formInline" :model="searchForm" inline>
        <FormItem v-for="(item,index) in searchData" :prop="item.key" :key="index">
            <Input
                v-if="!item.type || item.type=='input'"
                v-model="searchForm[item.key]"
                :placeholder="'请输入'+item.title"
                clearable
            />
            <DatePicker
                v-if="item.type === 'date'"
                type="date"
                :placeholder="'请选择'+item.title"
                v-model="searchForm[item.key]"
                @on-change="searchForm[item.key] = $event"
                format="yyyy-MM-dd"
                clearable
            ></DatePicker>
            <DatePicker
                v-if="item.type === 'daterange'"
                type="daterange"
                :placeholder="'请选择'+item.title"
                @on-change="val => dateSelect(val, item)"
                :format="item.format || 'yyyy-MM-dd'"
                clearable
            ></DatePicker>
            
            <Select
                v-if="item.type=='select'"
                v-model="searchForm[item.key]"
                :style="{'min-width': (item.minWidth || 160) + 'px'}"
                :placeholder="'请选择'+item.title"
            >
                <Option
                    v-for="sitem in item.dicUrl ? DIC && (DIC[item.key] || []) : item.dicData"
                    :value="sitem.value"
                    :key="sitem.value"
                >{{ sitem.label }}</Option>
            </Select>
        </FormItem>
    
        <!-- 列表自定义搜索 -->
        <!-- <template v-slot:searchFormItem="{ searchForm }">
            <FormItem>
                <Input type="text" v-model="searchForm.custom" placeholder="自定义搜索" clearable />
            </FormItem> 
        </template> -->

        <slot name="searchFormItem" v-bind:searchForm="searchForm"></slot>
        <Button type="primary" icon="ios-search" @click="handleSubmit('formInline')">搜索</Button>
        <Button icon="md-refresh" @click="handleReset('formInline')">重置</Button>
        <slot name="btn"></slot>
        <!-- <FormItem>
        <Button type="success" @click="handleSubmit()">导出</Button>
        </FormItem>-->
    </Form>
</template>
<script>
export default {
    data() {
        return {
            searchForm: {}
        };
    },
    props: ["searchData", "apiType", "DIC", "rules"],
    mounted() {
        this.searchData.map(ele => {
            if (ele.today) {
                this.searchForm[ele.name] = ele.today ? ele.today : "";
            }
        });
    },
    computed: {},
    methods: {
        dateSelect(val, item) {
            if(item.searchParams && Array.isArray(item.searchParams) && item.searchParams.length > 0) {
                item.searchParams.forEach( (param, index) => {
                    this.searchForm[param] = val && Array.isArray(val) ? val[index] : val
                })
            } else {
                this.searchForm[item.key] = val.join(',')
            }
        },
        // 提交搜索
        handleSubmit(formName) {
            this.$refs[formName].validate( valid => {
                if(valid) {
                    let searchObj = {}
                    for (let item in this.searchForm) {
                        if (typeof this.searchForm[item] === "object") {
                            searchObj[item] = this.searchForm[item].toLocaleDateString();
                        }else if(this.searchForm[item] && typeof this.searchForm[item] === "string"){
                            searchObj[item] = this.searchForm[item].trim()
                        }
                    }
                    this.$emit("search-submit", searchObj);
                }
            })
        },
        // 重置表单
        handleReset(name) {
            this.$refs[name].resetFields();
            this.searchForm = {};
            this.$emit('reset-search');
        }
    }
};
</script>
