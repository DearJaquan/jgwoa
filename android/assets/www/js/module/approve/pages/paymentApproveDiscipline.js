/**
 * Created by Ding on 2017/9/21.
 */
 //嘉定区建管委付款审批单
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["监察室科长","纪工委科长"];

/****************************以下内容为流程内容变量****************************/
//日期
var date;
//附件
var amount;
//申请部门/个人
var applicationDept;
//金额(小写)
var paymentAmount;
//申请事由
var applicationReason;
//支付方式
var paymentMethod;
//收款单位
var payee;
//收款账户
var payeeAccount;
//收款银行
var payeeBank;
//资金渠道
var fundingChannels;
//负责人意见
var adviceManager;
//负责人意见填写时间
var timeAdviceManager;
//负责人意见的历史记录
var historyAdviceManager;
//科室意见
var adviceSection;
//科室意见填写时间
var timeAdviceSection;
//科室意见的历史记录
var historyAdviceSection;
//计划科意见
var advicePlanningSection;
//计划科意见填写时间
var timeAdvicePlanningSection;
//计划科意见的历史记录
var historyAdvicePlanningSection;
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
//是否关联发起
var isRelateLaunch = false;
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
                instance.nextStep = "计划科审批";
                break;
            case "计划科审批":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                instance.nextStep = "主要领导审批";
                break;
            case "主要领导审批":
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
    date = new Date().Format();
    applicationDept = instance.launcherSection == "领导"?user.name:instance.launcherSection;
    var relate = getParameter("relate");
    if(relate){
        isRelateLaunch = true;
        var callBack = function (value) {
            applicationReason = value[0].applicationReason;
            paymentAmount = value[0].paymentAmount;
            instance.launcherSection = value[0].department;
            for(var i=1; i<value.length; i++){
                fileList.push({
                    id:value[i].instanceID,
                    name:value[i].name,
                    path:value[i].type,
                    step:instance.currentStep,
                    type:"procedure",
                    time:new Date().getTime()
                });
            }
        };
        var fromType = getParameter("from");
        var selectList = relate.split(',');
        switch (fromType){
            case "restaurantReception":
                getRelatedInstanceDetail(selectList,"PR",getUserSection(user.launchRole.name),callBack);
                break;
            case "meetingCostGather":
                getRelatedInstanceDetail(selectList,"PM",getUserSection(user.launchRole.name),callBack);
                break;
            case "publicAffairsAndVehicleApplication":
                getRelatedInstanceDetail(selectList,"PC",getUserSection(user.launchRole.name),callBack);
                break;
        }
    }
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
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
    $("#applicationDept").val(instance.launcherSection == "领导"?user.name:instance.launcherSection);
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    date = data.date;
    amount = data.amount;
    applicationDept = data.applicationDept;
    paymentAmount = data.paymentAmount;
    applicationReason = data.applicationReason;
    paymentMethod = data.paymentMethod;
    payee = data.payee;
    payeeAccount = data.payeeAccount;
    payeeBank = data.payeeBank;
    fundingChannels = data.fundingChannels;
    adviceManager = data.adviceManager;
    timeAdviceManager = data.timeAdviceManager;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    advicePlanningSection = data.advicePlanningSection;
    timeAdvicePlanningSection = data.timeAdvicePlanningSection;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    adviceMainLeader = data.adviceMainLeader;
    timeAdviceMainLeader = data.timeAdviceMainLeader;
    fileList = data.fileList;
    isRelateLaunch = data.isRelateLaunch;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if(instance.currentStep.indexOf("发起")>-1){
        isCorrect = checkInteger($("#amount").val(),$("#hintAmount")) && isCorrect;
        isCorrect = checkNotNull($("#applicationReason").val(),$("#hintApplicationReason")) && isCorrect;
        isCorrect = checkNotNullPositiveNum($("#paymentAmount").val(),$("#hintPaymentAmount")) && isCorrect;
        isCorrect = checkNotNull($("input[name='paymentMethod']:checked").val(),$("#hintPaymentMethod")) && isCorrect;
        if($(":radio:checked").val()=="转账"){
            isCorrect = checkNotNull($("#payee").val(),$("#hintPayee")) && isCorrect;
            isCorrect = checkNotNull($("#payeeAccount").val(),$("#hintPayeeAccount")) && isCorrect;
            isCorrect = checkNotNull($("#payeeBank").val(),$("#hintPayeeBank")) && isCorrect;
        }
    }
    if(instance.currentStep.indexOf("计划科审批")>-1){
        isCorrect = checkNotNull($("#fundingChannels").val(),$("#hintFundingChannels")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent() {
    var content = {};
    var cDate = $("#date");
    var cAmount = $("#amount");
    var cApplicationDept = $("#applicationDept");
    var cApplicationReason = $("#applicationReason");
    var cPaymentAmount = $("#paymentAmount");
    var cPayee = $("#payee");
    var cPayeeAccount = $("#payeeAccount");
    var cPayeeBank = $("#payeeBank");
    var cFundingChannels = $("#fundingChannels");
    switch (instance.currentStep) {
        case "发起流程":
            content.date = cDate.val();
            content.amount = cAmount.val();
            content.applicationDept = cApplicationDept.val();
            content.applicationReason = cApplicationReason.val();
            content.paymentAmount = cPaymentAmount.val();
            content.paymentMethod = $(":radio:checked").val();
            content.payee = cPayee.val();
            content.payeeAccount = cPayeeAccount.val();
            content.payeeBank = cPayeeBank.val();
            content.signatureTransactor = user.id;
            content.timeAdviceTransactor = new Date().Format();
            content.isRelateLaunch = isRelateLaunch;
            break;
        case "计划科审批":
            content.fundingChannels = cFundingChannels.val();
            content.advicePlanningSection = $("#advicePlanningSection").val();
            content.historyAdvicePlanningSection = "advicePlanningSection";
            content.signaturePlanningSection = user.id;
            content.timeAdvicePlanningSection = $("#timeAdvicePlanningSection").text();
            break;
        case "分管领导审批":
            content.adviceBranchLeader = $("#adviceBranchLeader").val();
            content.historyAdviceBranchLeader = "adviceBranchLeader";
            content.signatureBranchLeader= user.id;
            content.timeAdviceBranchLeader =$("#timeAdviceBranchLeader").text();
            break;
        case "主要领导审批":
            content.adviceMainLeader = $("#adviceMainLeader").val();
            content.historyAdviceMainLeader = "adviceMainLeader";
            content.signatureMainLeader = user.id;
            content.timeAdviceMainLeader = $("#timeAdviceMainLeader").text();
            break;
    }
    content.isBack = isBack;
    content.fileList = fileList;
    return content;
}

/*根据支付方式选填内容*/
$(function () {
    $(":radio").click(function () {
        var paymentMethod = $(this).val();
        var cPayee = $("#payee");
        var cPayeeAccount = $("#payeeAccount");
        var cPayeeBank = $("#payeeBank");
        cPayee.attr("readonly",true);
        cPayee.removeClass("default");
        cPayee.addClass("disable");
        cPayeeAccount.attr("readonly",true);
        cPayeeAccount.removeClass("default");
        cPayeeAccount.addClass("disable");
        cPayeeBank.attr("readonly",true);
        cPayeeBank.removeClass("default");
        cPayeeBank.addClass("disable");
        if(paymentMethod=="公务卡"){
            cPayee.val("区级公务卡还款（对私）");
            cPayeeAccount.val("1001244311200310390");
            cPayeeBank.val("中国工商银行");
        }else if(paymentMethod=="转账"){
            cPayee.val("");
            cPayeeAccount.val("");
            cPayeeBank.val("");
            cPayee.attr("readonly",false);
            cPayee.removeClass("disable");
            cPayee.addClass("default");
            cPayeeAccount.attr("readonly",false);
            cPayeeAccount.removeClass("disable");
            cPayeeAccount.addClass("default");
            cPayeeBank.attr("readonly",false);
            cPayeeBank.removeClass("disable");
            cPayeeBank.addClass("default");
        }else if(paymentMethod=="现金"){
            cPayee.val(user.name);
            cPayeeAccount.val("");
            cPayeeBank.val("");
        }
    });
});

/**
 * 初始化流程内容控件
 */
function initContentInterface() {
    var cRelateProcedure = $("#relateProcedure");
    cRelateProcedure.css("display", "none");
    if(instance.isOperator){
        switch (instance.currentStep){
            case "发起流程":
                $("[name='delete']",$("[data-type='procedure']",$("#fileList"))).css("display","none");
                break;
        }
    }
    if(isRelateLaunch && instance.isOperator && instance.isLaunch){
        user.launchRoleList.forEach(function (role) {
            if(role.name.indexOf(instance.launcherSection)>-1){
                user.launchRole.id = role.id;
                user.launchRole.name = role.name;
            }
        });
        var cSelectStatus = $("#selectStatus");
        cSelectStatus.addClass("disableDepartment");
        cSelectStatus.attr("disabled",true);
    }
    var cDate = $("#date");
    var cApplicationDept = $("#applicationDept");
    var cPaymentAmount = $("#paymentAmount");
    var cAmount = $("#amount");
    var cApplicationReason = $("#applicationReason");
    var cPaymentMethod = $(".paymentMethod");
    var cPayee = $("#payee");
    var cPayeeAccount = $("#payeeAccount");
    var cPayeeBank = $("#payeeBank");
    var cFundingChannels = $("#fundingChannels");
    cDate.val(date);
    cApplicationDept.val(applicationDept);
    cPaymentAmount.val(paymentAmount);
    cAmount.val(amount);
    cApplicationReason.val(applicationReason);
    if (paymentMethod) {
        switch (paymentMethod) {
            case "公务卡":
                $("#paymentMethod1").click();
                $("#paymentMethod1").attr("checked", "checked");
                break;
            case "转账":
                $("#paymentMethod2").click();
                $("#paymentMethod2").attr("checked", "checked");
                break;
            case "现金":
                $("#paymentMethod3").click();
                $("#paymentMethod3").attr("checked", "checked");
                break;
        }
    }
    cPayee.val(payee);
    cPayeeAccount.val(payeeAccount);
    cPayeeBank.val(payeeBank);
    cFundingChannels.val(fundingChannels);
    if (instance.isOperator && instance.isLaunch) {
        cDate.attr("readonly",false);
        cDate.removeClass("disable");
        cDate.addClass("longDate");
        laydate.render({
            elem: "#date",
            showBottom: false,
            max: 0,
            value: date
        });
        cPaymentAmount.attr("readonly",false);
        cPaymentAmount.removeClass("disableMoney");
        cPaymentAmount.addClass("money");
        cAmount.attr("readonly",false);
        cAmount.removeClass("disable");
        cAmount.addClass("default");
        cApplicationReason.attr("readonly",false);
        cApplicationReason.removeClass("disable");
        cApplicationReason.addClass("default");
        $("[name='paymentMethod']").attr("disabled",false);
    }
    if (instance.isOperator && instance.currentStep == "计划科审批") {
        cFundingChannels.attr("readonly",false);
        cFundingChannels.removeClass("disable");
        cFundingChannels.addClass("default");
    }

    if(instance.launcherSection != "领导"){
        if(instance.launcherSection.indexOf("计划科") > -1){
            $("#adviceSectionArea").css("display","none");
            initPlaningSectionApproveControl(instance.currentStep == "计划科审批",undefined);//计划科科长审批信息控制显示
            initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdvicePlanningSection);//分管领导审批信息显示控制
            initMainApproveControl(instance.currentStep.indexOf("主要领导审批") > -1,timeAdviceBranchLeader);//主要领导审批信息显示控制
        }

        initPlaningSectionApproveControl(instance.currentStep == "计划科审批",timeAdviceSection);//计划科科长审批信息控制显示
        initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdvicePlanningSection);//分管领导审批信息显示控制
        initMainApproveControl(instance.currentStep.indexOf("主要领导审批") > -1,timeAdviceBranchLeader);//主要领导审批信息显示控制
    }else{
        $("#adviceSectionArea").css("display","none");
        $("#adviceBranchLeaderArea").css("display","none");
        initPlaningSectionApproveControl(instance.currentStep == "计划科审批",undefined);//计划科科长审批信息控制显示
        initMainApproveControl(instance.currentStep.indexOf("主要领导审批") > -1,timeAdvicePlanningSection);//主要领导审批信息显示控制
    }
}

$(document).ready(
    function init() {
        initCommon("paymentApproveDiscipline");
        initContentInterface();
    }
);