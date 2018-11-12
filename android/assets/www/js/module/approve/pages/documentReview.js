/**
 * Modified by Jaquan on 2018/9/21.
 * Created by Revan on 2017/9/4.
 */

/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["科员"];

// var canTransmit = ["026","024"];//026徐佳 024顾袁洁

/****************************以下内容为流程内容变量****************************/
//办公室审批
var officeRoom;
//递交行政主要领导
var isToAdmin;
//递交党工委书记
var isToParty;
//办公室意见
var adviceOfficeRoom;
//科室意见的历史记录
var historyAdviceOfficeRoom;
//办公室意见填写时间
var timeAdviceOfficeRoom;
//科室意见
var adviceSection;
//科室意见填写时间
var timeAdviceSection;
//科室意见的历史记录
var historyAdviceSection;
//分管领导意见,为填写内容
var adviceBranchLeader;
//分管领导意见填写时间
var timeAdviceBranchLeader;
//分管领导意见的历史记录
var historyAdviceBranchLeader;
//行政主要领导意见,为填写内容
var adviceAdminMainLeader;
//行政主要领导意见填写时间
var timeAdviceAdminMainLeader;
//行政主要领导意见的历史记录
var historyAdviceAdminMainLeader;
//党委主要领导意见,为填写内容
var advicePartyMainLeader;
//党委主要领导意见填写时间
var timeAdvicePartyMainLeader;
//党委主要领导意见的历史记录
var historyAdvicePartyMainLeader;
//是否被退回
var isBack;

/****************************以下内容为流程必须函数****************************/
/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep){
            case "发起流程":
                instance.nextStep = "科室审批";
                break;
            case "科室审批":
                instance.nextStep = "办公室审批";
                break;
            case "办公室审批":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                if (isToAdmin) {
                    instance.nextStep = "行政主要领导审批";
                } else if (isToParty){
                    instance.nextStep = "党工委书记审批";
                } else {
                    instance.nextStep = "流程结束";
                }
                break;
            case "行政主要领导审批":
                if (isToParty) {
                    instance.nextStep = "党工委书记审批";
                } else {
                    instance.nextStep = "流程结束";
                }
                break;
            case "党工委书记审批":
                instance.nextStep = "流程结束";
                break;
        }
    }
}

/**
 * 新建流程时的初始化流程内容数据
 */
function setNewData() {}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    isAbleSelectBranch = instance.nextStep == "科室审批";
    isShowBranchSelect = isAbleSelectBranch;
}

/**
 * 获取需要提交服务器的流程控制
 */
function getMoreControl(controlInfo){
    switch (instance.currentStep){
        case "办公室审批":
            controlInfo.isToAdmin = $("#isToAdmin").is(":checked");
            controlInfo.isToParty = $("#isToParty").is(":checked");
            break;
    }
    return controlInfo;
}

/**
 * 发起身份变化对应函数
 */
function launchRoleChange() {
    var cSelectStatus = $("#selectStatus");
    user.launchRole.id = cSelectStatus.val();
    user.launchRole.name = cSelectStatus.find("option:selected").text();
    getNextStep();
    $("#nextStep").text(instance.nextStep);
    instance.launcherSection = getUserSection(user.launchRole.name);
    initSectionApproveControl(instance.nextStep == "主要领导审批",undefined);
    $("#confirm").parent().empty();
    isShowMainSelect = instance.nextStep == "";
    initOperateInterface();
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    officeRoom = data.officeRoom;
    isToAdmin = data.isToAdmin;
    isToParty = data.isToParty;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceOfficeRoom = data.adviceOfficeRoom;
    timeAdviceOfficeRoom = data.timeAdviceOfficeRoom;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    adviceAdminMainLeader = data.adviceAdminMainLeader;
    timeAdviceAdminMainLeader = data.timeAdviceAdminMainLeader;
    advicePartyMainLeader = data.advicePartyMainLeader;
    timeAdvicePartyMainLeader = data.timeAdvicePartyMainLeader;
    fileList = data.fileList;
    isBack = data.isBack;
}

/**
 * 检测需提交内容的合法性
 */
