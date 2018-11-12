/**
 * Created by Ding on 2017/8/23.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["科长","科员"];

/****************************以下内容为流程内容变量****************************/
//项目类型
var projectType;
//项目编号
var projectNum;
//项目名称
var projectName;
//投资额
var investmentAmount;
//招标方式
var tenderType;
//科室意见
var adviceSection;
//科室意见填写时间
var timeAdviceSection;
//科室意见的历史记录
var historyAdviceSection;
//分管领导意见,为填写内容
var adviceBranchLeader;
//科室意见填写时间
var timeAdviceBranchLeader;
//分管领导意见的历史记录
var historyAdviceBranchLeader;
//主要领导意见,为填写内容
var adviceAdminMainLeader;
//科室意见填写时间
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
        switch (instance.currentStep){
            case "发起流程":
                if(user.launchRole.name.indexOf("科员") > -1){
                    instance.nextStep = "科室审批";
                }else{
                    instance.nextStep = "分管领导审批";
                }
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
    }else{
        instance.nextStep = instance.currentStep;
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
    user.launchRoleList.forEach(function (value) {
        if(value.name.indexOf("科长")>-1){
            isAbleSelectBranch = true;
        }
    });
    isShowBranchSelect = instance.nextStep == "分管领导审批";
    isShowLaunchRoleSelect = instance.currentStep.indexOf("发起流程") > -1 && user.launchRoleList.length > 1;
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
    initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);
    $("#confirm").parent().empty();
    isShowBranchSelect = instance.nextStep == "分管领导审批";
    initOperateInterface();
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    projectType = data.projectType;
    projectNum = data.projectNum;
    projectName = data.projectName;
    investmentAmount = data.investmentAmount;
    tenderType = data.tenderType;
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
    if(instance.currentStep.indexOf("发起")>-1){
        isCorrect = checkNotNull($("#projectName").val(),$("#hintProjectName")) && isCorrect;
        isCorrect = checkNotNullPositiveNum($("#investmentAmount").val(),$("#hintInvestmentAmount")) && isCorrect;
        isCorrect = checkNotNull(radioValue(),$("#hintTenderType")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cProjectType = $("#projectType");
    var cProjectName = $("#projectName");
    var cInvestmentAmount = $("#investmentAmount");
    switch (instance.currentStep){
        case "发起流程":
            content.projectType = cProjectType.val();
            content.projectName = cProjectName.val();
            content.investmentAmount = cInvestmentAmount.val();
            content.tenderType = radioValue();
            if(user.launchRole.name.indexOf("科员") > -1){
                content.signatureStaff = user.id;
                content.timeAdviceStaff = new Date().Format();
            }else{
                content.signatureSection = user.id;
                content.adviceSection = $("#adviceSection").val();
                content.historyAdviceSection = "adviceSection";
                content.timeAdviceSection = $("#timeAdviceSection").text();
            }
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
function initContentInterface(){
    var cRelateProcedure = $("#relateProcedure");
    cRelateProcedure.css("display", "none");
    //项目编号信息显示控制
    var cProjectType = $("#projectType");
    var cProjectNumber = $("#projectNumber");
    var cProjectName = $("#projectName");
    var cInvestmentAmount = $("#investmentAmount");
    var cTenderType_other = $("#tenderType_other");
    projectType && cProjectType.val(projectType);
    cProjectNumber.val(projectNum);
    cProjectName.val(projectName);
    cInvestmentAmount.val(investmentAmount);
    cTenderType_other.val(tenderType);
    cTenderType_other.css("display","none");
    if (tenderType != null){
        switch(tenderType) {
            case "政府采购":
                $("#tenderType1").attr("checked", "checked");
                break;
            case "公开招标":
                $("#tenderType2").attr("checked", "checked");
                break;
            case "一体化招标":
                $("#tenderType3").attr("checked", "checked");
                break;
            default :
                $("#tenderType4").attr("checked", "checked");
                cTenderType_other.css("display","inline");
                break;
        }
    }
    if(instance.isOperator && instance.isLaunch) {
        cProjectNumber.css("display","none");
        cProjectType.removeAttr("disabled");
        cProjectType.removeClass("disable");
        cProjectType.addClass("default");
        cProjectName.attr("readonly",false);
        cProjectName.removeClass("disable");
        cProjectName.addClass("default");
        cInvestmentAmount.attr("readonly",false);
        cInvestmentAmount.removeClass("disableMoney");
        cInvestmentAmount.addClass("money");
        $("#tenderType1").attr("disabled",false);
        $("#tenderType2").attr("disabled",false);
        $("#tenderType3").attr("disabled",false);
        $("#tenderType4").attr("disabled",false);
        cTenderType_other.attr("readonly",false);
        cTenderType_other.removeClass("disableOther");
        cTenderType_other.addClass("other");
    }else{
        cProjectType.css("display","none");
    }

    initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);//科长审批信息显示控制
    initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceSection);//分管领导审批信息显示控制
    initAdminMainApproveControl(instance.currentStep.indexOf("主要领导审批") > -1,timeAdviceBranchLeader);//主要领导审批信息显示控制
}

$(document).ready(
    function init() {
        initCommon("projectPreview");
        initContentInterface();
    }
);

/****************************以下内容为页面独有函数****************************/
/**
 * 获取单选按钮控件值
 */
function radioValue(){
    var tt = document.getElementsByName('tenderType');
    for (var iIndex = 0; iIndex < tt.length ; iIndex++ )
    {
        if(tt[iIndex].checked)
        {
            if (tt[iIndex].value == "other")
            {
                var cTenderType_other = $("#tenderType_other");
                return cTenderType_other.val();
            }
            else
            {
                return tt[iIndex].value;
            }
        }
    }
}
/*根据单选按钮显示输入框控制*/
$(function(){
    $(":radio").click(function(){
        var status = $(this).val();
        if (status == "other"){
            $("#tenderType_other").css("display","inline");
        }else{
            $("#tenderType_other").css("display","none");
        }
    });
});