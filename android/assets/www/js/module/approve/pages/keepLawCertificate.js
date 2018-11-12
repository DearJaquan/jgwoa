/**
 * Created by feijiahui on 2018/5/15.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["行政办科长","行政办科员"];

/****************************以下内容为流程内容变量****************************/
//申请单位
var companyName;
//联系人
var proposer;
//联系电话
var telPhone;
//附件
var dispatchList;
//事由
var reason;

//是否被退回
var isBack;

//拟办意见
var adviceSection;
//拟办意见填写时间
var timeAdviceSection;
//拟办意见的历史记录
var historyAdviceSection;

//分管领导审核意见
var adviceBranchLeaderFirst;
//分管领导审核意见填写时间
var timeAdviceBranchLeaderFirst;
//分管领导审核意见的历史记录
var historyAdviceBranchLeaderFirst;

//科室初审意见
var adviceSectionFirst;
//科室初审意见填写时间
var timeAdviceSectionFirst;
//科室初审意见的历史记录
var historyAdviceSectionFirst;

//分管领导意见,为填写内容
var adviceBranchLeader;
//分管领导意见填写时间
var timeAdviceBranchLeader;
//分管领导意见的历史记录
var historyAdviceBranchLeader;



/****************************以下内容为流程必须函数****************************/
/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep){
            case "发起流程":
                if(user.launchRole.name.indexOf("科员") > -1){
                    instance.nextStep = "科室审批(拟办)";
                }else{
                    instance.nextStep = "分管领导审批(批示)";
                }
                break;
            case "科室审批(拟办)":
                instance.nextStep = "分管领导审批(批示)";
                break;
            case "分管领导审批(批示)":
                instance.nextStep = "行政办确认";
                break;
            case "行政办确认":
                instance.nextStep = "科室审批(初审)";
                break;
            case "科室审批(初审)":
                instance.nextStep = "分管领导审批(审核)";
                break;
            case "分管领导审批(审核)":
                instance.nextStep = "流程结束";
                break;
        }
    }else{
        instance.nextStep = instance.currentStep;
    }

}

/**
 * 新建流程时的初始化流程内容数据
 */
function setNewData() {
    dispatchList = "1、开具合规证明的申请\n2、公司营业执照复印件\n3、公司法定代表人身份证复印件\n4、公司董事会临时决议";
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    user.launchRoleList.forEach(function (value) {
        if(value.name.indexOf("科长")>-1){
            isAbleSelectBranch = true;
        }
    });
    isShowBranchSelect = instance.nextStep == "分管领导审批(批示)";
    isShowSectionSelect = instance.currentStep == "行政办确认";
    isShowLaunchRoleSelect = instance.currentStep.indexOf("发起流程") > -1 && user.launchRoleList.length > 1;
    isAbleSelectSection = isShowSectionSelect;
    isAbleSelectBranch = isShowBranchSelect;
}

/**
 * 发起身份变化对应函数,不存在可不写
 */
