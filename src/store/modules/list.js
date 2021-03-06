import * as fetch from '../../fetch/api'
import qs from 'qs';
const state = {
  url: '',
  params: '',
  res: '',
  actionsParams: '',
  searchParams: {}
}

const mutations = {
  setUrl (state, url) {
    state.url = url
  },
  setParams (state, params) {
    state.params = params
  },
  columnsHandle (state, params) {
    state.actionsParams = params.actions
    // return [
    //   params('Button', {}, '编辑')
    // ]
    // return [
    //   params('Button', {}, '编辑'),
    //   params('Button', {}, '删除')
    // ]
  }
}

const actions = {
  async getList (context, apiType = 'apiPost') {
    let res = await fetch[apiType](context.state.url, context.state.params)
    // let res = require('../../data/list.json')
    // context.state.res = res
    return res
  },
  async postApi (context, apiType="apiPost") {
    const url = context.state.url + '?' + qs.stringify(context.state.params)
    let res = await fetch[apiType](url, context.state.searchParams)
    // context.state.res = res
    return res
  }
}

export default {
  state,
  mutations,
  actions
}
