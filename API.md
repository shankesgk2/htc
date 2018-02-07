### 说明
- 所有错误码参考 [HTTP状态码](#http_status_code)
- 所有接口公共头部添加 `Accept:application/vnd.ds.v1+json`

### 授权
- [x] 登录后获取token，token默认有效期是一个月。
- [x] 需要授权的接口Header添加 `Authorization:Bearer token值`
- [ ] 如果token到期前一星期有新请求，接口会返回一个新的token，APP替换新token，新token有效期一个月。
- [ ] 如果token到期前一星期之内没有新请求，到期后APP要求用户重新登录。
### HTTP状态码分类
状态码|说明
-|-
1xx|信息，服务器收到请求，需要请求者继续执行操作
2xx|成功，操作被成功接收并处理
3xx|重定向，需要进一步的操作以完成请求
4xx|客户端错误，请求包含语法错误或无法完成请求
5xx|服务器错误，服务器在处理请求的过程中发生了错误
### <span id="http_status_code">常用HTTP状态码</span>
状态码|状态|说明
-|-|-
200|OK|服务器成功返回用户请求的数据
201|CREATED|[POST/PUT/PATCH]：用户新建或修改数据成功。
202|Accepted|表示一个请求已经进入后台排队（异步任务）
204|NO CONTENT|[DELETE]：用户删除数据成功。
400|INVALID REQUEST|[POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作。
401|Unauthorized|表示用户没有权限（令牌、用户名、密码错误）。
403|Forbidden|表示用户得到授权（与401错误相对），但是访问是被禁止的。
404|NOT FOUND|用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
406|Not Acceptable|用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
410|Gone|用户请求的资源被永久删除，且不会再得到的。
422|Unprocesable entity|[POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。错误处理请参考[验证错误处理](#a)
500|INTERNAL SERVER ERROR|服务器发生错误，用户将无法判断发出的请求是否成功。

### 验证错误处理
##### 多字段验证返回信息格式示例
```json
{
    "message": "422 Unprocessable Entity",
    "errors": {
        "name": [
            "请填写停车场名称"
        ],
        "longitude": [
            "缺少经度参数"
        ],
        "latitude": [
            "缺少纬度参数"
        ],
        "location": [
            "停车场位置不可为空"
        ],
        "barrier_gates": [
            "道闸参数不可为空"
        ]
    },
    "status_code": 422
}
```

##### 其他验证错误格式示例
```json
{
    "message": "不可重复预约，如需要重新预约请先取消当前预约。",
    "status_code": 500
}
```
> 建议写请求拦截，HTTP状态为422的请求结果。
两种返回格式可以用`errors`判断