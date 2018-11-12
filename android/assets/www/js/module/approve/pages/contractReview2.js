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
//表内容
var content;
//修改的元素对象
var infoEditFor;
//合作建议
var suggestion;
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

//评审小组个人意见
var adviceOne;
var adviceTwo;
var adviceThree;
//评审小组意见
var adviceReviewGroup;
//评审小组意见填写时间
var timeAdviceReviewGroup;
var adviceReviewGroupDetail;
//评审小组意见的历史记录
var historyAdviceReviewGroup;

//分管领导意见,为填写内容
var adviceBranchLeader;
//分管领导意见填写时间
var timeAdviceBranchLeader;
//分管领导意见的历史记录
var historyAdviceBranchLeader;

//主要领导意见,为填写内容
var adviceMainLeader;
//主要领导意见填写时间
var timeAdviceMainLeader;
//主要领导意见的历史记录
var historyAdviceMainLeader;

//法律顾问、投资监理意见
var adviceLegalAdviser;
//法律顾问、投资监理意见填写时间
var timeAdviceLegalAdviser;
//法律顾问、投资监理意见的历史记录
var historyAdviceLegalAdviser;

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
                    instance.nextStep = "评审小组确认";
                }
                break;
            case "科室审批":
                instance.nextStep = "评审小组确认";
                break;
            case "评审小组确认":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                instance.nextStep = "主要领导审批";
                break;
            case "主要领导审批":
                instance.nextStep = "发起人填写";
                break;
            case "发起人填写":
                instance.nextStep = "法律顾问、投资监理审批";
                break;
            case "法律顾问、投资监理审批":
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
    isShowBranchSelect = instance.nextStep == "评审小组确认";
    isAbleSelectBranch = isShowBranchSelect;
    isShowCompanySuggestionSelect = instance.currentStep == "评审小组确认";
    isAbleSelectCompanySuggestion = isShowCompanySuggestionSelect;
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
    content = data.content;
    suggestion = data.suggestion;
    contractNumber = data.contractNumber;
    inquiryPriceComparison = data.inquiryPriceComparison;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceOne = data.adviceOne;
    adviceTwo = data.adviceTwo;
    adviceThree = data.adviceThree;
    adviceReviewGroup = data.adviceReviewGroup;
    adviceReviewGroupDetail = data.adviceReviewGroupDetail;
    timeAdviceReviewGroup = data.timeAdviceReviewGroup;
    adviceLegalAdviser = data.adviceLegalAdviser;
    timeAdviceLegalAdviser = data.timeAdviceLegalAdviser;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    adviceMainLeader = data.adviceMainLeader;
    timeAdviceMainLeader = data.timeAdviceMainLeader;
    adviceAdminMainLeader = data.adviceAdminMainLeader;
    timeAdviceAdminMainLeader = data.timeAdviceAdminMainLeader;
    fileList = data.fileList;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if(instance.currentStep == "发起流程"){
        isCorrect = checkNotNull($("#projectName").val(),$("#hintProjectName")) && isCorrect;
        isCorrect = checkHasContent($("#tableLineList").children().length, $("#hintForApply")) && isCorrect;
        isCorrect = checkNotNull($("#inquiryPriceComparison").val(),$("#hintInquiryPriceComparison")) && isCorrect;
    }
    if(instance.currentStep == "发起人填写"){
        isCorrect = checkUploadFile($("#hintFileList")) && isCorrect;
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
    var cSuggestion = $("#suggestion");
    switch (instance.currentStep){
        case "发起流程":
            content.projectName = cProjectName.val();
            content.contractType = cContractType.val();
            content.content = getAll();
            content.suggestion = cSuggestion.val();
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
        case "评审小组确认":
            if(user.launchRole.name.indexOf("行政办科长") > -1){
                content.adviceOne = $("#companySuggestion").val() +","+ $("#adviceReviewGroup").val();
            }
            if(user.launchRole.name.indexOf("计划科科长") > -1){
                content.adviceTwo = $("#companySuggestion").val() +","+ $("#adviceReviewGroup").val();
            }
            if(user.launchRole.name.indexOf("纪工委科长") > -1){
                content.adviceThree = $("#companySuggestion").val() +","+ $("#adviceReviewGroup").val();
            }
            content.signatureReviewGroup = user.id;
            content.adviceReviewGroup = $("#adviceReviewGroup").val();
            content.historyAdviceReviewGroup = "adviceReviewGroup";
            content.timeAdviceReviewGroup = $("#timeAdviceReviewGroup").text();
            break;
        case "分管领导审批":
            content.adviceBranchLeader = $("#adviceBranchLeader").val();
            content.historyAdviceBranchLeader = "adviceBranchLeader";
            content.signatureBranchLeader = user.id;
            content.timeAdviceBranchLeader = $("#timeAdviceBranchLeader").text();
            break;
        case "主要领导审批":
            content.adviceMainLeader = $("#adviceMainLeader").val();
            content.historyAdviceMainLeader = "adviceMainLeader";
            content.signatureMainLeader = user.id;
            content.timeAdviceMainLeader = $("#timeAdviceMainLeader").text();
            break;
        case "法律顾问、投资监理审批":
            content.signatureLegalAdviser = user.id;
            content.adviceLegalAdviser = $("#adviceLegalAdviser").val();
            content.historyAdviceLegalAdviser = "adviceLegalAdviser";
            content.timeAdviceLegalAdviser = $("#timeAdviceLegalAdviser").text();
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
    var cEditTable = $(".tableLineEdit");
    var cSuggestion = $("#suggestion");
    cProjectName.val(projectName);
    cContractNumber.val(contractNumber);
    cInquiryPriceComparison.val(inquiryPriceComparison);
    setAll();
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
        cSuggestion.removeAttr("disabled");
        cSuggestion.removeClass("disable");
        cSuggestion.addClass("default");
        var detailNum = $("#tableLineList").children().length;
        if(detailNum == 0){
            cEditTable.removeClass("disappear");
        }
        if(detailNum < 3){
            $("#moreTableLine").css("display","inline");
        }
    }else{
        cContractType.css("display","none");
    }
    $("#saveForTableLine").click(function () {
        var cCompanyName = $("#inputForCompanyName");
        var cOffer = $("#inputForOffer");
        var isCorrect = true;
        isCorrect = checkNotNull(cCompanyName.val(), $("#inputForCompanyName")) && isCorrect;
        isCorrect = checkNotNull(cOffer.val(), $("#hintForOffer")) && isCorrect;
        if (isCorrect) {
            if (infoEditFor) {
                var cInfo = infoEditFor.find("span");
                cInfo[0].innerText = cCompanyName.val();
                cInfo[1].innerText = cOffer.val();
            } else {
                var info = {};
                info.companyName = cCompanyName.val();
                info.offer = cOffer.val();
                addBillInfo(info, true);
                var num = $("#tableLineList").children().length;
                if (num > 2) {
                    $("#moreTableLine").css("display", "none");
                }
            }
            cEditTable.addClass("disappear");
            addSelectOption();
        }
    });
    $("#moreTableLine").click(function () {
        cEditTable.removeClass("disappear");
        // infoEditFor = $("#tableLineList").children("div:last");
        // var cInfo = infoEditFor.find("span");
        $("#inputForCompanyName").val("");
        $("#inputForOffer").val("");
        infoEditFor = undefined;
    });
    addSelectOption();
    cSuggestion.val(suggestion);


    initSectionApproveControl(instance.nextStep == "评审小组确认",undefined);//科长审批信息显示控制
    initReviewGroupApproveControl(instance.currentStep == "评审小组确认",timeAdviceSection);
    initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceReviewGroup);//分管领导审批信息显示控制
    initMainApproveControl(instance.currentStep == "主要领导审批",timeAdviceBranchLeader);//主要领导审批信息显示控制
    initLegalAdviserApproveControl(instance.currentStep == "法律顾问、投资监理审批",timeAdviceMainLeader);
    initAdminMainApproveControl(instance.currentStep == "行政主要领导审批",timeAdviceLegalAdviser);//主要领导审批信息显示控制
    var cAdviceReviewGroup = $("#adviceReviewGroup");
    cAdviceReviewGroup.val("");
    if(instance.currentStep == "评审小组确认"){
        var adviceString = "";
        if(adviceOne){adviceString += "行政办：推荐"+adviceOne +"\n";}
        if(adviceTwo){adviceString += "计划科：推荐"+adviceTwo +"\n";}
        if(adviceThree){adviceString += "党委办：推荐"+adviceThree +"\n";}
        cAdviceReviewGroup.attr('placeholder',adviceString);
    }
    if(adviceReviewGroupDetail){
        var hintString = "";
        adviceReviewGroupDetail.forEach(function (value) {
            hintString += value + "\n";
        });
        cAdviceReviewGroup.val(hintString);
    }
}

