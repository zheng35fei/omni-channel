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
            <FormItem label="登录用户名：" prop="accName">
                <Input v-model="formItem.accName" placeholder="填写登录用户名" style="width:33%;" />
            </FormItem>
            <FormItem label="登录密码：" prop="accPass">
                <Input v-model="formItem.accPass" placeholder="填写登录密码" style="width:33%;" />
            </FormItem>
            <FormItem label="用户编号：" prop="accNo">
                <Input v-model="formItem.accNo" placeholder="填写用户编号" style="width:33%;" />
            </FormItem>
            <FormItem label="真实姓名：" prop="realName">
                <Input v-model="formItem.realName" placeholder="填写真实姓名" style="width:33%;" />
            </FormItem>
            <FormItem label="用户类型：" prop="accType">
                <Select v-model="formItem.accType" style="width:200px">
                    <Option
                        v-for="item in accTypes"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="用户状态：" prop="accStatus">
                <Switch :value="formItem.accStatus === 'T'" true-value="T" false-value="F" @on-change="accStatusSwitch">
                    <span slot="open">正常</span>
                    <span slot="close">锁定</span>
                </Switch>
            </FormItem>
            <FormItem label="是否管理员：" prop="ifAdmin">
                <Switch :value="formItem.ifAdmin === 'T'" true-value="T" false-value="F" @on-change="ifAdminSwitch">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                </Switch>
            </FormItem>

            
            <FormItem label="企业编码：" prop="corpCode">
                <Input v-model="formItem.corpCode" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="用户类型：" prop="userType">
                <Select v-model="formItem.userType" style="width:200px">
                    <Option
                        v-for="item in userTypes"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="归属的景区ID：" prop="scenicId">
                <Input v-model="formItem.scenicId" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="归属的景区编码：" prop="scenicCode">
                <Input v-model="formItem.scenicCode" style="width:33%;"></Input>
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
            userTypes: [
                {
                    value: 0,
                    label: "操作员"
                },
                {
                    value: 2,
                    label: "售票员"
                },
            ],
            accTypes: [
                {
                    value: 0,
                    label: "系统管理"
                },
                {
                    value: 1,
                    label: "企业管理员"
                },
                {
                    value: 3,
                    label: "分销商"
                }
            ],
            formItem: {
                id: "",
                parentId: "",
                funName: "",
                funCode: "",
                optType: "",
                sortNo: "",
                openType: "",
                funUrl: "",
                functionType: "",
                hierarchy: null,
                parentId: "",
            },
            ruleForm: {
                funName: [
                    { required: true, message: "请输入名称", trigger: "blur" }
                ],
                funCode: [
                    {
                        required: true,
                        message: "请输入唯一编码",
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
            apiGet("/userInfo/toEdit/" + this.$route.query.id).then(res => {
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
            let url =
                this.type === "edit" ? "/userInfo/update" : "/userInfo/save";
            this.common.formPost(this, {
                url,
                params: this.formItem,
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
        accStatusSwitch() {

        },
        ifAdminSwitch() {

        }
    }
};
</script>


<style lang="scss">
.addMenu {
    margin-top: 20px;
}
</style>


