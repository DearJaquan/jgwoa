/**
 * Created by Revan on 2017/8/15.
 */

var instanceID;
var instanceType;
var control = {};
var content = {};

function testLaunch(user) {
    showTestResult(user.roleName+"："+user.name+"发起流程----------");
    control.operate = "launch";
    launch(instanceID,instanceType,user.id,user.roleID,control,content,testCallBackLauncher,false);
}

function testSave(user) {
    showTestResult(user.roleName+"："+user.name+"保存流程----------");
    control.operate = "save";
    save(instanceID,instanceType,user.id,user.roleID,control,content,testCallBackLauncher,false);
}

function testConfirm(user) {
    showTestResult(user.roleName+"："+user.name+"确认流程----------");
    control.operate = "confirm";
    approve(instanceID,user.id,control,content,testCallBackApprove,false);
}

function testReject(user) {
    showTestResult(user.roleName+"："+user.name+"否决流程----------");
    control.operate = "reject";
    approve(instanceID,user.id,control,content,testCallBackApprove,false);
}

function testSendBack(user, backTo) {
    showTestResult(user.roleName+"："+user.name+"退回流程到"+backTo+"----------");
    control.operate = "sendBack";
    control.sendBackTo = backTo;
    approve(instanceID,user.id,control,content,testCallBackApprove,false);
}

function testAgree(user) {
    showTestResult(user.roleName+"："+user.name+"同意流程----------");
    control.operate = "approve";
    approve(instanceID,user.id,control,content,testCallBackApprove,false);
}

function testGetData(user) {
    showTestResult(user.roleName+"："+user.name+"测试流程数据----------");
    getApproveData(instanceID,user.id,testCallBackGetData,false);
}

function testTask(approvers, taskTypeName) {
    var taskType;
    switch (taskTypeName){
        case "我的关注":
            taskType = 1;
            break;
        case "待审批":
            taskType = 2;
            break;
        case "被否决":
            taskType = 3;
            break;
        case "被退回":
            taskType = 4;
        break;
        case "进行中":
            taskType = 5;
            break;
        case "待执行":
            taskType = 6;
            break;
        case "草稿":
            taskType = 7;
            break;
        case "已完成":
            taskType = 8;
            break;
    }
    approvers.forEach(function (user) {
        showTestResult(user.roleName+"："+user.name+"测试流程分类----------");
        getTask(user.id,taskType,testCallBackGetTask,false);
    });
}

function testCallBackLauncher(data) {
    if(data.msg == "成功"){
        var newInstanceID = data.data;
        if(instanceID != null && instanceID != newInstanceID){
            showTestResult("流程发起失败：实例ID前后不一致",true);
        }else{
            instanceID = newInstanceID;
            showTestResult("流程发起成功：实例ID为"+instanceID);
        }
    }else{
        showTestResult("流程发起失败："+data.msg,true);
    }
}

function testCallBackGetTask(data) {
    if(data.msg == "成功"){
        var isContain = false;
        data.data.forEach(function (value) {
            if(value.id == instanceID){
                isContain = true;
            }
        });
        if(isContain){
            showTestResult("流程递交成功");
        }else{
            showTestResult("流程递交失败：该分类中查询不到此流程实例",true);
        }
    }else{
        showTestResult("流程递交失败："+data.msg,true);
    }
}

function testCallBackApprove(data) {
    if(data.msg == "成功"){
        showTestResult(control.operate+"操作成功");
    }else{
        showTestResult(control.operate+"操作失败："+data.msg,true);
    }
}

function testCallBackGetData(data) {
    var isSame = true;
    var errorInfo;
    for(var prototype in content){
        if(data.content.hasOwnProperty(prototype)){
            if(typeof content[prototype] == "object"){

            }else{
                if(content[prototype] != data.content[prototype]){
                    isSame = false;
                    errorInfo = "内容‘"+prototype+"’不相等，本地"+content[prototype]+"，服务器"+data.content[prototype];
                    showTestResult("数值检测失败："+errorInfo,true);
                }
            }
        }else{
            isSame = false;
            errorInfo = "服务器缺少内容‘"+prototype+"’";
            showTestResult("数值检测失败："+errorInfo,true);
        }
    }
    if(isSame){
        showTestResult("数值检测通过");
    }
}

function showTestResult(text, isError) {
    var newInfo;
    if(isError){
        newInfo = "<div style='color:#F00'>"+text+"</div>";
    }else{
        newInfo = "<div>"+text+"</div>";
    }
    $("#testInfo").append(newInfo);
}