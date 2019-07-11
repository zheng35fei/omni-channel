<template>
    <div class="addMenu">
        <h2>{{type=='add'?"新增":"修改"}}</h2>
        <Form
            :model="formItem"
            label-position="right"
            :label-width="120"
            ref="formItem"
            :rules="ruleForm"
        >
            <FormItem prop="name" label="渠道名称：">
                <Input v-model="formItem.name" placeholder="请填写渠道限制规则名称" style="width:33%;"/>
            </FormItem>

            <h3>备注</h3>
            <FormItem label="备注：" prop="remark">
                <Input type="textarea" v-model="formItem.remark" style="width:33%;" :rows="4"/>
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
                remark: ""
            },
            ruleForm: {
                name: [
                    { required: true, message: "请输入景区id", trigger: "blur" }
                ],
                remark: [
                    {
                        max: 200,
                        message: "最多可输入200个字符",
                        trigger: "blur"
                    }
                ]
            },
            type: "add"
        };
    },
    created() {
        if (this.$route.query.id || this.$route.query.id == 0) {
            this.type = "edit";
            this.apiPost(
                this.baseinfoApi.brokerageRuleToEdit + this.$route.query.id
            ).then(res => {
                if (res.status == 200) {
                    for (let key in this.formItem) {
                        this.formItem[key] = res.data[key];
                    }
                }
            });
        }
    },
    computed: {
        necessaryContentsSelected() {
            return this.formItem.channelRuleParamDTO.queueInfoDTO.necessaryContents ? 
                [this.formItem.channelRuleParamDTO.queueInfoDTO.necessaryContents] : []
        }
    },
    methods: {
        back() {
            this.$router.back();
        },
        submit() {
            const url =
                this.type === "edit"
                    ? this.baseinfoApi.brokerageRuleUpdate
                    : this.baseinfoApi.brokerageRuleSave;
            let params = {};
            for (let key in this.formItem) {
                if (this.formItem[key]) {
                    params[key] = this.formItem[key];
                }
            }
            this.common.formPost(this, {
                url,
                params,
                mold: "modal",
                apiType: "apiPostJson",
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
        setBlockTime(dateArr) {
            if(dateArr && dateArr.length > 1) {
                this.formItem.channelRuleParamDTO.blockDateRangeDTO.startDate = dateArr[0]
                this.formItem.channelRuleParamDTO.blockDateRangeDTO.endDate = dateArr[1]
            }
        },
        setNecessaryContents( val) {
        }
    }
};
</script>


<style lang="scss">
.addMenu {
    margin-top: 20px;
}
</style>


