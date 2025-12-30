import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';

axios.defaults.baseURL = process.env.VUE_APP_BASE_API;
axios.defaults.responseType = 'json';
axios.defaults.timeout = 30000;

axios.interceptors.request.use(
    (config) => {
        const rnd = Math.floor(Math.random() * 1000000000);

        // let token = sessionStorage.token;
        let token = '843fbe40190288840600a697832633d7';

        config.headers.token = token;
        const menuId = sessionStorage.menuId;
        config.headers.menuId = menuId;
        if (!token) token = 'unlogin';

        const now = Date.parse(new Date());

        // 添加我的额外参数
        if (config.method === 'post') {
            const params = {
                ...config.data,
                _ts: now,
                _rnd: rnd,
                _token: token
            };
            if (config.headers['Content-Type'] === 'application/json') config.data = params;
            // 重新打包post内容，所有post的时候直接post object就行，不要先qs.stringify，否则这里就不适配了
            else config.data = qs.stringify(params);
        } else if (config.method === 'get') {
            const params = {
                ...config.params,
                _ts: now,
                _rnd: rnd,
                _token: token
            };
            config.params = params;
        }
        return config;
    },
    err => Promise.reject(err)
);

axios.interceptors.response.use(
    (response) => {
        if (response.data.code === 403) {
            console.error(`系统错误：${JSON.stringify(response.data)}`);
            window.location.reload();
        }

        return response;
    },
    (error) => {
        console.log(error);
        if (error.message.includes('timeout ')) {
            Message({
                type: 'error',
                message: '请求超时'
            });
        }
        // Do something with response error
        return Promise.reject(error);
    }
);

export function getColumnPageHttp(params) {
    return axios({
        url: '/platform-manage-flow-api/api/form/setting/column/list',
        params,
        method: 'get',
    });
}

export function editColumnHttp(data) {
    return axios({
        url: '/platform-manage-flow-api/api/form/setting/column/edit',
        data,
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
    });
}


export function getColumnTypeHttp(data) {
    return axios({
        url: '/platform-manage-flow-api/api/form/setting/column/type',
        data,
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
    });
}
