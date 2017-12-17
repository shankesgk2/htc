// tslint:disable:no-console class-name
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import swal from 'sweetalert2';
import 'rxjs/add/operator/do';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';
import { NzMessageService } from 'ng-zorro-antd';

/**
 * 封装HttpClient，主要解决：
 * + 优化HttpClient在参数上便利性
 * + 统一实现 loading
 * + 统一处理时间格式问题
 */
@Injectable()
export class _HttpClient {
    constructor(private http: HttpClient, private _msg: NzMessageService) { }

    private _loading = false;

    /** 是否正在加载中 */
    get loading(): boolean {
        return this._loading;
    }

    private error(error) {
        if (error instanceof HttpErrorResponse) {
            switch (error.status) {
                case 422: // 表单验证错误
                    const error_body = error.error.errors;
                    if (error_body) {
                        console.log('error_body', error_body);
                        const msg: Array<any> = [];
                        for (const key in error_body) {
                            for (const _msg of error_body[key]) {
                                msg.push(_msg);
                            }
                        }
                        swal({
                            title: '请求数据错误',
                            html: msg.join('<br>'),
                            type: 'error',
                            confirmButtonText: '确定'
                        });
                    }
                    break;
                default:
                    this._msg.error(error.message);
                    break;
            }
        } else {
            this._msg.error('系统异常，请稍后再试');
        }
    }


    parseParams(params: any): HttpParams {
        let ret = new HttpParams();
        if (params) {
            for (const key in params) {
                let _data = params[key];
                // 将时间转化为：时间戳 (秒)
                if (moment.isDate(_data)) {
                    _data = moment(_data).unix();
                }
                ret = ret.set(key, _data);
            }
        }
        return ret;
    }

    private begin() {
        this._loading = true;
    }

    private end() {
        this._loading = false;
    }

    /** 服务端URL地址 */
    get SERVER_URL(): string {
        return environment.SERVER_URL;
    }

    /**
     * GET请求
     *
     * @param {string} url URL地址
     * @param {*} [option] 请求选项
     */
    get(url: string, option?: any): Observable<any> {
        this.begin();
        if (option && option.params) option.params = this.parseParams(option.params);
        return this.http
            .get(url, option)
            .do(() => this.end())
            .catch((res) => {
                this.error(res);
                this.end();
                throw res;
            });
    }

    /**
     * POST请求
     *
     * @param {string} url URL地址
     * @param {*} [body] body内容
     * @param {*} [option] 请求选项
     */
    post(url: string, body?: any, option?: any): Observable<any> {
        this.begin();
        if (option && option.params) option.params = this.parseParams(option.params);
        return this.http
            .post(url, body || null, option)
            .do(() => this.end())
            .catch((res) => {
                this.error(res);
                this.end();
                throw res;
            });
    }

    /**
     * DELETE请求
     *
     * @param {string} url URL地址
     * @param {*} [option] 请求选项
     */
    delete(url: string, option?: any): Observable<any> {
        this.begin();
        if (option && option.params) option.params = this.parseParams(option.params);
        return this.http
            .delete(url, option)
            .do(() => this.end())
            .catch((res) => {
                this.error(res);
                this.end();
                throw res;
            });
    }

    /**
     * PUT请求
     *
     * @param {string} url URL地址
     * @param {*} [body] body内容
     * @param {*} [option] 请求选项
     */
    put(url: string, body?: any, option?: any): Observable<any> {
        this.begin();
        if (option && option.params) option.params = this.parseParams(option.params);
        return this.http
            .put(url, body || null, option)
            .do(() => this.end())
            .catch((res) => {
                this.error(res);
                this.end();
                throw res;
            });
    }

    /**
     * PATCH请求
     *
     * @param {string} url URL地址
     * @param {*} [body] body内容
     * @param {*} [option] 请求选项
     */
    patch(url: string, body?: any, option?: any): Observable<any> {
        this.begin();
        if (option && option.params) option.params = this.parseParams(option.params);
        return this.http
            .patch(url, body || null, option)
            .do(() => this.end())
            .catch((res) => {
                this.error(res);
                this.end();
                throw res;
            });
    }

    /**
     * POST或PATCH请求
     *
     * @param {string} url URL地址
     * @param {*} id 操作ID
     * @param {*} [body] body内容
     * @param {*} [option] 请求选项
     */
    post_patch(url: string, id: any, body?: any, option?: any): Observable<any> {
        this.begin();
        if (id) {
            const _url = url + '/' + id;
            return this.patch(_url, body, option);
        } else {
            return this.post(url, body, option);
        }
    }

    /**
     * POST或PUT请求
     *
     * @param {string} url URL地址
     * @param {*} id 操作ID
     * @param {*} [body] body内容
     * @param {*} [option] 请求选项
     */
    post_put(url: string, id: any, body?: any, option?: any): Observable<any> {
        this.begin();
        if (id) {
            const _url = url + '/' + id;
            return this.put(_url, body, option);
        } else {
            return this.post(url, body, option);
        }
    }
}
