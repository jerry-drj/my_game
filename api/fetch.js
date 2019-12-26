const axios = require('axios');

let fetch = axios.create({
  baseURL: '',
  timeout: 1000*60*60
  });

  //添加请求拦截器
  fetch.interceptors.request.use(config =>{
  //在发送请求之前做某事
  return config;
},(error) =>{
  //请求错误时做些事
  return Promise.reject(error);
});

//添加响应拦截器
fetch.interceptors.response.use(response => {
  //对响应数据做些事
  return response;
},(error) =>{
  //请求错误时做些事
  return Promise.reject(error);
});
module.exports =fetch;