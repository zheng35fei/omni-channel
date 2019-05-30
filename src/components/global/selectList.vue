<template>
  <div class="city-select">
    <Row>
        <Col class="city-list-item" span="8">
          <Select v-model="sheng" :disabled="disabled" @on-change="choseProvince" placeholder="省级地区">
            <Option
              v-for="item in province"
              :key="item.areaCode"
              :label="item.areaName"
              :value="item.areaCode"
              :selected="item.areaCode == sheng"
            ></Option>
          </Select>
        </Col>


        <Col class="city-list-item" span="8">
          <Select v-model="shi" :disabled="disabled" @on-change="choseCity" placeholder="市级地区">
            <Option
              v-for="item in shi1"
              :key="item.areaCode"
              :label="item.areaName"
              :value="item.areaCode"
              :selected="item.areaCode == shi"
            ></Option>
          </Select>
        </Col>


        <Col class="city-list-item" span="8">
          <Select v-model="qu" :disabled="disabled" @on-change="choseBlock" placeholder="区级地区">
            <Option
              v-for="item in qu1"
              :key="item.areaCode"
              :label="item.areaName"
              :value="item.areaCode"
              :selected="item.areaCode == qu"
            ></Option>
          </Select>
        </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      province: "",
      sheng: "",
      shengName:"",
      shi: "",
      shiName: "",
      shi1: [],
      qu: "",
      quName: "",
      qu1: [],
      city: "",
      block: "",
      areaCode: "",
    };
  },
  props: {
    addrCode: {
      type: String,
    },
    fieldName:{
      type: String,
      default: "addressCode"
    },
    disabled:{
      type:Boolean ,
      default: false
    },
  },
  watch: {
    addrCode(val, oldVal){
      this.updateArea()
    },
    // async addrCode(val, oldVal) {
    //   if (val){
    //     this.updateArea()
    //   } else {
    //     this.sheng = "";
    //     this.shi = "";
    //     this.qu = "";
    //     this.shi1 = [];
    //     this.qu1 = [];
    //   }
    // }
  },
  mounted() {
    // this.$nextTick(async () => {
    //   this.updateArea()
    // }, 200);
  },
  created() {
    this.getCityData();
  },
  methods: {
    getCityData() {
      this.$store.dispatch("getCityData").then(res => {
        this.province = res.data;
      });
    },
    // 选省
    choseProvince(e) {
      for (let index2 in this.province) {
        if (e === this.province[index2].areaCode) {
          // this.$emit("getProvince", this.province[index2].areaName, e);
          this.shi1 =  this.province[index2].subList
          this.shengName = this.province[index2].areaName
          break;
        }
      }
      // let params = {
      //   parentCode:e
      // }
      // this.apiGet(this.url,params).then(
      //   res => {
      //     this.shi1 = res.data;
      //     this.shi = "";
      //     this.qu = "";
      //     for (var index2 in this.province) {
      //       if (e === this.province[index2].areaCode) {
      //         this.$emit("getProvince", this.province[index2].areaName, e);
      //       }
      //     }
      //   }
      // );
    },
    // 选市
    choseCity(e) {
      for (let index3 in this.shi1) {
        if (e === this.shi1[index3].areaCode) {
          // this.$emit("getProvince", this.province[index2].areaName, e);
          this.qu1 =  this.shi1[index3].subList
          this.shiName =  this.shi1[index3].areaName
          break;
        }
      }
      // let params = {
      //   parentCode:e
      // }
      // this.apiGet(this.url,params).then(
      //   res => {
      //     this.qu1 = res.data;
      //     this.qu = "";
      //     for (var index3 in this.shi1) {
      //       if (e === this.shi1[index3].areaCode) {
      //         this.$emit("getCity", this.shi1[index3].areaName, e);
      //       }
      //     }
      //   }
      // );
    },
    // 选区
    choseBlock(e) {
      for (let index4 in this.qu1) {
        if (e === this.qu1[index4].areaCode) {
          this.quName = this.qu1[index4].areaName
          break;
        }
      }
      let area = [{
        value:this.sheng,
        label:this.shengName
        },{
        value:this.shi,
        label:this.shiName
        },{
        value:this.qu,
        label:this.quName
      }]

      // this.areaCode = this.sheng+"-"+this.shi+"-"+ this.qu;
      this.$emit("getQu", area,this.fieldName)

    },
    // 获取选择后的省市区编码
    // getArea(){
    //   let areaCode =  this.sheng+"-"+this.shi+"-"+ this.qu;
    //   return areaCode
    // },
    // 更新市或区
    updateArea(){
      if (this.addrCode){

        this.sheng = this.addrCode.split("-")[0];
        this.shi = this.addrCode.split("-")[1];
        this.qu = this.addrCode.split("-")[2];

        this.$store.dispatch("getCityData").then(res => {
          this.province = res.data;
          this.choseProvince(this.sheng)
          this.choseCity(this.shi)
          this.choseBlock(this.qu)
        });
        // let params = {}
        // if (this.sheng) {
        //   params.parentCode = this.sheng
        //   let shires = await this.apiGet(this.url,params);
        //   this.shi1 = shires.data;
        // }
        // if (this.shi) {
        //   params.parentCode = this.shi
        //   let qures = await this.apiGet(this.url,params);
        //   this.qu1 = qures.data;
        // }
      }
    }
  }
};
</script>

<style lang="scss">
.city-select {
  .ivu-col.ivu-col-span-3 {
    margin-right: 8px;
  }
  .city-list-item{
    .ivu-form-item{
      margin-bottom: 0;
    }
  }
}
</style>


