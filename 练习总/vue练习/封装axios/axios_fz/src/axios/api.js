import { Message } from "element-ui";
import axios from "axios";
import router from "../router/index"//配置路由的文件
const Api = axios.create({
  baseURL:'http://chaoshiapi.qiqiangkeji.com',
  timeout:10000,
  responseType:'json',
  withCredentials:true,// 是否允许带cookie这些
  headers:{
    'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
  }
});
//请求拦截器
Api.interceptors.request.use(
  config =>{
    if(config.method === 'post'){
      config.data = JSON.stringify(config.data);
    }
    return config;
  },
  error => {
    Message({
      showClose:true,
      message:error,
      type:'warning'
    });
    return Promise.reject(error)
  }
)
//响应拦截器
Api.interceptors.response.use(
  res =>{
    if (res.data && res.data.code!==0) {
      Message({
        showClose:true,
        message:res.data.msg,
        type:'warning'
      });
    }else if(res.data && res.data.code==0){
      Message({
        showClose:true,
        message:res.data.msg,
        type:'success'
      });
    }
    return res.data;
  },
  error => {
    if(error.data){
      switch (error.data.code){
        case 401:
          router.push({
            path:'/login',
            query:{
              redirect:router.currentRoute.fullPath
            }
          });
          break;
      }
    }
    return Promise.reject(error);
  }
)
export default {
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, "$http", { value: Api });
  }
};

