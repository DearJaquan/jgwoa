/**
 * Created by Dingfengwu on 2017/9/29.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["计划科科长", "计划科科员", "财务科科长"];

var year;
var unitName;
var unitManager;
var contact;
var telPhone;
var projectName;
var projectBudget;
var withdrawTotal;
var withdrawThis;
var payDetail;

//单位负责人意见
var adviceUnitManager;
//单位负责人意见填写时间
var timeAdviceUnitManager;
//单位负责人意见的历史记录
var historyAdviceUnitManager;
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
//主要领导意见,为填写内容
var adviceAdminMainLeader;
//主要领导意见填写时间
var timeAdviceAdminMainLeader;
//主要领导意见的历史记录
var historyAdviceAdminMainLeader;
//是否被退回
var isBack;

/****************************以下内容为流程必须函数****************************/
/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep) {
            case "发起流程":
                if(user.launchRole.name.indexOf("财务科科长") > -1){
                    instance.nextStep = "单位负责人审批";
                }else if(user.launchRole.name.indexOf("科员") > -1){
                    instance.nextStep = "科室审批";
                }else{
                    instance.nextStep = "分管领导审批";
                }
                break;
            case "单位负责人审批":
                instance.nextStep = "流程结束";
                break;
            case "科室审批":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                instance.nextStep = "行政主要领导审批";
                break;
            case "行政主要领导审批":
                instance.nextStep = "流程结束";
                break;
        }
    }
}

/**
 * 新建流程时的初始化流程内容数据
 */
function setNewData() {
    year = new Date().getFullYear();
    unitName = getUserSection(user.launchRole.name);
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    isAbleSelectBranch = instance.nextStep == "分管领导审批";
    isShowBranchSelect = isAbleSelectBranch;
    user.launchRoleList.forEach(function (value) {
        if(value.name.indexOf("计划科科长")>-1){
            isAbleSelectBranch = true;
        }
    });
    isShowLaunchRoleSelect = instance.currentStep.indexOf("发起流程") > -1 && user.launchRoleList.length > 1;
}

