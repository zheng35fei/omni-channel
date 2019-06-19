<template>
    <Row type="flex" align="top" style="height: 400px; overflow: auto; padding-top: 80px;">
        <Col :span="20" align="center" style="position: absolute; top: 80px; left:50%; margin-left: -42%; z-index: 2;">
            <Input v-model="filterName" placeholder="输入字体关键字, 比如system" clearable />
        </Col>
        <Col style="padding: 15px 0; cursor:pointer; z-index: 1" :span="4" align="center" v-for="(icon, index) in filterList" :key="icon" @click.native="select(icon, index)">
            <Icon :type="icon" :size="32" :color="index === selectIndex ? '#f66' : ''" />
            <p style="margin-top:5px;">{{icon}}</p>
        </Col>
    </Row>
</template>
<script>
import icons from '@/data/icons.js'
export default {
    computed: {
        filterList() {
            return this.list.filter( icon => icon.includes(this.filterName))
        }
    },
    methods: {
        select(name, index) {
            this.selectIndex = index
            this.selectIcon = name
            this.$emit('selected-icon', name)
        }
    },
    data() {
        return {
            filterName: "",
            selectIndex: '',
            selectIcon: '',
            list: icons
        };
    }
    // props: {
    //     list: {
    //         type: Array,
    //         value: []
    //     },
    // }
};
</script>