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
                <Select v-model="formItem.distId" style="width:33%;">
                    <Option v-for="item in distributors" :key="item.id" :value="item.id" :label="item.name"></Option>
                </Select>
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
                <img class="uploadImg" :src="formItem.idCardPicUrl || '/static/images/plus-large.png'">
                <Upload class="uploadBox" type="drag" action="/" :format="['png', 'jpg', 'gif']" :before-upload=" file => setImageValue('idCardPic', file)">
                    <Button icon="ios-cloud-upload-outline">Upload files</Button>
                </Upload>
            </FormItem>
            <FormItem label="导游证图片：" prop="touristCertPic">
                <img class="uploadImg" :src="formItem.touristCertPicUrl || '/static/images/plus-large.png'">
                <Upload class="uploadBox" type="drag" action="/" :before-upload=" file => setImageValue('touristCertPic', file)">
                    <Button icon="ios-cloud-upload-outline">Upload files</Button>
                </Upload>
            </FormItem>
            <FormItem label="营运证图片：" prop="tradeCardPic">
                <img class="uploadImg" :src="formItem.tradeCardPicUrl || '/static/images/plus-large.png'">
                <Upload class="uploadBox" type="drag" action="/" :before-upload=" file => setImageValue('tradeCardPic', file)">
                    <Button icon="ios-cloud-upload-outline">Upload files</Button>
                </Upload>
            </FormItem>
            <FormItem label="备注：" prop="remark">
                <Input type="textarea" v-model="formItem.remark" style="width:33%;" :rows="4" />
            </FormItem>

            <FormItem>
                <Button type="primary" @click="submit" v-if="type === 'add'">提交</Button>
                <Button @click="back">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            distributors: [],
            formItem: {
                id: "",
                distId: "",
                name: "",
                mobile: "",
                idCard: "",
                remark: "",
                idCardPic: "",
                idCardPicUrl: "",
                tradeCardPic: "",
                tradeCardPicUrl: "",
                touristCertPic: "",
                touristCertPicUrl: "",
            },
            ruleForm: {
                name: [
                    { required: true, message: "请输入推广员姓名", trigger: "blur" }
                ],
                distId: [
                    { type: 'number', required: true, message: "请选择分销商Id", trigger: "change" }
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
        this.getDistributorList();
        if (this.$route.query.id || this.$route.query.id == 0) {
            this.type = "edit";
            this.apiPost(this.baseinfoApi.promoterToEdit + this.$route.query.id).then(res => {
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
            let params = new FormData()
            for(let key in this.formItem) {
                if(this.formItem[key] && key !== 'idCardPicUrl' && key !== 'tradeCardPicUrl' && key !== 'touristCertPicUrl') {
                    if(key.includes('Pic')) {
                        params.append(key, this.formItem[key], this.formItem[key].name);
                    }else {
                        params.append(key, this.formItem[key]);

                    }
                }
            }
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then( res => {
                if (res.status === 200 && (res.data.status === 200 || res.data.success)) {
                    this.$Message.success(res.data.message);
                    this.$router.back();
                } else {
                    this.$Message.error(res.data.message);
                }
            }).catch( err=> {
                this.$Message.error(err.response.data.message);
            })
        },
        getDistributorList() {
            const url = this.baseinfoApi.distributorAllList;
            this.apiGet(url).then( res => {
                if(res.status === 200) {
                    this.distributors = res.data
                }
            })
        },
        setImageValue(key, file) {
            this.formItem[key] = file
            let reader = new FileReader();    //html5读文件  
            reader.readAsDataURL(file); //转BASE64     
            reader.onload=(e) => {        //读取完毕后调用接口    
                this.formItem[key + 'Url'] = e.target.result
            }
            return false
        }
    }
};
</script>


<style lang="scss">
.uploadBox {
    width: 120px;
}
.uploadBox .ivu-upload {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.uploadImg {
    width: 120px;
    height: 80px;
}
</style>


