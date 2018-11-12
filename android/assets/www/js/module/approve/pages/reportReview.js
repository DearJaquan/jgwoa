/**
 * Created by Revan on 2018/1/19.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["科员","科长"];

/****************************以下内容为流程内容变量****************************/
var fileName;
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
var advicePartySection;
//主要领导意见填写时间
var timeAdvicePartySection;
//主要领导意见的历史记录
var historyAdvicePartySection;
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
                    instance.nextStep = "党委办审批";
                }
                break;
            case "科室审批":
                instance.nextStep = "党委办审批";
                break;
            case "党委办审批":
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
    user.launchRoleList.forEach(function (value) {
        if(value.name.indexOf("科长")>-1){
            isAbleSelectBranch = true;
        }
    });
    isAbleSelectBranch = isAbleSelectBranch || instance.nextStep == "党委办审批";
    isShowBranchSelect = instance.nextStep == "党委办审批";
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
    launchSection = instance.launcherSection;
    $("#launchSection").val(launchSection);
    initSectionApproveControl(instance.nextStep == "党委办审批",undefined);
    $("#confirm").parent().empty();
    isShowBranchSelect = instance.nextStep == "党委办审批";
    initOperateInterface();
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    fileName = data.fileName;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    advicePartySection = data.advicePartySection;
    timeAdvicePartySection = data.timeAdvicePartySection;
    fileList = data.fileList;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if (instance.currentStep == "发起流程") {
        isCorrect = checkNotNull($("#fileName").val(),$("#hintFileName")) && isCorrect;
        isCorrect = checkUploadFile($("#hintFileList")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent() {
    var content = {};
    var cFileName = $("#fileName");
    switch (instance.currentStep) {
        case "发起流程":
            content.fileName = cFileName.val();
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
        case "党委办审批":
            content.advicePartySection = $("#advicePartySection").val();
            content.historyAdvicePartySection = "advicePartySection";
            content.signaturePartySection = user.id;
            content.timeAdvicePartySection = $("#timeAdvicePartySection").text();
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

    var cFileName = $("#fileName");
    cFileName.val(fileName);

    if(instance.isOperator && instance.isLaunch){
        cFileName.attr("readonly",false);
        cFileName.removeClass("disable");
        cFileName.addClass("default");
    }
    
    initSectionApproveControl(instance.nextStep == "党委办审批",undefined);//科长审批信息显示控制
    initPartySectionApproveControl(instance.currentStep == "党委办审批",timeAdviceBranchLeader);//主要领导审批信息显示控制
}

$(document).ready(
    function init() {
        initCommon("reportReview");
        initContentInterface();
    }
);