function checkContent() {
    var isCorrect = true;
    if(instance.currentStep == "发起流程"){
        isCorrect = checkNotNull(radioValue(),$("#hintOfficeRoom")) && isCorrect;
        isCorrect = checkUploadFile($("#hintFileList")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cOfficeRoom = radioValue();
    switch (instance.currentStep){
        case "发起流程":
            content.officeRoom = cOfficeRoom;
            break;
        case "科室审批":
            content.adviceSection = $("#adviceSection").val();
            content.historyAdviceSection = "adviceSection";
            content.signatureSection = user.id;
            content.timeAdviceSection = $("#timeAdviceSection").text();
            break;
        case "办公室审批":
            content.isToAdmin = $("#isToAdmin").is(":checked");
            content.isToParty = $("#isToParty").is(":checked");
            content.adviceOfficeRoom = $("#adviceOfficeRoom").val();
            content.historyAdviceOfficeRoom = "adviceOfficeRoom";
            content.signatureOfficeRoom = user.id;
            content.timeAdviceOfficeRoom = $("#timeAdviceOfficeRoom").text();
            break;
        case "分管领导审批":
            content.adviceBranchLeader = $("#adviceBranchLeader").val();
            content.historyAdviceBranchLeader = "adviceBranchLeader";
            content.signatureBranchLeader = user.id;
            content.timeAdviceBranchLeader = $("#timeAdviceBranchLeader").text();
            break;
        case "行政主要领导审批":
            content.adviceAdminMainLeader = $("#adviceAdminMainLeader").val();
            content.historyAdviceAdminMainLeader = "adviceAdminMainLeader";
            content.signatureAdminMainLeader = user.id;
            content.timeAdviceAdminMainLeader = $("#timeAdviceAdminMainLeader").text();
            break;
        case "党工委书记审批":
            content.advicePartyMainLeader = $("#advicePartyMainLeader").val();
            content.historyAdviceMainLeader = "advicePartyMainLeader";
            content.signaturePartyMainLeader = user.id;
            content.timeAdvicePartyMainLeader = $("#timeAdvicePartyMainLeader").text();
            break;
    }
    content.isBack = isBack;
    content.fileList = fileList;
    return content;
}


/**
 * 初始化流程内容控件
 */
function initContentInterface(){
    var cRelateProcedure = $("#relateProcedure");
    cRelateProcedure.css("display", "none");
    //是否需要行政主要领导审批控制
    if (officeRoom != null){
        switch(officeRoom) {
            case "行政办审批":
                $("#officeRoom1").attr("checked", "checked");
                break;
            case "党委办审批":
                $("#officeRoom2").attr("checked", "checked");
                break;
        }
    }
    if(instance.isOperator && instance.currentStep == "发起流程"){
        $("#officeRoom1").attr("disabled",false);
        $("#officeRoom2").attr("disabled",false);
    }
    // updatePersonCount();
    initSectionApproveControl(instance.currentStep == "科室审批",undefined);
    initOfficeRoomApproveControl(instance.currentStep == "办公室审批",timeAdviceSection);//办公室审批信息显示控制
    initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceOfficeRoom);//分管领导审批信息显示控制
    initAdminMainApproveControl(instance.currentStep == "行政主要领导审批",timeAdviceBranchLeader);//党委主要领导审批信息显示控制
    initPartyMainApproveControl(instance.currentStep == "党工委书记审批",timeAdviceAdminMainLeader);//行政主要领导审批信息显示控制
}

$(document).ready(
    function init() {
        initCommon("documentReview");
        initContentInterface();
    }
);

/****************************以下内容为页面独有函数****************************/
/**
 * 获取单选按钮控件值
 */
function radioValue(){
    var tt = document.getElementsByName('officeRoom');
    for (var iIndex = 0; iIndex < tt.length ; iIndex++ )
    {
        if(tt[iIndex].checked)
        {
            return tt[iIndex].value;
        }
    }
}
function addMoreControlOperate() {
    //是否需要行政主要领导审批控制
    if(instance.isOperator && instance.currentStep == "办公室审批"){
        var isToAdmin = "<a class='isToWhere'><input type='checkbox' id='isToAdmin' checked>递交行政主要领导</a>";
        var isToParty = "<a class='isToWhere'><input type='checkbox' id='isToParty' checked>递交党工委书记</a>";
        $("#moreSelectArea").prepend(isToAdmin);
        $("#moreSelectArea").prepend(isToParty);
    }
}