function launchRoleChange() {
    var cSelectStatus = $("#selectStatus");
    user.launchRole.id = cSelectStatus.val();
    user.launchRole.name = cSelectStatus.find("option:selected").text();
    getNextStep();
    $("#nextStep").text(instance.nextStep);
    instance.launcherSection = getUserSection(user.launchRole.name);
    initSectionApproveControl(instance.nextStep == "分管领导审批(批示)",undefined);
    $("#confirm").parent().empty();
    isShowBranchSelect = instance.nextStep == "分管领导审批(批示)";
    initOperateInterface();
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    companyName = data.companyName;
    proposer = data.proposer;
    telPhone = data.telPhone;
    dispatchList = data.dispatchList;
    reason=data.reason;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceBranchLeaderFirst = data.adviceBranchLeaderFirst;
    timeAdviceBranchLeaderFirst = data.timeAdviceBranchLeaderFirst;
    adviceSectionFirst = data.adviceSectionFirst;
    timeAdviceSectionFirst = data.timeAdviceSectionFirst;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    fileList = data.fileList;
    isRelateLaunch = data.isRelateLaunch;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if(instance.currentStep.indexOf("发起")>-1){
        isCorrect = checkNotNull($("#companyName").val(),$("#hintCompanyName")) && isCorrect;
        isCorrect = checkNotNull($("#proposer").val(),$("#hintProposer")) && isCorrect;
        isCorrect = checkNotNullTel($("#telPhone").val(), $("#hintTelPhone")) && isCorrect;
        isCorrect = checkNotNull($("#dispatchList").val(),$("#hintDispatchList")) && isCorrect;
        isCorrect = checkNotNull($("#reason").val(),$("#hintReason")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cCompanyName = $("#companyName");
    var cProposer = $("#proposer");
    var cTelPhone = $("#telPhone");
    var cDispatchList = $("#dispatchList");
    var cReason = $("#reason");
    switch (instance.currentStep){
        case "发起流程":
            content.companyName = cCompanyName.val();
            content.proposer = cProposer.val();
            content.telPhone = cTelPhone.val();
            content.dispatchList = cDispatchList.val();
            content.reason = cReason.val();
            if(user.launchRole.name.indexOf("科长") > -1){
                content.signatureSection = user.id;
                content.adviceSection = $("#adviceSection").val();
                content.historyAdviceSection = "adviceSection";
                content.timeAdviceSection = $("#timeAdviceSection").text();
            }
            break;
        case "科室审批(拟办)":
            content.adviceSection = $("#adviceSection").val();
            content.historyAdviceSection = "adviceSection";
            content.signatureSection = user.id;
            content.timeAdviceSection = $("#timeAdviceSection").text();
            break;
        case "分管领导审批(批示)":
            content.adviceBranchLeaderFirst = $("#adviceBranchLeaderFirst").val();
            content.historyAdviceBranchLeaderFirst = "adviceBranchLeaderFirst";
            content.signatureBranchLeaderFirst = user.id;
            content.timeAdviceBranchLeaderFirst = $("#timeAdviceBranchLeaderFirst").text();
            break;
        case "科室审批(初审)":
            content.adviceSectionFirst = $("#adviceSectionFirst").val();
            content.historyAdviceSectionFirst = "adviceSectionFirst";
            content.signatureSectionFirst = user.id;
            content.timeAdviceSectionFirst = $("#timeAdviceSectionFirst").text();
            break;
        case "分管领导审批(审核)":
            content.adviceBranchLeader = $("#adviceBranchLeader").val();
            content.historyAdviceBranchLeader = "adviceBranchLeader";
            content.signatureBranchLeader = user.id;
            content.timeAdviceBranchLeader = $("#timeAdviceBranchLeader").text();
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
    var cCompanyName = $("#companyName");
    var cProposer = $("#proposer");
    var cTelPhone = $("#telPhone");
    var cDispatchList = $("#dispatchList");
    var cReason = $("#reason");
    cCompanyName.val(companyName);
    cProposer.val(proposer);
    cTelPhone.val(telPhone);
    cDispatchList.val(dispatchList);
    dispatchList && cDispatchList.height(getTextAreaHeight(dispatchList));
    cReason.val(reason);
    if(instance.isOperator && instance.isLaunch) {
        cCompanyName.attr("readonly",false);
        cCompanyName.removeClass("disable");
        cCompanyName.addClass("default");
        cProposer.attr("readonly",false);
        cProposer.removeClass("disable");
        cProposer.addClass("default");
        cTelPhone.attr("readonly",false);
        cTelPhone.removeClass("disable");
        cTelPhone.addClass("default");
        cDispatchList.attr("readonly",false);
        cDispatchList.removeClass("disableDispatch");
        cDispatchList.addClass("dispatch");
        cReason.attr("readonly",false);
        cReason.removeClass("disable");
        cReason.addClass("default");
    }
    initSectionApproveControl(instance.nextStep == "分管领导审批(批示)",undefined);//科长审批信息显示控制
    initBranchFirstApproveControl(instance.currentStep == "分管领导审批(批示)",timeAdviceSection);//分管领导审批信息显示控制
    initSectionFirstApproveControl(instance.currentStep == "科室审批(初审)",timeAdviceBranchLeaderFirst);//科长审批信息显示控制
    initBranchApproveControl(instance.currentStep == "分管领导审批(审核)",timeAdviceSectionFirst);//分管领导审批信息显示控制
    
}

$(document).ready(
    function init() {
        initCommon("keepLawCertificate");
        initContentInterface();
    }
);

function getTextAreaHeight(content) {
    var tempH = content.split("\n").length * 32;
    console.log(tempH);
    return content.split("\n").length * 32;
}