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
            <FormItem label="所属分销商：" prop="distId">
                <Select v-model="formItem.distId" style="width:33%;">
                    <Option v-for="item in distributors" :key="item.id" :value="item.id" :label="item.name"></Option>
                </Select>
            </FormItem>
            <FormItem label="姓名:" prop="name">
                <Input v-model="formItem.name" placeholder="填写姓名" style="width:33%;" clearable/>
            </FormItem>
            <FormItem label="手机号：" prop="mobile">
                <Input v-model="formItem.mobile" placeholder="填写手机号" style="width:33%;" clearable/>
            </FormItem>
            <FormItem label="身份证编号：" prop="idCard">
                <Input v-model.trim="formItem.idCard" placeholder="填写身份证编号" style="width:33%;" clearable />
            </FormItem>
            
            <FormItem label="身份证图片：" prop="idCardPicCode">
                <upload-img class="uploadBox" :uploadList="idCardPicList" @getImgUrl="arr => getImgUrl(arr, 'idCardPic')" :action="adminApi.imgUpload" :name="uploadConfig.name" :header="uploadConfig.header">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="48" style="color: #3399ff"></Icon>
                        <p>点击或拖动文件到这里</p>
                    </div>
                </upload-img>
            </FormItem>
            <FormItem label="导游证图片：" prop="touristCertPicCode">
                <upload-img class="uploadBox" :uploadList="touristCertPicList" @getImgUrl="arr => getImgUrl(arr, 'touristCertPic')" :action="adminApi.imgUpload" :name="uploadConfig.name" :header="uploadConfig.header">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="48" style="color: #3399ff"></Icon>
                        <p>点击或拖动文件到这里</p>
                    </div>
                </upload-img>
            </FormItem>
            <FormItem label="营运证图片：" prop="tradeCardPicCode">
                <upload-img class="uploadBox" :uploadList="tradeCardPicList" @getImgUrl="arr => getImgUrl(arr, 'tradeCardPic')" :action="adminApi.imgUpload" :name="uploadConfig.name" :header="uploadConfig.header">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="48" style="color: #3399ff"></Icon>
                        <p>点击或拖动文件到这里</p>
                    </div>
                </upload-img>
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
import uploadImg from '@/components/global/singleImg.vue'
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
                idCardPicCode: "",
                idCardPicUrl: "",
                tradeCardPicCode: "",
                tradeCardPicUrl: "",
                touristCertPicCode: "",
                touristCertPicUrl: "",
            },
            ruleForm: {
                name: [
                    { required: true, message: "请输入推广员姓名", trigger: "blur" }
                ],
                distId: [
                    { type: 'number', required: true, message: "请选择分销商", trigger: "change" }
                ],
                idCard: [
                    { required: true, message: "请输入身份证号", trigger: "blur" },
                    { validator: (rule, value, callback) => {
                        // true "验证通过", false //校验不通过
                        let flag = true;
                        var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
                        //号码规则校验
                        if(!format.test(value)){
                            flag = false
                        }
                        //区位码校验
                        //出生年月日校验   前正则限制起始年份为1900;
                        var year = value.substr(6,4),//身份证年
                            month = value.substr(10,2),//身份证月
                            date = value.substr(12,2),//身份证日
                            time = Date.parse(month+'-'+date+'-'+year),//身份证日期时间戳date
                            now_time = Date.parse(new Date()),//当前时间戳
                            dates = (new Date(year,month,0)).getDate();//身份证当月天数
                        if(time>now_time||date>dates){
                            flag = false
                        }
                        //校验码判断
                        var c = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);   //系数
                        var b = new Array('1','0','X','9','8','7','6','5','4','3','2');  //校验码对照表
                        var id_array = value.split("");
                        var sum = 0;
                        for(var k=0;k<17;k++){
                            sum+=parseInt(id_array[k])*parseInt(c[k]);
                        }
                        if(id_array[17] && id_array[17].toUpperCase() != b[sum%11].toUpperCase()){
                            flag = false
                        }
                        if(!flag) {
                            callback(new Error('身份证号格式不正确'))
                        }else {
                            callback()
                        }

                    }, trigger: 'blur'}
                ],
                idCardPicCode: [
                    { required: true, message: "请上传身份证", trigger: "change" }
                ],
                touristCertPicCode: [
                    { required: true, message: "请上传导游证", trigger: "change" }
                ],
                tradeCardPicCode: [
                    { required: true, message: "请上传营运证", trigger: "change" }
                ],
                mobile: [
                    { required: true, message: "请输入手机号", trigger: "blur" },
                    { pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/, message: '请输入正确格式的手机号'}
                ],
                remark: [
                    {
                        max:200,
                        message: "最多可输入200个字符",
                        trigger: "blur"
                    }
                ],
            },
            type: "add",
            uploadConfig: {
                name: 'picFile',
                header: {'Content-Type': 'multipart/form-data'}
            }
        };
    },
    components: {uploadImg},
    computed: {
        idCardPicList: {
            get: function() {
                return this.formItem.idCardPicUrl ? [{
                    code: this.formItem.idCardPicCode,
                    picUrl: this.formItem.idCardPicUrl
                }] : []
            },
            set: function(val) {
                this.formItem.idCardPicCode = val[0] ? val[0].code : ''
                this.formItem.idCardPicUrl = val[0] ? val[0].picUrl : ''
            }
        },
        tradeCardPicList: {
            get: function() {
                return this.formItem.tradeCardPicUrl ? [{
                    code: this.formItem.tradeCardPicCode,
                    picUrl: this.formItem.tradeCardPicUrl
                }] : []
            },
            set: function(val) {
                this.formItem.tradeCardPicCode = val[0] ? val[0].code : ''
                this.formItem.tradeCardPicUrl = val[0] ? val[0].picUrl : ''
            }
        },
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
            this.$refs.formItem.validate(vaild => {
                if(vaild) {
                    const url =
                        this.type === "edit" ? this.baseinfoApi.promoterUpdate : this.baseinfoApi.promoterSave;
                    let params = {}
                    for(let key in this.formItem) {
                        if(this.formItem[key] && key !== 'idCardPicUrl' && key !== 'tradeCardPicUrl' && key !== 'touristCertPicUrl') {
                            params[key] = this.formItem[key];
                        }
                    }
                    axios.post(url, params).then( res => {
                        if (res.status === 200 && (res.data.status === 200 || res.data.success)) {
                            this.$Message.success('推广员提交成功!');
                            this.$router.push('/promoter-list');
                        } else {
                            this.$Message.error(res.data.message);
                        }
                    }).catch( err=> {
                        this.$Message.error(err);
                    })
                }
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
        },
        getImgUrl(arr, name) {
            this[name+ 'List'] = arr
            console.log(this.formItem[name], this[name+ 'List'])
        }
    }
};
</script>


<style lang="scss" scoped>
.uploadBox {
    width: 33%;
}
.uploadBox .ivu-upload {
    width: 100%;
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


