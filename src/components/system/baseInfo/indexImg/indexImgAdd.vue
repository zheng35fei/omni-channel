<template>
    <div>
        <Form
            :model="formItem"
            label-position="right"
            :label-width="150"
            ref="formItem"
            :rules="ruleForm"
        >
            <FormItem label="栏目名称：" prop="name">
                <Input v-model="formItem.name" clearable placeholder="填写栏目名称" style="width:33%;"/>
            </FormItem>

            <FormItem label="上传图片：" prop="pic">
                <upload-img class="uploadBox" :uploadList="touristCertPicList" @getImgUrl="arr => getImgUrl(arr, 'touristCertPic')" :action="adminApi.imgUpload" :name="uploadConfig.name" :header="uploadConfig.header">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="48" style="color: #3399ff"></Icon>
                        <p>点击或拖动文件到这里</p>
                    </div>
                </upload-img>
            </FormItem>

            <FormItem label="备注：" prop="ramark">
                <Input type="textarea" :autosize="{minRows: 3,maxRows: 8}" v-model="formItem.ramark" placeholder="填写备注" style="width:33%;"/>
            </FormItem>

            <FormItem>
                <Button type="primary" @click="submit">提交</Button>
                <Button @click="back">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import uploadImg from '@/components/global/singleImg.vue'
export default {
    components: { uploadImg },
    data() {
        return {
            formItem: {
                id: "",
                accName: "",
                accPass: "",
                accNo: "",
                accType: '',
                realName:'',
                accStatus: "T",
                ifAdmin: "F",
                corpCode: "",
                userType: 0
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
                ]
            },
            type: "add",
            uploadConfig: {
                name: 'picFile',
                header: {'Content-Type': 'multipart/form-data'}
            }
        }
    },
    created() {
        if (this.$route.query.id || this.$route.query.id == 0) {
            this.type = "edit";
            this.apiGet(this.adminApi.userToEdit + this.$route.query.id).then(res => {
                if (res.status == 200) {
                    for (let key in this.formItem) {
                        this.formItem[key] = res.data[key];
                    }
                }
            });
        }
    },
    computed: {
        touristCertPicList: {
            get: function() {
                return this.formItem.touristCertPicUrl ? [{
                    code: this.formItem.touristCertPicCode ,
                    picUrl: this.formItem.touristCertPicUrl
                }] : []
            },
            set: function(val) {
                this.formItem.touristCertPicCode  = val[0] ? val[0].code : ''
                this.formItem.touristCertPicUrl = val[0] ? val[0].picUrl : ''
            }
        },
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
        getImgUrl(arr, name) {
            this[name+ 'List'] = arr
        }
    }
}
</script>

<style lang="scss" scoped>
.uploadBox {
    width: 33%;

    .ivu-upload {
        width: 100%;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
}
.uploadImg {
    width: 120px;
    height: 80px;
}
</style>