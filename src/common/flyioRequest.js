import { textToast } from './utils.js'
import Fly from 'flyio/dist/npm/fly';
const fly = new Fly;
const URL = process.env.BASEURL	//全局总URL
//设置超时
fly.config.timeout = 10000;
//设置请求基地址
fly.config.baseURL = URL;
//添加请求拦截器
// fly.interceptors.request.use((request)=>{
//     //给所有请求添加自定义header
// 	const token = sessionStorage.getItem('token');
//     if (token) {
//        request.headers['authorized'] = token;
//     }
//     return request;
// });
//添加响应拦截器
fly.interceptors.response.use(
    (response) => {
		// 根据后台的需求自定义
		let token = response.headers['authorized'];
		if (token) {
			sessionStorage.setItem('token', token);
		}
        //只将请求结果的data字段返回
		let data = response.data
		if (data.code === 200) {
			 return data
		}else {
			if (data.code === 401) {
			} else {
			  textToast(data.msg)
			}
			return Promise.reject(new Error('error'))
		}
    },
    (err) => {
        // 发生网络错误后会走到这里
		textToast(err.message);
        return Promise.reject(new Error('error'))
        // return err
    }
);
export default fly;