<template>
    <div class="login-main">
        <h3 class="login-title">后台管理系统</h3>
        <Form ref="formInline" :model="formInline" :rules="ruleInline" class="login-from">
            <FormItem prop="userName">
                <Input type="text" v-model="formInline.userName" placeholder="用户名">
                    <Icon type="ios-person-outline" slot="prepend"/>
                </Input>
            </FormItem>
            <FormItem prop="password">
                <Input type="password" v-model="formInline.password" placeholder="密码">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="corpCode">
                <Input type="text" v-model="formInline.corpCode" placeholder="企业码">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="checkCode">
                <Row>
                    <Col span="9">
                        <Input type="text" v-model="formInline.checkCode" placeholder="验证码"></Input>
                    </Col>
                    <Col span="9">
                        <img :src="codeImg" @click="getCode" class="code-img">
                    </Col>
                    <Col span="6">
                        <a @click="getCode" href="javascript:;">换一换</a>
                    </Col>
                </Row>
            </FormItem>
            <!--<FormItem label="用户状态"-->
            <!--prop="accStatus"-->
            <!--:rules="accStatusRule">-->
            <!--<Select v-model="formInline.accSt"-->
            <!--style="width:200px">-->
            <!--<Option value="T">正常</Option>-->
            <!--<Option value="F">锁定</Option>-->
            <!--</Select>-->
            <!--</FormItem>-->
            <FormItem>
                <Button type="primary" long @click="handleSubmit()">登录</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import { getters, actions } from "vuex";
import store from "@/store";
import Main from "./main";

export default {
    data() {
        return {
            formInline: {
                userName: "",
                password: "",
                checkCode: "",
                corpCode: "",
                key: ""
                // accStatus:""
            },
            codeImg: "",
            ruleInline: {
                userName: [
                    { required: true, message: "请填写用户名", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请填写密码", trigger: "blur" },
                    {
                        type: "string",
                        min: 6,
                        message: "密码长度不能小于6位",
                        trigger: "blur"
                    }
                ],
                checkCode: [
                    { required: true, message: "请填写验证码", trigger: "blur" }
                ]
            }
            // accStatusRule: [{ required: true, message: '请选择用户状态', trigger: 'change' }]
        };
    },
    store,
    beforeCreate() {
        document.getElementsByTagName("body")[0].className = "login-bg";
    },
    beforeDestroy() {
        document.body.removeAttribute("class", "add_bg");
    },
    mounted() {
        this.getCode();
    },
    created() {
        //   this.$cookies.set("pmsToken", "testToken123456");
        // 绑定enter键盘事件
        document.onkeydown = e => {
            if (window.event.keyCode == 13) {
                this.handleSubmit();
            }
        };
    },
    methods: {
        // ...actions([
        //   'setUserIdAction'
        // ]),
        getCode() {
            this.formInline.key = new Date().getTime();
            this.codeImg =
                this.common.apiPrefix +
                "/api/checkCode?key=" +
                this.formInline.key;
            //   this.codeImg = "/checkCode";
        },
        handleSubmit() {
            this.$refs.formInline.validate(async valid => {
                if (valid) {
                    let url = "";
                    let params = {};
                    for (let key in this.formInline) {
                        this.formInline[key] &&
                            (params[key] = this.formInline[key]);
                    }
                    if (this.$route.path == "/login") {
                        url = "/login";
                    } else if (this.$route.path == "/adminLogin") {
                        url = "/manage/admin/admin/logining";
                    }
                    this.$store
                        .dispatch("login", {
                            url,
                            params
                        })
                        .then(async res => {
                            // let res = require('../data/user')
                            if (res.status === 200) {
                                //sesstionstorage缓存登录用户token，vuex中缓存userId，用户后续路由beforeEach中判断也是是刷新还是只是路由变化
                                this.$cookies.set("token", res.data.sessionId);
                                this.$cookies.set("userId", res.data.id);
                                this.$store.dispatch(
                                    "setUserIdAction",
                                    res.data.id
                                );
                                await this.$store.dispatch("getMenu"); //获取权限
                                this.$store.dispatch("formaterRouterHandle"); // 根据权限获取路由
                                this.$router.addRoutes([
                                    {
                                        path: "/wqdwqdwqdwa",
                                        name: "qwdwqd",
                                        component: Main,
                                        children: [
                                            ...this.$store.state.menu.asyncRouter
                                        ]
                                    }
                                ]); // 动态加载路由
                                // this.formaterRouterHandle()
                                console.log(
                                    this.$store.state.menu.asyncRouter[0]
                                );
                                this.$router.push(
                                    this.$store.state.menu.asyncRouter[0].path
                                );
                            } else {
                                this.$Message.error(res.message);
                            }
                        })
                        .catch(err => {
                            this.$Message.error(err);
                        });
                }
            });
        }
    }
};
</script>
<style>
@import "../assets/styles/login.css";
</style>
