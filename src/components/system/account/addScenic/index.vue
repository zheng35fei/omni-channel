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
            <FormItem label="景区编码：" prop="scenicCode">
                <Input v-model="formItem.scenicCode" placeholder="填写景区编码" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="景区名称：" prop="name">
                <Input v-model="formItem.name" placeholder="填写景区名称" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="联系人:" prop="linkName">
                <Input v-model="formItem.linkName" placeholder="填写联系人" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="联系人电话：" prop="linkMobile">
                <Input v-model="formItem.linkMobile" placeholder="填写联系人电话" style="width:33%;"></Input>
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
                scenicCode: "",
                name: "",
                remark: "",
                linkName: "",
                linkMobile: ""
            },
            funType: [],
            ruleForm: {
                scenicCode: [
                    { required: true, message: "请输入景区id", trigger: "blur" }
                ],
                name: [
                    { required: true, message: "请输入名称", trigger: "blur" }
                ],
                remark: [
                    {
                        max:200,
                        message: "最多可输入200个字符",
                        trigger: "blur"
                    }
                ],
                linkMobile: [
                    {
                        type: 'number',
                        message: "请填写正确的手机号",
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
            apiGet("/baseInfo/scenicInfo/toEdit/" + this.$route.query.id).then(res => {
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
                this.type === "edit" ? "/baseInfo/scenicInfo/update" : "/baseInfo/scenicInfo/save";
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


