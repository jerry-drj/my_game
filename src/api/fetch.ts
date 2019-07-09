import axios from 'axios'
  const instance = axios.create({
    baseURL: '',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'},
  });
    // 添加请求拦截器
    instance.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    return config;
    }, error => {
      // 对请求错误做些什么
      return Promise.reject(error);
    });
    // 添加响应拦截器
    instance.interceptors.response.use(response => {
      // 对响应数据做点什么
      return response;
    }, error => {
    // 对响应错误做点什么
      return Promise.reject(error);
    });


export default instance