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
                <Select v-model="formItem.channelRuleId" placeholder="填写分销商名称" style="width:33%;" />
            </FormItem>
            <FormItem label="渠道返佣规则：" prop="brokerageRuleId">
                <Select v-model="formItem.brokerageRuleId" placeholder="填写分销商名称" style="width:33%;" />
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
import { apiGet } from "@/fetch/api";
export default {
    data() {
        return {
            formItem: {
                id: "",
                name: "",
                remark: "",
                channelRuleId: "",
                brokerageRuleId: "",
                scenicId: "",
                scenicCode: ""
            },
            funType: [],
            ruleForm: {
                name: [
                    { required: true, message: "请输入景区id", trigger: "blur" }
                ],
                channelRuleId: [
                    { required: true, message: "请选择分销商规则", trigger: "change" }
                ],
                brokerageRuleId: [
                    { required: true, message: "请选择分销商规则", trigger: "change" }
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
        if (this.$route.query.id || this.$route.query.id == 0) {
            this.type = "edit";
            apiGet("/baseinfo/baseInfo/distributor/toEdit/" + this.$route.query.id).then(res => {
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
                this.type === "edit" ? "/baseinfo/baseInfo/distributor/update" : "/baseinfo/baseInfo/distributor/save";
            let params = {}
            for(let key in this.formItem) {
                if(this.formItem[key]) {
                    params[key] = this.formItem[key]
                }
            }
            this.common.formPost(this, {
                url,
                params,
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
            console.log(val)
        }
    }
};
</script>


<style lang="scss">
.addMenu {
    margin-top: 20px;
}
</style>


