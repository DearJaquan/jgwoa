/**
 * Created by Dingfengwu on 2017/8/24.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["科长","科员"];
//可发起角色中可选择分管科室列表

/****************************以下内容为流程内容变量****************************/
//项目名称
var projectName;
//合同类型
var contractType;
//合同编号
var contractNumber;
//询价比价情况
var inquiryPriceComparison;
//是否被退回
var isBack;

//主办科室意见
var adviceSection;
//主办科室意见填写时间
var timeAdviceSection;
//主办科室意见的历史记录
var historyAdviceSection;

//评审小组意见
var adviceReviewGroup;
//评审小组意见填写时间
var timeAdviceReviewGroup;
var adviceReviewGroupDetail;
//评审小组意见的历史记录
var historyAdviceReviewGroup;

//法律顾问、投资监理意见
var adviceLegalAdviser;
//法律顾问、投资监理意见填写时间
var timeAdviceLegalAdviser;
//法律顾问、投资监理意见的历史记录
var historyAdviceLegalAdviser;

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
                    instance.nextStep = "评审小组审批";
                }
                break;
            case "科室审批":
                instance.nextStep = "评审小组审批";
                break;
            case "评审小组审批":
                instance.nextStep = "法律顾问、投资监理审批";
                break;
            case "法律顾问、投资监理审批":
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
    isShowBranchSelect = instance.currentStep == "法律顾问、投资监理审批";
    isAbleSelectBranch = isShowBranchSelect;
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
    $("#confirm").parent().empty();
    initOperateInterface();
};

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    projectName = data.projectName;
    contractType = data.contractType;
    contractNumber = data.contractNumber;
    inquiryPriceComparison = data.inquiryPriceComparison;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceReviewGroup = data.adviceReviewGroup;
    adviceReviewGroupDetail = data.adviceReviewGroupDetail;
    timeAdviceReviewGroup = data.timeAdviceReviewGroup;
    adviceLegalAdviser = data.adviceLegalAdviser;
    timeAdviceLegalAdviser = data.timeAdviceLegalAdviser;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    adviceAdminMainLeader = data.adviceAdminMainLeader;
    timeAdviceAdminMainLeader = data.timeAdviceAdminMainLeader;
    fileList = data.fileList;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if(instance.currentStep == "发起流程"){
        isCorrect = checkNotNull($("#projectName").val(),$("#hintProjectName")) && isCorrect;
        isCorrect = checkNotNull($("#inquiryPriceComparison").val(),$("#hintInquiryPriceComparison")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cProjectName = $("#projectName");
    var cContractType = $("#contractType");
    var cInquiryPriceComparison = $("#inquiryPriceComparison");
    switch (instance.currentStep){
        case "发起流程":
            content.projectName = cProjectName.val();
            content.contractType = cContractType.val();
            content.inquiryPriceComparison = cInquiryPriceComparison.val();
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
            content.signatureSection = user.id;
            content.adviceSection = $("#adviceSection").val();
            content.historyAdviceSection = "adviceSection";
            content.timeAdviceSection = $("#timeAdviceSection").text();
            break;
        case "评审小组审批":
            content.signatureReviewGroup = user.id;
            content.adviceReviewGroup = $("#adviceReviewGroup").val();
            content.historyAdviceReviewGroup = "adviceReviewGroup";
            content.timeAdviceReviewGroup = $("#timeAdviceReviewGroup").text();
            break;
        case "法律顾问、投资监理审批":
            content.signatureLegalAdviser = user.id;
            content.adviceLegalAdviser = $("#adviceLegalAdviser").val();
            content.historyAdviceLegalAdviser = "adviceLegalAdviser";
            content.timeAdviceLegalAdviser = $("#timeAdviceLegalAdviser").text();
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
        default:
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
    var cProjectName = $("#projectName");
    var cContractType = $("#contractType");
    var cContractNumber = $("#contractNumber");
    var cInquiryPriceComparison = $("#inquiryPriceComparison");
    cProjectName.val(projectName);
    cContractNumber.val(contractNumber);
    cInquiryPriceComparison.val(inquiryPriceComparison);
    if(instance.isOperator && instance.isLaunch) {
        cContractNumber.css("display","none");
        cContractType.removeAttr("disabled");
        cContractType.removeClass("disable");
        cContractType.addClass("default");
        cProjectName.attr("readonly",false);
        cProjectName.removeClass("disable");
        cProjectName.addClass("default");
        cInquiryPriceComparison.attr("readonly",false);
        cInquiryPriceComparison.removeClass("disable");
        cInquiryPriceComparison.addClass("default");
    }else{
        cContractType.css("display","none");
    }
    initSectionApproveControl(instance.nextStep == "评审小组审批",undefined);//科长审批信息显示控制
    initReviewGroupApproveControl(instance.currentStep == "评审小组审批",timeAdviceSection);
    initLegalAdviserApproveControl(instance.currentStep == "法律顾问、投资监理审批",timeAdviceReviewGroup);
    initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceLegalAdviser);//分管领导审批信息显示控制
    initAdminMainApproveControl(instance.currentStep == "行政主要领导审批",timeAdviceBranchLeader);//主要领导审批信息显示控制
    var cAdviceReviewGroup = $("#adviceReviewGroup");
    if(instance.currentStep == "评审小组审批" && adviceReviewGroupDetail){
        cAdviceReviewGroup.val("");
        var hintString = "";
        adviceReviewGroupDetail.forEach(function (value) {
            hintString += value + "\n";
        });
        cAdviceReviewGroup.attr('placeholder',hintString);
    }
}

$(document).ready(
    function init() {
        initCommon("contractReview");
        initContentInterface();
    }
);
