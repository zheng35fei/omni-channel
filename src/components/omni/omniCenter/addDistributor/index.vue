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
            <FormItem label="登录用户名：" prop="userName">
                <Input v-model="formItem.userName" placeholder="填写分销商名称" style="width:33%;" />
            </FormItem>
            <FormItem label="登录密码：" prop="name">
                <Input v-model="formItem.name" placeholder="填写分销商名称" style="width:33%;" />
            </FormItem>
            <FormItem label="分销商名称：" prop="name">
                <Input v-model="formItem.name" placeholder="填写分销商名称" style="width:33%;" />
            </FormItem>
            <FormItem label="所属渠道：" prop="channelId">
                <Input v-model="formItem.channelId" placeholder="选择所属渠道" style="width:33%;" />
            </FormItem>
            <FormItem label="是否启用：" prop="enabled">
                <i-switch :value="formItem.enabled === 'T'" @on-change="enableDistrubutor" true-value="T" false-value="F">
                    <span slot="open">启用</span>
                    <span slot="close">禁用</span>
                </i-switch>
            </FormItem>
            <FormItem label="协议有效期：" prop="validDate">
                <Input v-model="formItem.validDate" placeholder="填写联系人" style="width:33%;" />
            </FormItem>
            <FormItem label="联系人：" prop="linkName">
                <Input v-model="formItem.linkName" placeholder="填写联系人" style="width:33%;" />
            </FormItem>
            <FormItem label="手机号：" prop="linkMobile">
                <Input v-model="formItem.linkMobile" placeholder="填写手机号" style="width:33%;" />
            </FormItem>
            <FormItem label="公司电话：" prop="telephone">
                <Input v-model="formItem.telephone" placeholder="填写用户名" style="width:33%;" />
            </FormItem>
            <FormItem label="公司地址：" prop="compAddr">
                <Input v-model="formItem.compAddr" placeholder="填写用户名" style="width:33%;" />
            </FormItem>
            <FormItem label="公司传真：" prop="fax">
                <Input v-model="formItem.fax" placeholder="填写用户名" style="width:33%;" />
            </FormItem>
            <FormItem label="备注：" prop="remark">
                <Input type="textarea" v-model="formItem.remark" style="width:33%;" :rows="4" />
            </FormItem>

            <FormItem label="营业执照注册号：" prop="busLicensePicCode">
                
            </FormItem>
            <FormItem label="旅行社经营许可证：" prop="busPermitPicCode">
                
            </FormItem>
            
            <Divider />

            <h3>自定义规则</h3>

            <FormItem label="渠道限制规则：" prop="channelRuleId">
                
            </FormItem>
            <FormItem label="渠道返佣规则：" prop="brokerageRuleId">
                
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
                roleName: "",
                remark: "",
                enabled: 'T'
            },
            funType: [],
            ruleForm: {
                scenicId: [
                    { required: true, message: "请输入景区id", trigger: "blur" }
                ],
                roleName: [
                    { required: true, message: "请输入角色名称", trigger: "blur" }
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
            apiGet("/baseInfo/distributor/toEdit/" + this.$route.query.id).then(res => {
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
                this.type === "edit" ? "/sysRole/update" : "/baseInfo/distributor/save";
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


