/**
 * Created by Dingfengwu on 2017/9/7.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["科长","科员"];

/****************************以下内容为流程内容变量****************************/
//发文单位
var dispatchUnit;
//公开方式
var overtType;

var fileTitle;
//附件名称
var dispatchList;
//发送机关
var sendOrgan;
//抄送机关
var copyOrgan;
//内发机关
var internalOrgan;
//发文
var dispatch;
//编号
var dispatchNumber;
//发文日期
var dispatchDate;
//是否被退回
var isBack;

//科室意见
var adviceSection;
var adviceExamine;
//科室意见填写时间
var timeAdviceSection;
var timeAdviceExamine;
//科室意见的历史记录
var historyAdviceSection;
var historyAdviceExamine;
//分管领导意见,为填写内容
var adviceSign;
//分管领导意见填写时间
var timeAdviceSign;
//分管领导意见的历史记录
var historyAdviceSign;

/****************************以下内容为流程必须函数****************************/
/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep){
            case "发起流程":
                instance.nextStep = "核稿（科长审批）";
                break;
            case "核稿（科长审批）":
                instance.nextStep = "签发（分管领导审批）";
                break;
            case "核稿（分管领导审批）":
                instance.nextStep = "签发（主要领导审批）";
                break;
            case "签发（主要领导审批）":
                instance.nextStep = "行政办确认";
                break;
            case "行政办确认":
                instance.nextStep = "流程结束";
                break;
            default:
                instance.nextStep = "";
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
    dispatchUnit = "上海市嘉定区建设和管理委员会";
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    isShowChiefSelect = instance.nextStep == "核稿（科长审批）";
    isAbleSelectChief = user.launchRoleList.length > 1 || isShowChiefSelect;
    isShowMainSelect = instance.nextStep == "核稿（科长审批）";
    isAbleSelectMain = user.launchRoleList.length > 1 || isShowMainSelect;
    isShowLaunchRoleSelect = instance.currentStep.indexOf("发起流程") > -1 && user.launchRoleList.length > 1;
}

/**
 * 发起身份变化对应函数,不存在可不写
 */
