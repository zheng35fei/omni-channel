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
                <Input v-model="formItem.accName" placeholder="填写登录用户名" style="width:33%;"/>
            </FormItem>
            <FormItem label="登录密码：" prop="accPass">
                <Input v-model="formItem.accPass" placeholder="填写登录密码" style="width:33%;"/>
            </FormItem>
            <FormItem label="用户编号：" prop="accNo">
                <Input v-model="formItem.accNo" placeholder="填写用户编号" style="width:33%;"/>
            </FormItem>
            <FormItem label="真实姓名：" prop="realName">
                <Input v-model="formItem.realName" placeholder="填写真实姓名" style="width:33%;"/>
            </FormItem>
            <FormItem v-if="isSysRole" label="所属角色：" prop="sysRoleId">
                <Select v-model.number="formItem.sysRoleId" style="width:200px">
                    <Option
                        v-for="item in sysRoles"
                        :value="item.value"
                        :key="item.value"
                        :label="item.label"
                    ></Option>
                </Select>
            </FormItem>
            <FormItem label="用户状态：" prop="accStatus">
                <i-switch
                    size="large"
                    :value="formItem.accStatus === 'T'"
                    @on-change="(val) => {setSwitchVal(val, 'accStatus')}"
                >
                    <span slot="open">正常</span>
                    <span slot="close">锁定</span>
                </i-switch>
            </FormItem>
            <FormItem label="是否管理员：" prop="ifAdmin">
                <i-switch
                    :disabled='true'
                    size="large"
                    :value="formItem.ifAdmin === 'T'"
                    @on-change="(val) => {setSwitchVal(val, 'ifAdmin')}"
                >
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                </i-switch>
            </FormItem>

            <FormItem label="企业编码：" prop="corpCode">
                <Input v-model="formItem.corpCode" style="width:33%;"/>
            </FormItem>
            <!-- <FormItem label="用户类型：" prop="userType">
                <Select v-model="formItem.userType" style="width:200px">
                    <Option
                        v-for="item in userTypes"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</Option>
                </Select>
            </FormItem> -->

            <FormItem>
                <Button type="primary" @click="submit">提交</Button>
                <Button @click="back">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { mapState } from 'vuex'
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
                }
            ],
            sysRoles: [],
            formItem: {
                id: "",
                accName: "",
                accPass: "",
                accNo: "",
                sysRoleId: '',
                realName:'',
                accStatus: "T",
                ifAdmin: "",
                corpCode: "",
                userType: 0,
                accType: "",
                scenicId: this.$route.query.scenicId,
                scenicCode: this.$route.query.scenicCode
            },
            ruleForm: {
                accName: [
                    { required: true, message: "请输入登录用户名", trigger: "blur" }
                ],
                accPass: [
                    { required: true, message: "请输入登录密码", trigger: "blur" }
                ],
                accNo: [
                    { required: true, message: "请输入用户编号", trigger: "blur" }
                ],
                accType: [
                    { type: 'number', required: true, message: "请选择用户角色", trigger: "change" }
                ],
                accNo: [
                    { required: true, message: "请输入用户编号", trigger: "blur" }
                ],
                sysRoleId: [
                    { required: true, message: "请选择所属角色", trigger: "change" }
                ]
            },
            type: "add"
        };
    },
    computed: {
        ...mapState({
            accType: state => state.user.accType
        }),
        isSysRole() {
            return this.type === 'add' ? this.accType != '0' : this.formItem.accType != 1
        }
    },
    created() {
        console.log(this.accType)
        this.formItem.ifAdmin = this.accType == '0' ? 'T' : 'F'
        this.formItem.accType = this.accType == '0' ? '1' : '4'
        this.accType != '0' && this.getRoleList()
        
        if (this.$route.query.id || this.$route.query.id == 0) {
            this.type = "edit";
            this.apiGet(this.adminApi.userToEdit + this.$route.query.id).then(res => {
                if (res.status == 200) {
                    for (let key in this.formItem) {
                        this.formItem[key] = res.data[key];
                    }
                }else {
                    this.$Message.error(res.message)
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
                this.type === "edit" ? this.adminApi.userUpdate : this.adminApi.userSave;
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
        setSwitchVal(name, val) {
            this.formItem[name] = val ? 'T' : 'F'
        },
        getRoleList() {
            this.apiPostJson(this.adminApi.roleList).then( res => {
                this.sysRoles = res.data.rows.map( item => ({label: item.roleName, value: item.id}))
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


