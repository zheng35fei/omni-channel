import {apiGet,apiPost} from '../../fetch/api'

const globalConfig = {
  state: {
    channelType: '',
    cityData:'',
  },
  getters: {
    getPayProduct: (state) => (username) => {

      // return sessionStorage.getItem('payProduct')
      // return this.$cookies.get('userName')
    }
  },
  mutations: {
    setPayProduct: (state,username) => {
      state.userName = username
    }
  },
  actions: {
    async getChannelType(context){
      if(!context.state.channelType){
        let channelType = []
        let res = await apiGet("/channel/type/list")
        if(res.status == 200){
          res.data.forEach((ele)=>{
            let channelTypeItem = {
              value:ele.channelType,
              label:ele.channelTypeName
            }
            channelType.push(channelTypeItem)
          })
        }
        context.state.channelType = channelType
      }
      return context.state.channelType
    },
    async getCityData(context){
      console.log(context.state.cityData)
      if(!context.state.cityData){
        let res = await apiGet("/area/list")
        context.state.cityData = res
        console.log(context.state.cityData)
      }
      return context.state.cityData
    }
  }
}

export default globalConfig
