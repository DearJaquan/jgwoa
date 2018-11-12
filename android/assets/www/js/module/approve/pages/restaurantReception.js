/**
 * Created by Ding-PC on 2017/8/22.
 */

var canLaunch = ["科长","科员","领导"];

//申请人
var transactor;
//用餐时间
var dinnerDate;
//用章人数
var dinnerNum;
//用餐标准
var dinnerStandard;
//申请事由
var dinnerReason;
//用餐地点
var dinnerPlace;
//用餐费用
var dinnerCost;
//分管领导意见,为填写内容
var adviceBranchLeader;
//分管领导意见填写时间
var timeAdviceBranchLeader;
//分管领导意见的历史记录
var historyAdviceBranchLeader;
//是否被退回
var isBack;

/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep){
            case "发起流程":
                if(user.launchRole.name.indexOf("领导") > -1){
                    instance.nextStep = "行政办填写";
                }else{
                    instance.nextStep = "分管领导审批";
                }
                break;
            case "分管领导审批":
                instance.nextStep = "行政办填写";
                break;
            case "行政办填写":
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
    transactor = user.name;
    dinnerDate = new Date().Format();
    dinnerStandard = 50;
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    isShowBranchSelect = instance.nextStep == "分管领导审批";
    isAbleSelectBranch = user.launchRoleList.length > 1 || isShowBranchSelect;
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
    if(user.launchRole.name.indexOf("领导") > -1){
        $("#adviceBranchLeaderArea").css("display","none");
    }else{
        $("#adviceBranchLeaderArea").css("display","inline");
        initBranchApproveControl(instance.currentStep == "分管领导审批",undefined);
    }
    $("#confirm").parent().empty();
    isShowBranchSelect = instance.nextStep == "分管领导审批";
    initOperateInterface();
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    transactor = data.transactor;
    dinnerDate = data.dinnerDate;
    dinnerNum = data.dinnerNum;
    dinnerStandard = data.dinnerStandard;
    dinnerReason = data.dinnerReason;
    dinnerPlace = data.dinnerPlace;
    dinnerCost = data.dinnerCost;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    fileList = data.fileList;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    switch (instance.currentStep){
        case "发起流程":
            isCorrect = checkNotNullPositiveInteger($("#dinnerNum").val(),$("#hintDinnerNum")) && isCorrect;
            isCorrect = checkNotNullPositiveInteger($("#dinnerStandard").val(),$("#hintDinnerStandard")) && isCorrect;
            isCorrect = checkNotNull($("#dinnerReason").val(),$("#hintDinnerReason")) && isCorrect;
            break;
        case "行政办填写":
            isCorrect = checkNotNull($("#dinnerPlace").val(),$("#hintDinnerPlace")) && isCorrect;
            isCorrect = checkNotNullPositiveInteger($("#dinnerCost").val(),$("#hintDinnerCost")) && isCorrect;
            break;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var dinnerDate = $("#dinnerDate");
    var dinnerNum = $("#dinnerNum");
    var dinnerStandard = $("#dinnerStandard");
    var dinnerReason = $("#dinnerReason");
    var dinnerPlace = $("#dinnerPlace");
    var dinnerCost = $("#dinnerCost");
    switch (instance.currentStep){
        case "发起流程":
            content.transactor = transactor;
            content.dinnerDate = dinnerDate.val();
            content.dinnerNum = dinnerNum.val();
            content.dinnerStandard = dinnerStandard.val();
            content.dinnerReason = dinnerReason.val();
            content.signatureTransactor = user.id;
            content.timeAdviceTransactor = new Date().Format();
            break;
        case "分管领导审批":
            content.adviceBranchLeader = $("#adviceBranchLeader").val();
            content.historyAdviceBranchLeader = "adviceBranchLeader";
            content.signatureBranchLeader = user.id;
            content.timeAdviceBranchLeader = $("#timeAdviceBranchLeader").text();
            break;
        case "行政办填写":
            content.dinnerPlace = dinnerPlace.val();
            content.dinnerCost = dinnerCost.val();
            content.signatureConfirm = user.id;
            content.timeAdviceConfirm = new Date().Format();
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
    //申请人信息显示控制
    var cTransactor = $("#transactor");
    var cDinnerDate = $("#dinnerDate");
    var cDinnerNum = $("#dinnerNum");
    var cDinnerStandard = $("#dinnerStandard");
    var cDinnerReason = $("#dinnerReason");
    var cDinnerPlace = $("#dinnerPlace");
    var cDinnerCost = $("#dinnerCost");
    cTransactor.val(transactor);
    cDinnerDate.val(dinnerDate);
    cDinnerNum.val(dinnerNum);
    cDinnerStandard.val(dinnerStandard);
    cDinnerReason.val(dinnerReason);
    cDinnerPlace.val(dinnerPlace);
    cDinnerCost.val(dinnerCost);
    if(instance.isOperator && instance.isLaunch) {
        cDinnerDate.attr("readonly",false);
        cDinnerDate.removeClass("disable");
        cDinnerDate.addClass("longDate");
        laydate.render({
            elem: "#dinnerDate",
            showBottom: false,
            value: dinnerDate
        });
        cDinnerNum.attr("readonly",false);
        cDinnerNum.removeClass("disable");
        cDinnerNum.addClass("default");
        cDinnerStandard.attr("readonly",false);
        cDinnerStandard.removeClass("disableMoney");
        cDinnerStandard.addClass("money");
        cDinnerReason.attr("readonly",false);
        cDinnerReason.removeClass("disable");
        cDinnerReason.addClass("default");
    }
    if(instance.isOperator && instance.currentStep == "行政办填写"){
        cDinnerCost.val(cDinnerNum.val()*cDinnerStandard.val());
        cDinnerPlace.attr("readonly",false);
        cDinnerPlace.removeClass("disable");
        cDinnerPlace.addClass("default");
        cDinnerCost.attr("readonly",false);
        cDinnerCost.removeClass("disableMoney");
        cDinnerCost.addClass("money");
    }
    if(instance.launcherSection != "领导"){
        initBranchApproveControl(instance.currentStep == "分管领导审批",undefined);
    }else{
        $("#adviceBranchLeaderArea").css("display","none");
    }
}

$(document).ready(
    function init() {
        initCommon("restaurantReception");
        initContentInterface();
    }
);

