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
            <FormItem label="所属分销商Id：" prop="distId">
                <Input v-model="formItem.distId" placeholder="填写分销商Id" style="width:33%;" />
            </FormItem>
            <FormItem label="姓名:" prop="name">
                <Input v-model="formItem.name" placeholder="填写分销商Id" style="width:33%;" />
            </FormItem>
            <FormItem label="手机号：" prop="mobile">
                <Input v-model="formItem.mobile" placeholder="填写手机号" style="width:33%;" />
            </FormItem>
            <FormItem label="身份证编号：" prop="idCard">
                <Input v-model="formItem.idCard" placeholder="填写身份证编号" style="width:33%;" />
            </FormItem>
            <FormItem label="身份证图片：" prop="idCardPic">
                
            </FormItem>
            <FormItem label="导游证图片：" prop="touristCertPic">
                
            </FormItem>
            <FormItem label="营运证图片：" prop="tradeCardPic">
                
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
                distId: "",
                name: "",
                mobile: "",
                idCard: "",
                remark: "",
                idCardPic: "",
                tradeCardPic: "",
                touristCertPic: "",
            },
            funType: [],
            ruleForm: {
                name: [
                    { required: true, message: "请输入景区id", trigger: "blur" }
                ],
                distId: [
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
            this.apiGet(this.baseinfoApi.promoterToEdit + this.$route.query.id).then(res => {
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
                this.type === "edit" ? this.baseinfoApi.promoterUpdate : this.baseinfoApi.promoterSave;
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


