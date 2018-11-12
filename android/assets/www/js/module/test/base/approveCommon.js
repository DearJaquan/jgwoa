/**
 * Created by Revan on 2017/7/18.
 */

var url = "http://192.168.1.107:8080";

/**
 * 设置流程表单大小
 * @param workArea
 */
function initSize(workArea) {
    workArea.width(window.screen.availHeight * 0.8);
}

/**
 * 获取用户信息
 */
function getUserInfo(){
    var cookie = getCookieValue();
    var user = {};
    user.ID = cookie.id;
    user.name = cookie.name;
    user.roleList = JSON.parse(cookie.roleList);
    return user;
}

/**
 * 获取可发起流程角色列表
 */
function getLaunchRole(user, canLaunch){
    user.launchRoleList = [];
    for (var i=0; i<user.roleList.length; i++){
        for (var j=0; j<canLaunch.length; j++){
            if(user.roleList[i].name.indexOf(canLaunch[j]) > -1){
                user.launchRoleList.push(user.roleList[i]);
            }
        }
    }
    user.launchRole = {};
    if(user.launchRoleList.length > 0){
        user.launchRole.id = user.launchRoleList[0].id;
        user.launchRole.name = user.launchRoleList[0].name;
    }
}
/**
 * 获取业务科室
 * instanceType（流程类型）
 * userID（用户ID）
 * 返回：业务科室列表
 */
function getSection(instanceType,userID,callback,isAsync){
    if(isAsync == null){
        isAsync = true;
    }
    $.ajax({
        type:"GET",
        url:url+"/jdjgw-oa/ws/architecture/all",
        data:{
            instanceType:instanceType,
            userID:userID
        },
        async: isAsync,
        dataType:"JSON",
        success:function(data){
            var info = data.data;
            callback(info);
        },
        error:function(){

        }
    });
}
/**
 * 获取分管领导
 * instanceType（流程类型）
 * userID（用户ID）
 * 返回：branchLeader（默认分管领导ID）
 *     branchLeaderList（分管领导列表）
 */
function getBranchLeader(instanceType,userID,callback,isAsync){
    if(isAsync == null){
        isAsync = true;
    }
    $.ajax({
        type:"GET",
        url:url+"/jdjgw-oa/ws/user/personality/branchleader",
        data:{
            instanceType:instanceType,
            userID:userID
        },
        async: isAsync,
        dataType:"JSON",
        success:function(data){
            var info = data.data;
            callback(info);
        },
        error:function(){

        }
    });
}

/**
 * 获取主要领导
 * instanceType（流程类型）
 * userID（用户ID）
 * 返回：mainLeader（默认主要领导ID）
 *     mainLeaderList（主要领导列表）
 */
function getMainLeader(instanceType,userID,callback,isAsync){
    if(isAsync == null){
        isAsync = true;
    }
    $.ajax({
        type:"GET",
        url:url+"/jdjgw-oa/ws/user/login",
        data:{
            instanceType:instanceType,
            userID:userID
        },
        async: isAsync,
        dataType:"JSON",
        success:function(data){
            var info = data.data;
            callback(info);
        },
        error:function(){

        }
    });
}

/**
 * 获取历史记录
 * instanceType（流程类型）
 * userID（用户ID）
 * 返回：historyContent（实例对应的所有history）
 */
function getHistory(instanceType,userID,callback,isAsync){
    if(isAsync == null){
        isAsync = true;
    }
    $.ajax({
        type:"POST",
        url:url+"/jdjgw-oa/ws/user/login",
        data:{
            instanceType:instanceType,
            userID:userID
        },
        async: isAsync,
        dataType:"JSON",
        success:function(data){
            callback(data);
        },
        error:function(){

        }
    });
}

/**
 * 获取流程数据
 * @param instanceID
 * @param userID
 * @param callBack
 * @param isAsync
 */
function getApproveData(instanceID, userID, callBack, isAsync){
    if(isAsync == null){
        isAsync = true;
    }
    $.ajax({
        type: "GET",
        url:url + "/jdjgw-oa/ws/process/detail",
        data: {
            uid:userID,
            validateCode:"",
            instanceID:instanceID
        },
        async: isAsync,
        dataType: "json",
        success: function(data){
            callBack(data.data);
        },
        error:function () {

        }
    });
}

/**
 * 流程发起
 * instanceID（流程实例ID）
 * instanceType（流程类别，与实例ID只存在一个）
 * userID（用户ID）
 * userType（用户发起时选择的部门）
 * control（控制流程）
 * content（文档内容）
 */