function launchRoleChange() {
    var cSelectStatus = $("#selectStatus");
    user.launchRole.id = cSelectStatus.val();
    user.launchRole.name = cSelectStatus.find("option:selected").text();
    instance.launcherSection = getUserSection(user.launchRole.name);
    getNextStep();
    $("#nextStep").text(instance.nextStep);
    $("#confirm").parent().empty();
    isShowBranchSelect = instance.nextStep.indexOf("分管领导审批") > -1;
    isShowMainSelect = instance.nextStep == "核稿（分管领导审批）";
    initOperateInterface();
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    dispatchUnit = data.dispatchUnit;
    overtType = data.overtType;
    fileTitle =data.fileTitle;
    dispatchList = data.dispatchList;
    sendOrgan = data.sendOrgan;
    copyOrgan = data.copyOrgan;
    internalOrgan = data.internalOrgan;
    dispatch = data.dispatch;
    dispatchNumber = data.dispatchNumber;
    dispatchDate = data.dispatchDate;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceExamine = data.adviceExamine;
    timeAdviceExamine = data.timeAdviceExamine;
    adviceSign = data.adviceSign;
    timeAdviceSign = data.timeAdviceSign;
    fileList = data.fileList;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    switch (instance.currentStep){
        case "发起流程":
            isCorrect = checkNotNull($("#dispatchUnit").val(),$("#hintDispatchUnit")) && isCorrect;
            isCorrect = checkNotNull($("input[name='overtType']:checked").val(),$("#hintOvertType")) && isCorrect;
            isCorrect = checkNotNull($("#fileTitle").val(),$("#hintFileTitle")) && isCorrect;
            // isCorrect = checkNotNull($("#dispatchList").val(),$("#hintDispatchList")) && isCorrect;
            isCorrect = checkNotNull($("#sendOrgan").val(),$("#hintSendOrgan")) && isCorrect;
            var tempContent = $("#dispatchUnit").val();
            console.log(tempContent.split("\n").length);
            console.log(tempContent);
            break;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cDispatchUnit = $("#dispatchUnit");
    var cOvertType = $("input[name='overtType']:checked");
    var cFileTitle = $("#fileTitle");
    var cDispatchList = $("#dispatchList");
    var cSendOrgan = $("#sendOrgan");
    var cCopyOrgan = $("#copyOrgan");
    var cInternalOrgan = $("#internalOrgan");
    var cDispatch = $("#dispatch");
    var cDispatchNumber = $("#dispatchNumber");
    var cDispatchDate = $("#dispatchDate");
    switch (instance.currentStep){
        case "发起流程":
            content.dispatchUnit = cDispatchUnit.val();
            content.overtType = cOvertType.val();
            content.fileTitle = cFileTitle.val();
            content.dispatchList = cDispatchList.val();
            content.sendOrgan = cSendOrgan.val();
            content.copyOrgan = cCopyOrgan.val();
            content.internalOrgan = cInternalOrgan.val();
            content.signatureDraft = user.id;
            content.timeAdviceDraft = new Date().Format();
            break;
        case "核稿（科长审批）":
            content.adviceSection = $("#adviceSection").val();
            content.historyAdviceSection = "adviceSection";
            content.signatureSection = user.id;
            content.timeAdviceSection = $("#timeAdviceSection").text();
            break;
        case "核稿（分管领导审批）":
            content.adviceExamine = $("#adviceExamine").val();
            content.historyAdviceExamine = "adviceExamine";
            content.signatureExamine = user.id;
            content.timeAdviceExamine = $("#timeAdviceExamine").text();
            break;
        case "签发（主要领导审批）":
            var dispatchDate = $("#timeAdviceSign").text();
            content.dispatchDate = dispatchDate;
            content.adviceSign = $("#adviceSign").val();
            content.historyAdviceSign = "adviceSign";
            content.signatureSign = user.id;
            content.timeAdviceSign = dispatchDate;
            break;
        case "行政办确认":
            content.dispatch = cDispatch.val();
            content.dispatchNumber = cDispatchNumber.val();
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
    var cDispatchUnit = $("#dispatchUnit");
    var cOvertType = $("input[name='overtType']:checked");
    var cFileTitle = $("#fileTitle");
    var cDispatchList = $("#dispatchList");
    var cSendOrgan = $("#sendOrgan");
    var cCopyOrgan = $("#copyOrgan");
    var cInternalOrgan = $("#internalOrgan");
    var cDispatch = $("#dispatch");
    var cDispatchNumber = $("#dispatchNumber");
    var cDispatchDate = $("#dispatchDate");
    cDispatchUnit.val(dispatchUnit);
    cOvertType.val(overtType);
    switch (overtType){
        case "主动公开":
            $("#overtTypeA").attr('checked', 'checked');
            break;
        case "不予公开":
            $("#overtTypeB").attr('checked', 'checked');
            break;
        case "依申请公开":
            $("#overtTypeC").attr('checked', 'checked');
            break;
    }
    cFileTitle.val(fileTitle);
    cDispatchList.val(dispatchList);
    cSendOrgan.val(sendOrgan);
    cCopyOrgan.val(copyOrgan);
    cInternalOrgan.val(internalOrgan);
    cDispatch.val(dispatch);
    cDispatchNumber.val(dispatchNumber);
    cDispatchDate.val(dispatchDate);

    fileTitle && cFileTitle.height(getTextAreaHeight(fileTitle));
    dispatchUnit && cDispatchUnit.height(getTextAreaHeight(dispatchUnit));
    dispatchList && cDispatchList.height(getTextAreaHeight(dispatchList));
    sendOrgan && cSendOrgan.height(getTextAreaHeight(sendOrgan));
    copyOrgan && cCopyOrgan.height(getTextAreaHeight(copyOrgan));
    internalOrgan && cInternalOrgan.height(getTextAreaHeight(internalOrgan));

    if(instance.isOperator && instance.isLaunch) {
        cDispatchUnit.attr("readonly",false);
        cDispatchUnit.removeClass("disableDispatch");
        cDispatchUnit.addClass("dispatch");
        $("#overtTypeA").attr("disabled",false);
        $("#overtTypeB").attr("disabled",false);
        $("#overtTypeC").attr("disabled",false);
        cFileTitle.attr("readonly",false);
        cFileTitle.removeClass("disableDispatch");
        cFileTitle.addClass("dispatch");
        cDispatchList.attr("readonly",false);
        cDispatchList.removeClass("disableDispatch");
        cDispatchList.addClass("dispatch");
        cSendOrgan.attr("readonly",false);
        cSendOrgan.removeClass("disableDispatch");
        cSendOrgan.addClass("dispatch");
        cCopyOrgan.attr("readonly",false);
        cCopyOrgan.removeClass("disableDispatch");
        cCopyOrgan.addClass("dispatch");
        cInternalOrgan.attr("readonly",false);
        cInternalOrgan.removeClass("disableDispatch");
        cInternalOrgan.addClass("dispatch");
        // cDispatch.attr("readonly",false);
        // cDispatch.removeClass("disable");
        // cDispatch.addClass("default");
    }
    if(instance.isOperator && instance.currentStep=="行政办确认"){
        cDispatch.attr("readonly",false);
        cDispatch.removeClass("disable");
        cDispatch.addClass("default");
        cDispatchNumber.attr("readonly",false);
        cDispatchNumber.removeClass("disable");
        cDispatchNumber.addClass("default");
        // cDispatchDate.attr("readonly",false);
        // cDispatchDate.removeClass("disable");
        // cDispatchDate.addClass("default");
    }
    initSectionApproveControl(instance.currentStep.indexOf("核稿（科长审批）") > -1,undefined);
    initExamineApproveControl(instance.currentStep.indexOf("核稿（分管领导审批）") > -1,timeAdviceSection);
    initSignApproveControl(instance.currentStep.indexOf("签发") > -1,timeAdviceExamine);
}

$(document).ready(
    function init() {
        initCommon("dispatchDocumentOrganization");
        initContentInterface();
    }
);

function getTextAreaHeight(content) {
    var tempH = content.split("\n").length * 32;
    console.log(tempH);
    return content.split("\n").length * 32;
}