$(document).ready(
    function init() {
        initCommon("contractReview2");
        initContentInterface();
    }
);

function addSelectOption() {
    var tableList = $("#tableLineList").children();
    var cSuggestion =  $("#suggestion");
    cSuggestion.empty();
    for (var i = 0; i < tableList.length; i++) {
        var cTableInfo = $(tableList[i]).find("span");
        var cCompanyName = cTableInfo[0].innerText;
        var option = "<option value='"+ cCompanyName +"'>"+ cCompanyName +"</option>";
        cSuggestion.append(option);
    }
}

function editTableLine(el) {
    infoEditFor = $(el).parent().parent();
    var cTableLineEdit = $(".tableLineEdit");
    cTableLineEdit.removeClass("disappear");
    var cInfo = infoEditFor.find("span");
    $("#inputForCompanyName").val(cInfo[0].innerText);
    $("#inputForOffer").val(cInfo[1].innerText);
    addSelectOption();
}

function deleteTableLine(el) {
    var rootE = $(el).parent().parent();
    if (rootE.is(infoEditFor)) {
        $("#tableLineEdit").addClass("disappear");
    }
    rootE.remove();
    if ($("#tableLineList").children().length < 5) {
        $("#moreTableLine").css("display", "inline");
    }
    $(".tableLineEdit").addClass("disappear");
    addSelectOption();
}

