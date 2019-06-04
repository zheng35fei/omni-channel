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
            <FormItem label="景区id：" prop="scenicId">
                <Input v-model="formItem.scenicId" placeholder="填写所属景区" style="width:33%;" />
            </FormItem>
            <FormItem label="角色名称：" prop="roleName">
                <Input v-model="formItem.roleName" placeholder="填写角色名称" style="width:33%;" />
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
                scenicId: "",
                roleName: "",
                remark: "",
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
            apiGet("/sysRole/toEdit/" + this.$route.query.id).then(res => {
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
                this.type === "edit" ? "/sysRole/update" : "/sysRole/save";
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
        }
    }
};
</script>


<style lang="scss">
.addMenu {
    margin-top: 20px;
}
</style>


