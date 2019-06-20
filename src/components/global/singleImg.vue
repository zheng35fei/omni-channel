<template>
    <div>
        <div
            v-if="index < limitNum"
            class="demo-upload-list"
            v-for="(item,index) in uploadList"
            :key="index"
        >
            <img :src="item.picUrl || item">
            <div class="demo-upload-list-cover">
                <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
            </div>
        </div>
        <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
            :format="['jpg','jpeg','png',]"
            :max-size="maxSize"
            :multiple="multiple"
            :name="name"
            :on-exceeded-size="handleMaxSize"
            :type="type"
            :action="action"
        >
            <slot>
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera" size="20"></Icon>
                </div>
            </slot>
        </Upload>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    props: {
        maxSize: {
            type: [Number, String],
            default: 3072
        },
        multiple: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: "drag"
        },
        action: {
            type: String,
            default: ""
        },
        uploadList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        limitNum: {
            type: Number,
            default: 9
        },
        header: {
            type: Object
        }
    },
    methods: {
        handleRemove(index) {
            this.uploadList.splice(index, 1);
            this.$emit("getImgUrl", this.uploadList);
        },
        handleSuccess(res, file) {
            if (res.status == 200) {
                if (this.multiple) {
                    this.uploadList.push(res.data);
                } else {
                    this.$emit("getImgUrl", [res.data]);
                    return
                }
                this.$emit("getImgUrl", this.uploadList);
            } else {
                this.$Message.warning("上传失败，请重新上传");
            }
        },
        handleBeforeUpload() {
            if (this.multiple) {
                const check = this.uploadList.length < this.limitNum;
                if (!check) {
                    this.$Notice.warning({
                        title: "上传的照片不能超过" + this.limitNum + "张"
                    });
                }
                return check;
            }
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: "上传的照片文件过大",
                desc: "照片  " + file.name + " 过大, 不能超过 2M"
            });
        }
    },
    mounted() {}
};
</script>
<style>
.demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
}
.demo-upload-list img {
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}
.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>
