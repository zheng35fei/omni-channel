<template>
    <div class="addMenu">
        <h2>{{type=='add'?"新增":"修改"}}</h2>
        <Form
            :model="formItem"
            label-position="right"
            :label-width="150"
            ref="formItem"
            :rules="ruleForm"
        >
            <FormItem label="渠道名称：" prop="name">
                <Input v-model="formItem.name" placeholder="填写分销商名称" style="width:33%;" />
            </FormItem>
            <FormItem label="渠道限制规则:" prop="channelRuleId">
                <Select v-model="formItem.channelRuleId" placeholder="填写分销商名称" style="width:33%;">
                    <Option v-for="item in channelRuleArr" :value="item.id" :label="item.name" :key="item.id"></Option>
                </Select>
            </FormItem>
            <FormItem label="渠道返佣规则：" prop="brokerageRuleId">
                <Select v-model="formItem.brokerageRuleId" placeholder="填写分销商名称" style="width:33%;">
                    <Option v-for="item in brokerageRuleArr" :value="item.id" :label="item.name" :key="item.id"></Option>
                </Select>
            </FormItem>
            <FormItem label="备注：" prop="remark">
                <Input type="textarea" v-model="formItem.remark" style="width:33%;" :rows="4" />
            </FormItem>

            <FormItem>
                <Button type="primary" @click="submit">提交</Button>
                <Button @click="back">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formItem: {
                id: "",
                name: "",
                remark: "",
                channelRuleId: "",
                brokerageRuleId: ""
            },
            channelRuleArr: [],
            brokerageRuleArr: [],
            ruleForm: {
                name: [
                    { required: true, message: "请输入渠道名称", trigger: "blur" }
                ],
                channelRuleId: [
                    {type: 'number', required: true, message: "请选择分销商规则", trigger: "change" }
                ],
                brokerageRuleId: [
                    {type: 'number', required: true, message: "请选择分销商规则", trigger: "change" }
                ],
                remark: [
                    {
                        max:200,
                        message: "最多可输入200个字符",
                        trigger: "blur"
                    }
                ],
            },
            type: "add"
        };
    },
    created() {
        this.getRuleList()
        this.getReBackList()
        if (this.$route.query.id || this.$route.query.id == 0) {
            this.type = "edit";
            this.apiGet(this.baseinfoApi.channelToEdit + this.$route.query.id).then(res => {
                if (res.status == 200) {
                    for(let key in this.formItem) {
                      this.formItem[key] = res.data[key]
                    }
                }
            });
        }
    },
    methods: {
        back() {
            this.$router.back();
        },
        submit() {
            const url =
                this.type === "edit" ? this.baseinfoApi.channelUpdate : this.baseinfoApi.channelSave;
            let params = {}
            for(let key in this.formItem) {
                if(this.formItem[key]) {
                    params[key] = this.formItem[key]
                }
            }
            this.common.formPost(this, {
                url,
                params,
                apiType: 'apiPostJson',
                mold: "modal",
                callback: res => {
                    if (res.status == 200) {
                        this.$Message.success(res.message);
                        this.$router.back();
                    } else {
                        this.$router.warning(res.message);
                    }
                }
            });
        },
        enableDistrubutor(val) {
        },
        getRuleList() {
            const url = this.baseinfoApi.channelRuleList
            this.apiPostJson(url).then( res => {
                this.channelRuleArr = res.data.rows
            })
        },
        getReBackList() {
            const url = this.baseinfoApi.brokerageRuleList
            this.apiPostJson(url).then( res => {
                this.brokerageRuleArr = res.data.rows
            })
        }
    }
};
</script>


<style lang="scss">
.addMenu {
    margin-top: 20px;
}
</style>


