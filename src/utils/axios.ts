import axios, { AxiosRequestConfig, AxiosResponse, CustomSuccessData } from "axios";
import { Toast } from 'zarm';

const httpGen = (obj: AxiosRequestConfig) => {
  // 创建axios的实例
  const service = axios.create({
    ...obj,
    timeout: 10000, // 超时时间
  });

  // 默认参数
  service.defaults.withCredentials = true
  service.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
  service.defaults.headers.common['Authorization'] = `${localStorage.getItem('token') || null}`
  service.defaults.headers.post['Content-Type'] = 'application/json'


  service.interceptors.response.use((response: AxiosResponse<CustomSuccessData<any>>) => {
    if (typeof response.data !== 'object') {
      Toast.show('服务端异常！')
      return Promise.reject(response)
    }
    if (response.data.code !== 200) {
      if (response.data.msg) Toast.show(response.data.msg)
      if (response.data.code === 401) {
        window.location.href = '/login'
      }
      return Promise.reject(response.data)
    }
    return response.data;
  })

  return service;
}

export const http = httpGen({baseURL: '/api'})