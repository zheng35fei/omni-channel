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
            <FormItem label="名称：" prop="funName">
                <Input v-model="formItem.funName" placeholder="填写菜单名称" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="唯一编码：" prop="funCode">
                <Input v-model="formItem.funCode" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="功能图标：" prop="funIco">
                <Input v-model="formItem.funIco" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="URL：" prop="funUrl">
                <Input v-model="formItem.funUrl" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="父ID：" prop="parentId">
                <Input v-model="formItem.parentId" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="所属类型：">
                <CheckboxGroup v-model="funType">
                    <Checkbox
                        v-for="item in funTypes"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value"
                    >{{item.label}}</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="打开方式：" prop="openType">
                <Select v-model="formItem.openType" style="width:200px">
                    <Option
                        v-for="item in openMode"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="标识：">
                <Input v-model="formItem.optType" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="排序：" prop="sortNo">
                <Input v-model="formItem.sortNo" style="width:33%;" number></Input>
            </FormItem>
            <FormItem label="层级深度：" prop="hierarchy">
                <Select v-model="formItem.hierarchy" style="width:200px">
                    <Option
                        v-for="item in Hierarchy"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="功能类型" prop="functionType">
                <Select v-model="formItem.functionType" style="width:200px">
                    <Option
                        v-for="item in functionTypes"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</Option>
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
            openMode: [
                {
                    value: "_blank",
                    label: "打开新页面"
                },
                {
                    value: "_self",
                    label: "当前页面打开"
                }
            ],
            Hierarchy: [
                {
                    value: 0,
                    label: "一级菜单"
                },
                {
                    value: 1,
                    label: "二级菜单"
                },
                {
                    value: 2,
                    label: "三级菜单"
                },
                {
                    value: 3,
                    label: "四级菜单"
                }
            ],
            funTypes: [
                {
                    value: "superAdmin",
                    label: "系统管理员"
                },
                {
                    value: "parkAdmin",
                    label: "景区管理员"
                },
                {
                    value: "dist",
                    label: "分销商"
                },
                {
                    value: "extension",
                    label: "推广员"
                }
            ],
            functionTypes: [
                {
                    value: "menu",
                    label: "菜单"
                },
                {
                    value: "column",
                    label: "栏目"
                },
                {
                    value: "button",
                    label: "按钮"
                }
            ],
            formItem: {
                id: "",
                parentId: "",
                funName: "",
                funCode: "",
                optType: "",
                sortNo: "",
                openType: "",
                funUrl: "",
                functionType: "",
                hierarchy: null,
                parentId: "",
                funType: ""
            },
            funType: [],
            ruleForm: {
                funName: [
                    { required: true, message: "请输入名称", trigger: "blur" }
                ],
                funCode: [
                    {
                        required: true,
                        message: "请输入唯一编码",
                        trigger: "blur"
                    }
                ],
                openType: [
                    {
                        required: true,
                        message: "请选择打开方式",
                        trigger: "change"
                    }
                ],
                sortNo: [
                    {
                        required: true,
                        type: "number",
                        message: "请输入排序",
                        trigger: "blur"
                    }
                ],
                hierarchy: [
                    {
                        required: true,
                        type: "number",
                        message: "请选择层级深度",
                        trigger: "change"
                    }
                ],
                functionType: [
                    {
                        required: true,
                        message: "请选择功能类别",
                        trigger: "change"
                    }
                ]
            },
            type: "add"
        };
    },
    created() {
        if (this.$route.query.id || this.$route.query.id == 0) {
            this.type = "edit";
            apiGet(this.adminApi.menuToEdit + this.$route.query.id).then(res => {
                if (res.status == 200) {
                    for(let key in this.formItem) {
                      this.formItem[key] = res.data[key]
                    }
                    this.funType = res.data.funType
                        ? res.data.funType.split(",")
                        : [];
                }
            });
        }
        if (
            (this.$route.query.parentId || this.$route.query.parentId == 0) &&
            (this.$route.query.parentHierarchy ||
                this.$route.query.parentHierarchy == 0)
        ) {
            this.formItem.hierarchy = this.$route.query.parentHierarchy;
            this.formItem.parentId = this.$route.query.parentId;
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
        }
    }
};
</script>


<style lang="scss">
.addMenu {
    margin-top: 20px;
}
</style>