//发起身份变化对应函数
var launchRoleChange = function () {
    var cSelectStatus = $("#selectStatus");
    user.launchRole.id = cSelectStatus.val();
    user.launchRole.name = cSelectStatus.find("option:selected").text();
    instance.launcherSection = getUserSection(user.launchRole.name);
    getNextStep();
    $("#nextStep").text(instance.nextStep);
    if(user.launchRole.name.indexOf("财务科科长") > -1){
        $("#adviceUnitManagerArea").css("display","inline");
        $("#adviceSectionArea").css("display","none");
        $("#adviceBranchLeaderArea").css("display","none");
        $("#adviceAdminMainLeaderArea").css("display","none");
        initUnitManagerApproveControl(instance.currentStep == "单位负责人审批",undefined);//科长审批信息显示控制
    }else{
        $("#adviceUnitManagerArea").css("display","none");
        $("#adviceSectionArea").css("display","inline");
        $("#adviceBranchLeaderArea").css("display","inline");
        $("#adviceAdminMainLeaderArea").css("display","inline");
        initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);
        initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceSection);
        initAdminMainApproveControl(instance.currentStep == "行政主要领导审批",timeAdviceAdminMainLeader);
    }
    $("#confirm").parent().empty();
    initOperateInterface();
    $("#unitName").val(getUserSection(user.launchRole.name));
};

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    year = data.year;
    unitName = data.unitName;
    unitManager = data.unitManager;
    contact = data.contact;
    telPhone = data.telPhone;
    projectName = data.projectName;
    projectBudget = data.projectBudget;
    withdrawTotal = data.withdrawTotal;
    withdrawThis = data.withdrawThis;
    payDetail = data.payDetail;

    adviceUnitManager = data.adviceUnitManager;
    timeAdviceUnitManager = data.timeAdviceUnitManager;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    adviceAdminMainLeader = data.adviceAdminMainLeader;
    timeAdviceAdminMainLeader = data.timeAdviceAdminMainLeader;
    fileList = data.fileList;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if (instance.currentStep == "发起流程") {
        isCorrect = checkNotNull($("#unitManager").val(), $("#hintUnitManager")) && isCorrect;
        isCorrect = checkNotNull($("#contact").val(), $("#hintContact")) && isCorrect;
        isCorrect = checkNotNullTel($("#telPhone").val(), $("#hintTelPhone")) && isCorrect;
        isCorrect = checkNotNull($("#projectName").val(), $("#hintProjectName")) && isCorrect;
        isCorrect = checkNotNullPositiveNum($("#projectBudget").val(),$("#hintProjectBudget")) && isCorrect;
        isCorrect = checkNotNullPositiveNum($("#withdrawTotal").val(),$("#hintWithdrawTotal")) && isCorrect;
        isCorrect = checkNotNullPositiveNum($("#withdrawThis").val(),$("#hintWithdrawThis")) && isCorrect;
        isCorrect = checkNotNull($("#payDetail").val(), $("#hintPayDetail")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent() {
    var content = {};
    var cYear = $("#year");
    var cUnitName = $("#unitName");
    var cUnitManager = $("#unitManager");
    var cContact = $("#contact");
    var cTelPhone = $("#telPhone");
    var cProjectName = $("#projectName");
    var cProjectBudget = $("#projectBudget");
    var cWithdrawTotal = $("#withdrawTotal");
    var cWithdrawThis = $("#withdrawThis");
    var cPayDetail = $("#payDetail");
    switch (instance.currentStep) {
        case "发起流程":
            content.year = cYear.val();
            content.unitName = cUnitName.val();
            content.unitManager = cUnitManager.val();
            content.contact = cContact.val();
            content.telPhone = cTelPhone.val();
            content.projectName = cProjectName.val();
            content.projectBudget = cProjectBudget.val();
            content.withdrawTotal = cWithdrawTotal.val();
            content.withdrawThis = cWithdrawThis.val();
            content.payDetail = cPayDetail.val();
            content.signatureStaff = user.id;
            content.timeAdviceStaff = new Date().Format();
            if(user.launchRole.name.indexOf("计划科科长") > -1){
                content.signatureSection = user.id;
                content.adviceSection = $("#adviceSection").val();
                content.historyAdviceSection = "adviceSection";
                content.timeAdviceSection = $("#timeAdviceSection").text();
            }
            break;
        case "单位负责人审批":
            content.adviceUnitManager = $("#adviceUnitManager").val();
            content.historyAdviceUnitManager = "adviceUnitManager";
            content.signatureUnitManager = user.id;
            content.timeAdviceUnitManager = $("#timeAdviceUnitManager").text();
            break;
        case "科室审批":
            content.adviceSection = $("#adviceSection").val();
            content.historyAdviceSection = "adviceSection";
            content.signatureSection = user.id;
            content.timeAdviceSection = $("#timeAdviceSection").text();
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
    }
    content.isBack = isBack;
    content.fileList = fileList;
    return content;
}

/**
 * 初始化流程内容控件
 */
function initContentInterface() {
    var cRelateProcedure = $("#relateProcedure");
    cRelateProcedure.css("display", "none");

    var cYear = $("#year");
    var cUnitName = $("#unitName");
    var cUnitManager = $("#unitManager");
    var cContact = $("#contact");
    var cTelPhone = $("#telPhone");
    var cProjectName = $("#projectName");
    var cProjectBudget = $("#projectBudget");
    var cWithdrawTotal = $("#withdrawTotal");
    var cWithdrawThis = $("#withdrawThis");
    var cPayDetail = $("#payDetail");

    cYear.val(year);
    cUnitName.val(unitName);
    cUnitManager.val(unitManager);
    cContact.val(contact);
    cTelPhone.val(telPhone);
    cProjectName.val(projectName);
    cProjectBudget.val(projectBudget);
    cWithdrawTotal.val(withdrawTotal);
    cWithdrawThis.val(withdrawThis);
    cPayDetail.val(payDetail);

    if(instance.isOperator && instance.currentStep == "发起流程"){
        cUnitManager.attr("readonly",false);
        cUnitManager.removeClass("disable");
        cUnitManager.addClass("default");
        cContact.attr("readonly",false);
        cContact.removeClass("disable");
        cContact.addClass("default");
        cTelPhone.attr("readonly",false);
        cTelPhone.removeClass("disable");
        cTelPhone.addClass("default");
        cProjectName.attr("readonly",false);
        cProjectName.removeClass("disable");
        cProjectName.addClass("default");
        cProjectBudget.attr("readonly",false);
        cProjectBudget.removeClass("disableMoney");
        cProjectBudget.addClass("money");
        cWithdrawTotal.attr("readonly",false);
        cWithdrawTotal.removeClass("disableMoney");
        cWithdrawTotal.addClass("money");
        cWithdrawThis.attr("readonly",false);
        cWithdrawThis.removeClass("disableMoney");
        cWithdrawThis.addClass("money");
        cPayDetail.attr("readonly",false);
        cPayDetail.removeClass("disable");
        cPayDetail.addClass("default");
    }

    if(instance.launcherSection.indexOf("计划科") == -1){
        initUnitManagerApproveControl(instance.currentStep == "单位负责人审批",undefined);//科长审批信息显示控制
        $("#adviceSectionArea").css("display","none");
        $("#adviceBranchLeaderArea").css("display","none");
        $("#adviceAdminMainLeaderArea").css("display","none");
    }else{
        $("#adviceUnitManagerArea").css("display","none");
        initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);
        initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceSection);
        initAdminMainApproveControl(instance.currentStep == "行政主要领导审批",timeAdviceBranchLeader);
    }
}

$(document).ready(
    function init() {
        initCommon("projectFundsWithdrawal");
        initContentInterface();
    }
);