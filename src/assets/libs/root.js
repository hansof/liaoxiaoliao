import axios from 'axios'
import util from './util'
import Qs from 'qs'
import token from '@/components/getToken/getToken';
const host = window.location.host;
axios.defaults.baseURL = 'http://192.168.1.12/';
if (host.indexOf("liaoxiaoliao") >= 0) {
    axios.defaults.baseURL = "https://wx.liaoxiaoliao.com/";
}
export default {
    install(Vue, options) {
        Vue.prototype.ajaxRequest = (params, callback) => {
            let accessToken = util.getCookie('token');
            let url = params.path;
            
            delete params.path;
            var sing = util.sort_ASCII(params.data);
            if (!!sing) {
                let obj = {}
                for (let item in params.data) {
                    if (item!="images") {
                        obj[item] = encodeURIComponent(params.data[item]);
                    }

                }
                obj.sign = hex_md5(sing + '&token=' + accessToken).toUpperCase();
                obj.images = params.data.images;
                params.data = obj;
            } else {
                params.data = {
                    sign: hex_md5('token=' + accessToken).toUpperCase()
                }
            }
            // if (url.indexOf("token") <= -1) {
            axios.defaults.headers["token"] = `${accessToken}`;
            // }
            if (url.indexOf("generator") > -1) {
                // axios.defaults.headers['content-type'] = 'multipart/form-data';
                axios.defaults.headers['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                params = Qs.stringify(params);
            } else {
                axios.defaults.headers['content-type'] = 'application/json';

            }
            axios({
                method: 'post',
                url: axios.defaults.baseURL + url,
                data: JSON.stringify(params) == '{}' ? "" :params
            }).then(response => {
                if (response.data.code == '1003' || !accessToken) {
                    //重新获取token
                    token(true).then(res => {
                        //token获取成功重新发起请求
                        let cfgdata = response.config.data ? JSON.parse(response.config.data) : { data: {} };
                        response.config.headers.token = res;
                        if (!!cfgdata.data) {
                            cfgdata.data.sign = hex_md5(sing + '&token=' + res).toUpperCase();
                        } else {
                            cfgdata = {
                                sign: hex_md5('token=' + res).toUpperCase()
                            }
                        }
                        response.config.data = JSON.stringify(cfgdata);
                        axios(response.config).then(response => {
                            if (response.data.errorCode == '0000') {
                                callback && callback(response);
                            } else {
                                callback && callback({data: { "errorCode": "0047", "code": "0047", "message": "网络异常，请稍后再试！" }});
                            }
                        });
                    }).catch(res => {
                        callback && callback({data: { "errorCode": "0047", "code": "0047", "message": "网络异常，请稍后再试！" }});
                    });
                } else {
                    callback && callback(response);
                }
            }).catch(function (error) {
                callback && callback({data: { "errorCode": "0047", "code": "0047", "message": "网络异常，请稍后再试！" }});
                console.log(error);
            });
        };
        Vue.prototype.formRequest = (params, callback) => {
            let url = params.path;
            delete params.path;
            axios.defaults.headers['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            axios({
                method: 'post',
                url: axios.defaults.baseURL + url,
                data: Qs.stringify(params)
            }).then(response => {
                if (response.data.code == "0") {
                    callback && callback(response);
                } else {
                    callback && callback({ data: { "errorCode": "0047", "code": "0047", "message": "网络异常，请稍后再试！" } });
                }
            }).catch(function (error) {
                callback && callback({ data: { "errorCode": "0047", "code": "0047", "message": "网络异常，请稍后再试！" } });
                console.log(error);
            });
        };
        Vue.prototype.formDataRequest = (params, callback) => {
            let accessToken = util.getCookie('token');
            let url = params.path,sing_sort = util.sort_ASCII(params.data);
            let sign = hex_md5(sing_sort + '&token=' + util.getCookie('token')).toUpperCase();
            delete params.path;
            axios.defaults.headers['content-type'] = 'multipart/form-data';
            axios.defaults.headers["token"] = `${accessToken}`;
            let formData = new FormData()
            formData.append('sign', sign);
            for (let i in params.data) {
                if (i == 'images') {
                    for (let n = 0; n < params.data[i].length; n++) { 
                        formData.append(i, params.data[i][n]);
                    }
                } else {
                    formData.append(i, encodeURIComponent(params.data[i]));
                }
            }
            axios({
                method: 'post',
                url: axios.defaults.baseURL + url,
                data: formData,
            }).then(response => {
                    callback && callback(response);
            }).catch(function (error) {
                callback && callback({ data: { "errorCode": "0047", "code": "0047", "message": "网络异常，请稍后再试！" } });
                console.log(error);
            });

            // let config = {
            //         headers: {
            //         'Content-Type': 'multipart/form-data'
            //         }
            //     }
            //     axios.post(axios.defaults.baseURL + url, formData,config).then( res => {
            //     console.log(res)
            //     }).catch( res => {
            //     console.log(res)
            //     })
        }
    }
}