function launch(instanceID,instanceType,userID,userType,control,content,callback,isAsync){
    if(isAsync == null){
        isAsync = true;
    }
    var docContent = JSON.stringify(content);
    var control = JSON.stringify(control);
    $.ajax({
        type:"POST",
        url:url+"/jdjgw-oa/ws/process/user/launch",  //流程发起url
        data:{
            userID:userID,
            userType:userType,
            validateCode:"",
            authorityCode:"",
            instanceID:instanceID,
            instanceType:instanceType,
            control:control,
            content:docContent
        },
        async: isAsync,
        dataType:"JSON",
        success:function(data){
            callback(data);
        },
        error:function(){

        }
    });
}

/**
 * 流程保存
 * instanceID（流程实例ID）
 * instanceType（流程类别，与实例ID只存在一个）
 * userID（用户ID）
 * userType（用户发起时选择的部门）
 * control （控制流程）
 * content（文档内容）
 */
function save(instanceID,instanceType,userID,userType,control,content,callback,isAsync){
    if(isAsync == null){
        isAsync = true;
    }
    var docContent = JSON.stringify(content);
    var control = JSON.stringify(control);
    $.ajax({
        type:"POST",
        url:url+"/jdjgw-oa/ws/process/user/save", //保存url
        data:{
            userID:userID,
            userType:userType,
            validateCode:"",
            authorityCode:"",
            instanceID:instanceID,
            instanceType:instanceType,
            control:control,
            content:docContent
        },
        async: isAsync,
        dataType:"JSON",
        success:function(data){
            callback(data);
        },
        error:function(){

        }
    });
}

/**
 * 流程审批
 * instanceID（流程实例ID）
 * userID（用户ID）
 * branchLeader（分管领导ID，如果有）
 * mainLeader（主要领导ID）
 * content（文档内容）
 */
function approve(instanceID,userID,control,content,callback,isAsync){
    if(isAsync == null){
        isAsync = true;
    }
    var docContent = JSON.stringify(content);
    var control = JSON.stringify(control);
    $.ajax({
        type:"POST",
        url:url+"/jdjgw-oa/ws/process/user/approve",
        data:{
            instanceID:instanceID,
            userID:userID,
            control:control,
            content:docContent
        },
        async: isAsync,
        dataType:"JSON",
        success:function(data){
            callback(data);
        },
        error:function(){

        }
    });
}

/**
 * 文档预览
 * instanceID（流程实例ID）
 * userID（用户ID）
 * content（文档内容）
 * 返回：pdfList（流程对应文档的列表）
 */
function preview(instanceID,userID,content,callback,isAsync){
    if(isAsync == null){
        isAsync = true;
    }
    var docContent = JSON.stringify(content);
    $.ajax({
        type:"POST",
        url:url+"/jdjgw-oa/ws/process/user/preview",
        data:{
            instanceID:instanceID,
            userID:userID,
            content:docContent
        },
        async: isAsync,
        dataType:"JSON",
        success:function(data){
            callback(data);
        },
        error:function(){

        }
    });
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
 * 历史记录显示框
 */
function dialog(text){
    //获取页面的高度和宽度
    var sWidth=document.body.scrollWidth || document.documentElement.scrollWidth;
    var sHeight=document.body.scrollHeight || document.documentElement.scrollHeight;

    //获取页面的可视区域高度和宽度
    var wHeight=document.documentElement.clientHeight || document.body.clientHeight;

    //创建遮罩层
    var oMask=document.createElement("div");
    oMask.id="mask";
    oMask.style.height=sHeight+"px";
    oMask.style.width=sWidth+"px";
    document.body.appendChild(oMask);            //添加到body末尾

    //创建登录框
    var oLogin=document.createElement("div");
    oLogin.id="login";
    oLogin.innerHTML="<div class='loginCon'><div id='close'>点击关闭</div>我是登录框哟！</div>";
    document.body.appendChild(oLogin);

    //获取登陆框的宽和高
    var dHeight=oLogin.offsetHeight;
    var dWidth=oLogin.offsetWidth;

    //设置登陆框的left和top
    oLogin.style.left=sWidth/2-dWidth/2+"px";
    oLogin.style.top=wHeight/2-dHeight/2+"px";

    //获取关闭按钮
    var oClose=document.getElementById("close");

    //点击关闭按钮和点击登陆框以外的区域都可以关闭登陆框
    oClose.onclick=oMask.onclick=function(){
        document.body.removeChild(oLogin);
        document.body.removeChild(oMask);
    };
}


/**
 * 任务查看
 * @param userID
 * @param callback
 */
function getTask(userID,status,callback,isAsync){
    if(isAsync == null){
        isAsync = true;
    }
    $.ajax({
        type:"GET",
        url:url+"/jdjgw-oa/ws/process/user/task",  //流程发起url
        data:{
            uid:userID,
            validateCode:"",
            processInstanceId:"",
            status:status
        },
        async: isAsync,
        dataType:"JSON",
        success:function(data){
            callback(data);
        },
        error:function(){
            
        }
    });
}