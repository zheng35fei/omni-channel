<template>
    <div>
        <Form
            :model="formObj"
            label-position="right"
            :label-width="150"
            ref="formItem"
            :rules="rules"
        >
            <FormItem label="原密码：" prop="scenicCode">
                <Input v-model="formObj.scenicCode" clearable placeholder="填写原密码" style="width:33%;" />
            </FormItem>
            <FormItem label="新密码：" prop="name">
                <Input v-model="formObj.name" clearable placeholder="填写新密码" style="width:33%;" />
            </FormItem>
            <FormItem label="确认新密码:" prop="linkName">
                <Input v-model="formObj.linkName" clearable placeholder="填写新密码" style="width:33%;" />
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
            formObj: {},
            rules: {}
        }
    },
    methods: {
        back() {
            this.$router.back();
        },
        submit() {
            let _this = this;
            this.formItem.funType = this.funType.join(",");
            let url =
                _this.type === "edit" ? this.adminApi.menuUpdate : this.adminApi.menuSave;
            this.common.formPost(this, {
                url,
                params: this.formItem,
                mold: "modal",
                callback(res) {
                    if (res.status == 200) {
                        _this.$Message.success(res.message);
                        _this.$router.back();
                    } else {
                        _this.$router.warning(res.message);
                    }
                }
            });
        },
    }
}
</script>