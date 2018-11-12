/**
 * Created by Ding on 2017/7/28.
 */

// var urlBase = "http://192.168.1.107:8080/oa";//服务器路径
// var urlBase = "http://59.78.100.126:8083/oa";//服务器路径
// var urlBase = "http://192.168.1.100:8083/oa";//服务器路径
// var urlFileBase = "http://192.168.1.100:8083/";//服务器路径
var urlBase = "http://58.39.144.24/oa";//服务器路径
var urlFileBase = "http://58.39.144.24/";//服务器路径

function connectToServer(type, url, data, async, callBack, isApprove) {
    url = urlBase + url;
    data = isApprove?encryptionApprove(type, url, data) : encryption(type, url, data);
    $.ajax({
        type: type,
        url: url,
        data: data,
        async: async,
        dataType: "json",
        success: function (data) {
            switch (data.code){
                case 200:
                    callBack(data.data);
                    break;
                case 401:
                    jAlert("系统提示："+data.msg,"服务器错误");
                    addCookie("approvePS", undefined);
                    break;
                default:
                    callBackFail(data.msg);
                    break;
            }
        }
    });
}

function callBackFail(msg) {
    console.log(msg);
    switch(msg){
        case "验证失败":
            break;
        default :
            jAlert("系统提示："+msg,"服务器错误");
            break;
    }
}

function encryption(type, url, data) {
    var cookie = getCookieValue();
    var dateTime = new Date().getTime().toString();
    var kDate = CryptoJS.HmacSHA256(dateTime, cookie.id);
    console.log(kDate.toString());
    var kPassword = CryptoJS.HmacSHA256(cookie.password, kDate);
    console.log(kPassword.toString());
    var kType = CryptoJS.HmacSHA256(type, kPassword);
    console.log(kType.toString());
    url = url.replace(urlBase,"");
    var kUrl = CryptoJS.HmacSHA256(url, kType);
    console.log(kUrl.toString());
    var temp = signedHeaders(data);
    //console.log(temp.toString());
    var kContent = CryptoJS.HmacSHA256(temp, kUrl);
    console.log(kContent.toString());
    data.dateTime = dateTime;
    data.userID = cookie.id;
    data.validateCode = kContent.toString();
    return data;
}

function encryptionApprove(type, url, data) {
    var cookie = getCookieValue();
    var dateTime = new Date().getTime().toString();
    var kDate = CryptoJS.HmacSHA256(dateTime, cookie.id);
    console.log(kDate.toString());
    var kPassword = CryptoJS.HmacSHA256(cookie.password, kDate);
    console.log(kPassword.toString());
    var kApprovePS = CryptoJS.HmacSHA256(cookie.approvePS, kPassword);
    console.log(kApprovePS.toString());
    var kType = CryptoJS.HmacSHA256(type, kApprovePS);
    console.log(kType.toString());
    url = url.replace(urlBase,"");
    var kUrl = CryptoJS.HmacSHA256(url, kType);
    console.log(kUrl.toString());
    var content = signedHeaders(data).toString();
    var kContent = CryptoJS.HmacSHA256(content, kUrl);
    console.log(kContent.toString());
    data.dateTime = dateTime;
    data.userID = cookie.id;
    data.validateCode = kContent.toString();
    return data;
}

function signedHeaders(data) {
    var keys = [];
    for(var key in data) {
        if (data[key]||data[key]==0) {
            var temp = key + ":" + data[key];
            keys.push(temp);
        }
    }
    var result = keys.sort().join(';');
    return result;
}

/**
 * 添加Cookie
 * @param name
 * @param value
 * @param hour 过期小时
 */
function addCookie(name, value, hour) {
    if (!hour) {
        hour = 240;//过期时间设置为10天
    }
    var cookieName = encodeURI(name);
    var cookieValue = encodeURI(value);
    var expires = new Date();
    expires.setTime(expires.getTime() + hour * 3600000);
    document.cookie = cookieName + "=" + cookieValue + ";expires=" + expires.toUTCString() + ";path=/";
}

/**
 * 清除Cookie
 */
function clearCookie() {
    if (document.cookie.length <= 0) {
    } else {
        var info = document.cookie.split("; ");
        for (var i = 0; i < info.length; i++) {
            var arr = info[i].split("=");
            var cookieName = decodeURI(arr[0]);
            var cookieValue = decodeURI(arr[1]);
            var expires = new Date();
            expires.setTime(expires.getTime() - 10 * 3600000 * 24);
            document.cookie = cookieName + "=" + cookieValue + ";expires=" + expires.toUTCString() + ";path=/";
        }
    }
}

/**
 * 依据参数名获取URL中参数值
 */
function getParameter(param){
    var query = window.location.search;
    var iLen = param.length;
    var iStart = query.indexOf(param);
    if (iStart == -1)
        return "";
    iStart += iLen + 1;
    var iEnd = query.indexOf("&", iStart);
    if (iEnd == -1)
        return query.substring(iStart);
    return query.substring(iStart, iEnd);
}

/**
 * 将Cookie转换为Object对象
 * @returns {{}}
 */
function getCookieValue() {
    var info = document.cookie.split("; ");
    var map = {};
    for (var i = 0; i < info.length; i++) {
        var arr = info[i].split("=");
        var cookieName = decodeURI(arr[0]);
        map[cookieName] = decodeURI(arr[1]);
    }
    return map;
}

/**
 * 获取用户信息
 */
function getUserInfo() {
    var cookie = getCookieValue();
    var user = {};
    user.id = cookie.id;
    user.name = cookie.name;
    user.roleList = JSON.parse(cookie.roleList);
    return user;
}

/**
 * 上传文件
 * @param url 上传路径
 * @param form 上传内容
 * @param onLoadEnd 上传完成执行函数
 * @param onProgress 上传中执行函数
 */
function uploadFile(url, form, onLoadEnd, onProgress) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onloadend = function () {
        onLoadEnd(xhr.response);
    };
    xhr.upload.onprogress = function (evt) {
        onProgress(evt);
    };
    xhr.send(form);
}

/**
 * 改变时间控件的最小时间
 * @param timer
 * @param date
 */
function changeMinTime(timer,date) {
    date.month -= 1;
    timer.config.min = date;
}

Date.prototype.Format = function (fmt) {
    if(!fmt){
        fmt = "yyyy-MM-dd";
    }
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};


//时间戳转时间 2010-10-1 10:10:10
function getStandardDate(time){
    var date = new Date(time);
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate()+'&nbsp;&nbsp; ';
    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
    s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());
    return Y+M+D+h+m+s;
}

//制保留2位小数，如：2，会在2后面补上00.即2.00
function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        f=0;
    }
    f = Math.round(f*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}