//获取表中的值
function getAll() {
    var tableArr = [];
    var tableList = $("#tableLineList").children();
    for (var i = 0; i < tableList.length; i++) {
        var cInfo = $(tableList[i]).find("span");
        var element = {};
        element.companyName = cInfo[0].innerText;
        element.offer = cInfo[1].innerText;
        tableArr.push(element);
    }
    return tableArr;
}

//填表
function setAll() {
    if (content) {
        for (var i = 0; i < content.length; i++) {
            if (instance.isOperator && instance.isLaunch) {
                addBillInfo(content[i], true);
            } else {
                addBillInfo(content[i], false);
            }
        }
    }
}

function addBillInfo(info, canOperate) {
    var newTableLine = "<div>";
    if (canOperate) {
        newTableLine +=
            "<div style='margin-top: 5px'>" +
            "<a href='javascript:void(0);' onclick='editTableLine(this)' title='修改' style='padding-left: 10px'><img src='../../resources/images/editTableLine.png'></a>" +
            "<a href='javascript:void(0);' onclick='deleteTableLine(this)' title='删除' style='padding-left: 10px'><img src='../../resources/images/deleteTableLine.png'></a>" +
            "</div>";
    }
    newTableLine +=
        "<table class='tableDetail'>" +
        "<tr>" +
        "<td width='750px' height='15px'>" +
        "<label class='combine'>公司名称：<span>"+info.companyName+"</span></label>" +
        "<label class='combine'>报价：<span>"+info.offer+"</span></label>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</div>";
    $("#tableLineList").append(newTableLine);
}
