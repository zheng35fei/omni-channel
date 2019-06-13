<template>
    <Form ref="formInline" :model="searchForm" inline>
        <FormItem v-for="(item,index) in searchData" :prop="item.key" :key="index" :rules="rules">
            <Input
                v-if="!item.type || item.type=='input'"
                v-model="searchForm[item.key]"
                :placeholder="'请输入'+item.title"
                clearable
            />
            <DatePicker
                v-if="item.type=='date'"
                type="date"
                confirm
                :placeholder="'请选择'+item.title"
                v-model="searchForm[item.key]"
                @on-change="searchForm[item.key]=$event"
                format="yyyy-MM-dd"
                clearable
            ></DatePicker>
            <Select
                v-if="item.type=='select'"
                v-model="searchForm[item.key]"
                style="width:180px"
                :placeholder="'请选择'+item.title"
            >
                <Option
                    v-for="sitem in item.dicUrl ? DIC && (DIC[item.key] || []) : item.dicData"
                    :value="sitem.value"
                    :key="sitem.value"
                >{{ sitem.label }}</Option>
            </Select>
        </FormItem>
        <FormItem>
            <slot name="searchFormItem"></slot>
        </FormItem>
        <Button type="primary" icon="ios-search" @click="handleSubmit('formInline')">搜索</Button>
        <Button type="primary" icon="md-refresh" @click="handleReset('formInline')">重置</Button>
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
            searchForm: {},
            arules: {
                linkMobile: [
                    {
                        type: "number",
                        required: true,
                        message: "请输入正确的手机号",
                        trigger: "blur"
                    }
                ],
                channelId: [
                    {
                        type: "number",
                        required: true,
                        message: "请输入正确的手机号",
                        trigger: "blur"
                    }
                ]
            }
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
        // 提交搜索
        handleSubmit(formName) {
            this.$refs[formName].validate( valid => {
                if(valid) {
                    for (let item in this.searchForm) {
                        if (typeof this.searchForm[item] === "object") {
                            this.searchForm[item] = this.searchForm[
                                item
                            ].toLocaleDateString();
                        }
                    }
                    this.$store.state.list.searchParams = this.searchForm;
                    this.$emit("search-submit", this.searchForm);
                    this.$parent.loadpage(this.apiType);
                }
            })
        },
        // 重置表单
        handleReset(name) {
            this.$refs[name].resetFields();
            this.$store.state.list.searchParams = {};
            this.$parent.loadpage(this.apiType);
        }
    }
};
</script>
