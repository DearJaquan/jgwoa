/**
 * Created by feijiahui on 2017/7/26.
 */

window.onload = function init() {
    if (localStorage.getItem("remember") == 1 ){
        document.getElementById("username").value = localStorage.getItem("username");
        document.getElementById("password").value = localStorage.getItem("password");
        login();
    }
};



/**
 * 用户登陆
 */
function login(){
    var password = $("#password").val();    //发布时加密，测试时明文
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCLnwM/jgBq/qmmpvKd1TK5FRFAQ5sK6SpJzYBWcMItut8UOoHstJ28Rz8LHHsgoeOYmL4iWs0miF2fuDJzDJrqgDKX8jMpFOR0SjNBH3XC2grP4Pn9KoesNN4J5dcPzfCxg1iRnFnyssUJArPUuHqnfBoBIepRu63L7wwxy1m1MwIDAQAB");
    var PW = encrypt.encrypt(password);
    $.ajax({
        type: "POST",
        // url: urlBase+"/ws/user/login/app",   //发布
        url: urlBase+"/ws/user/login",  //测试
        async: false,
        //发布时检查password、version，device
        data: {username:$("#username").val(), password:password, version:"1.09", device:"0"},
        dataType: "json",
        success: function(data){
            //alert("数据：" + data + "\n状态：" + status);
            var info = data.data;
            // console.log(info.error_code);
            if(info.error_code==0){
                localStorage.setItem("nowIndex",0);
                addCookie("username",$("#username").val());
                // window.JPush.setAlias({ sequence: 1, alias: $("#username").val() });
                localStorage.setItem("username",$("#username").val());
                addCookie("password","001");
                localStorage.setItem("password",$("#password").val());
                if (document.getElementById("remember").checked){
                    localStorage.setItem("remember", 1);
                }
                addCookie("validate_code",info.validate_code);
                addCookie("relatedId",info.user.relatedId);
                addCookie("id",info.user.id);
                window.JPush.setAlias({ sequence: 1, alias: info.user.id });
                addCookie("name",info.user.name);
                addCookie("account",info.user.account);
                addCookie("signaturePath",info.user.signaturePath);
                addCookie("signaturePath",info.user.signaturePath);
                addCookie("idCode",info.user.idCode);
                addCookie("gender",info.user.gender);
                var department = JSON.stringify(info.user.department);
                addCookie("department",department);
                var roleList = JSON.stringify(info.user.roleList);
                addCookie("roleList",roleList);
                addCookie("createTime",info.user.createTime);
                addCookie("modifyTime",info.user.modifyTime);
                window.location.href = 'pages/index/indexInfo.html';
            }else if(info.error_code==2){
                jAlert('发现新版本，点击下载更新！','版本检测',function(){window.location.href = info.path;});
            }else{
                $("#hintLogin").text("用户名或密码不正确");
            }
            
        }
        // error: function() {
        //     alert("URL加载失败！！！");
        // }
    });
}

/**
 * 消息推送
 */
var onDeviceReady = function() {
    initiateUI();
};

var getRegistrationID = function() {
    window.JPush.getRegistrationID(onGetRegistrationID);
};

var onGetRegistrationID = function(data) {
    try {
        console.log("JPushPlugin:registrationID is " + data);

        if (data.length == 0) {
            var t1 = window.setTimeout(getRegistrationID, 1000);
        }

        $("#registrationId").html(data);
    } catch (exception) {
        console.log(exception);
    }
};


var onOpenNotification = function(event) {
    try {
        var alertContent;
        if (device.platform == "Android") {
            alertContent = event.alert;
        } else {
            alertContent = event.aps.alert;
        }
        alert("open Notification:" + alertContent);
    } catch (exception) {
        console.log("JPushPlugin:onOpenNotification" + exception);
    }
};

var onReceiveNotification = function(event) {
    try {
        var alertContent;
        if (device.platform == "Android") {
            alertContent = event.alert;
        } else {
            alertContent = event.aps.alert;
        }
        $("#notificationResult").html(alertContent);
    } catch (exception) {
        console.log(exception)
    }
};

var onReceiveMessage = function(event) {
    try {
        var message;
        if (device.platform == "Android") {
            message = event.message;
        } else {
            message = event.content;
        }
        $("#messageResult").html(message);
    } catch (exception) {
        console.log("JPushPlugin:onReceiveMessage-->" + exception);
    }
};

var initiateUI = function() {
    try {
        window.JPush.init();
        window.setTimeout(getRegistrationID, 1000);
        if (device.platform != "Android") {
            window.JPush.setDebugModeFromIos();
            window.JPush.setApplicationIconBadgeNumber(0);
        } else {
            window.JPush.setDebugMode(true);
            // window.JPush.setStatisticsOpen(true);
        }
    } catch (exception) {
        console.log(exception);
    }
};

document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("jpush.openNotification", onOpenNotification, false);
document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);