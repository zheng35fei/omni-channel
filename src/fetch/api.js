import axios from 'axios'
import qs from 'qs'
import common from '@/common/index'
axios.defaults.timeout = 5000
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? common.apiPrefix : '';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// request 拦截器
axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response拦截
axios.interceptors.response.use(
  response => {
    if(response.data && response.data.status === 402 && response.data.message.includes('用户登录超时')) {
      setCookies('userId','',-1)
      setCookies('token','',-1)
      window.location.href= process.env.BASE_URL + "login"
    }
    return response
  },
  error => {
    if(error.response.data.status==401){
      setCookies('userId','',-1)
      setCookies('token','',-1)
      // return  window.location.href='http://pms.sendinfo.com.cn/login'
    }else if(error.response.status === 500) {
      if(error.response.data.message.includes('用户登录超时')) {
        setCookies('userId','',-1)
        setCookies('token','',-1)
      }
    }
    return Promise.reject(error)
  }
)

function setCookies(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  console.info(cname + "=" + cvalue + "; " + expires);
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function apiGet (url, params = {}, options = {}) {
  if(!url){
   return
  }
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  return new Promise((resolve, reject) => {
    axios.get(url, {params:{...params}})
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function apiPost (url, params = {}) {
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  return new Promise((resolve, reject) => {
    params = qs.stringify(params)
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function apiPostJson (url, params = {}, options = {}) {
  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
  return new Promise((resolve, reject) => {
    axios.post(url, params, options)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}


/**
 * 封装DELETE方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function apiDelete (url, params = {}) {
  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
  return new Promise((resolve, reject) => {
    axios.delete(url, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function apiConfig( url, params = {}, method = 'get', headers = {}) {
  return axios.request({
    method, 
    url,
    params,
    headers
  }).then( res => {
    return res.data
  }).catch( err => {
    return err
  })
}