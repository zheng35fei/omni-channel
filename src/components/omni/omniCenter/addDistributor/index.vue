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
                <Input v-model="formItem.accName" placeholder="填写分销商名称" style="width:33%;"/>
            </FormItem>
            <FormItem label="登录密码：" prop="accPass">
                <Input v-model="formItem.accPass" placeholder="填写分销商名称" style="width:33%;"/>
            </FormItem>
            <FormItem label="分销商名称：" prop="name">
                <Input v-model="formItem.name" placeholder="填写分销商名称" style="width:33%;"/>
            </FormItem>
            <FormItem label="所属渠道：" prop="channelId">
                <Select v-model="formItem.channelId" style="width:200px">
                    <Option
                        v-for="item in channelIds"
                        :value="item.id"
                        :key="item.id"
                        :label="item.name"
                    ></Option>
                </Select>
            </FormItem>
            <FormItem label="是否启用：" prop="enabled">
                <i-switch
                    :value="isEnabled"
                    @on-change="setEnabled"
                    size="large"
                >
                    <span slot="open">启用</span>
                    <span slot="close">禁用</span>
                </i-switch>
            </FormItem>
            <FormItem label="协议有效期：" prop="validDate">
                <DatePicker
                    :value="formItem.validDate"
                    type="datetime"
                    placeholder="协议有效期"
                    style="width: 33%"
                    @on-change="setValidDate"
                ></DatePicker>
                <!-- <Input v-model="formItem.validDate" placeholder="填写联系人" style="width:33%;" /> -->
            </FormItem>
            <FormItem label="联系人：" prop="linkName">
                <Input v-model="formItem.linkName" placeholder="填写联系人" style="width:33%;"/>
            </FormItem>
            <FormItem label="手机号：" prop="linkMobile">
                <Input v-model="formItem.linkMobile" placeholder="填写手机号" style="width:33%;"/>
            </FormItem>
            <FormItem label="公司电话：" prop="telephone">
                <Input v-model="formItem.telephone" placeholder="填写用户名" style="width:33%;"/>
            </FormItem>
            <FormItem label="公司地址：" prop="compAddr">
                <Input v-model="formItem.compAddr" placeholder="填写用户名" style="width:33%;"/>
            </FormItem>
            <FormItem label="公司传真：" prop="fax">
                <Input v-model="formItem.fax" placeholder="填写用户名" style="width:33%;"/>
            </FormItem>
            <FormItem label="备注：" prop="remark">
                <Input type="textarea" v-model="formItem.remark" style="width:33%;" :rows="4"/>
            </FormItem>

            <FormItem label="营业执照注册号：" prop="busLicensePicCode">
                <Input
                    v-model="formItem.busLicensePicCode"
                    placeholder="营业执照注册号"
                    style="width:33%;"
                />
            </FormItem>
            <FormItem label="旅行社经营许可证：" prop="busPermitPicCode">
                <Input
                    v-model="formItem.busPermitPicCode"
                    placeholder="旅行社经营许可证号"
                    style="width:33%;"
                />
            </FormItem>

            <Divider/>

            <h3 stlye="margin-bottom:10px;">自定义规则</h3>

            <FormItem label="渠道限制规则：" prop="channelRuleId">
                <Select v-model="formItem.channelRuleId" placeholder="填写分销商名称" style="width:33%;">
                    <Option
                        v-for="item in channelRuleArr"
                        :value="item.id"
                        :label="item.name"
                        :key="item.id"
                    ></Option>
                </Select>
            </FormItem>
            <FormItem label="渠道返佣规则：" prop="brokerageRuleId">
                <Select v-model="formItem.brokerageRuleId" placeholder="填写分销商名称" style="width:33%;">
                    <Option
                        v-for="item in brokerageRuleArr"
                        :value="item.id"
                        :label="item.name"
                        :key="item.id"
                    ></Option>
                </Select>
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
            channelIds: [],
            channelRuleArr: [],
            brokerageRuleArr: [],
            formItem: {
                id: "",
                userId: "",
                accName: "",
                name: "",
                accPass: "",
                userName: "",
                channelId: "",
                enabled: "T",
                validDate: "",
                linkName: "",
                linkMobile: "",
                telephone: "",
                compAddr: "",
                fax: "",
                remark: "",
                busLicensePicCode: "",
                busPermitPicCode: "",
                channelRuleId: "",
                brokerageRuleId: ""
            },
            ruleForm: {
                roleName: [
                    {
                        required: true,
                        message: "请输入角色名称",
                        trigger: "blur"
                    }
                ],
                remark: [
                    {
                        max: 200,
                        message: "最多可输入200个字符",
                        trigger: "blur"
                    }
                ]
            },
            type: "add"
        };
    },
    computed: {
        isEnabled() {
            return this.formItem.enabled === 'T'
        }
    },
    created() {
        this.getChannelList();
        this.getRuleList();
        this.getReBackList();
        if (this.$route.query.id || this.$route.query.id == 0) {
            this.type = "edit";
            apiGet(
                this.baseinfoApi.distributorToEdit + this.$route.query.id
            ).then(res => {
                if (res.status == 200) {
                    for (let key in this.formItem) {
                        this.formItem[key] = res.data[key];
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
                this.type === "edit"
                    ? this.baseinfoApi.distributorUpdate
                    : this.baseinfoApi.distributorSave;
            let params = {};
            for (let key in this.formItem) {
                if (this.formItem[key]) {
                    console.log(key, this.formItem[key])
                    params[key] = this.formItem[key];
                }
            }
            console.log('params', params)
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
        getChannelList() {
            this.apiPostJson(this.baseinfoApi.channelList).then(res => {
                if (res.status === 200) {
                    this.channelIds = res.data.rows;
                }
            });
        },
        getRuleList() {
            const url = this.baseinfoApi.channelRuleList;
            this.apiPostJson(url).then(res => {
                console.log(res);
                this.channelRuleArr = res.data.rows;
            });
        },
        getReBackList() {
            const url = this.baseinfoApi.brokerageRuleList;
            this.apiPostJson(url).then(res => {
                console.log(res);
                this.brokerageRuleArr = res.data.rows;
            });
        },
        setValidDate(date) {
            this.formItem.validDate = date
        },
        setEnabled(val) {
            this.formItem.enabled = val ? 'T' : 'F'
        }
    }
};
</script>


<style lang="scss">
.addMenu {
    margin-top: 20px;
}
</style>


