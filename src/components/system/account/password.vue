<template>
    <div>
        <Form
            :model="formObj"
            label-position="right"
            :label-width="150"
            ref="formItem"
            :rules="rules"
        >
            <FormItem label="原密码：" prop="originPass">
                <Input type="password" v-model="formObj.originPass" clearable placeholder="填写原密码" style="width:33%;" />
            </FormItem>
            <FormItem label="新密码：" prop="targetPass">
                <Input type="password" v-model="formObj.targetPass" clearable placeholder="填写新密码" style="width:33%;" />
            </FormItem>
            <FormItem label="确认新密码：" prop="secondPass">
                <Input type="password" v-model="formObj.secondPass" clearable placeholder="确认新密码" style="width:33%;" />
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
            formObj: {
                userId: this.$store.state.userId,
                originPass: '',
                targetPass: '',
                secondPass: ''
            },
            rules: {
                originPass: [{
                    required: true,
                    message: '请输入原始密码',
                    trigger: "blur"
                },{
                    min:6,
                    max:30,
                    message: '请输入6-30位密码',
                    trigger: "blur"
                }],
                secondPass: [{
                    required: true,
                    message: '请再次输入新密码',
                    trigger: "blur"
                },{
                    min:6,
                    max:30,
                    message: '请输入6-30位密码',
                    trigger: "blur"
                }],
                targetPass: [{
                    required: true,
                    message: '请输入新密码',
                    trigger: "blur"
                },{
                    min:6,
                    max:30,
                    message: '请输入6-30位密码',
                    trigger: "blur"
                }],
            },
        }
    },
    methods: {
        back() {
            this.$router.back();
        },
        submit() {
            let url = this.adminApi.modifyPwd;
            this.common.formPost(this, {
                url,
                params: this.formObj,
                mold: "page",
                callback: res => {
                    if (res.success) {
                        this.$Message.success(res.message || '修改成功');
                    }
                }
            });
        },
    }
}
</script>