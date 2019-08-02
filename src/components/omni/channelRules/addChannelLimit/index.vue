<template>
    <div class="addMenu">
        <h2>{{type=='add'?"新增":"修改"}}</h2>
        <br>
        <Form
            :model="formItem"
            label-position="left"
            :label-width="120"
            ref="formItem"
            :rules="ruleForm"
            style="margin-left: 40px;"
        >
            <FormItem prop="name" label="渠道名称：">
                <Input v-model="formItem.name" clearable placeholder="请填写渠道限制规则名称" style="width:33%;"/>
            </FormItem>
            <Divider></Divider>
            <h3 class="formGroupTitle">推广模式</h3>
            <FormItem label="推广模式：" prop="promoteWay">
                <RadioGroup v-model="formItem.promoteWay" type="button">
                    <Radio
                        v-for="item in promoteWays"
                        :key="item.value"
                        :label="item.value"
                    >{{item.label}}</Radio>
                </RadioGroup>
            </FormItem>

            <template v-if="formItem.promoteWay === 1">
                <FormItem label="队列所需完善内容：" prop="necessaryContents">
                    <CheckboxGroup
                        v-model="necessaryContentsSelected"
                        @on-change="setNecessaryContents"
                    >
                        <Checkbox v-for="item in necessaryContents" :key="item" :label="item"></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="队列重复开启时间：" prop="repeatOpenTime">
                    <InputNumber
                        :min="0"
                        v-model="formItem.channelRuleParamDTO.queueInfoDTO.repeatOpenTime"
                        style="width:150px"
                    />
                    <span>分钟</span>
                </FormItem>
                <FormItem label="队列有效人数判断：" prop="quantityType">
                    <RadioGroup v-model="formItem.channelRuleParamDTO.queueInfoDTO.quantityType">
                        <Radio v-for="item in quantityTypes" :key="item.value" :label="item.value">{{item.label}}</Radio>
                    </RadioGroup>
                </FormItem>
            </template>

            <Divider></Divider>
            <h3 class="formGroupTitle">关联有效期</h3>
            <FormItem label="关联有效期：" prop="relevanceWay">
                <RadioGroup v-model="formItem.relevanceWay" type="button">
                    <Radio
                        v-for="item in relevanceTypes"
                        :key="item.value"
                        :label="item.value"
                    >{{item.label}}</Radio>
                </RadioGroup>
            </FormItem>

            <FormItem label="长期有效时间：" prop="longTermType" v-if="formItem.relevanceWay === 1">
                <RadioGroup v-model="formItem.channelRuleParamDTO.longTermDTO.type">
                    <Radio v-for="item in longTermTypes" :key="item.value" :label="item.value">
                        <span>{{item.label}}</span>
                        <template v-if="item.value === formItem.channelRuleParamDTO.longTermDTO.type">
                            <InputNumber
                                style="width:60px;"
                                v-model="formItem.channelRuleParamDTO.longTermDTO.num"
                                :placeholder="item.value === 0 ? '天数' : '小时'"
                                :max="100"
                                :min="1"
                            />
                            {{item.value === 0 ? '天' : '小时'}}
                        </template>
                    </Radio>
                </RadioGroup>
            </FormItem>
            <Divider></Divider>
            <h3 class="formGroupTitle">屏蔽时间设置（设置部分时间无法进行关联推广员）</h3>
            <FormItem label="屏蔽时间设置：" prop="blockingTime">
                <RadioGroup v-model="formItem.blockingTime" type="button">
                    <Radio
                        v-for="item in blockDateRanges"
                        :label="item.value"
                        :key="item.value"
                    >{{item.label}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="屏蔽时间:" prop="blockingTimeStartEnd" v-if="formItem.blockingTime === 1">
                <DatePicker
                    :value="blockingTimeStartEnd"
                    type="datetimerange"
                    placeholder="选择开始结束时间"
                    style="width: 280px"
                    @on-change="setBlockTime"
                ></DatePicker>
            </FormItem>
            <Divider></Divider>
            
            <FormItem label="备注：" prop="remark">
                <Input type="textarea" v-model="formItem.remark" style="width:33%;" :rows="4"/>
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
            loading: false,
            scenicList: [],
            blockDateRanges: [
                {
                    label: "不屏蔽",
                    value: 0
                },
                {
                    label: "屏蔽",
                    value: 1
                }
            ],
            longTermTypes: [{ label: "按天", value: 0}, {label: "固定时间", value: 1}],
            relevanceTypes: [
                {
                    label: "单次关联模式",
                    value: 0
                },
                {
                    label: "长期模式",
                    value: 1
                }
            ],
            quantityTypes: [{label: "车辆入场模式", value: '0'}, {label: "用户取票数量", value: '1'}],
            promoteWays: [
                {
                    label: "普通模式",
                    value: 0
                },
                {
                    label: "队列模式",
                    value: 1
                }
            ],
            necessaryContents: ["旅行社", "车牌号", "导游证"],
            formItem: {
                id: "",
                name: "",
                promoteWay: 0,
                relevanceWay: 0,
                blockingTime: 0,
                repeatOpenTime: 0,
                channelRuleParamDTO: {
                    queueInfoDTO: {
                        necessaryContents: "",
                        repeatOpenTime: 0,
                        quantityType: ""
                    },
                    longTermDTO: {
                        type: "",
                        num: null
                    },
                    blockDateRangeDTO: {
                        startDate: "",
                        endDate: ""
                    }
                },
                remark: ""
            },
            ruleForm: {
                name: [
                    { required: true, message: "请输入渠道名称", trigger: "blur" }
                ],
                distId: [
                    {
                        required: true,
                        message: "请选择分销商规则",
                        trigger: "change"
                    }
                ],
                remark: [
                    {
                        max: 200,
                        message: "最多可输入200个字符",
                        trigger: "blur"
                    }
                ],
                // 自定义规则 blockingTime=1 必填
                blockingTimeStartEnd: [
                    {

                    }
                ]
            },
            type: "add"
        };
    },
    watch: {
        'formItem.relevanceWay': {
            handler: function(val) {
                if(val === 1) {
                    this.formItem.channelRuleParamDTO.longTermDTO.type = this.formItem.channelRuleParamDTO.longTermDTO.type || 0;
                }else {
                    this.formItem.channelRuleParamDTO.longTermDTO.type = null
                }
            },
            immediate: true,
            deep: true
        },
        'formItem.channelRuleParamDTO.longTermDTO.type': {
            handler: function(val, old) {
                // 编辑状态仍要处理
                console.log(val, old)
                if(val != old) {
                    this.formItem.channelRuleParamDTO.longTermDTO.num = null
                }
            },
            immediate: true,
            deep: true
        }
    },
    created() {
        this.getAllScenicList();
        if (this.$route.query.id || this.$route.query.id == 0) {
            this.type = "edit";
            this.apiPost(
                this.baseinfoApi.channelRuleToEdit + this.$route.query.id
            ).then(res => {
                if (res.status == 200) {
                    for (let key in this.formItem) {
                        this.formItem[key] = res.data[key];
                    }
                }
            });
        }
    },
    computed: {
        necessaryContentsSelected: {
            get: function() {
                const arr = this.formItem.channelRuleParamDTO.queueInfoDTO
                    .necessaryContents;
                return arr
                    ? Array.isArray(arr) && arr.length > 0
                        ? arr
                        : arr.split(",")
                    : [];
            },
            set: function(val) {
                this.formItem.channelRuleParamDTO.queueInfoDTO.necessaryContents = val.join(
                    ","
                );
            }
        },
        blockingTimeStartEnd() {
            return [
                this.formItem.channelRuleParamDTO.blockDateRangeDTO.startDate,
                this.formItem.channelRuleParamDTO.blockDateRangeDTO.endDate
            ];
        }
    },
    methods: {
        getAllScenicList() {
            this.apiGet(this.adminApi.getAllScenicList).then(res => {
                if (res.status === 200) {
                    this.scenicList = res.data;
                } else {
                    this.$Message.error(res.message);
                }
            });
        },
        // 选中景区
        selectScenicItem(val) {
            const select = this.scenicList.filter(item => item.id === val)[0];
            this.formItem.scenicId = select && select.id;
            this.formItem.scenicCode = select && select.scenicCode;
        },
        back() {
            this.$router.back();
        },
        submit() {
            const url =
                this.type === "edit"
                    ? this.baseinfoApi.channelRuleUpdate
                    : this.baseinfoApi.channelRuleSave;
            let params = {};
            
            // return
            if(this.formItem.blockingTime === 0) {
                this.channelRuleParamDTO.blockDateRangeDTO.startDate = null
                this.channelRuleParamDTO.blockDateRangeDTO.endDate = null
            }

            for (let key in this.formItem) {
                if (typeof this.formItem[key] === 'number' || this.formItem[key]) {
                    params[key] = this.formItem[key];
                }
            }
            this.common.formPost(this, {
                url,
                params,
                mold: "modal",
                apiType: "apiPostJson",
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
        setBlockTime(dateArr) {
            if (dateArr && dateArr.length > 1) {
                this.formItem.channelRuleParamDTO.blockDateRangeDTO.startDate =
                    dateArr[0];
                this.formItem.channelRuleParamDTO.blockDateRangeDTO.endDate =
                    dateArr[1];
            }
        },
        setNecessaryContents(val) {
            // console.log(val)
        }
    }
};
</script>


<style lang="scss">
.formGroupTitle {
    font-size: 15px;
    margin-bottom: 10px;
    margin-left: -5px;
    padding: 5px;
}
</style>


